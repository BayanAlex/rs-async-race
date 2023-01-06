import * as ui from './ui';
import * as api from './api';
import { libGenerateCars } from './libs/common';

const generateCarsAmount = 100;
const maxCarsAmount = 10000;

class RaceApp {
  garageCarsOnPage = 7;

  winnersCarsOnPage = 10;

  garageCurrentPage = 1;

  winnersCurrentPage = 1;

  garagePagesCount = 1;

  winnersPagesCount = 1;

  lastDriveRequestStartTime = new Map();

  runningCars = new Set();

  deleteCar = async (id) => {
    let result = await api.deleteCar(id);
    if (!result.status) {
      this.garageCount -= 1;
      this.garagePagesCount = Math.ceil(this.garageCount / this.garageCarsOnPage) || 1;
      if (this.garagePagesCount < this.garageCurrentPage) {
        this.garageCurrentPage = this.garagePagesCount;
      }
    }
    this.getGarage(this.garageCurrentPage);
    result = await api.getAllWinners();
    if (result.find((winner) => winner.id === +id)) {
      result = await api.deleteWinner(id).then((response) => {
        if (!response.status) {
          if (!result.status) {
            this.winnersCount -= 1;
            this.winnersPagesCount = Math.ceil(this.winnersCount / this.winnersCarsOnPage) || 1;
            if (this.winnersPagesCount < this.winnersCurrentPage) {
              this.winnersCurrentPage = this.winnersPagesCount;
            }
          }
          this.getSortWinners(this.winnersCurrentPage);
        }
      }).catch(() => {});
    }
  };

  async getGarage(page) {
    this.lastDriveRequestStartTime.clear();
    const requests = [];
    this.runningCars.forEach((id) => requests.push(this.resetCar(id)));
    await Promise.all(requests);
    const cars = await api.getCars(page, this.garageCarsOnPage);
    this.garageCurrentPage = page;
    this.garageCount = +cars.totalCount;
    this.garagePagesCount = Math.ceil(this.garageCount / this.garageCarsOnPage) || 1;
    ui.setGarageCount(cars.totalCount);
    ui.setGaragePage(page, this.garagePagesCount, cars.carsList);
  }

  async getSortWinners(page) {
    const cars = await api.getSortWinners(
      page,
      this.winnersCarsOnPage,
      ui.getWinnersSortSettings(),
    );
    this.winnersCurrentPage = page;
    this.winnersCount = cars.totalCount;
    this.winnersPagesCount = Math.ceil(this.winnersCount / this.winnersCarsOnPage) || 1;
    const requests = [];
    for (let i = 0; i < cars.carsList.length; i += 1) {
      const car = cars.carsList[i];
      requests.push(api.getCar(car.id));
    }
    Promise.all(requests)
      .then((responses) => responses.forEach((response, i) => {
        [cars.carsList[i].name, cars.carsList[i].color] = [response.name, response.color];
      }))
      .then(() => {
        ui.setWinnersCount(cars.totalCount);
        ui.setWinnersPage(page, this.winnersCarsOnPage, this.winnersPagesCount, cars.carsList);
      });
  }

  // Callbacks
  createCar = async (car) => {
    await api.createCar(car);
    await this.getGarage(this.garageCurrentPage);
  };

  static updateCar = async (car) => {
    const result = await api.updateCar(car);
    if (!result.status) {
      ui.updateCar(result);
    }
  };

  garageNextPage = () => this.getGarage(this.garageCurrentPage + 1);

  garagePreviousPage = () => this.getGarage(this.garageCurrentPage - 1);

  winnersNextPage = () => {
    this.getSortWinners(this.winnersCurrentPage + 1);
  };

  winnersPreviousPage = () => {
    this.getSortWinners(this.winnersCurrentPage - 1);
  };

  getWinners = () => {
    this.getSortWinners(this.winnersCurrentPage);
  };

  generateCars = async () => {
    if (this.garageCount >= maxCarsAmount) return;
    const requests = [];
    const cars = await libGenerateCars(generateCarsAmount);
    let addCount = cars.length;
    if (this.garageCount + addCount >= maxCarsAmount) {
      addCount = maxCarsAmount - this.garageCount;
    }
    for (let i = 0; i < addCount; i += 1) {
      requests.push(api.createCar(cars[i]));
    }
    Promise.all(requests).then(() => {
      this.getGarage(this.garageCurrentPage);
    });
  };

  startCar = async (id) => {
    const startTime = Date.now();
    this.lastDriveRequestStartTime[id] = startTime;
    let result = await api.startCar(id);
    this.runningCars.add(id);

    if (startTime !== this.lastDriveRequestStartTime[id]) {
      return { status: 'ignore' };
    }
    result.id = id;
    if (result.status) return Promise.reject();
    ui.driveCar(id, result);
    result = await api.driveCar(id);
    if (startTime !== this.lastDriveRequestStartTime[id]) {
      return { status: 'ignore' };
    }
    switch (result.status) {
      case 'finished':
        this.runningCars.delete(id);
        ui.stopCar(id);
        break;
      case 'broken':
        this.runningCars.delete(id);
        ui.stopCar(id);
        return Promise.reject();
      case 'not found':
        return result;
      default:
    }
    result.id = id;
    return result;
  };

  startCarCallback = (id) => this.startCar(id).catch(() => {});

  resetCar = async (id) => {
    const result = await api.stopCar(id);
    this.runningCars.delete(id);
    if (result.status) return;
    if (+result.velocity === 0) {
      this.lastDriveRequestStartTime[id] = 0;
      ui.resetCar(id);
    }
  };

  startRace = async (carsIds) => {
    const requests = [];
    ui.runStopwatch();
    carsIds.forEach((id) => requests.push(this.startCar(id)));
    let winner;
    try {
      winner = await Promise.any(requests)
        .then((response) => response)
        .catch(() => {
          throw new Error('All cars are broken!');
        });
      if (winner.status === 'ignore') return;
      if (winner.status === 'not found') throw new Error('Fail! Restart race!');
    } catch (error) {
      ui.stopStopwatch();
      ui.showRaceFailPopup(error.message);
      return;
    }
    winner.time = ui.stopStopwatch();
    ui.showWinnerPopup(winner);
    let result = await api.getWinner(winner.id);
    const setValue = { id: winner.id, wins: 1, time: winner.time.toFixed(2) };
    if (result.status === 'not found') {
      result = await api.createWinner(setValue);
    } else {
      setValue.wins = result.wins + 1;
      const savedTime = +result.time;
      if (savedTime < winner.time) {
        setValue.time = savedTime.toFixed(2);
      }
      result = await api.updateWinner(setValue);
    }
    this.getWinners();
  };

  resetRace = async (carsIds) => {
    const requests = [];
    carsIds.forEach((id) => requests.push(this.resetCar(id)));
    await Promise.all(requests);
  };

  setCallbacks() {
    ui.setCallbacks(
      this.createCar,
      RaceApp.updateCar,
      this.deleteCar,
      this.garagePreviousPage,
      this.garageNextPage,
      this.winnersPreviousPage,
      this.winnersNextPage,
      this.getWinners,
      this.generateCars,
      this.startCarCallback,
      this.resetCar,
      this.startRace,
      this.resetRace,
    );
  }

  async start() {
    ui.initUi();
    this.setCallbacks();
    await this.getGarage(1);
    await this.getSortWinners(1, ui.getWinnersSortSettings());
  }
}

const raceApp = new RaceApp();
raceApp.start();

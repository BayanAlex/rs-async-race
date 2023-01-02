import {
  initUi,
  uiAddCarToWinners,
  garagePages,
  uiSetGarageCount,
  uiAddCarToGarage,
  uiSetWinnersCount,
  uiSetGaragePage,
  uiSetWinnersPage,
  uiSetCallbacks,
  uiUpdateCar,
  uiDeleteCarFromWinners,
  uiDeleteCarFromGarage,
  uiGetWinnersSortSettings,
  uiDriveCar,
  uiStopCar,
  uiResetRace,
} from './ui';

import { libGenerateCars } from './lib';

import {
  apiGetCars,
  apiGetCar,
  apiCreateCar,
  apiDeleteCar,
  apiUpdateCar,
  apiStartCar,
  apiDriveCar,
  apiStopCar,
  apiGetWinners,
  apiGetWinner,
  apiGetSortWinners,
  apiDeleteWinner,
  apiCreateWinner,
  apiUpdateWinner,
  apiGetAllWinners,
} from './api';

const generateCarsAmount = 100;
const maxCarsAmount = 1000;

class RaceApp {
  garageCarsOnPage = 2;

  winnersCarsOnPage = 2;

  garageCurrentPage = 1;

  winnersCurrentPage = 1;

  garagePagesCount = 1;

  winnersPagesCount = 1;

  deleteCar = async (id) => {
    let result = await apiDeleteCar(id);
    if (!result.status) {
      this.garageCount -= 1;
      this.garagePagesCount = Math.ceil(this.garageCount / this.garageCarsOnPage) || 1;
      if (this.garagePagesCount < this.garageCurrentPage) {
        this.garageCurrentPage = this.garagePagesCount;
      }
    }
    this.getGarage(this.garageCurrentPage);
    result = await apiGetAllWinners();
    if (result.find((winner) => winner.id === +id)) {
      result = await apiDeleteWinner(id).then((response) => {
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
    const cars = await apiGetCars(page, this.garageCarsOnPage);
    this.garageCurrentPage = page;
    this.garageCount = +cars.totalCount;
    this.garagePagesCount = Math.ceil(this.garageCount / this.garageCarsOnPage) || 1;
    uiSetGarageCount(cars.totalCount);
    uiSetGaragePage(page, this.garagePagesCount, cars.carsList);
  }

  async getSortWinners(page) {
    const cars = await apiGetSortWinners(page, this.winnersCarsOnPage, uiGetWinnersSortSettings());
    this.winnersCurrentPage = page;
    this.winnersCount = cars.totalCount;
    this.winnersPagesCount = Math.ceil(this.winnersCount / this.winnersCarsOnPage) || 1;
    const requests = [];
    for (let i = 0; i < cars.carsList.length; i += 1) {
      const car = cars.carsList[i];
      requests.push(apiGetCar(car.id));
    }
    Promise.all(requests)
      .then((responses) => responses.forEach((response, i) => {
        [cars.carsList[i].name, cars.carsList[i].color] = [response.name, response.color];
      }))
      .then(() => {
        uiSetWinnersCount(cars.totalCount);
        uiSetWinnersPage(page, this.winnersCarsOnPage, this.winnersPagesCount, cars.carsList);
      });
  }

  // Callbacks
  createCar = async (car) => {
    await apiCreateCar(car);
    await this.getGarage(this.garageCurrentPage);
  };

  updateCar = async (car) => {
    const result = await apiUpdateCar(car);
    if (!result.status) {
      uiUpdateCar(result);
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
      requests.push(apiCreateCar(cars[i]));
    }
    Promise.all(requests).then(() => {
      this.getGarage(this.garageCurrentPage);
    });
  };

  startCar = async (id) => {
    let result = await apiStartCar(id);
    if (result.status) return;
    uiDriveCar(id, result);
    result = await apiDriveCar(id);
    console.log('drive', result);
    switch (result.status) {
      case 'finished':
        uiStopCar(id);
        break;
      case 'broken':
        uiStopCar(id);
        break;
      default:
    }
  };

  resetCar = async (id) => {
    const result = await apiStopCar(id);
    console.log('stop', result);
    if (result.status) return;
    if (+result.velocity === 0) {
      uiResetRace(id);
    }
  };

  setCallbacks() {
    uiSetCallbacks(
      this.createCar,
      this.updateCar,
      this.deleteCar,
      this.garagePreviousPage,
      this.garageNextPage,
      this.winnersPreviousPage,
      this.winnersNextPage,
      this.getWinners,
      this.generateCars,
      this.startCar,
      this.resetCar,
    );
  }

  async start() {
    initUi();
    this.setCallbacks();
    await this.getGarage(1);
    await this.getSortWinners(1, uiGetWinnersSortSettings());
  }
}

const raceApp = new RaceApp();
raceApp.start();

// test();

// async function test() {
//   await apiStartCar(1)
//     .then((result) => console.log(result))
//     .then(() => apiDriveCar(100))
//     .then((result) => console.log(result))
//     .then(() => console.log('finish'));
//   // .catch((error) => console.log(error.name));
// }

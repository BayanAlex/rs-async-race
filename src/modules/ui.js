import { rgbToHex } from './libs/common';
import {
  setElementAttribute,
  getElementAttribute,
  removeElementAttribute,
  setDisabled,
  setEnabled,
  showElement,
  hideElement,
  createElement,
  addElement,
  loadSvg,
} from './libs/lib_ui';
import Stopwatch from './components/stopwatch';

const mainTabs = ['garage', 'winners'];
let deleteCarCallback;
let startCarCallback;
let resetCarCallback;

const disableButtonNext = (tabName) => setDisabled(document.querySelector(`.tab-${tabName} .page-controls__button_next`));
const disableButtonPrevious = (tabName) => setDisabled(document.querySelector(`.tab-${tabName} .page-controls__button_prev`));
const enableButtonNext = (tabName) => setEnabled(document.querySelector(`.tab-${tabName} .page-controls__button_next`));
const enableButtonPrevious = (tabName) => setEnabled(document.querySelector(`.tab-${tabName} .page-controls__button_prev`));

function enablePageControls(tabName) {
  const pageControl = document.querySelector(`.tab-${tabName}__page-controls`);
  const currentPage = +pageControl.querySelector('.page-controls__number').textContent;
  const pagesCount = +pageControl.dataset.count;

  if (currentPage === pagesCount) {
    disableButtonNext(tabName);
  } else {
    enableButtonNext(tabName);
  }

  if (currentPage === 1) {
    disableButtonPrevious(tabName);
  } else {
    enableButtonPrevious(tabName);
  }
}

function setPageControls(tabName, currentPage, pagesCount) {
  const pageControl = document.querySelector(`.tab-${tabName}__page-controls`);
  pageControl.querySelector('.page-controls__number').textContent = currentPage;
  setElementAttribute(pageControl, 'data-count', pagesCount);
  enablePageControls(tabName);
}

function disablePageControls(tabName) {
  disableButtonNext(tabName);
  disableButtonPrevious(tabName);
}

function runStopwatch() {
  setElementAttribute('.race-stopwatch', 'state', 'run');
}

function stopStopwatch() {
  setElementAttribute('.race-stopwatch', 'state', 'stop');
  return document.querySelector('.race-stopwatch').value / 100;
}

function resetStopwatch() {
  setElementAttribute('.race-stopwatch', 'state', 'reset');
}

function setCarColor(pageClassName, id, color) {
  document.querySelector(`.${pageClassName} .page__item[data-id="${id}"] .car__body`).style.fill = color;
}

function updateCar({
  id, name, color, wins, time,
}) {
  mainTabs.forEach((tab) => {
    const pageItem = `.tab-${tab} .page__item[data-id="${id}"]`;
    if (document.querySelector(pageItem)) {
      setCarColor(`tab-${tab}`, id, color);
      document.querySelector(`${pageItem} .page__car-name`).textContent = name;
      if (document.querySelector(`${pageItem} .page__wins`) && wins) {
        document.querySelector(`${pageItem} .page__wins`).textContent = wins;
      }
      if (document.querySelector(`${pageItem} .page__time`) && time) {
        document.querySelector(`${pageItem} .page__time`).textContent = time;
      }
    }
  });
}

function enableUpdateBlock() {
  setEnabled('.update-car__button_update');
  setEnabled('.update-car__name');
  setEnabled('.update-car__button_color');
}

function disableUpdateBlock() {
  setDisabled('.update-car__button_update');
  setDisabled('.update-car__name');
  document.querySelector('.update-car__name').value = '';
  setDisabled('.update-car__button_color');
  removeElementAttribute('.update-car', 'data-car-id');
}

function selectCar(id) {
  const race = document.querySelector(`.race[data-id="${id}"]`);
  enableUpdateBlock();
  document.querySelector('.update-car__name').value = race.querySelector('.race__car-name').textContent;
  document.querySelector('.update-car__button_color').value = rgbToHex(race.querySelector('.car__body').style.fill);
  setElementAttribute('.update-car', 'data-car-id', id);
}

function setCount(tab, count) {
  document.querySelector(`.tab-${tab}__cars-count`).textContent = count;
}

function setGarageCount(count) {
  setCount('garage', count);
}

function setWinnersCount(count) {
  setCount('winners', count);
}

function setPage(pageName, pageNum, pagesCount, cars, addCarCallback) {
  const items = document.querySelectorAll(`.tab-${pageName} .page__item`);
  if (cars.length > items.length) {
    for (let i = 0; i < cars.length; i += 1) {
      if (i < items.length) {
        items[i].dataset.id = cars[i].id;
        updateCar(cars[i]);
      } else {
        addCarCallback(cars[i]);
      }
    }
  } else if (cars.length < items.length) {
    for (let i = 0; i < items.length; i += 1) {
      if (i < cars.length) {
        items[i].dataset.id = cars[i].id;
        updateCar(cars[i]);
      } else {
        items[i].remove();
      }
    }
  } else {
    items.forEach((race, i) => {
      const currentRace = race;
      currentRace.dataset.id = cars[i].id;
      updateCar(cars[i]);
    });
  }
  setPageControls(pageName, pageNum, pagesCount);

  const updateCarId = document.querySelector('.update-car').dataset.carId;
  let idFound = false;
  document.querySelectorAll('.race').forEach((race) => {
    if (race.dataset.id === updateCarId) idFound = true;
  });
  if (!idFound) disableUpdateBlock();
}

async function addCarToWinners({
  id, time, wins, name, color,
}) {
  const carImg = await loadSvg('./images/car.svg').then((data) => data);
  const elementNumber = (document.querySelector('.winners-table__body').children.length + 1) * (+document.querySelector('.tab-winners__page-number').textContent);
  const idRow = `.winners-table__row[data-id="${id}"]`;
  addElement('.winners-table__body', 'tr', 'winners-table__row page__item', null, null, { name: 'data-id', value: id });
  addElement(idRow, 'td', 'winners-table__cell', null, elementNumber, { name: 'data-type', value: 'number' });
  addElement(idRow, 'td', 'winners-table__cell page__car', null, null, { name: 'data-type', value: 'image' });
  document.querySelector(`.winners-table__row[data-id="${id}"] .winners-table__cell[data-type="image"]`).innerHTML = carImg;
  setCarColor('tab-winners', id, color);
  addElement(idRow, 'td', 'winners-table__cell page__car-name', null, name, { name: 'data-type', value: 'name' });
  addElement(idRow, 'td', 'winners-table__cell page__wins', null, wins, { name: 'data-type', value: 'wins' });
  addElement(idRow, 'td', 'winners-table__cell page__time', null, time, { name: 'data-type', value: 'time' });
}

function setWinnersPage(pageNum, maxCarsOnPage, pagesCount, cars) {
  setPage('winners', pageNum, pagesCount, cars, addCarToWinners);
  const startNumber = (pageNum - 1) * maxCarsOnPage + 1;
  document.querySelectorAll('.winners-table__row').forEach((row, index) => {
    const numberCell = row.querySelector('.winners-table__cell[data-type="number"]');
    numberCell.textContent = startNumber + index;
  });
}

function animateCarDrive({ id, draw, duration }) {
  const start = performance.now();
  return requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    draw(timeFraction);
    if (timeFraction < 1) {
      const animationId = requestAnimationFrame(animate);
      const race = document.querySelector(`.race[data-id="${id}"]`);
      setElementAttribute(race, 'data-animation-id', animationId);
    }
  });
}

function noCarsDriving() {
  const races = document.querySelectorAll('.race');
  for (let i = 0; i < races.length; i += 1) {
    if (races[i].dataset.state !== 'reset') return false;
  }
  return true;
}

function driveCar(id, { velocity, distance }) {
  const race = document.querySelector(`.race[data-id="${id}"]`);
  if (!race) return;
  const car = race.querySelector('.race__car');
  setEnabled(race.querySelector('.race__control_stop'));
  setEnabled(document.querySelector('.controls__reset-button'));
  const duration = distance / velocity; // milliseconds
  const wheels = car.querySelectorAll('.car__wheel');
  for (let i = 0; i < wheels.length; i += 1) {
    wheels[i].style.transitionDuration = `${Math.round(duration)}ms`;
  }
  const bodyContent = window.getComputedStyle(document.querySelector('.body__content'));
  const padding = parseInt(bodyContent.paddingLeft, 10);
  const driveDistance = parseInt(bodyContent.width, 10) - padding * 2
    - parseInt(window.getComputedStyle(car).width, 10);
  const start = padding;

  const animationId = animateCarDrive({
    id,
    duration,
    draw(progress) {
      car.style.left = `${start + progress * driveDistance}px`;
    },
  });
  setElementAttribute(race, 'data-animation-id', animationId);
  setElementAttribute(race, 'data-state', 'drive');
  car.classList.add('race-animation');
}

function stopCar(id) {
  const race = document.querySelector(`.race[data-id="${id}"]`);
  if (!race) return;
  const car = race.querySelector('.race__car');
  car.style.transitionDuration = '';
  const wheels = car.querySelectorAll('.car__wheel');
  for (let i = 0; i < wheels.length; i += 1) {
    wheels[i].style.transitionDuration = '';
  }
  cancelAnimationFrame(+race.dataset.animationId);
  car.classList.remove('race-animation');
  setEnabled(race.querySelector('.race__button_remove'));
  setEnabled(race.querySelector('.race__button_select'));
  setElementAttribute(race, 'data-state', 'stopped');
}

function resetCar(id) {
  const race = document.querySelector(`.race[data-id="${id}"]`);
  if (!race) return;
  const car = race.querySelector('.race__car');
  setEnabled(race.querySelector('.race__control_start'));
  setDisabled(race.querySelector('.race__control_stop'));
  stopCar(id);
  car.style.left = '';
  setElementAttribute(race, 'data-state', 'reset');
  if (noCarsDriving()) {
    setEnabled(document.querySelector('.controls__race-button'));
    enablePageControls('garage');
    setDisabled(document.querySelector('.controls__reset-button'));
    resetStopwatch();
    setEnabled(document.querySelector('.controls__generate-button'));
  }
}

function showPopup(content) {
  let popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
  addElement('.body__content', 'div', 'popup');
  addElement('.popup', 'div', 'popup__content');
  document.querySelector('.popup__content').innerHTML = content.innerHTML;
  addElement('.popup__content', 'button', 'button button_black popup__close-button', null, 'close');
  document.querySelector('.popup__close-button').onclick = () => {
    document.querySelector('.popup').ontransitionend = () => {
      popup = document.querySelector('.popup');
      if (popup) {
        popup.remove();
      }
    };
    document.querySelector('.popup').classList.remove('show-popup');
  };
  enablePageControls('garage');
  document.querySelector('.popup').classList.add('show-popup');
}

function showWinnerPopup(winnerData) {
  const content = createElement('div');
  addElement(content, 'img', 'popup__cup', null, null, { name: 'src', value: './images/cup.svg' });
  addElement(content, 'h2', 'popup__caption', null, 'winner');
  addElement(content, 'p', 'popup__car-name', null, document.querySelector(`.race[data-id="${winnerData.id}"] .race__car-name`).textContent);
  addElement(content, 'p', 'popup__time', null, `Time: ${winnerData.time.toFixed(2)} sec`);
  showPopup(content);
  setEnabled('.controls__reset-button');
}

function showRaceFailPopup(message) {
  const content = createElement('div');
  addElement(content, 'h2', 'popup__caption', null, message);
  showPopup(content);
  setEnabled('.controls__reset-button');
}

function setGarageListeners(currentRace) {
  document.querySelector(`${currentRace} .race__button_remove`).addEventListener('click', (event) => {
    const carId = event.target.closest('.race').dataset.id;
    deleteCarCallback(carId);
    const curUpdateCarId = document.querySelector('.update-car').dataset.carId;
    if (curUpdateCarId === carId) {
      disableUpdateBlock();
    }
  });

  document.querySelector(`${currentRace} .race__button_select`).addEventListener('click', (event) => {
    selectCar(getElementAttribute(event.target.closest('.race'), 'data-id'));
  });

  document.querySelector(`${currentRace} .race__control_start`).addEventListener('click', (event) => {
    const carId = getElementAttribute(event.target.closest('.race'), 'data-id');
    const race = document.querySelector(`.race[data-id="${carId}"]`);
    setDisabled(race.querySelector('.race__control_start'));
    setDisabled(race.querySelector('.race__button_remove'));
    setDisabled(race.querySelector('.race__button_select'));
    setDisabled(document.querySelector('.controls__race-button'));
    setDisabled(document.querySelector('.controls__generate-button'));
    startCarCallback(carId);
  });

  document.querySelector(`${currentRace} .race__control_stop`).addEventListener('click', (event) => {
    const carId = getElementAttribute(event.target.closest('.race'), 'data-id');
    const race = document.querySelector(`.race[data-id="${carId}"]`);
    stopCar(carId);
    setDisabled(race.querySelector('.race__control_stop'));
    resetCarCallback(carId);
  });
}

async function addCarToGarage({ id, name, color }) {
  addElement('.race-area', 'div', 'race page__item', null, null, { name: 'data-id', value: id });
  const currentRace = `.race[data-id="${id}"]`;
  addElement(currentRace, 'div', 'race__buttons');
  addElement(`${currentRace} .race__buttons`, 'button', 'button button_black race__button race__button_select', null, 'select');
  addElement(`${currentRace} .race__buttons`, 'button', 'button button_black race__button race__button_remove', null, 'remove');
  addElement(`${currentRace}`, 'div', 'race__controls', '');
  addElement(`${currentRace} .race__controls`, 'button', 'button button_main-color button_round race__control race__control_start');
  addElement(`${currentRace} .race__control_start`, 'img', 'race__control-img', null, null, { name: 'src', value: './images/button-start.svg' });
  addElement(`${currentRace} .race__controls`, 'button', 'button button_main-color button_round race__control race__control_stop', null, null, { name: 'disabled', value: '' });
  addElement(`${currentRace} .race__control_stop`, 'img', 'race__control-img', null, null, { name: 'src', value: './images/button-stop.svg' });
  addElement(`${currentRace} .race__controls`, 'p', 'race__car-name page__car-name');
  addElement(currentRace, 'div', 'race__road');
  addElement(`${currentRace} .race__road`, 'div', 'race__car page__car');
  const carImg = await loadSvg('./images/car.svg').then((data) => data);
  document.querySelector(`${currentRace} .race__car`).innerHTML = carImg;
  updateCar({ id, name, color });
  setGarageListeners(currentRace);
  setEnabled('.controls__race-button');
}

function setGaragePage(pageNum, pagesCount, cars) {
  const popup = document.querySelector('.popup');
  if (popup) popup.remove();
  setPage('garage', pageNum, pagesCount, cars, addCarToGarage);
  document.querySelectorAll('.race').forEach((race) => {
    resetCar(race.dataset.id);
  });
}

function deleteCarFromWinners(id) {
  const carInWinnersTable = document.querySelector(`.winners-table__row[data-id="${id}"]`);
  if (carInWinnersTable) {
    carInWinnersTable.remove();
  }
}

function editCarNameCheck(event, relatedButton) {
  if (event.target.value === '') {
    setDisabled(`.${relatedButton}`);
  } else {
    setEnabled(`.${relatedButton}`);
  }
}

function tabButtonClick(tab) {
  mainTabs.forEach((curTab) => {
    const tabButton = `.header__button_tab-${curTab}`;
    if (tab === curTab) {
      showElement(`.tab-${curTab}`);
      document.querySelector(tabButton).classList.add('highlight');
    } else {
      hideElement(`.tab-${curTab}`);
      document.querySelector(tabButton).classList.remove('highlight');
    }
  });
}

function initListeners() {
  document.querySelector('.new-car__name').addEventListener('input', (event) => {
    editCarNameCheck(event, 'new-car__button_create');
  });

  document.querySelector('.update-car__name').addEventListener('input', (event) => {
    editCarNameCheck(event, 'update-car__button_update');
  });

  mainTabs.forEach((tab) => {
    document.querySelector(`.header__button_tab-${tab}`).addEventListener('click', () => {
      tabButtonClick(tab);
    });
  });
}

function getWinnersSortSettings() {
  const sortCell = document.querySelector('.winners-table__header-cell[data-order]');
  return {
    sortParam: sortCell.dataset.sort,
    sortOrder: sortCell.dataset.order,
  };
}

function sortHeaderClick(event, callback) {
  const sortCell = event.currentTarget;
  document.querySelectorAll('.winners-table__header-cell[data-sort]').forEach((cell) => {
    if (cell.dataset.sort !== sortCell.dataset.sort) {
      cell.removeAttribute('data-order');
    }
  });
  const sortParam = sortCell.dataset.sort;
  const sortOrder = sortCell.dataset.order === 'ASC' ? 'DESC' : 'ASC';
  sortCell.dataset.order = sortOrder;
  callback({ sortParam, sortOrder });
}

function createCarClick(callback) {
  const name = document.querySelector('.new-car__name').value;
  const color = document.querySelector('.new-car__button_color').value;
  document.querySelector('.new-car__name').value = '';
  setDisabled('.new-car__button_create');
  callback({ name, color });
}

function updateCarClick(callback) {
  const id = document.querySelector('.update-car').dataset.carId;
  const name = document.querySelector('.update-car__name').value;
  const color = document.querySelector('.update-car__button_color').value;
  document.querySelector('.update-car__name').value = '';
  disableUpdateBlock();
  callback({ id, name, color });
}

function raceClick(callback) {
  setDisabled('.controls__race-button');
  setDisabled('.controls__reset-button');
  setDisabled('.controls__generate-button');
  disablePageControls('garage');
  const ids = [];
  document.querySelectorAll('.race').forEach((race) => {
    ids.push(+race.dataset.id);
    setDisabled(race.querySelector('.race__control_start'));
    setDisabled(race.querySelector('.race__button_select'));
    setDisabled(race.querySelector('.race__button_remove'));
  });
  callback(ids);
}

async function resetClick(callback) {
  setDisabled('.controls__reset-button');
  const ids = [];
  document.querySelectorAll('.race').forEach((race) => {
    ids.push(+race.dataset.id);
  });
  await callback(ids);
  resetStopwatch();
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
}

function setPageControlsCallbacks(
  garagePrevCallback,
  garageNextCallback,
  winnersPrevCallback,
  winnersNextCallback,
) {
  document.querySelector('.tab-garage__prev-page').addEventListener('click', garagePrevCallback);
  document.querySelector('.tab-garage__next-page').addEventListener('click', garageNextCallback);
  document.querySelector('.tab-winners__prev-page').addEventListener('click', winnersPrevCallback);
  document.querySelector('.tab-winners__next-page').addEventListener('click', winnersNextCallback);
}

function setCallbacks(
  garageCreateCarCb,
  garageUpdateCarCb,
  deleteCarCb,
  garagePrevPageCb,
  garageNextPageCb,
  winPrevPageCb,
  winNextPageCb,
  winSortCb,
  generateCarsCb,
  startCarCb,
  resetCarCb,
  startRaceCb,
  resetRaceCb,
) {
  setPageControlsCallbacks(garagePrevPageCb, garageNextPageCb, winPrevPageCb, winNextPageCb);
  document.querySelector('.controls__generate-button').addEventListener('click', async () => {
    await generateCarsCb();
  });
  document.querySelectorAll('.winners-table__header-cell[data-sort]').forEach((sort) => sort.addEventListener('click', (event) => {
    sortHeaderClick(event, winSortCb);
  }));
  document.querySelector('.new-car__button_create').addEventListener('click', () => {
    createCarClick(garageCreateCarCb);
  });
  document.querySelector('.update-car__button_update').addEventListener('click', () => {
    updateCarClick(garageUpdateCarCb);
  });
  document.querySelector('.controls__race-button').addEventListener('click', () => {
    raceClick(startRaceCb);
  });
  document.querySelector('.controls__reset-button').addEventListener('click', async () => {
    resetClick(resetRaceCb);
  });
  deleteCarCallback = deleteCarCb;
  startCarCallback = startCarCb;
  resetCarCallback = resetCarCb;
}

function initControlPanel() {
  addElement('.tab-garage', 'div', 'control-panel');
  addElement('.control-panel', 'div', 'new-car');
  addElement('.new-car', 'input', 'input new-car__name', null, null, { name: 'type', value: 'text' });
  addElement('.new-car', 'input', 'input button-color new-car__button new-car__button_color', null, null, { name: 'type', value: 'color' });
  addElement('.new-car', 'button', 'button button_black control-panel__button new-car__button_create', null, 'create');

  addElement('.control-panel', 'div', 'update-car');
  addElement('.update-car', 'input', 'input update-car__name', null, null, { name: 'type', value: 'text' });
  addElement('.update-car', 'input', 'input button-color update-car__button update-car__button_color', null, null, { name: 'type', value: 'color' });
  addElement('.update-car', 'button', 'button button_black control-panel__button update-car__button_update', null, 'update');

  addElement('.control-panel', 'div', 'controls');
  addElement('.controls', 'button', 'button button_main-color controls__race-button', null, 'race');
  addElement('.controls', 'button', 'button button_main-color controls__reset-button', null, 'reset');
  addElement('.controls', 'button', 'button button_main-color controls__generate-button', null, 'generate cars');
}

function initTabs() {
  addElement('.header__content', 'div', 'header__buttons');
  addElement('.header__content', 'img', 'header__logo', null, null, { name: 'src', value: './images/logo.svg' });
  mainTabs.forEach((tab, index) => {
    addElement('.header__buttons', 'button', `button button_black header__button header__button_tab-${tab}`, null, tab);
    addElement('.main__content', 'section', `tab tab-${tab}`);
    if (index > 0) {
      hideElement(`.tab-${tab}`);
    } else {
      document.querySelector(`.header__button_tab-${tab}`).classList.add('highlight');
    }
  });
}

function initFooter() {
  addElement('.footer__content', 'a', 'footer__github-logo', null, null, { name: 'href', value: 'https://github.com/BayanAlex' });
  addElement('.footer__github-logo', 'img', 'footer__github-img', null, null, { name: 'src', value: 'images/logo-github.svg' });
  addElement('.footer__content', 'div', 'footer__copyright', null, '© 01.2023 Oleksandr Shyhyda');
  addElement('.footer__content', 'a', 'footer__rs-logo', null, null, { name: 'href', value: 'https://rs.school/' });
  addElement('.footer__rs-logo', 'img', 'footer__rs-img', null, null, { name: 'src', value: 'images/logo-rsschool.svg' });
}

function initBody() {
  addElement('.body', 'div', 'body__content', null, null, null, 'begin');
  addElement('.body__content', 'header', 'header');
  addElement('.header', 'div', 'header__content');
  addElement('.body__content', 'main', 'main');
  addElement('.main', 'div', 'main__content');
  addElement('.body__content', 'footer', 'footer');
  addElement('.footer', 'div', 'footer__content');
  initFooter();
}

function addPageControl(pageName) {
  addElement(`.tab-${pageName}`, 'div', `page-controls tab-${pageName}__page-controls`);
  addElement(`.tab-${pageName} .page-controls`, 'button', `button button_round button_main-color page-controls__button page-controls__button_prev tab-${pageName}__prev-page`, null);
  addElement(`.tab-${pageName}__prev-page`, 'img', null, null, null, { name: 'src', value: './images/angle-left.svg' });
  addElement(`.tab-${pageName} .page-controls`, 'div', `page-controls__number tab-${pageName}__page-number`, null, '1');
  addElement(`.tab-${pageName} .page-controls`, 'button', `button button_round button_main-color page-controls__button page-controls__button_next tab-${pageName}__next-page`, null);
  addElement(`.tab-${pageName}__next-page`, 'img', null, null, null, { name: 'src', value: './images/angle-right.svg' });
}

function initGarage() {
  addElement('.tab-garage', 'div', 'tab-garage__caption-wrap', '');
  addElement('.tab-garage__caption-wrap', 'div', 'tab-caption tab-garage__caption', '');
  addElement('.tab-garage__caption', 'span', 'tab-caption__text tab-garage__caption-text', null, 'garage');
  addElement('.tab-garage__caption', 'span', 'tab-caption__count tab-garage__cars-count', null, '0');
  addElement('.tab-garage__caption-wrap', 'x-stopwatch', 'race-stopwatch');
  addElement('.tab-garage', 'div', 'race-area page', '');
  addPageControl('garage');
}

function initWinners() {
  addElement('.tab-winners', 'div', 'tab-caption tab-winners__caption');
  addElement('.tab-winners__caption', 'span', 'tab-caption__text tab-winners__caption-text', null, 'winners');
  addElement('.tab-winners__caption', 'span', 'tab-caption__count tab-winners__cars-count', null, '0');
  addElement('.tab-winners', 'table', 'winners-table-wrap');
  addElement('.winners-table-wrap', 'table', 'winners-table');
  addElement('.winners-table', 'thead', 'winners-table__header');
  addElement('.winners-table__header', 'tr', 'winners-table__header-row');
  addElement('.winners-table', 'tbody', 'winners-table__body page');
  ['#', 'car', 'name'].forEach((caption) => addElement('.winners-table__header-row', 'th', 'winners-table__header-cell', null, caption));
  addElement('.winners-table__header-row', 'th', 'winners-table__header-cell', null, null, [{ name: 'data-sort', value: 'wins' }, { name: 'data-order', value: 'ASC' }]);
  addElement('.winners-table__header-cell[data-sort="wins"]', 'div', 'winners-table__header-cell-content', null, 'wins');
  addElement('.winners-table__header-cell[data-sort="wins"] .winners-table__header-cell-content', 'img', 'sort-arrow', null, null, { name: 'src', value: './images/arrow-up.svg' });
  addElement('.winners-table__header-row', 'th', 'winners-table__header-cell', null, null, { name: 'data-sort', value: 'time' });
  addElement('.winners-table__header-cell[data-sort="time"]', 'div', 'winners-table__header-cell-content', null, 'time (sec)');
  addElement('.winners-table__header-cell[data-sort="time"] .winners-table__header-cell-content', 'img', 'sort-arrow', null, null, { name: 'src', value: './images/arrow-up.svg' });
  addPageControl('winners');
}

function initStates() {
  setDisabled('.new-car__button_create');
  disableUpdateBlock();
  setDisabled('.controls__race-button');
  setDisabled('.controls__reset-button');
  document.querySelectorAll('.page-controls__button').forEach((button) => {
    setDisabled(button);
  });
}

function initCustom() {
  customElements.define('x-stopwatch', Stopwatch);
}

function initUi() {
  initBody();
  initCustom();
  initTabs();
  initControlPanel();
  initGarage();
  initWinners();
  initStates();
  initListeners();
}

function setTabActive(tab) {
  document.querySelectorAll('.tab').forEach((curTab) => (curTab.id === tab ? showElement(`#${curTab}`) : hideElement(`#${curTab}`)));
}

export {
  initUi,
  setTabActive,
  addCarToGarage,
  addCarToWinners,
  deleteCarFromWinners,
  setGarageCount,
  setWinnersCount,
  setGaragePage,
  setWinnersPage,
  setCallbacks,
  updateCar,
  getWinnersSortSettings,
  driveCar,
  stopCar,
  resetCar,
  showWinnerPopup,
  showRaceFailPopup,
  runStopwatch,
  stopStopwatch,
};

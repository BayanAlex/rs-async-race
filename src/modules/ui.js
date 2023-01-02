const mainTabs = ['garage', 'winners'];
let deleteCarCallback;

const disableButtonNext = (tabName) => setDisabled(document.querySelector(`.tab-${tabName} .page-controls__button_next`));
const disableButtonPrevious = (tabName) => setDisabled(document.querySelector(`.tab-${tabName} .page-controls__button_prev`));
const enableButtonNext = (tabName) => setEnabled(document.querySelector(`.tab-${tabName} .page-controls__button_next`));
const enableButtonPrevious = (tabName) => setEnabled(document.querySelector(`.tab-${tabName} .page-controls__button_prev`));

function setPageControls(tabName, currentPage, pagesCount) {
  document.querySelector(`.tab-${tabName} .page-controls__number`).textContent = currentPage;

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

function createElement(elementType, classList, id, text, attributes) {
  const element = document.createElement(elementType);
  if (classList) {
    classList.split(' ').forEach((c) => element.classList.add(c));
  }
  if (id) {
    element.setAttribute('id', id);
  }
  if (text) {
    element.textContent = text;
  }
  if (attributes) {
    if (Array.isArray(attributes)) {
      attributes.forEach((attr) => element.setAttribute(attr.name, attr.value));
    } else {
      element.setAttribute(attributes.name, attributes.value);
    }
  }
  return element;
}

function addElement(destination, elementType, classList, id, text, attributes, position = 'end') {
  const element = createElement(elementType, classList, id, text, attributes, position);
  const insert = {
    begin() {
      document.querySelector(destination).prepend(element); },
    end() { document.querySelector(destination).append(element); },
  };
  insert[position]();
}

function setElementText(element, text) {
  document.querySelector(element).textContent = text;
  if (typeof element === 'string') {
    document.querySelector(element).textContent = text;
  } else {
    element.textContent = text;
  }
}

function setElementAttribute(element, attribute, value) {
  if (typeof element === 'string') {
    document.querySelector(element).setAttribute(attribute, value);
  } else {
    element.setAttribute(attribute, value);
  }
}

function getElementAttribute(element, attribute) {
  if (typeof element === 'string') {
    return document.querySelector(element).getAttribute(attribute);
  }
  return element.getAttribute(attribute);
}

function removeElementAttribute(element, attribute) {
  if (typeof element === 'string') {
    document.querySelector(element).removeAttribute(attribute);
  } else {
    element.removeAttribute(attribute);
  }
}

function setDisabled(element) {
  if (typeof element === 'string') {
    document.querySelector(element).setAttribute('disabled', '');
  } else {
    element.setAttribute('disabled', '');
  }
}

function setEnabled(element) {
  if (typeof element === 'string') {
    document.querySelector(element).removeAttribute('disabled');
  } else {
    element.removeAttribute('disabled');
  }
}

function showElement(element) {
  if (typeof element === 'string') {
    document.querySelector(element).classList.remove('hidden');
  } else {
    element.classList.remove('hidden');
  }
}

function hideElement(element) {
  if (typeof element === 'string') {
    document.querySelector(element).classList.add('hidden');
  } else {
    element.classList.add('hidden');
  }
}

function uiGetCount(tab) {
  return +document.querySelector(`.tab-${tab}__cars-count`).textContent;
}

function uiSetCount(tab, count) {
  document.querySelector(`.tab-${tab}__cars-count`).textContent = count;
}

function uiSetGarageCount(count) {
  uiSetCount('garage', count);
}

function uiIncGarageCount() {
  uiSetCount('garage', uiGetCount('garage') + 1);
}

function uiDecGarageCount() {
  uiSetCount('garage', uiGetCount('garage') - 1);
}

function uiSetWinnersCount(count) {
  uiSetCount('winners', count);
}

function uiIncWinnersCount() {
  uiSetCount('winners', uiGetCount('winners') + 1);
}

function uiDecWinnersCount() {
  uiSetCount('winners', uiGetCount('winners') - 1);
}

function uiResetRace(id) {

}

// function uiSetGaragePage(cars, page, pagesCount) {
//   document.querySelectorAll('.race').forEach((race) => race.remove());
//   cars.forEach((car) => uiAddCarToGarage(car));
//   setPageControls('garage', page, pagesCount);
// }

function uiSetPage(pageName, pageNum, pagesCount, cars, addCarCallback) {
  const items = document.querySelectorAll(`.tab-${pageName} .page__item`);
  if (cars.length > items.length) {
    for (let i = 0; i < cars.length; i += 1) {
      if (i < items.length) {
        items[i].dataset.id = cars[i].id;
        uiUpdateCar(cars[i]);
        // uiResetRace(cars[i].id);
      } else {
        addCarCallback(cars[i]);
      }
    }
  } else if (cars.length < items.length) {
    for (let i = 0; i < items.length; i += 1) {
      if (i < cars.length) {
        items[i].dataset.id = cars[i].id;
        uiUpdateCar(cars[i]);
        // uiResetRace(cars[i].id);
      } else {
        items[i].remove();
      }
    }
  } else {
    items.forEach((race, i) => {
      const currentRace = race;
      currentRace.dataset.id = cars[i].id;
      uiUpdateCar(cars[i]);
      // uiResetRace(cars[i].id);
    });
  }
  setPageControls(pageName, pageNum, pagesCount);
}

function uiSetGaragePage(pageNum, pagesCount, cars) {
  uiSetPage('garage', pageNum, pagesCount, cars, uiAddCarToGarage);
}

function uiSetWinnersPage(pageNum, maxCarsOnPage, pagesCount, cars) {
  uiSetPage('winners', pageNum, pagesCount, cars, uiAddCarToWinners);
  const startNumber = (pageNum - 1) * maxCarsOnPage + 1;
  document.querySelectorAll('.winners-table__row').forEach((row, index) => {
    const numberCell = row.querySelector('.winners-table__cell[data-type="number"]');
    numberCell.textContent = startNumber + index;
  });
}

async function uiAddCarToGarage({ id, name, color }) {
  addElement('.race-area', 'div', 'race page__item', null, null, { name: 'data-id', value: id });
  const currentRace = `.race[data-id="${id}"]`;
  addElement(currentRace, 'div', 'race__buttons');
  addElement(`${currentRace} .race__buttons`, 'button', 'button button_black race__button race__button_select', null, 'select');
  addElement(`${currentRace} .race__buttons`, 'button', 'button button_black race__button race__button_remove', null, 'remove');
  addElement(`${currentRace}`, 'div', 'race__controls', '');
  addElement(`${currentRace} .race__controls`, 'button', 'button button_main-color button_round race__control race__control_start');
  addElement(`${currentRace} .race__control_start`, 'img', 'race__control-img', null, null, { name: 'src', value: './images/button-start.svg' });
  document.querySelector(`${currentRace} .race__control_start`).addEventListener('click', () => {
    document.querySelector(`${currentRace} .race__car`).classList.add('race-animation');
  });
  addElement(`${currentRace} .race__controls`, 'button', 'button button_main-color button_round race__control race__control_stop');
  addElement(`${currentRace} .race__control_stop`, 'img', 'race__control-img', null, null, { name: 'src', value: './images/button-stop.svg' });
  document.querySelector(`${currentRace} .race__control_stop`).addEventListener('click', () => {
    document.querySelector(`${currentRace} .race__car`).classList.remove('race-animation');
  });
  addElement(`${currentRace} .race__controls`, 'p', 'race__car-name page__car-name');
  addElement(currentRace, 'div', 'race__road');
  addElement(`${currentRace} .race__road`, 'div', 'race__car page__car');
  const carImg = await loadSvg('./images/car.svg').then((data) => data);
  document.querySelector(`${currentRace} .race__car`).innerHTML = carImg;
  uiUpdateCar({ id, name, color });
  // uiIncGarageCount();

  document.querySelector(`${currentRace} .race__button_remove`).addEventListener('click', (event) => {
    deleteCarCallback(getElementAttribute(event.target.closest('.race'), 'data-id'));
  });
  document.querySelector(`${currentRace} .race__button_select`).addEventListener('click', (event) => {
    uiSelectCar(getElementAttribute(event.target.closest('.race'), 'data-id'));
  });
  setEnabled('.controls__race-button');
  // garagePages.update();
}

function uiDeleteCarFromGarage(id) {
  document.querySelector(`.race[data-id="${id}"]`).remove();
  const curUpdateCarId = document.querySelector('.update-car').dataset.carId;
  if (+curUpdateCarId === id) {
    document.querySelector('.update-car__name').value = '';
    uiDisableUpdateBlock();
  }
  // uiRemoveCarFromWinners(id);
  // garagePages.update();
}

async function uiAddCarToWinners({
  id, time, wins, name, color,
}) {
  const carImg = await loadSvg('./images/car.svg').then((data) => data);
  const elementNumber = (document.querySelector('.winners-table__body').children.length + 1) * (+document.querySelector('.tab-winners__page-number').textContent);
  addElement('.winners-table__body', 'tr', 'winners-table__row page__item', null, null, { name: 'data-id', value: id });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell', null, elementNumber, { name: 'data-type', value: 'number' });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell page__car', null, null, { name: 'data-type', value: 'image' });
  document.querySelector(`.winners-table__row[data-id="${id}"] .winners-table__cell[data-type="image"]`).innerHTML = carImg;
  uiSetCarColor('tab-winners', id, color);
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell page__car-name', null, name, { name: 'data-type', value: 'name' });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell page__wins', null, wins, { name: 'data-type', value: 'wins' });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell page__time', null, time, { name: 'data-type', value: 'time' });
  // uiIncWinnersCount();
  // winnersPages.update();
}

function uiDeleteCarFromWinners(id) {
  const carInWinnersTable = document.querySelector(`.winners-table__row[data-id="${id}"]`);
  if (carInWinnersTable) {
    carInWinnersTable.remove();
    // uiDecWinnersCount();
    // winnersPages.update();
  }
}

function uiEnableUpdateBlock() {
  setEnabled('.update-car__button_update');
  setEnabled('.update-car__name');
  setEnabled('.update-car__button_color');
}

function uiDisableUpdateBlock() {
  setDisabled('.update-car__button_update');
  setDisabled('.update-car__name');
  setDisabled('.update-car__button_color');
  removeElementAttribute('.update-car', 'data-car-id');
}

function uiSetListeners() {
  document.querySelector('.new-car__name').addEventListener('input', (event) => {
    if (event.target.value === '') {
      setDisabled('.new-car__button_create');
    } else {
      setEnabled('.new-car__button_create');
    }
  });

  document.querySelector('.update-car__name').addEventListener('input', (event) => {
    if (event.target.value === '') {
      setDisabled('.update-car__button_update');
    } else {
      setEnabled('.update-car__button_update');
    }
  });

  mainTabs.forEach((tab) => {
    document.querySelector(`.header__button_tab-${tab}`).addEventListener('click', () => {
      mainTabs.forEach((curTab) => {
        if (tab === curTab) {
          showElement(`.tab-${curTab}`);
          document.querySelector(`.header__button_tab-${curTab}`).classList.add('highlight');
        } else {
          hideElement(`.tab-${curTab}`);
          document.querySelector(`.header__button_tab-${curTab}`).classList.remove('highlight');
        }
      });
    });
  });
}

function uiGetWinnersSortSettings() {
  const sortCell = document.querySelector('.winners-table__header-cell[data-order]');
  return {
    sortParam: sortCell.dataset.sort,
    sortOrder: sortCell.dataset.order,
  };
}

function uiSetCallbacks(
  garageCreateCar,
  garageUpdateCar,
  deleteCallback,
  garagePreviousPage,
  garageNextPage,
  winnersPreviousPage,
  winnersNextPage,
  winnersSort,
  generateCars,
) {
  document.querySelector('.tab-garage__prev-page').addEventListener('click', garagePreviousPage);
  document.querySelector('.tab-garage__next-page').addEventListener('click', garageNextPage);
  document.querySelector('.tab-winners__prev-page').addEventListener('click', winnersPreviousPage);
  document.querySelector('.tab-winners__next-page').addEventListener('click', winnersNextPage);
  document.querySelector('.controls__generate-button').addEventListener('click', generateCars);

  document.querySelectorAll('.winners-table__header-cell[data-sort]').forEach((sort) => sort.addEventListener('click', (event) => {
    const sortCell = event.currentTarget;
    document.querySelectorAll('.winners-table__header-cell[data-sort]').forEach((cell) => {
      if (cell.dataset.sort !== sortCell.dataset.sort) {
        cell.removeAttribute('data-order');
      }
    });
    const sortParam = sortCell.dataset.sort;
    const sortOrder = sortCell.dataset.order === 'ASC' ? 'DESC' : 'ASC';
    sortCell.dataset.order = sortOrder;
    winnersSort({ sortParam, sortOrder });
  }));

  document.querySelector('.new-car__button_create').addEventListener('click', () => {
    const name = document.querySelector('.new-car__name').value;
    // if (name === '') return;
    const color = document.querySelector('.new-car__button_color').value;
    document.querySelector('.new-car__name').value = '';
    setDisabled('.new-car__button_create');
    garageCreateCar({ name, color });
  });

  document.querySelector('.update-car__button_update').addEventListener('click', () => {
    const id = document.querySelector('.update-car').dataset.carId;
    const name = document.querySelector('.update-car__name').value;
    const color = document.querySelector('.update-car__button_color').value;
    document.querySelector('.update-car__name').value = '';
    uiDisableUpdateBlock();
    garageUpdateCar({ id, name, color });
  });

  deleteCarCallback = deleteCallback;
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

function initBody() {
  addElement('.body', 'div', 'body__content', null, null, null, 'begin');
  addElement('.body__content', 'header', 'header');
  addElement('.header', 'div', 'header__content');
  addElement('.body__content', 'main', 'main');
  addElement('.main', 'div', 'main__content');
  addElement('.body__content', 'footer', 'footer');
  addElement('.footer', 'div', 'footer__content');
}

async function loadSvg(path) {
  const svg = await fetch(path).then((response) => response.text()).then((data) => data);
  return svg;
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
  addElement('.tab-garage', 'div', 'tab-caption tab-garage__caption', '');
  addElement('.tab-garage__caption', 'span', 'tab-caption__text tab-garage__caption-text', null, 'garage');
  addElement('.tab-garage__caption', 'span', 'tab-caption__count tab-garage__cars-count', null, '0');
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

function uiSetCarColor(pageClassName, id, color) {
  document.querySelector(`.${pageClassName} .page__item[data-id="${id}"] .car__body`).style.fill = color;
}

function rgbToHex(color) {
  return color.match(/\d+/g).reduce((result, value) => {
    const hexVal = (+value).toString(16);
    return result + (hexVal.length > 1 ? hexVal : `0${hexVal}`);
  }, '#');
}

function uiSelectCar(id) {
  const race = document.querySelector(`.race[data-id="${id}"]`);
  uiEnableUpdateBlock();
  document.querySelector('.update-car__name').value = race.querySelector('.race__car-name').textContent;
  document.querySelector('.update-car__button_color').value = rgbToHex(race.querySelector('.car__body').style.fill);
  setElementAttribute('.update-car', 'data-car-id', id);
}

function uiUpdateCar({ id, name, color, wins, time }) {
  mainTabs.forEach((tab) => {
    const pageItem = `.tab-${tab} .page__item[data-id="${id}"]`;
    if (document.querySelector(pageItem)) {
      uiSetCarColor(`tab-${tab}`, id, color);
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

function initStates() {
  setDisabled('.new-car__button_create');
  uiDisableUpdateBlock();
  setDisabled('.controls__race-button');
  setDisabled('.controls__reset-button');
  document.querySelectorAll('.page-controls__button').forEach((button) => {
    setDisabled(button);
  });
}

function initUi() {
  initBody();
  initTabs();
  initControlPanel();
  initGarage();
  initWinners();
  initStates();
  uiSetListeners();
}

function uiSetTabActive(tab) {
  document.querySelectorAll('.tab').forEach((curTab) => (curTab.id === tab ? showElement(`#${curTab}`) : hideElement(`#${curTab}`)));
}

export {
  initUi,
  uiSetTabActive,
  uiAddCarToGarage,
  uiDeleteCarFromGarage,
  uiAddCarToWinners,
  uiDeleteCarFromWinners,
  uiSetGarageCount,
  uiSetWinnersCount,
  uiSetGaragePage,
  uiSetWinnersPage,
  uiSetCallbacks,
  uiUpdateCar,
  uiGetWinnersSortSettings,
};

const mainTabs = ['garage', 'winners'];
const maxGaragePageItems = 7;
const maxWinnersPageItems = 3;
let garagePages;
let winnersPages;

class Paginator {
  currentPage = 1;

  pagesCount = 1;

  itemsCount = 0;

  constructor(contentElementClass, pageControlsElementClass, maxItemsPerPage) {
    this.contentElement = document.querySelector(`.${contentElementClass}`);
    this.pageControlsElement = document.querySelector(`.${pageControlsElementClass}`);
    this.maxItemsPerPage = maxItemsPerPage;

    this.pageControlsElement.querySelector('.page-controls__button_prev').addEventListener('click', () => {
      this.#previousPage();
    });

    this.pageControlsElement.querySelector('.page-controls__button_next').addEventListener('click', () => {
      this.#nextPage();
    });

    // this.observer = new MutationObserver(() => this.update());
    // this.observer.observe(this.contentElement, { childList: true });
  }

  #addPage() {
    this.pagesCount += 1;
  }

  #removeLastPage() {
    this.pagesCount -= 1;
  }

  #disableButton(button) {
    setDisabled(button);
  }

  #disableButtonNext() {
    this.#disableButton(this.pageControlsElement.querySelector('.page-controls__button_next'));
  }

  #disableButtonPrevious() {
    this.#disableButton(this.pageControlsElement.querySelector('.page-controls__button_prev'));
  }

  #enableButton(button) {
    setEnabled(button);
  }

  #enableButtonNext() {
    this.#enableButton(this.pageControlsElement.querySelector('.page-controls__button_next'));
  }

  #enableButtonPrevious() {
    this.#enableButton(this.pageControlsElement.querySelector('.page-controls__button_prev'));
  }

  #setPageControls() {
    this.pageControlsElement.querySelector('.page-controls__number').textContent = this.currentPage;

    if (this.currentPage === this.pagesCount) {
      this.#disableButtonNext();
    } else {
      this.#enableButtonNext();
    }

    if (this.currentPage === 1) {
      this.#disableButtonPrevious();
    } else {
      this.#enableButtonPrevious();
    }
  }

  setPage(index) {
    let start = (this.currentPage - 1) * this.maxItemsPerPage;
    if (start <= this.contentElement.children.length - 1) {
      for (let itemIndex = start; itemIndex <= start + this.maxItemsPerPage - 1; itemIndex += 1) {
        hideElement(this.contentElement.children[itemIndex]);
        if (itemIndex === this.contentElement.children.length - 1) break;
      }
    }

    start = (index - 1) * this.maxItemsPerPage;
    for (let itemIndex = start; itemIndex <= start + this.maxItemsPerPage - 1; itemIndex += 1) {
      showElement(this.contentElement.children[itemIndex]);
      if (itemIndex === this.contentElement.children.length - 1) break;
    }

    this.currentPage = index;
    this.#setPageControls();
  }

  #nextPage() {
    this.setPage(this.currentPage + 1);
  }

  #previousPage() {
    this.setPage(this.currentPage - 1);
  }

  update() {
    this.itemsCount = this.contentElement.children.length;
    this.pagesCount = Math.ceil(this.itemsCount / this.maxItemsPerPage);
    if (this.pagesCount === 0) {
      this.pagesCount = 1;
    }

    if (this.currentPage > this.pagesCount) {
      this.currentPage = this.pagesCount;
    }
    const currentPageStartIndex = (this.currentPage - 1) * this.maxItemsPerPage;
    const currentPageEndIndex = currentPageStartIndex + this.maxItemsPerPage - 1;
    for (let i = 0; i < this.itemsCount; i += 1) {
      if (i >= currentPageStartIndex && i <= currentPageEndIndex) {
        showElement(this.contentElement.children[i]);
      } else {
        hideElement(this.contentElement.children[i]);
      }
    }
    this.#setPageControls();
  }

  // addItem() {
  //   this.itemsCount += 1;
  //   if (Math.ceil(this.itemsCount / this.maxItemsPerPage) > this.pagesCount) {
  //     this.#addPage();
  //   }
  //   this.setPage(this.pagesCount);
  // }

  // removeItem(id) {
  //   this.itemsCount -= 1;
  //   if (this.itemsCount === 0) return;
  //   if (Math.ceil(this.itemsCount / this.maxItemsPerPage) < this.pagesCount) {
  //     this.#removeLastPage();
  //     if (this.currentPage > this.pagesCount) {
  //       this.setPage(this.pagesCount);
  //       return;
  //     }
  //     if (this.currentPage === this.pagesCount) {
  //       this.#disableButtonNext();
  //       return;
  //     }
  //   }

  //   const index = Array.from(this.contentElement.children)
  //     .findIndex((item) => +item.dataset.id === id) + 1;
  //   if (this.currentPage === this.pagesCount
  //       && index <= (this.pagesCount - 1) * this.maxItemsPerPage && index > 0) {
  //     hideElement(this.contentElement.children[(this.currentPage - 1) * this.maxItemsPerPage]);
  //     return;
  //   }

  //   if (this.currentPage < this.pagesCount) {
  //     showElement(this.contentElement.children[this.currentPage * this.maxItemsPerPage - 1]);
  //   }
  // }
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
    document.querySelector(element).getAttribute(attribute);
  } else {
    element.getAttribute(attribute);
  }
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

function uiIncGarageCount() {
  uiSetCount('garage', uiGetCount('garage') + 1);
}

function uiDecGarageCount() {
  uiSetCount('garage', uiGetCount('garage') - 1);
}

function uiIncWinnersCount() {
  uiSetCount('winners', uiGetCount('winners') + 1);
}

function uiDecWinnersCount() {
  uiSetCount('winners', uiGetCount('winners') - 1);
}

async function uiAddCarToGarage(id, name, color) {
  addElement('.race-area', 'div', 'race', null, null, { name: 'data-id', value: id });
  addElement(`.race[data-id="${id}"]`, 'div', 'race__buttons');
  addElement(`.race[data-id="${id}"] .race__buttons`, 'button', 'button button_black race__button race__button_select', null, 'select');
  addElement(`.race[data-id="${id}"] .race__buttons`, 'button', 'button button_black race__button race__button_remove', null, 'remove');
  addElement(`.race[data-id="${id}"]`, 'div', 'race__controls', '');
  addElement(`.race[data-id="${id}"] .race__controls`, 'button', 'button button_main-color button_round race__control race__control_start');
  addElement(`.race[data-id="${id}"] .race__control_start`, 'img', 'race__control-img', null, null, { name: 'src', value: './images/button-start.svg' });
  addElement(`.race[data-id="${id}"] .race__controls`, 'button', 'button button_main-color button_round race__control race__control_stop');
  addElement(`.race[data-id="${id}"] .race__control_stop`, 'img', 'race__control-img', null, null, { name: 'src', value: './images/button-stop.svg' });
  addElement(`.race[data-id="${id}"] .race__controls`, 'p', 'race__car-name');
  addElement(`.race[data-id="${id}"]`, 'div', 'race__road');
  addElement(`.race[data-id="${id}"] .race__road`, 'div', 'race__car');
  const carImg = await loadSvg('./images/car.svg').then((data) => data);
  document.querySelector(`.race[data-id="${id}"] .race__car`).innerHTML = carImg;
  setCarProps(id, name, color);
  addElement(`.race[data-id="${id}"] .race__road`, 'img', 'race__flag', null, null, { name: 'src', value: './images/flag.svg' });
  uiIncGarageCount();

  document.querySelector(`.race[data-id="${id}"] .race__button_remove`).addEventListener('click', () => uiRemoveCarFromGarage(id));
  document.querySelector(`.race[data-id="${id}"] .race__button_select`).addEventListener('click', () => uiSelectCar(id));
  setEnabled('.controls__race-button');
  garagePages.update();
}

function uiRemoveCarFromGarage(id) {
  document.querySelector(`.race[data-id="${id}"]`).remove();
  const curUpdateCarId = document.querySelector('.update-car').dataset.carId;
  uiDecGarageCount();
  if (+curUpdateCarId === id) {
    document.querySelector('.update-car__name').value = '';
    uiDisableUpdateBlock();
  }
  uiRemoveCarFromWinners(id);
  garagePages.update();
}

function uiAddCarToWinners(id) {
  const car = document.querySelector(`.race[data-id="${id}"]`).cloneNode(true);
  const carImg = car.querySelector('.race__car svg');
  const carName = car.querySelector('.race__car-name').textContent;
  addElement('.winners-table__body', 'tr', 'winners-table__row', null, null, { name: 'data-id', value: id });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell', null, '1', { name: 'data-type', value: 'number' });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell', null, null, { name: 'data-type', value: 'image' });
  document.querySelector(`.winners-table__row[data-id="${id}"] .winners-table__cell[data-type="image"]`).append(carImg);
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell', null, carName, { name: 'data-type', value: 'name' });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell', null, '0', { name: 'data-type', value: 'wins' });
  addElement(`.winners-table__row[data-id="${id}"]`, 'td', 'winners-table__cell', null, '0', { name: 'data-type', value: 'time' });
  uiIncWinnersCount();
  winnersPages.update();
}

function uiRemoveCarFromWinners(id) {
  const carInWinnersTable = document.querySelector(`.winners-table__row[data-id="${id}"]`);
  if (carInWinnersTable) {
    carInWinnersTable.remove();
    uiDecWinnersCount();
    winnersPages.update();
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

function setListeners() {
  document.querySelector('.new-car__button_create').addEventListener('click', () => {
    const name = document.querySelector('.new-car__name').value;
    if (name === '') return;
    const color = document.querySelector('.new-car__button_color').value;
    const node = document.querySelectorAll('.race');
    const id = node.length === 0 ? 0 : +node[node.length - 1].dataset.id + 1;
    uiAddCarToGarage(id, name, color);
    document.querySelector('.new-car__name').value = '';
    setDisabled('.new-car__button_create');
  });

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

  document.querySelector('.update-car__button_update').addEventListener('click', () => {
    const id = document.querySelector('.update-car').dataset.carId;
    const name = document.querySelector('.update-car__name').value;
    const color = document.querySelector('.update-car__button_color').value;
    setCarProps(id, name, color);
    document.querySelector('.update-car__name').value = '';
    uiDisableUpdateBlock();
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
  addElement('.tab-garage', 'div', 'race-area', '');
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
  addElement('.winners-table', 'tbody', 'winners-table__body');
  ['#', 'car', 'name'].forEach((caption) => addElement('.winners-table__header-row', 'th', 'winners-table__header-cell', null, caption));
  addElement('.winners-table__header-row', 'th', 'winners-table__header-cell', null, 'wins', { name: 'data-sort', value: 'wins' });
  addElement('.winners-table__header-row', 'th', 'winners-table__header-cell', null, 'best time (sec)', { name: 'data-sort', value: 'time' });
  addPageControl('winners');
}

function uiSetCarColor(raceId, color) {
  document.querySelector(`.race[data-id="${raceId}"] .car__body`).style.fill = color;
  const carInWinnersTable = document.querySelector(`.winners-table__row[data-id="${raceId}"]`);
  if (carInWinnersTable) {
    carInWinnersTable.querySelector('.winners-table__cell[data-type="image"] .car__body').style.fill = color;
  }
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

function setCarProps(id, name, color) {
  uiSetCarColor(id, color);
  document.querySelector(`.race[data-id="${id}"] .race__car-name`).textContent = name;
  const carInWinnersTable = document.querySelector(`.winners-table__row[data-id="${id}"]`);
  if (carInWinnersTable) {
    carInWinnersTable.querySelector('.winners-table__cell[data-type="name"]').textContent = name;
  }
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

function initPaginator() {
  garagePages = new Paginator('race-area', 'tab-garage__page-controls', maxGaragePageItems);
  winnersPages = new Paginator('winners-table__body', 'tab-winners__page-controls', maxWinnersPageItems);
}

function initUi() {
  initBody();
  initTabs();
  initControlPanel();
  initGarage();
  initWinners();
  initStates();
  setListeners();
  initPaginator();
}

function uiSetTabActive(tab) {
  document.querySelectorAll('.tab').forEach((curTab) => (curTab.id === tab ? showElement(`#${curTab}`) : hideElement(`#${curTab}`)));
}

export {
  initUi,
  uiSetTabActive,
  uiAddCarToGarage,
  uiRemoveCarFromGarage,
  uiAddCarToWinners,
  uiRemoveCarFromWinners,
  garagePages,
};

import { initUi, uiAddCarToWinners, garagePages } from './ui';
import { loadCars, generateCars } from './gameplay';

function init() {
  initUi();
}

init();
generateCars().then(() => {
  uiAddCarToWinners(0);
  uiAddCarToWinners(1);
  uiAddCarToWinners(2);
  uiAddCarToWinners(3);
  uiAddCarToWinners(4);
  uiAddCarToWinners(5);
  uiAddCarToWinners(6);
  uiAddCarToWinners(7);
  uiAddCarToWinners(8);
  garagePages.setPage(1);
});

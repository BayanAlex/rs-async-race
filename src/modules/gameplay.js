import { uiAddCarToGarage } from './ui';

async function loadCars() {
  const cars = await fetch('../data/cars.json').then((response) => response.json()).then((data) => data);
  return cars;
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function generateCars() {
  const carsList = await loadCars().then((data) => data);
  const results = [];
  for (let i = 0; i < 100; i += 1) {
    const carBrandIndex = randomRange(0, carsList.length - 1);
    const carBrand = carsList[carBrandIndex].brand;
    const carModelIndex = randomRange(0, carsList[carBrandIndex].models.length - 1);
    const carModel = carsList[carBrandIndex].models[carModelIndex];
    const car = {
      id: i,
      name: `${carBrand} ${carModel}`,
      color: `#${randomRange(0, 0xFFFFFF).toString(16)}`,
    };
    results.push(uiAddCarToGarage(car.id, car.name, car.color));
  }
  await Promise.all(results);
}

export { loadCars, generateCars };

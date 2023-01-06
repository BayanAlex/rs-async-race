async function loadCars() {
  const cars = await fetch('../data/cars.json').then((response) => response.json()).then((data) => data);
  return cars;
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function libGenerateCars(amount) {
  const carsList = await loadCars().then((data) => data);
  const results = [];
  for (let i = 0; i < amount; i += 1) {
    const carBrandIndex = randomRange(0, carsList.length - 1);
    const carBrand = carsList[carBrandIndex].brand;
    const carModelIndex = randomRange(0, carsList[carBrandIndex].models.length - 1);
    const carModel = carsList[carBrandIndex].models[carModelIndex];
    const color = `00000${randomRange(0, 0xFFFFFF).toString(16)}`.slice(-6);
    const car = {
      name: `${carBrand} ${carModel}`,
      color: `#${color}`,
    };
    results.push(car);
  }
  return results;
}

function rgbToHex(color) {
  return color.match(/\d+/g).reduce((result, value) => {
    const hexVal = (+value).toString(16);
    return result + (hexVal.length > 1 ? hexVal : `0${hexVal}`);
  }, '#');
}

export { libGenerateCars, rgbToHex };

const host = 'https://async-race-api.up.railway.app';

async function sendRequest(pathname, searchParams, params = {}) {
  const url = new URL(pathname, host);
  if (searchParams) {
    Object.keys(searchParams).forEach((key) => url.searchParams.append(key, searchParams[key]));
  }
  const result = await fetch(url, params)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((data) => data);
  return result;
}

async function sendPageRequest(pathname, searchParams, params = {}) {
  let totalCount;
  const url = new URL(pathname, host);
  if (searchParams) {
    Object.keys(searchParams).forEach((key) => url.searchParams.append(key, searchParams[key]));
  }
  const carsList = await fetch(url, params)
    .then((response) => {
      totalCount = response.headers.get('X-Total-Count');
      return response.json();
    })
    .then((data) => data);
  return { carsList, totalCount };
}

async function getCars(_page, _limit) {
  const result = await sendPageRequest('garage', { _page, _limit });
  return result;
}

async function getCar(id) {
  const result = await sendRequest(`garage/${id}`)
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function createCar(car) {
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  };
  const result = await sendRequest('garage', null, params);
  return result;
}

async function updateCar({ id, name, color }) {
  const params = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, color }),
  };
  const result = await sendRequest(`garage/${id}`, null, params)
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function deleteCar(id) {
  const result = await sendRequest(`garage/${id}`, null, { method: 'DELETE' })
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function startStopCar(id, status) {
  const result = await sendRequest('engine', { id, status }, { method: 'PATCH' })
    .catch((error) => {
      switch (error.message) {
        case '400': return { status: 'invalid status' };
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function startCar(id) {
  const result = await startStopCar(id, 'started');
  return result;
}

async function stopCar(id) {
  const result = await startStopCar(id, 'stopped');
  return result;
}

async function driveCar(id) {
  const result = await sendRequest('engine', { id, status: 'drive' }, { method: 'PATCH' })
    .then(() => ({ status: 'finished' }))
    .catch((error) => {
      switch (error.message) {
        case '500': return { status: 'broken' };
        case '429': return { status: 'ignore' };
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function getAllWinners() {
  const result = await sendRequest('winners');
  return result;
}

async function getWinners(page, winnersCarsOnPage) {
  const result = await sendPageRequest('winners', { _page: page, _limit: winnersCarsOnPage });
  return result;
}

async function getSortWinners(page, winnersCarsOnPage, { sortParam, sortOrder }) {
  const result = await sendPageRequest('winners', {
    _page: page,
    _limit: winnersCarsOnPage,
    _sort: sortParam,
    _order: sortOrder,
  });
  return result;
}

async function getWinner(id) {
  const result = await sendRequest(`winners/${id}`)
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function deleteWinner(id) {
  const result = await sendRequest(`winners/${id}`, null, { method: 'DELETE' });
  return result;
}

async function createWinner({ id, wins, time }) {
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, wins, time }),
  };
  const result = await sendRequest('winners', null, params);
  return result;
}

async function updateWinner({ id, wins, time }) {
  const params = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wins, time }),
  };
  const result = await sendRequest(`winners/${id}`, null, params);
  return result;
}

export {
  getCars,
  getCar,
  createCar,
  deleteCar,
  updateCar,
  startCar,
  driveCar,
  stopCar,
  getWinners,
  getWinner,
  deleteWinner,
  createWinner,
  updateWinner,
  getSortWinners,
  getAllWinners,
};

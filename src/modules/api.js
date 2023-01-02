const host = 'http://localhost:3000';

async function apiSendRequest(pathname, searchParams, params = {}) {
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
    // .catch((error) => console.log(error.message));
  // const log = await result.json().then((data) => data);
  // console.log('request result ', result);
  return result;
}

async function apiSendPageRequest(pathname, searchParams, params = {}) {
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

async function apiGetCars(_page, _limit) {
  const result = await apiSendPageRequest('garage', { _page, _limit });
  return result;
}

async function apiGetCar(id) {
  const result = await apiSendRequest(`garage/${id}`)
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function apiCreateCar(car) {
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  };
  const result = await apiSendRequest('garage', null, params);
  return result;
}

async function apiUpdateCar({ id, name, color }) {
  const params = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, color }),
  };
  const result = await apiSendRequest(`garage/${id}`, null, params)
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function apiDeleteCar(id) {
  const result = await apiSendRequest(`garage/${id}`, null, { method: 'DELETE' })
    .catch((error) => {
      switch (error.message) {
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function apiStartStopCar(id, status) {
  const result = await apiSendRequest('engine', { id, status }, { method: 'PATCH' })
    .catch((error) => {
      switch (error.message) {
        case '400': return { status: 'invalid status' };
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function apiStartCar(id) {
  const result = await apiStartStopCar(id, 'started');
  return result;
}

async function apiStopCar(id) {
  const result = await apiStartStopCar(id, 'stopped');
  return result;
}

async function apiDriveCar(id) {
  const result = await apiSendRequest('engine', { id, status: 'drive' }, { method: 'PATCH' })
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

async function apiGetAllWinners() {
  const result = await apiSendRequest('winners');
  return result;
}

async function apiGetWinners(page, winnersCarsOnPage) {
  const result = await apiSendPageRequest('winners', { _page: page, _limit: winnersCarsOnPage });
  return result;
}

async function apiGetSortWinners(page, winnersCarsOnPage, { sortParam, sortOrder }) {
  const result = await apiSendPageRequest('winners', {
    _page: page,
    _limit: winnersCarsOnPage,
    _sort: sortParam,
    _order: sortOrder,
  });
  return result;
}

async function apiGetWinner(id) {
  const result = await apiSendRequest(`winners/${id}`)
    .catch((error) => {
      switch (error.message) {
        case '400': return { status: 'invalid status' };
        case '404': return { status: 'not found' };
        default: return { status: 'unknown error' };
      }
    });
  return result;
}

async function apiDeleteWinner(id) {
  const result = await apiSendRequest(`winners/${id}`, null, { method: 'DELETE' });
  return result;
}

async function apiCreateWinner(id, wins, time) {
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, wins, time }),
  };
  const result = await apiSendRequest('winners', null, params);
  return result;
}

async function apiUpdateWinner(id, wins, time) {
  const params = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wins, time }),
  };
  const result = await apiSendRequest(`winners/${id}`, null, params);
  return result;
}

export {
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
  apiDeleteWinner,
  apiCreateWinner,
  apiUpdateWinner,
  apiGetSortWinners,
  apiGetAllWinners,
};

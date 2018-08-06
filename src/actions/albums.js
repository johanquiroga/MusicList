import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

// Action creators
export const addAlbumFailure = error => ({ type: 'MUSIC_ALBUM_ADD_FAILURE', error });
export const addAlbumSuccess = json => ({ type: 'MUSIC_ALBUM_ADD_SUCCESS', json });

export const albumDeleteFailure = error => ({ type: 'MUSIC_ALBUM_DELETE_FAILURE', error });
export const albumDeleteSuccess = json => ({ type: 'MUSIC_ALBUM_DELETE_SUCCESS', json });

export const albumLatestFailure = error => ({ type: 'MUSIC_ALBUM_LATEST_FAILURE', error });
export const albumLatestSuccess = json => ({ type: 'MUSIC_ALBUM_LATEST_SUCCESS', json });

export const albumSearchClear = () => ({ type: 'MUSIC_ALBUM_SEARCH_CLEAR' });
export const albumSearchFailure = error => ({ type: 'MUSIC_ALBUM_SEARCH_FAILURE', error });
export const albumSearchSuccess = json => ({ type: 'MUSIC_ALBUM_SEARCH_SUCCESS', json });

export const albumsPopulateFailure = error => ({ type: 'MUSIC_ALBUMS_POPULATE_FAILURE', error });
export const albumsPopulateSuccess = json => ({ type: 'MUSIC_ALBUMS_POPULATE_SUCCESS', json });

// Add an Album
export const addAlbum = id => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  await fetch(
    '/api/albums/add',
    {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json.user.email) {
        return dispatch(addAlbumSuccess(json.user));
      }
      return dispatch(addAlbumFailure(new Error(json.error)));
    })
    .catch(error => dispatch(addAlbumFailure(new Error(error))));

  return dispatch(decrementProgress());
};

// Delete an album from user's list
export const deleteAlbum = albumId => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  await fetch(
    '/api/albums/delete',
    {
      method: 'POST',
      body: JSON.stringify({ albumId }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (!json.error) {
        dispatch(populateAlbums(json.albums)); // eslint-disable-line
      }
      return json;
    })
    .then((json) => {
      if (!json.error) {
        return dispatch(albumDeleteSuccess(json));
      }
      return dispatch(albumDeleteFailure(new Error(json.error)));
    })
    .catch(error => dispatch(albumDeleteFailure(new Error(error))));

  return dispatch(decrementProgress());
};

export const getLatestAlbum = () => async (dispatch) => {
  dispatch(incrementProgress());

  const searchQuery = {
    q: '',
    type: 'master',
    format: 'album',
    sort_order: 'asc',
  };

  await fetch(
    '/api/albums/search',
    {
      method: 'POST',
      body: JSON.stringify(searchQuery),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json.results) {
        return dispatch(albumLatestSuccess(json.results[0]));
      }
      return dispatch(albumLatestFailure(new Error(json.error)));
    })
    .catch(error => dispatch(albumLatestFailure(new Error(error))));

  return dispatch(decrementProgress());
};

export const populateAlbums = albums => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  await fetch(
    '/api/albums/populate',
    {
      method: 'POST',
      body: JSON.stringify(albums),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json && json.albums) {
        return dispatch(albumsPopulateSuccess(json.albums));
      }
      return dispatch(albumsPopulateFailure(new Error(json.error)));
    })
    .catch(error => dispatch(albumsPopulateFailure(new Error(error))));

  return dispatch(decrementProgress());
};

// Search Albums
export const searchAlbums = searchText => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  const searchQuery = {
    q: searchText,
    type: 'master',
    format: 'album',
  };

  // Send packet to our API, which will communicate with Discogs
  await fetch(
    '/api/albums/search',
    {
      method: 'POST',
      body: JSON.stringify(searchQuery),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json.results) {
        return dispatch(albumSearchSuccess(json));
      }
      return dispatch(albumSearchFailure(new Error(json.error)));
    })
    .catch(error => dispatch(albumSearchFailure(new Error(error))));

  return dispatch(decrementProgress());
};

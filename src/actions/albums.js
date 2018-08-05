import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

// Action creators
export const addAlbumFailure = error => ({ type: 'MUSIC_ALBUM_ADD_FAILURE', error });
export const addAlbumSuccess = json => ({ type: 'MUSIC_ALBUM_ADD_SUCCESS', json });
export const albumSearchClear = () => ({ type: 'MUSIC_ALBUM_SEARCH_CLEAR' });
export const albumSearchFailure = error => ({ type: 'MUSIC_ALBUM_SEARCH_FAILURE', error });
export const albumSearchSuccess = json => ({ type: 'MUSIC_ALBUM_SEARCH_SUCCESS', json });

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
      console.log(json);
      if (json.user.email) {
        return dispatch(addAlbumSuccess(json.user));
      }
      return dispatch(addAlbumFailure(new Error(json)));
    })
    .catch(error => dispatch(addAlbumFailure(new Error(error))));

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

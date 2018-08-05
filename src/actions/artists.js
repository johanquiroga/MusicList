import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

// Action creators
export const addArtistFailure = error => ({ type: 'MUSIC_ARTIST_ADD_FAILURE', error });
export const addArtistSuccess = json => ({ type: 'MUSIC_ARTIST_ADD_SUCCESS', json });
export const artistSearchClear = () => ({ type: 'MUSIC_ARTIST_SEARCH_CLEAR' });
export const artistSearchFailure = error => ({ type: 'MUSIC_ARTIST_SEARCH_FAILURE', error });
export const artistSearchSuccess = json => ({ type: 'MUSIC_ARTIST_SEARCH_SUCCESS', json });
export const artistsPopulateFailure = error => ({ type: 'MUSIC_ARTISTS_POPULATE_FAILURE', error });
export const artistsPopulateSuccess = json => ({ type: 'MUSIC_ARTISTS_POPULATE_SUCCESS', json });

// Add an Artist
export const addArtist = id => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  await fetch(
    '/api/artists/add',
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
        return dispatch(addArtistSuccess(json.user));
      }
      return dispatch(addArtistFailure(new Error(json.error)));
    })
    .catch(error => dispatch(addArtistFailure(new Error(error))));

  return dispatch(decrementProgress());
};

export const populateArtists = artists => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  await fetch(
    '/api/artists/populate',
    {
      method: 'POST',
      body: JSON.stringify(artists),
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
      if (json && json.artists) {
        return dispatch(artistsPopulateSuccess(json.artists));
      }
      return dispatch(artistsPopulateFailure(new Error(json.error)));
    })
    .catch(error => dispatch(artistsPopulateFailure(new Error(error))));

  return dispatch(decrementProgress());
};

// Search Artists
export const searchArtists = searchText => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  const searchQuery = {
    q: searchText,
    type: 'artist',
  };

  // Send packet to our API, which will communicate with Discogs
  await fetch(
    '/api/artists/search',
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
        return dispatch(artistSearchSuccess(json));
      }
      return dispatch(artistSearchFailure(new Error(json.error)));
    })
    .catch(error => dispatch(artistSearchFailure(new Error(error))));

  return dispatch(decrementProgress());
};

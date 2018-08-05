const initialState = {
  albums: [],
  artists: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_SUCCESS':
    case 'AUTHENTICATION_SESSION_CHECK_SUCCESS':
      return {
        albums: [...state.albums, ...action.json.albums],
        artists: [...state.artists, ...action.json.artists],
      };
    case 'MUSIC_ALBUM_ADD_SUCCESS':
      return {
        ...state,
        albums: [...state.albums, ...action.json.albums],
      };
    case 'MUSIC_ARTIST_ADD_SUCCESS':
      return {
        ...state,
        artists: [...state.artists, ...action.json.artists],
      };
    default:
      return state;
  }
};

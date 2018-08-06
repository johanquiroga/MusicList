const initialState = {
  username: '',
  albums: [],
  albumsPopulated: [],
  artists: [],
  artistsPopulated: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MUSIC_ALBUM_DELETE_SUCCESS':
      return {
        ...state,
        albums: action.json.albums,
      };
    case 'MUSIC_ALBUMS_POPULATE_FAILURE':
      return {
        ...state,
        albumsPopulated: [],
      };
    case 'MUSIC_ALBUMS_POPULATE_SUCCESS':
      return {
        ...state,
        albumsPopulated: action.json,
      };
    case 'MUSIC_ARTIST_DELETE_SUCCESS':
      return {
        ...state,
        artists: action.json.artists,
      };
    case 'MUSIC_ARTISTS_POPULATE_FAILURE':
      return {
        ...state,
        artistsPopulated: [],
      };
    case 'MUSIC_ARTISTS_POPULATE_SUCCESS':
      return {
        ...state,
        artistsPopulated: action.json,
      };
    case 'USER_CLEAR_LIST':
    case 'USER_LOOKUP_FAILURE':
      return { ...initialState };
    case 'USER_LOOKUP_SUCCESS':
      return {
        ...state,
        username: action.json.username,
        albums: action.json.albums,
        artists: action.json.artists,
      };
    default:
      return state;
  }
};

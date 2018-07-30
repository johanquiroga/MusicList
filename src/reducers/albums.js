const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MUSIC_ALBUM_SEARCH_SUCCESS':
      return action.json.results.slice();
    case 'MUSIC_ALBUM_SEARCH_CLEAR':
      return initialState.slice();
    default:
      return state;
  }
};

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MUSIC_ALBUM_LATEST_SUCCESS':
      return action.json;
    case 'MUSIC_ALBUM_LATEST_FAILURE':
      return { ...initialState };
    default:
      return state;
  }
};

const initialState = {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  isLoggedIn: false,
  isLoggingIn: false,
};
const keys = Object.keys(initialState);

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_ATTEMPT':
      return {
        ...state,
        isLoggingIn: true,
      };
    case 'AUTHENTICATION_LOGIN_FAILURE':
      return initialState;
    case 'AUTHENTICATION_LOGIN_SUCCESS': {
      const newState = {
        ...state,
      };

      keys.forEach((key) => {
        newState[key] = action.json[key === 'id' ? '_id' : key];
      });

      newState.isLoggedIn = true;
      newState.isLoggingIn = false;

      return newState;
    }
    default:
      return state;
  }
};

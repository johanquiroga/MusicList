const initialState = {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  isLoggedIn: false,
  isLoggingIn: false,
  isPasswordReset: false,
  isPasswordChanged: false,
  registrationSucceeded: false,
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
    case 'AUTHENTICATION_SESSION_CHECK_FAILURE':
    case 'AUTHENTICATION_LOGOUT_SUCCESS':
      return { ...initialState };
    case 'AUTHENTICATION_LOGIN_SUCCESS':
    case 'AUTHENTICATION_SESSION_CHECK_SUCCESS': {
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
    case 'AUTHENTICATION_LOGOUT_FAILURE':
    case 'AUTHENTICATION_REGISTRATION_FAILURE':
      return state;
    case 'AUTHENTICATION_PASSWORD_RESET_CLEAR':
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE':
      return {
        ...state,
        isPasswordReset: false,
      };
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED':
      return {
        ...state,
        isPasswordReset: true,
      };
    case 'AUTHENTICATION_PASSWORD_SAVE_CLEAR':
      return {
        ...state,
        isPasswordChanged: false,
      };
    case 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS':
      return {
        ...state,
        isPasswordChanged: true,
      };
    case 'AUTHENTICATION_REGISTRATION_SUCCESS':
      return {
        ...state,
        registrationSucceeded: true,
      };
    case 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED':
      return {
        ...state,
        registrationSucceeded: false,
      };
    default:
      return state;
  }
};

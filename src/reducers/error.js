const initialState = {
  isError: false,
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_FAILURE':
    case 'AUTHENTICATION_LOGOUT_FAILURE':
    case 'AUTHENTICATION_REGISTRATION_FAILURE':
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE':
      return {
        ...state,
        isError: true,
        error: action.error,
      };
    case 'ERROR_CLEARED':
      return { ...initialState };
    default:
      return state;
  }
};

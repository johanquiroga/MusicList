import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';

// Action creators
export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginFailure = error => ({ type: 'AUTHENTICATION_LOGIN_FAILURE', error });
export const loginSuccess = json => ({ type: 'AUTHENTICATION_LOGIN_SUCCESS', json: json.user });
export const sessionCheckFailure = () => ({ type: 'AUTHENTICATION_SESSION_CHECK_FAILURE' });
export const sessionCheckSuccess = json => ({ type: 'AUTHENTICATION_SESSION_CHECK_SUCCESS', json });
export const logoutFailure = error => ({ type: 'AUTHENTICATION_LOGOUT_FAILURE', error });
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });

// Log User In
export const logUserIn = userData => async (dispatch) => {
  // turn on spinner
  dispatch(incrementProgress());

  // register that a login attempt is being made
  dispatch(loginAttempt());

  // contact login API
  await fetch(
    // where to contact
    '/api/authentication/login',
    {
      method: 'POST',
      body: JSON.stringify(userData),
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
      if (json) {
        dispatch(loginSuccess(json));
      } else {
        dispatch(loginFailure(new Error('Authentication Failed')));
      }
    })
    .catch((error) => {
      dispatch(loginFailure(new Error(error)));
    });

  // turn off spinner
  return dispatch(decrementProgress());
};

// Log User Out
export const logUserOut = () => async (dispatch) => {
  dispatch(incrementProgress());

  await fetch(
    '/api/authentication/logout',
    {
      method: 'POST',
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.status === 200) {
        dispatch(logoutSuccess());
      } else {
        dispatch(logoutFailure(`Error: ${response.status}`));
      }
    })
    .catch((error) => {
      dispatch(logoutFailure(error));
    });

  return dispatch(decrementProgress());
};

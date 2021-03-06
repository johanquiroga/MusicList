import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

// Action creators
export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginFailure = error => ({ type: 'AUTHENTICATION_LOGIN_FAILURE', error });
export const loginSuccess = json => ({ type: 'AUTHENTICATION_LOGIN_SUCCESS', json });

export const logoutFailure = error => ({ type: 'AUTHENTICATION_LOGOUT_FAILURE', error });
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });

export const registrationFailure = error => ({ type: 'AUTHENTICATION_REGISTRATION_FAILURE', error });
export const registrationSuccess = () => ({ type: 'AUTHENTICATION_REGISTRATION_SUCCESS' });
export const registrationSuccessViewed = () => ({ type: 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED' });

export const passwordResetClear = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_CLEAR' });
export const passwordResetHashCreated = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED' });
export const passwordResetHashFailure = error => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE', error });

export const passwordSaveFailure = error => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_FAILURE', error });
export const passwordSaveSuccess = () => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS' });
export const passwordSaveClear = () => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_CLEAR' });

export const sessionCheckFailure = () => ({ type: 'AUTHENTICATION_SESSION_CHECK_FAILURE' });
export const sessionCheckSuccess = json => ({ type: 'AUTHENTICATION_SESSION_CHECK_SUCCESS', json });

// Check User Session
export const checkSession = () => async (dispatch) => {
  await fetch(
    '/api/authentication/checksession',
    {
      method: 'GET',
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
      if (json && json.user && json.user.username) {
        return dispatch(sessionCheckSuccess(json.user));
      }
      return dispatch(sessionCheckFailure());
    })
    .catch(error => dispatch(sessionCheckFailure(error)));
};

// Send email to API for hashing
export const createHash = email => async (dispatch) => {
  dispatch(clearError());

  dispatch(incrementProgress());

  await fetch(
    '/api/authentication/saveresethash',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
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
      if (json.success) {
        return dispatch(passwordResetHashCreated(json));
      }
      return dispatch(passwordResetHashFailure(new Error('Something went wrong. Please try again.')));
    })
    .catch(error => dispatch(passwordResetHashFailure(error)));

  return dispatch(decrementProgress());
};

// Log User In
export const logUserIn = userData => async (dispatch) => {
  // clear the error box if it's displayed
  dispatch(clearError());

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
      if (json && json.user) {
        dispatch(loginSuccess(json.user));
      } else {
        dispatch(loginFailure(new Error('Email or Password Incorrect. Please try again')));
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
  dispatch(clearError());

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
        dispatch(logoutFailure(new Error(response.status)));
      }
    })
    .catch((error) => {
      dispatch(logoutFailure(new Error(error)));
    });

  return dispatch(decrementProgress());
};

// Register User
export const registerUser = userData => async (dispatch) => {
  // clear the error box if it's displayed
  dispatch(clearError());

  // turn on spinner
  dispatch(incrementProgress());

  // contact login API
  await fetch(
    // where to contact
    '/api/authentication/register',
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
    .then(async (json) => {
      if (json && json.user && json.user.username) {
        await dispatch(loginSuccess(json.user));
        await dispatch(registrationSuccess());
      } else {
        dispatch(registrationFailure(new Error(json.error.message ? 'Email or username already exists' : json.error)));
      }
    })
    .catch((error) => {
      dispatch(registrationFailure(new Error(error.message || 'Registration Failed. Please try again.')));
    });

  // turn off spinner
  return dispatch(decrementProgress());
};

export const savePassword = data => async (dispatch) => {
  // clear the error box if it's displayed
  dispatch(clearError());

  // turn on spinner
  dispatch(incrementProgress());

  // contact login API
  await fetch(
    // where to contact
    '/api/authentication/savepassword',
    {
      method: 'POST',
      body: JSON.stringify(data),
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
    .then(async (json) => {
      if (json && json.success) {
        dispatch(passwordSaveSuccess());
      } else {
        dispatch(passwordSaveFailure(new Error(json.error.message ? 'There was an error saving the password. Please try again.' : json.error)));
      }
    })
    .catch((error) => {
      dispatch(passwordSaveFailure(new Error(error.message ? 'There was an error saving the password. Please try again.' : error)));
    });

  // turn off spinner
  return dispatch(decrementProgress());
};

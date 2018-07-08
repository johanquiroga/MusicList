import { decrementProgress, incrementProgress } from './progress';

// Action creators
export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginFailure = error => ({ type: 'AUTHENTICATION_LOGIN_FAILURE', error });
export const loginSuccess = json => ({ type: 'AUTHENTICATION_LOGIN_SUCCESS', json: json.user });
export const sessionCheckFailure = () => ({ type: 'AUTHENTICATION_SESSION_CHECK_FAILURE' });
export const sessionCheckSuccess = json => ({ type: 'AUTHENTICATION_SESSION_CHECK_SUCCESS', json });
export const logoutFailure = error => ({ type: 'AUTHENTICATION_LOGOUT_FAILURE', error });
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });

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

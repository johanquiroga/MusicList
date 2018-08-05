import { combineReducers } from 'redux';
import albums from './albums';
import authentication from './authentication';
import error from './error';
import progress from './progress';
import user from './user';

const reducers = {
  albums,
  authentication,
  error,
  progress,
  user,
};

export default combineReducers(reducers);

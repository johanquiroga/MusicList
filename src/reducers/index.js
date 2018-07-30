import { combineReducers } from 'redux';
import albums from './albums';
import authentication from './authentication';
import error from './error';
import progress from './progress';

const reducers = {
  albums,
  authentication,
  error,
  progress,
};

export default combineReducers(reducers);

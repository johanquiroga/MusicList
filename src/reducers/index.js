import { combineReducers } from 'redux';
import authentication from './authentication';
import error from './error';
import progress from './progress';

const reducers = {
  authentication,
  error,
  progress,
};

export default combineReducers(reducers);

import { combineReducers } from 'redux';
import authentication from './authentication';
import progress from './progress';

const reducers = {
  authentication,
  progress,
};

export default combineReducers(reducers);

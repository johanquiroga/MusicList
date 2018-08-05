import { combineReducers } from 'redux';
import albums from './albums';
import artists from './artists';
import authentication from './authentication';
import error from './error';
import progress from './progress';
import user from './user';

const reducers = {
  albums,
  artists,
  authentication,
  error,
  progress,
  user,
};

export default combineReducers(reducers);

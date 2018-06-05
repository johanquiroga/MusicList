import { combineReducers, createStore } from 'redux';

import progress from '../reducers/progress';

const combinedReducers = combineReducers({
  progress,
});

const store = createStore(combinedReducers);

export default store;

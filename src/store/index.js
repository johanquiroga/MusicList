import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { logger } from 'redux-logger';

import DevTools from '../components/shared/DevTools';
import progress from '../reducers/progress';

const combinedReducers = combineReducers({
  progress,
});

const enhancer = compose(
  applyMiddleware(logger),
  DevTools.instrument(),
);

const configureStore = (initialState) => {
  const store = createStore(combinedReducers, initialState, enhancer);

  // Hot reload reducers
  if (module.hot) {
    module.hot.accept(
      '../reducers/progress',
      () =>
        store.replaceReducer(progress),
    );
  }

  return store;
};

export default configureStore;

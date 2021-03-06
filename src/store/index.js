import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from '../reducers';
import DevTools from '../components/shared/DevTools';

const logger = createLogger();

const enhancer = compose(
  applyMiddleware(
    thunk,
    logger,
  ),
  DevTools.instrument(),
);

const configureStore = (initialState) => {
  const store = createStore(reducers, initialState, enhancer);

  // Hot reload reducers
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      /* eslint-disable-next-line global-require */
      const nextReducers = require('../reducers');
      store.replaceReducer(nextReducers);
    });
  }

  return store;
};

export default configureStore;

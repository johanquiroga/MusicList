import React from 'react';

import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

// CSS from a module
import 'bootstrap/dist/css/bootstrap.min.css';

// CSS from a local file
import './css/musiclist.scss';

import DevTools from './components/shared/DevTools';
import configureStore from './store';

import TemplateContainer from './components/TemplateContainer';

const store = configureStore();

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <div>
          <Component />
          <DevTools />
        </div>
      </Provider>
    </AppContainer>,
    document.querySelector('#react-app'),
  );
};

renderApp(TemplateContainer);

if (module && module.hot) {
  module.hot.accept();
}

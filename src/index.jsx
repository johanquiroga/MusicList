import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

// CSS from a module
import 'bootstrap/dist/css/bootstrap.min.css';
// CSS from a local file
import './css/musiclist.scss';

import store from './store';

import TemplateContainer from './components/TemplateContainer';

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.querySelector('#react-app'),
  );
};

renderApp(TemplateContainer);

if (module && module.hot) {
  module.hot.accept();
}

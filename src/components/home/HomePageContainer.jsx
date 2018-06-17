import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { incrementProgress, decrementProgress } from '../../actions/progress';

import HomePage from './HomePage';

const HomePageContainer = ({ incrementProgressAction, decrementProgressAction }) => (
  <HomePage
    incrementFunction={incrementProgressAction}
    decrementFunction={decrementProgressAction}
  />
);

export { HomePageContainer };

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    incrementProgressAction: incrementProgress,
    decrementProgressAction: decrementProgress,
  }, dispatch);

export default connect(null, mapDispatchToProps)(HomePageContainer);

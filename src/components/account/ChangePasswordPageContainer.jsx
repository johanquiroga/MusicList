import React from 'react';
import { connect } from 'react-redux';
// import {  } from '../../actions/authentication';

import ChangePasswordPage from './ChangePasswordPage';

class ChangePasswordPageContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hash } = this.props.match.params;
    return (
      <ChangePasswordPage hash={hash} />
    );
  }
}

export default connect()(ChangePasswordPageContainer);

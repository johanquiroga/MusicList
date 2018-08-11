import React from 'react';
import { connect } from 'react-redux';
import { checkSession } from '../actions/authentication';

import Template from './Template';

class TemplateContainer extends React.Component {
  constructor(props) {
    super(props);

    this.checkUserSession = this.checkUserSession.bind(this);
  }

  componentWillMount() {
    this.checkUserSession();
  }

  checkUserSession() {
    const { dispatch } = this.props;
    dispatch(checkSession());
  }

  render() {
    const { progress, authentication } = this.props;

    return (
      <Template progress={progress} authentication={authentication} />
    );
  }
}

const mapStateToProps = state => ({
  progress: state.progress,
  authentication: state.authentication,
});

export default connect(mapStateToProps)(TemplateContainer);

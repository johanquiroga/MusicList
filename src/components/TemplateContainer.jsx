import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Template from './Template';
import { sessionCheckFailure, sessionCheckSuccess } from '../actions/authentication';

class TemplateContainer extends React.Component {
  constructor(props) {
    super(props);

    this.checkSession = this.checkSession.bind(this);
  }

  componentWillMount() {
    this.checkSession();
  }

  async checkSession() {
    const { sessionCheckFailureAction, sessionCheckSuccessAction } = this.props;

    await fetch(
      '/api/authentication/checksession',
      {
        method: 'GET',
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json.username) {
          sessionCheckSuccessAction(json);
        } else {
          sessionCheckFailureAction();
        }
      })
      .catch((error) => {
        sessionCheckFailureAction(error);
      });
  }

  render() {
    const { progress, authentication } = this.props;

    return (
      <Template progress={progress} authentication={authentication} />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    sessionCheckFailureAction: sessionCheckFailure,
    sessionCheckSuccessAction: sessionCheckSuccess,
  }, dispatch);

const mapStateToProps = state => ({
  progress: state.progress,
  authentication: state.authentication,
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateContainer);

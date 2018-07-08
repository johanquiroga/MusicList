import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { incrementProgress, decrementProgress } from '../../actions/progress';
import { logoutSuccess, logoutFailure } from '../../actions/authentication';

import Header from './Header';

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);

    this.logUserOut = this.logUserOut.bind(this);
  }

  async logUserOut() {
    const {
      incrementProgressAction,
      decrementProgressAction,
      logoutSuccessAction,
      logoutFailureAction,
    } = this.props;

    incrementProgressAction();

    await fetch(
      '/api/authentication/logout',
      {
        method: 'POST',
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return logoutSuccessAction();
        }

        return logoutFailureAction(`Error: ${response.status}`);
      })
      .catch((error) => {
        logoutFailureAction(error);
      });

    decrementProgressAction();
  }

  render() {
    const { authentication } = this.props;

    return (
      <Header authentication={authentication} logUserOut={this.logUserOut} />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    incrementProgressAction: incrementProgress,
    decrementProgressAction: decrementProgress,
    logoutSuccessAction: logoutSuccess,
    logoutFailureAction: logoutFailure,
  }, dispatch);

export { HeaderContainer };

export default connect(null, mapDispatchToProps)(HeaderContainer);

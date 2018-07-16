import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';

class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      email: '',
    };
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.handleValidSubmit();
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { resetPasswordFunction } = this.props;
    const formData = this.state;
    resetPasswordFunction(formData.email);
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
            If you&lsquo;d like to reset yoour password, please enter your email here
            and a link to do so will be sent to the address you enter.
          </p>
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="email">Email</Label>
              <AvInput
                type="email"
                name="email"
                id="email"
                placeholder="contact@johanquiroga.me"
                value={this.state.email}
                required
                onChange={this.handleEmailChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>A valid email is required to log in</AvFeedback>
            </AvGroup>
            <Button color="primary">Reset Password</Button>
          </AvForm>
        </div>
      </div>
    );
  }
}

export default ResetPasswordPage;

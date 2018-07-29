import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';

class ChangePasswordPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    this.state = {
      password: '',
      passwordCheck: '',
    };
  }

  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      this.handleValidSubmit();
    }
  }

  handleValidSubmit() {
    const { sendPasswordFunction } = this.props;
    const formData = this.state;
    sendPasswordFunction(formData);
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col10 col-sm-7 col-md-5 col-lg-4">
          <p>
            Please enter and confirm a new password below to change the
            password associated with this email address.
          </p>
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="password">Password</Label>
              <AvInput
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={this.state.password}
                required
                minLength="8"
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>Passwords must be at least eight characters in length</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="passwordCheck">Confirm Password</Label>
              <AvInput
                id="passwordCheck"
                name="passwordCheck"
                type="password"
                placeholder="password again"
                value={this.state.passwordCheck}
                required
                minLength="8"
                validate={{ match: { value: 'password' } }}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>Passwords must match</AvFeedback>
            </AvGroup>

            <Button color="primary">Change Password</Button>
          </AvForm>
        </div>
      </div>
    );
  }
}

export default ChangePasswordPage;

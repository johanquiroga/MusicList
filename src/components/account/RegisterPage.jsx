import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      username: '',
    };
  }

  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      this.compileFormData();
    }
  }

  handleValidSubmit() {
    const { registerFunction } = this.props;
    const formData = this.state;
    registerFunction(formData);
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
            Want to het started saving ypur favorite bands to MusicList?
            Create an account! All fields are required
          </p>
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="email">Email</Label>
              <AvInput
                id="email"
                name="email"
                type="email"
                placeholder="noreply@musiclist.com"
                value={this.state.email}
                required
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>A valid email is required to register</AvFeedback>
            </AvGroup>

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
              <span>
                we recommend a password service like&nbsp;
                <a href="https://www.lastpass.com/" target="_blank" rel="noopener noreferrer">LastPass</a>
                &nbsp;or <a href="https://1password.com/" target="_blank" rel="noopener noreferrer">1Password</a>
              </span>
            </AvGroup>

            <AvGroup>
              <Label for="username">Username</Label>
              <AvInput
                id="username"
                name="username"
                type="text"
                placeholder="CaptainCode"
                value={this.state.username}
                required
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>A username is required to register</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="firstName">First Name</Label>
              <AvInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={this.state.firstName}
                required
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>A first name is required to register</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="lastName">Last Name</Label>
              <AvInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Smith"
                value={this.state.lastName}
                required
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <AvFeedback>A last name is required to register</AvFeedback>
            </AvGroup>

            <Button color="primary">Register</Button>
          </AvForm>
        </div>
      </div>
    );
  }
}

export default RegisterPage;

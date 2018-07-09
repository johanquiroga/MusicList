import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.compileFormData = this.compileFormData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

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

  compileFormData() {
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
            Create an account!
          </p>
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="noreply@musiclist.com"
                value={this.state.email}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
              <span>
                we recommend a password service like&nbsp;
                <a href="https://www.lastpass.com/" target="_blank" rel="noopener noreferrer">LastPass</a>
                &nbsp;or <a href="https://1password.com/" target="_blank" rel="noopener noreferrer">1Password</a>
              </span>
            </FormGroup>

            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="CaptainCode"
                value={this.state.username}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
            </FormGroup>

            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={this.state.firstName}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
            </FormGroup>

            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Smith"
                value={this.state.lastName}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
              />
            </FormGroup>

            <Button color="primary" onClick={this.compileFormData}>Register</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default RegisterPage;

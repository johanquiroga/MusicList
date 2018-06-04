import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <Form>
            <FormGroup>
              <Label htmlFor="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="contact@johanquiroga.me"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="examplePassword"
                placeholder="password"
              />
            </FormGroup>
            <Button>Log In</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginPage;

import React, { Component } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
const axios = require('axios');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Username: "",
      Password: ""
    };
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.submitData = this.submitData.bind(this);

  }

  checkFrom() {
    return this.state.Username.length > 0 && this.state.Password.length > 0;
  }

  submitData(e) {
    e.preventDefault();
    axios.get('http://127.0.0.1:3001/login', {
    params: {
      Username: this.state.Username,
      Password: this.state.Password,
    }
    }).then(function (response) {
      if(response.data) {
        console.log("saving to localStorage");
        localStorage.setItem('User', this.state.Username);
      }
    });
  }



  updateUsername(e) {
    e.preventDefault();
    if(e.target.value.length <= 140) {
     this.setState({Username: e.target.value});
    }
  }

  updatePassword(e) {
    e.preventDefault();
    if(e.target.value.length <= 140) {
     this.setState({Password: e.target.value});
    }
  }


  render() {
    return (
      <div className="Login">
        <form onSubmit={this.submitData}>
          <FormGroup size="large">
            <Label>username</Label>
            <Input
              autoFocus
              type="Username"
              value={this.state.Username}
              onChange={this.updateUsername}
            />
          </FormGroup>
          <FormGroup size="large">
            <Label>Password</Label>
            <Input
              value={this.state.Password}
              onChange={this.updatePassword}
              type="password"
            />
          </FormGroup>
          <Button
            block
            size="large"
            disabled={!this.checkFrom()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}
export default Login;

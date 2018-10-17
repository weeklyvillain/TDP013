import React, { Component } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import {Redirect}  from "react-router-dom";
const axios = require('axios');

class Login extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  Username: "",
	  Password: "",
	  wrongComb: false,
	  LoggedIn: false
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
	  Password: this.state.Password
	}
	}).then(res => {
	  const result = res.data;
	  if(result === true){
		sessionStorage.setItem("LoginName", this.state.Username);
		sessionStorage.setItem("LoggedIn", result);
		this.setState({LoggedIn: result});
	  }else{
		this.setState({wrongComb: true})
	  }
	});
  }



  updateUsername(e) {
	e.preventDefault();
	this.setState({Username: e.target.value});
  }

  updatePassword(e) {
	e.preventDefault();
	this.setState({Password: e.target.value});
	
  }


  render() {
	if(this.state.LoggedIn|| sessionStorage.getItem("LoggedIn") === "true") {
	  return (
		  <Redirect
		  to={{
			pathname: sessionStorage.getItem("LoginName"),
		  }}
		  />)
	  }else{
		  return(
			<div className="Login">
			  <form onSubmit={this.submitData}>
				<FormGroup size="large">
				  <Label>username</Label>
				  <Input
					autoFocus
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
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
				{this.state.wrongComb ? "Wrong Username/Password combination": ""}
			  </form>
			  <FormGroup size="large">
				<label>Register</label>
				<Input
					placeholder="Display name"
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
				  <Input
					placeholder="Username"
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
					<Input
						placeholder="Password"
					value={this.state.Password}
					onChange={this.updatePassword}
					type="password"
				  />
					<Input
						placeholder="Confirm Password"
					value={this.state.Password}
					onChange={this.updatePassword}
					type="password"
				  />
				</FormGroup>
			</div>
		  )
	  }
  }
}
export default Login;

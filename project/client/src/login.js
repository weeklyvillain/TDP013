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
	  LoggedIn: false,
	  newDisplayName: "", 
	  newUsername: "",
	  newPassword: "",
	  newConfirmedPass: ""
	};

	this.updateUsername = this.updateUsername.bind(this);
	this.updatePassword = this.updatePassword.bind(this);
	this.submitData = this.submitData.bind(this);
	this.disableInvalidLogin = this.disableInvalidLogin.bind(this);

  }

  disableInvalidLogin() {
	return this.state.Username.length > 0 && this.state.Password.length > 0;
  }

  validateNewUser(){
	  return true;
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

  addUser(e){
	e.preventDefault();
	axios.get('http://127.0.0.1:3001/register', {
		params: {
	  		Username: this.state.newUsername,
	  		Password: this.state.newPassword,
			DisplayName: this.newDisplayName
		}
	}).then(res => {
		sessionStorage.setItem("LoginName", this.state.newUsername);
		sessionStorage.setItem("LoggedIn", true);
		this.setState({LoggedIn: true});
	});
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
				  <Label>Log in!</Label>
				  <Input
					autoFocus
					placeholder="Username"
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
				  <br></br>
				  <Input
				  	placeholder="Password"
					value={this.state.Password}
					onChange={this.updatePassword}
					type="password"
				  />
				</FormGroup>
				<Button
				  block
				  size="large"
				  disabled={!this.disableInvalidLogin()}
				  type="submit"
				>
				  Login
				</Button>
				{this.state.wrongComb ? "Wrong Username/Password combination": ""}
			  </form>
			{/*				  
			  <FormGroup size="large">
				<label>Or register please:</label>
				<Input
					placeholder="Your New Display Name"
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
				  
				  <br></br>
				  <Input
					placeholder="Your New Username"
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
				  <br></br>
					<Input
						placeholder="Your New Password"
					value={this.state.Password}
					onChange={this.updatePassword}
					type="password"
				  />
				  <br></br>
					<Input
						placeholder="Please Confirm Your New Password"
					value={this.state.Password}
					onChange={this.updatePassword}
					type="password"
				  />
				<br></br>
				<Button
				  block
				  size="large"
				  disabled={this.validateNewUser()}
				  type="submit"
				>
				  Register
				</Button>
				</FormGroup>
				*/}
			</div>
		  )
		  }
  }
}
export default Login;

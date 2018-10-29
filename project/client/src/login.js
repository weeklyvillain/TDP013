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
			loggedIn: false,
			newDisplayName: "",
			newUsername: "",
			newPassword: "",
			newConfirmedPassword: ""
		};

		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateNewUsername = this.updateNewUsername.bind(this);
		this.updateNewDisplayName = this.updateNewDisplayName.bind(this);
		this.updateNewPassword = this.updateNewPassword.bind(this);
		this.updateNewConfirmedPassword = this.updateNewConfirmedPassword.bind(this);
		this.submitData = this.submitData.bind(this);
		this.disableInvalidLogin = this.disableInvalidLogin.bind(this);
		this.registerUser = this.registerUser.bind(this);
  	}

  	disableInvalidLogin() {
		return this.state.Username.length > 0 && this.state.Password.length > 0;
  	}

	validateNewUser(){
		if(this.state.newDisplayName.length !== 0 && this.state.newUsername.length !== 0 && this.state.newPassword === this.state.newConfirmedPassword){
			return true;
		}else{
			return false; 
		}
	}
	registerUser(e){
		e.preventDefault();
		axios.get('http://127.0.0.1:3001/register', {
			params: {
				newDisplayName: this.state.newDisplayName,
				newUsername: this.state.newUsername,
				newPassword: this.state.newPassword
			}
		}).then(res => {
			if(res.data === "success"){
				alert("Successful Registration! Please login!");
			}else{
				alert(res.data);
			}
			
			

		});
	}
	submitData(e) {
		e.preventDefault();
		axios.get('http://127.0.0.1:3001/login', {
			params: {
				username: this.state.Username,
				password: this.state.Password
			},
  			withCredentials: true
		}).then(res => {
			const result = res.data;
			sessionStorage.setItem("LoginName", result);
			this.setState({loggedIn: true})
		}).catch(err => {
			console.log("Failure")
			this.setState({wrongComb: true});
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
	
	updateNewUsername(e) {
		e.preventDefault();
		this.setState({newUsername: e.target.value});
	}
	updateNewDisplayName(e) {
		e.preventDefault();
		this.setState({newDisplayName: e.target.value});
	}
	updateNewPassword(e) {
		e.preventDefault();
		this.setState({newPassword: e.target.value});
	}
	updateNewConfirmedPassword(e) {
		e.preventDefault();
		this.setState({newConfirmedPassword: e.target.value});
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
			this.setState({loggedIn: true});
		});
	}



	render() {
		if(this.state.loggedIn) {
	  		return (
		  		<Redirect to={{pathname: sessionStorage.getItem("LoginName")}}/>)
	  	}else{
			return(
			<div className="Login">
				<form onSubmit={this.submitData}>
				<FormGroup size="large">
				  <Label>Log in!</Label>
				  <Input
					id='loginUsername'
					autoFocus
					placeholder="Username"
					type="username"
					value={this.state.Username}
					onChange={this.updateUsername}
				  />
				  <br></br>
				  <Input
					id='loginPassword'
				  	placeholder="Password"
					value={this.state.Password}
					onChange={this.updatePassword}
					type="password"
				  />
				</FormGroup>
				<Button
					id='loginSubmit'
				  	block
				  	size="large"
				  	disabled={!this.disableInvalidLogin()}
				  	type="submit"
				>
				  Login
				</Button>
				{this.state.wrongComb ? "Wrong Username/Password combination": ""}
			  </form>


			  <form onSubmit={this.registerUser}>
			  <FormGroup size="large">
				<label>Or register please:</label>
					<Input
					id='registerDisplayName'
					placeholder="Your New Display Name"
					type="username"
					value={this.state.newDisplayName}
					onChange={this.updateNewDisplayName}
				  	required minLength="1" maxLength="32"
					/>

				  <br></br>
				  <Input
				  	id='registerUsername'
					placeholder="Your New Username"
					type="username"
					value={this.state.newUsername}
					onChange={this.updateNewUsername}
					required minLength="6" maxLength="20"
				  />
				  <br></br>
					<Input
						id='registerPassword'
						placeholder="Your New Password"
					value={this.state.newPassword}
					onChange={this.updateNewPassword}
					type="password"
					required minLength="8" maxLength="24"
				  />
				  <br></br>
					<Input
						id='registerConfirmedPassword'
						placeholder="Please Confirm Your New Password"
						value={this.state.newConfirmedPass}
						onChange={this.updateNewConfirmedPassword}
						type="password"
						required minLength="8" maxLength="24"
					/>
				<br></br>
				<Button
					id='registerSubmit'
				  block
				  size="large"
				  disabled={!this.validateNewUser()}
				  type="submit"
				>
				  Register
				</Button>
				</FormGroup>
				</form>
				</div>
			
		  )
		  }
  }
}
export default Login;

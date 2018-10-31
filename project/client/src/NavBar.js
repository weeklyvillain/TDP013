import React, { Component } from "react";
import {Redirect}  from "react-router-dom";
import { Button, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, Input, Navbar, NavbarBrand, NavItem, NavLink, Nav} from 'reactstrap';
const axios = require('axios');

class NavBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			profiles: [],
			loggedIn: true
		};

		this.updateState = this.updateState.bind(this);
		this.sendData = this.sendData.bind(this);
		this.logout = this.logout.bind(this);
		this.addFriend = this.addFriend.bind(this);
	}

	logout(e){
		e.preventDefault();
		sessionStorage.clear();
		axios.get('http://127.0.0.1:3001/logout', {
			withCredentials: true
		}).then(res => {
			this.setState({loggedIn: false});
		});
	}

	updateState(e){
		e.preventDefault();
		this.setState({username: e.target.value});
	};

	sendData(e) {
		e.preventDefault();
		axios.get('http://127.0.0.1:3001/search', {
			params: {
				searchedName: this.state.username
			},
			withCredentials: true
		}).then(res => {
			this.setState({profiles: res.data});
		});
	}

	addFriend(e){
		e.preventDefault();
		axios.get('http://127.0.0.1:3001/addFriend', {
			params: {
				FriendDisplayName: this.state.username,
				FriendLoginName: e.target.value
			},
			withCredentials: true
		}).then(res => {
			if(res.data === "success"){ 
				this.props.updateFriendsList();
				return;
			}else{
				alert("Friend Already Added!");
			}
		});
	}

	render(){
		if(!sessionStorage.getItem("LoggedIn") || !this.state.loggedIn){
			return(<Redirect to={{pathname: '/',}}/>);
		}else{
			return (
			<Navbar color="light" expand="md">
				<NavbarBrand href="/">Wittier</NavbarBrand>
				<Nav className="ml-auto" navbar>
					<NavItem>
						<form id="searchForm" onSubmit={this.sendData}>
							<InputGroup>
								<Input id='searchInput' value = {this.state.username} onChange = {this.updateState} />
								<InputGroupAddon id='searchSubmit' addonType="append"><Button color = "primary" type='submit'>Search</Button></InputGroupAddon>
							</InputGroup>
						</form>
					</NavItem>
					<NavItem>
						<NavLink id='logoutButton' href="/" onClick={this.logout}>Logout!</NavLink>
					</NavItem>
				</Nav>
				<div id="searchFeed">
				
					<ListGroup>
					{this.state.profiles.map((profile) =>
						<ListGroupItem color="info" key={profile._id.toString()} id={profile._id.toString()}>
						{profile.DisplayName} <br />username: {profile.LoginName}
						<Button className="addFriendButton" outline color="primary" value={profile.LoginName} onClick={this.addFriend}>Add Friend</Button>{' '}
						</ListGroupItem>
					)}
					</ListGroup>
				</div>
			</Navbar>
			);
		}
	}
}
export default NavBar;

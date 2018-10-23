import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, Input, Navbar, NavbarBrand, NavItem, NavLink, Nav} from 'reactstrap';
import {Redirect}  from "react-router-dom";
import './profile_page.css';
const axios = require('axios');

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
				data: '',
				profile:{LoginName: "", DisplayName: "", FriendsList:{}},
				posts: [],
				notExist: false
		}

		this.updateCounter = this.updateCounter.bind(this);
		this.post = this.post.bind(this);
		this.flag = this.flag.bind(this);
		this.getProfile = this.getProfile.bind(this);
		this.updateFeed = this.updateFeed.bind(this);
		this.logout = this.logout.bind(this);
	};

	logout(e){
		e.preventDefault();
		sessionStorage.clear();
		this.setState({LoginName: ""});
	}

	getProfile(){

		axios.get("http://127.0.0.1:3001/getProfile",{params: {Username: this.props.match.url.substring(1)}})
		.then(res => {
			if(res.data.length === 0){
				this.setState({notExist: true});
			}else{
				const profile = res.data[0];
				this.setState({profile: profile, posts: profile.Posts.reverse()})
			}
		});
	}

	updateFeed(){
		axios.get("http://127.0.0.1:3001/getAll",{params: {UserPage: this.state.profile.LoginName}})
		.then(res => {
			const responses = res.data;
			this.setState({posts:responses.reverse()});
		});
	}
	componentDidMount() {
		console.log("I got here");
			this.getProfile();
	}


	updateCounter(e) {
		e.preventDefault();
		if(e.target.value.length <= 140) {
			this.setState({data: e.target.value});
		}
	}

	post(e) {
		e.preventDefault();
		axios({
				method:'get',
				url:'http://127.0.0.1:3001/save',
				params: {
					message: this.state.data,
					UserPage: this.state.profile.LoginName,
					UserPosted: sessionStorage.getItem('LoginName'),
					Flag: (sessionStorage.getItem('LoginName') === this.state.profile.LoginName)? 1 : 0
				}
		});
		this.updateFeed();
		this.setState({data:""});
	}

	flag(e) {
		if(sessionStorage.getItem('LoginName') !== this.state.profile.LoginName){
			return;
		}
		e.preventDefault();
		axios({
				method:'get',
				url:'http://127.0.0.1:3001/flag',
				params: {
					id: e.target.id
				}
		});
		this.updateFeed();
	}

	checkExists(){

		if(this.state.notExist === true){
			return ("Hm... there does not seem to be anything here"  );
		}else{
			return (
				<div>
				<Navbar color="light" expand="md">
				<NavbarBrand href="/">witter</NavbarBrand>
				<h4>Welcome to {sessionStorage.getItem('LoginName') === this.state.profile.LoginName ? (" your home"):(" " + this.state.profile.DisplayName + "s ")}page!</h4>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href="/search">Search</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="/" onClick={this.logout}>Logout!</NavLink>
						</NavItem>
					</Nav>
			</Navbar>


					<div className = "Input">
						<form onSubmit={this.post}>

							<InputGroup>
					        <InputGroupAddon addonType="prepend">Message:</InputGroupAddon>
					        <Input value = {this.state.data} onChange = {this.updateCounter} />
									<InputGroupAddon addonType="append"><Button color = "primary" type='submit'>Post</Button></InputGroupAddon>
								</InputGroup>
								{this.state.data.length}/140

						</form>
						</div>
						<ListGroup id = "feed">
						<ListGroupItem color="success"><h2>Posts</h2></ListGroupItem>
						<div id="feedScroll">
						{this.state.posts.map((message) =>
							<ListGroupItem color="info" key={message._id.toString()} style= {message.Flag === 1 ? {color: 'blue'} : {color: 'red'}} id={message._id.toString()} onClick={this.flag}>
							"{message.Message}" Posted by {sessionStorage.getItem('LoginName') === message.UserPosted ? ('You') : (message.UserPosted)  }!
							</ListGroupItem>
						)}
						</div>
						</ListGroup>
							{this.printFriendsList()}

				</div>
			);
		}
	}

	printFriendsList(){
		if (sessionStorage.getItem('LoginName') === this.state.profile.LoginName){
			return(<ListGroup id="friendlist">
			<ListGroupItem color="success"><h2>Friendlist</h2></ListGroupItem>
			{
				Object.keys(this.state.profile.FriendsList).length === 0 ?
				(<ListGroupItem color="info">You do not seem to have any friends!</ListGroupItem>) :
				(this.state.profile.FriendsList.map((friend) => <ListGroupItem color="info" key={friend}><a href={friend[0]}>{friend[1]}</a></ListGroupItem>))
			}
		</ListGroup>
			);
		}else{
			return;
		}
	}

	render() {
			return this.checkExists();
	}
}


export default Profile;

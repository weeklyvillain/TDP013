import React, { Component } from 'react';
import './App.css';
import { Button } from 'reactstrap';
const axios = require('axios');

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
				data: '',
				profile:{LoginName: "", DisplayName: "", FriendsList:{}},
				posts: []
		}

		this.updateCounter = this.updateCounter.bind(this);
		this.post = this.post.bind(this);
		this.flag = this.flag.bind(this);
		this.getProfile = this.getProfile.bind(this);
		this.updateFeed = this.updateFeed.bind(this);
	};

	getProfile(){
		axios.get("http://127.0.0.1:3001/getProfile",{params: {Username: 'Admin'}})
		.then(res => {
			const profile = res.data[0];
			this.setState({profile: profile, posts: profile.Posts.reverse()})
		});
	}

	updateFeed(){
		axios.get("http://127.0.0.1:3001/getAll",{params: {UserPage: this.state.profile.LoginName}})
		.then(res => {
			const responses = res.data;
			console.log(responses)
			this.setState({posts:responses.reverse()});
		});
	}

	componentWillMount() {
		sessionStorage.setItem('LoginName', 'Admin2');
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
					UserPosted: sessionStorage.getItem('LoginName')
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
		console.log(e.target.id);
		axios({
				method:'get',
				url:'http://127.0.0.1:3001/flag',
				params: {
					id: e.target.id
				}
		});
		this.updateFeed();
	}

	render() {
		return (
			<div>
				<h1>Welcome to {sessionStorage.getItem('LoginName') === this.state.profile.LoginName ? (" your home"):(" " + this.state.profile.DisplayName + "s ")}page!</h1>
					<div className = "Input">
					<form onSubmit={this.post}>
						<input type = "text" value = {this.state.data} onChange = {this.updateCounter}/>{this.state.data.length}/140<br></br>
						<Button color = "primary" type='submit'>Post</Button>
					</form>
					</div>
					<ul id = "feed">
					{this.state.posts.map((message) =>
						<li key={message._id.toString()} style= {message.Flag === true ? {color: 'blue'} : {color: 'red'}} id={message._id.toString()} onClick={this.flag}>
						"{message.Message}" Posted by {sessionStorage.getItem('LoginName') === message.UserPosted ? ('You') : (message.UserPosted)  }!
						
						</li>
					)}
					</ul>
					<h2>Friendlist</h2>
					<ul>
					{
						Object.keys(this.state.profile.FriendsList).length === 0 ?  (<li>You do not seem to have any friends!</li>) : (this.state.profile.FriendsList.map((friend) => <li key={friend}>{friend.DisplayName}</li>))
					} 
					</ul>
			</div>
		);
	}
}



export default Profile;

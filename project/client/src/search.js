import React, { Component } from "react";
import { Button, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, Input} from 'reactstrap';
import {Redirect}  from "react-router-dom";
import './search.css'
import Nav_bar from "./NavBar";
const axios = require('axios');

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Username: "",
      profiles: []
    };
    this.updateState = this.updateState.bind(this);
    this.sendData = this.sendData.bind(this);
    this.logout = this.logout.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  logout(e){
    e.preventDefault();
    sessionStorage.clear();
    this.setState({Username: ""});
  }

  updateState(e) {
    e.preventDefault();
    this.setState({Username: e.target.value});
    };

  sendData(e) {
      e.preventDefault();
      axios.get('http://127.0.0.1:3001/search', {
      params: {
        Username: this.state.Username
      }
    }).then(res => {
			this.setState({profiles: res.data});
		});
    }

  addFriend(e){
    e.preventDefault();
    axios.get('http://127.0.0.1:3001/addFriend', {
    params: {
      LoginName: sessionStorage.getItem('LoginName'),
      DispalyName: sessionStorage.getItem('DisplayName'),
      FriendDisplayName: this.state.Username,
      FriendLoginName: e.target.value
    }
  }).then(res => {

  });
  }


  render() {
    if(sessionStorage.getItem("LoggedIn") === "true"){
      return (

      <div>
        <Nav_bar />

        <form id="searchForm" onSubmit={this.sendData}>
          <InputGroup>
              <Input value = {this.state.Username} onChange = {this.updateState} />
              <InputGroupAddon addonType="append"><Button color = "primary" type='submit'>Search</Button></InputGroupAddon>
            </InputGroup>
          </form>

      <div id="searchFeed">
        <ListGroup>
            {this.state.profiles.map((profile) =>
              <ListGroupItem color="info"  key={profile._id.toString()} id={profile._id.toString()}>
              {profile.DisplayName} <br />Username: {profile.LoginName}
              <Button className="addFriendButton" outline color="primary" value={profile.LoginName} onClick={this.addFriend}>Add Friend</Button>{' '}
              </ListGroupItem>
            )}
            </ListGroup>
      </div>
    </div>
      );
		}else{
			return (
				<Redirect
					to={{
						pathname: "/"
					}}
		/>)
		}

  }
}
export default Search;

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
      username: "",
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
    this.setState({username: ""});
  }

  updateState(e) {
    e.preventDefault();
    this.setState({username: e.target.value});
    };

  sendData(e) {
      e.preventDefault();
      console.log(this.state.username);
      axios.get('http://127.0.0.1:3001/search', {
      params: {
        searchedName: this.state.username
      }
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
    }
  }).then(res => {
    
  });
  }


  render() {
      return (
      <div>
        <Nav_bar />

        <form id="searchForm" onSubmit={this.sendData}>
          <InputGroup>
              <Input value = {this.state.username} onChange = {this.updateState} />
              <InputGroupAddon addonType="append"><Button color = "primary" type='submit'>Search</Button></InputGroupAddon>
            </InputGroup>
          </form>

      <div id="searchFeed">
        <ListGroup>
            {this.state.profiles.map((profile) =>
              <ListGroupItem color="info"  key={profile._id.toString()} id={profile._id.toString()}>
              {profile.DisplayName} <br />username: {profile.LoginName}
              <Button className="addFriendButton" outline color="primary" value={profile.LoginName} onClick={this.addFriend}>Add Friend</Button>{' '}
              </ListGroupItem>
            )}
            </ListGroup>
      </div>
    </div>
      );
		}

  }

export default Search;

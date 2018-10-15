import React, { Component } from "react";
import { Button } from "reactstrap";
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
        }).then(function (response) {
            console.table(response.data)
            this.setState({profiles: response.data});
          });
      }

  render() {
    return (
      <div>
      <input type = "text" value = {this.state.Username}
           onChange = {this.updateState} />
      <Button color="primary" onClick={this.sendData}>Send!</Button>
      <ul>
          {this.state.profiles.map((profile) =>
            <li key={profile._id.toString()} id={profile._id.toString()}>
            {profile.DisplayName}
            </li>
          )}
          </ul>
      </div>
    );
  }
}
export default Search;

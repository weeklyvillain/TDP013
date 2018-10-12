import React, { Component } from 'react';
import './App.css';
import { Button } from 'reactstrap';
const axios = require('axios');

class Input extends Component {
  constructor(props) {
     super(props);

     this.state = {
        data: ''
     }

     this.updateState = this.updateState.bind(this);
     this.sendData = this.sendData.bind(this);
  };
  updateState(e) {
    e.preventDefault();
    if(e.target.value.length <= 140) {
     this.setState({data: e.target.value});
    }
  }

  sendData(e) {
    e.preventDefault();
    axios({
        method:'get',
        url:'http://127.0.0.1:3000/save',
        params: {
          message: this.state.data
        }
    });
    window.location.reload();
  }

  render() {
    return (
      <div className="Input">
          <input type = "text" value = {this.state.data}
           onChange = {this.updateState} />
        <h4>{this.state.data.length}/140</h4>
          <Button color="primary" onClick={this.sendData}>Send!</Button>
      </div>
    );
  }
}

export default Input;

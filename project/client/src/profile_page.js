import React, { Component } from 'react';
import './App.css';
import { Button } from 'reactstrap';
const axios = require('axios');

class Input extends Component {
  constructor(props) {
     super(props);

     this.state = {
        data: '',
        profile:{},
        posts: []
     }

     this.updateState = this.updateState.bind(this);
     this.sendData = this.sendData.bind(this);
     this.flag = this.flag.bind(this);
  };

  updateFeed(){
    axios.get("http://127.0.0.1:3001/getProfile",{params: {Username: 'Admin'}})
        .then(res => {
            const respones = res.data;
            this.setState({profile: respones})
            this.setState({posts:respones.Posts})
        });
  }

  componentDidMount() {
    this.updateFeed();
  }



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
        url:'http://127.0.0.1:3001/save',
        params: {
          message: this.state.data
        }
    });
    this.updateFeed();
    this.setState({data:""});
  }

  flag(e) {
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
      <div className="Input">
          <input type = "text" value = {this.state.data}
           onChange = {this.updateState} />
        <h4>{this.state.data.length}/140</h4>
          <Button color="primary" onClick={this.sendData}>Send!</Button>
          <ul>
          {this.state.posts.map((message) =>
            <li key={message._id.toString()} style= {message.Flag === true ? {color: 'blue'} : {color: 'red'}} id={message._id.toString()} onClick={this.flag}>
            {message.Message}
            </li>
          )}
          </ul>
      </div>
    );
  }
}



export default Input;

import React, { Component } from 'react';
import './App.css';
const axios = require('axios');


class Feed extends Component {
  constructor(props) {
     super(props);

     this.state = {
        messages: []
      }

     this.updateState = this.updateState.bind(this);
     this.flag = this.flag.bind(this);
  };
  updateState(e) {
     this.setState({data: e.target.value});
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:3000/getall")
        .then(res => {
            const respones = res.data;
            console.log(respones)
            this.setState({messages: respones.reverse()})
        });
  }

  flag(e) {
    console.log(e.target.id);
    axios({
        method:'get',
        url:'http://127.0.0.1:3000/flag',
        params: {
          id: e.target.id
        }
    });
      window.location.reload();
  }
  render() {
    return (
      <div className="Feed">
          <ul>
          {this.state.messages.map((message) =>

            <li key={message._id.toString()} style= {message.Flag === true ? {color: 'blue'} : {color: 'red'}} id={message._id.toString()} onClick={this.flag}>
            {message.Message}
            </li>
          )}
          </ul>
      </div>
    );
  }
}

export default Feed;

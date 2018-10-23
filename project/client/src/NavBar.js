import React, { Component } from "react";
import { Button, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, Input, Navbar, NavbarBrand, NavItem, NavLink, Nav} from 'reactstrap';
const axios = require('axios');

class NavBar extends Component {
  constructor(props) {
    super(props);
    
    this.logout = this.logout.bind(this);
  }

  logout(e){
    e.preventDefault();
    sessionStorage.clear();
    this.setState({Username: ""});
  }

  render() {
      return (
        <Navbar color="light" expand="md">
        <NavbarBrand href="/">witter</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Back</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/" onClick={this.logout}>Logout!</NavLink>
            </NavItem>
          </Nav>
      </Navbar>
    );
  }
}
export default NavBar;

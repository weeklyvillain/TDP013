import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from './login';
import Profile from './profile_page';
import Search from './search';


const Pages = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route path='/profile' component={Profile} />
      <Route path='/search' component={Search} />
      </Switch>
  </BrowserRouter>
)


export default Pages;

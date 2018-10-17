import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from './login';
import Profile from './profile_page';
import Search from './search';


const Pages = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route path='/search' component={Search} />
      <Route path='/:id' component={Profile} />
      </Switch>
  </BrowserRouter>
)


export default Pages;

import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from './login';
import Profile from './profile_page';

const Pages = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={Login} />
			<Route path='/:id' component={Profile} />
		</Switch>
	</BrowserRouter>
)

export default Pages;

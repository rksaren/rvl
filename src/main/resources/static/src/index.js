import React, { Fragment } from "react";
import ReactDOM from "react-dom";
 
import Header from "./Header";
import Query from "./Query"
import Admin from "./Admin"
import Road from "./Road"
 
import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom';

import $ from "jquery";
import { Provider, withBus } from 'react-bus'
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css';
import 'font-awesome/css/font-awesome.css';
import '@progress/kendo-theme-material/dist/all.css';
import './App.css';
import * as serviceWorker from './serviceWorker';


$.ajaxSetup({
	contentType: "application/json",
	dataType:"JSON"
})
ReactDOM.render(
	<Router>
		<Provider>
			<Header />
			 
			<Route exact path="/" render={() => (<Redirect to="/Roads" />)} />
			<Route  path={"/Roads/:id"} component={ Road} />
			<Route exact path={"/Roads"} component={Road}/>
			<Route exact path={"/Admin"} component={Admin} />
			<Route exact path={"/Query"} component={Query} />
			
		</Provider>
	</Router>,
  document.getElementById('root')
)

 

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister(); 
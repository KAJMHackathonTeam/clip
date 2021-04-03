import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Landing from './Landing.js'
import Dashboard from './Dashboard.js'
import Organizations from './Organizations.js'
// eslint-disable-next-line

export var LANDING = '/'
export var DASHBOARD = '/dashboard'
export var ORGANIZATIONS = '/organizations'
class App extends React.Component {
  render(){
    return (
      <Router>
        <Switch>
          <Route exact path= {LANDING} component={Landing}/>
          <Route path= {DASHBOARD} component={Dashboard}/>
          <Route path= {ORGANIZATIONS} component={Organizations}/>
        </Switch>
      </Router>
    );
  }
};

export default App;

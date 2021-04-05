import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Landing from './Landing.js'
import Dashboard from './NewDashboard.js'
import Organizations from './Organizations.js'
import { DataStore } from '@aws-amplify/datastore';
// eslint-disable-next-line

export var LANDING = '/'
export var DASHBOARD = '/dashboard'
export var ORGANIZATIONS = '/organizations'
class App extends React.Component {
  async componentDidMount(){
    await DataStore.start();
  }
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

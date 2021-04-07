import React from 'react';
import './App.css';
import Routes from './routes'

import { createBrowserHistory } from 'history';
import { Router } from "react-router-dom";
import { connect } from 'react-redux';

export const history = createBrowserHistory();


function App() {
  return (
    <Router history={history}>
      <div className="App">
        <Routes />
      </div>
    </Router>
  );
}

export default App;

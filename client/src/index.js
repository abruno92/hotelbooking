import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { RoomProvider } from './Context';

ReactDOM.render(
  <RoomProvider>
    <Router>
      <App />
    </Router>
  </RoomProvider>,
  document.getElementById('root')
);

reportWebVitals();

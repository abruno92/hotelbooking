import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RoomProvider} from './Context';
import {Auth0Provider} from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

ReactDOM.render(
    // <Auth0Provider
    //     domain="aslan2703.eu.auth0.com"
    //     clientId="N1DJodzvbPNPSRYiyOFYQJsjMALDBmQb"
    //     redirectUri={window.location.origin}
    // >
        <RoomProvider>
            <Router>
                <App/>
            </Router>
        </RoomProvider>,
    // </Auth0Provider>,
    document.getElementById('root')
);

reportWebVitals();

const GoogleAuthentication = require('@authentication/google');
const express = require('express');

const app = express();

import * as firebase from 'firebase'
import './logreg.css'
import firebaseConfig from "client\public\firebase.confiq.js";

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);
//var provider = new firebase.auth.GoogleAuthProvider();
//provider.add2FactorAuthentication(userID)
//{
    // get the secret to be shared with the google authenticator app
//    const gaSecret = await generateSecret(); 
    //await DB.TheTable.update(userDI, {gaSecret});
//}

const {verifyToken} = require('@authentication/google-authenticator');

function onToken(token) {
  if (verifyToken({secret: user.gaSecret, token}) === true) {
    // verified token
  }
}

const handleForm = e => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user) Auth.setLoggedIn(true);
      })
      .catch(e => {
        setErrors(e.message);
      });
  };



const googleAuthentication = new GoogleAuthentication({
  callbackURL: '/__/auth/google'
});

app.get('/', (req, res, next) => {
  res.send(
    `<form action=${
      googleAuthentication.callbackPath
    } method="post"><button type="submit">Login</button></form>`
  );
});

app.post(googleAuthentication.callbackPath, async (req, res, next) => {
  googleAuthentication.redirectToProvider(req, res, next, {
    // you can pass some abritrary state through to the callback here
    state: {message: ' '}
  });
});
app.get(googleAuthentication.callbackPath, async (req, res, next) => {
  try {
    if (googleAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      accessToken, // use this to make requests to the Google API on behalf of the user
      refreshToken,
      profile,
      state 
    } = await googleAuthentication.completeAuthentication(req, res);
    res.json(profile);
  } catch (ex) {
    next(ex);
  }
});

app.listen(3001);

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

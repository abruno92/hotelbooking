import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/app'
import firebaseconfig from './firebase.confiq'
import firebase from 'firebase'


const GoogleAuthentication = require('@authentication/google');
const express = require('express');
const app = express();
const {verifyToken} = require('@authentication/google-authenticator');

export const authMethods = {
  // firebase helper methods go here... 
  signup: (email, password) => {

    },
  signin: (email, password) => {

    },
  signout: (email, password) => {

    },
  }


export function signIn(){
  auth.signInWithPopup(provider);
};

export function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const AuthContext = React.createContext(null);

var provider = new firebase.auth.GoogleAuthProvider();
provider.add2FactorAuthentication(userID)
{
    // get the secret to be shared with the google authenticator app
    const gaSecret = await generateSecret(); 
    //await DB.TheTable.update(userDI, {gaSecret});
}

export function handleForm (e) {
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

export function handleForm(e) {
  e.preventDefault();
  firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then(res => {
    if (res.user) Auth.setLoggedIn(true);
  })
  .catch(e => {
    setErrors(e.message);
  });
};

export function onToken(token) {
  if (verifyToken({secret: user.gaSecret, token}) === true) {
    // verified token
  }
}



app.listen(3000, () => console.log('Server running'));
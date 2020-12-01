import firebase from 'firebase'

const express = require('express');
const app = express();

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'url';
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
};
  xhr.send('idtoken=' + id_token);
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

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

export function handleCreation(e) {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(emailReg, passwordReg)
      .then(res => {
        if (res.user) Auth.setLoggedIn(true);
      })
      .catch(e => {
        setErrors(e.message);
      });
};

export function handleSignIn(e) {
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
import React from 'react';

const handleSignup = () => {
    // middle man between firebase and signup 
    console.log('handleSignup')
    // calling signup from firebase server
    return authMethods.signup()
  }
  
const AuthProvider = (props) => {
    return (
      <firebaseAuth.Provider
      value={{
        test: "context is working"
      }}>
        {props.children}
  
      </firebaseAuth.Provider>
    );
  };

  <firebaseAuth.Provider
  value={{
    //replaced test with handleSignup
    handleSignup
  }}>
    {props.children}

  </firebaseAuth.Provider>
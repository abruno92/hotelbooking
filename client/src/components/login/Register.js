import React, {useState} from "react";
import Axios from "axios";
import * as firebase from 'firebase'
import firebaseConfig from "client\public\firebase.confiq.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();
provider.add2FactorAuthentication(userID)
{
    // get the secret to be shared with the google authenticator app
    const gaSecret = await generateSecret(); 
    //await DB.TheTable.update(userDI, {gaSecret});
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

const Register = () => {
    const [firstNameReg, setFirstNameReg] = useState('');
    const [lastNameReg, setLastNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

    handleForm();

    const register = () => {
        Axios.post('http://localhost:3001/auth/register', {
            firstName: firstNameReg, 
            lastName: lastNameReg, 
            email: emailReg, 
            password: passwordReg
        }).then((response) => {
            console.log(response.data);
        })
    };

    return (
        <div className="wrapper">
            <div className="form-wrapper">
                <form>
                <h1>Sign Up</h1>
                <div className="firstname">
                    <label htmlFor="firstname">First Name</label>
                    <input 
                        type="text" 
                        name="firstname" 
                        placeholder="First Name"
                        id="firstname" 
                        onChange={(e)=>{
                            setFirstNameReg(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="lastname">
                    <label htmlFor="lastname">Last Name</label>
                    <input 
                        type="text" 
                        name="lastname" 
                        placeholder="Last Name"
                        id="lastname" 
                        onChange={(e)=> {
                            setLastNameReg(e.target.value);
                        }}
                        required
                    />
                </div>    
                <div className="email">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        name="email" 
                        placeholder="Email"
                        id="email" 
                        onChange={(e)=> {
                            setEmailReg(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="text" 
                        name="password" 
                        placeholder="Password"
                        id="password"
                        onChange={(e)=>{
                            setPasswordReg(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="login">
                    <button type="submit" onClick={register}>Submit</button>
                </div> 
                <small>Already have an account?</small>
                <div className="createAccount">
                    <button type="submit">Login</button>
                </div>
                </form>
            </div>
        </div>
    );
}

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };
export default Register; 
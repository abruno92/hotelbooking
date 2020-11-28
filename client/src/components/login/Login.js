import React, {useState} from "react";
import './logreg.css'
import Axios from "axios";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const login = () => {
        Axios.post('http://localhost:3001/auth/login', {
            email: email, 
            password: password
        }).then((response) => {
            if (response.data.message) {
                setLoginStatus(response.data.message)
            } else {
                setLoginStatus(response.data[0].email)
            }
        })
    };

    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      }

    return (
        <div className="wrapper">
            <div className="form-wrapper">
                <form>
                <h1>Login</h1>    
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
                <div className="email">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        className="email" 
                        placeholder="Email"
                        id="email" 
                        onClick = {(e)=>{
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="text" 
                        className="password" 
                        placeholder="Password"
                        id="password"
                        onClick = {(e)=>{
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div className="login">
                     <button type="submit" onClick={login}>Submit</button>
                </div> 
                <small>Don't have an account?</small>
                <div className="createAccount">
                    <button type="submit">Create an Account</button>
                </div>
                </form>
            </div>
        </div>
    );
}

export default Login; 
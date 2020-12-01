import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios';
import GoogleBtn from "../components/GoogleAuthentication/googleLogin";
import LoginButton from "../components/GoogleAuthentication/Auth0LoginBtn";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const login = (e) => {
        e.preventDefault();
        Axios.post('https://localhost:3001/auth/login', {
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

    return (
        <>
        <div className="wrapper">
            <div className="form-wrapper">
                <form>
                <GoogleBtn/>
                <LoginButton/>
                <h1>Login</h1>
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
                        type="password"
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
                    <button>
                        <Link to='/register' style={{textDecoration: "none", color:"black"}}>Create an Account</Link>
                    </button>
                </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default Login; 
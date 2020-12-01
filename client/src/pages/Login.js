import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios';
import GoogleBtn from "../components/GoogleAuthentication/googleLogin";
import LoginButton from "../components/GoogleAuthentication/Auth0LoginBtn";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const login = (e) => {
        e.preventDefault();
        Axios.post('https://localhost:3001/auth/login', {
            email: email, 
            password: password
        }).then((response) => {
            console.log(response.data.message);

        }).catch(reason => {
            if (reason.response.status === 401) {
                setErrorMessage(reason.response.data.error);
            }
            console.log(reason.response.data.errors);
        })
    };

    return (
        <>
        <div className="wrapper">
            <div className="form-wrapper">
                <form>
                {/*<GoogleBtn/>*/}
                {/*<LoginButton/>*/}
                <h1>Login</h1>
                <div className="email">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        className="email" 
                        placeholder="Email"
                        id="email" 
                        onChange={(e)=>{
                            setEmail(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        className="password" 
                        placeholder="Password"
                        id="password"
                        onChange = {(e)=>{
                            setPassword(e.target.value);
                        }}
                        required
                    />
                </div>
                    <span>{errorMessage}</span>
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
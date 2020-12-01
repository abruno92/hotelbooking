import React, {useState} from "react";
import './logreg.css'
import Axios from "axios";
import GoogleBtn from "../Google Authentication/googleLogin";
import LoginButton from "../Google Authentication/Auth0LoginBtn";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    //handleSignIn(email,password);
    //const auth = new AuthService("711812867459-m97h2u5maequivh2m89imhujttt19aqn.apps.googleusercontent.com",  "AdWj1GnYeM6h4OKaH_TtUH5k");

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
    //<LoginButton/>
    return (
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
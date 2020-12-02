import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthService} from "../services/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const login = async (e) => {
        e.preventDefault();

        let failure;
        try {
            failure = await AuthService.login(email, password);
        } catch (e) {
            if (!e.response) {
                console.log(e);
                return;
            }
        }

        if (!failure) {
            // yes
        } else {
            // no
            if (e.response.status === 401) {
                setErrorMessage(e.response.data.error);
            } else {
                console.log(e.response.data.errors);
            }
        }
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
                                onChange={(e) => {
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
                                onChange={(e) => {
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
                            {/*<button>*/}
                            <Link to='/register' style={{textDecoration: "none", color: "black"}}>
                                <button>Create an Account</button>
                            </Link>
                            {/*</button>*/}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login; 
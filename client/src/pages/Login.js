import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {AuthService} from "../services/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let failure;
        try {
            failure = await AuthService.login(email, password);
        } catch (e) {
            if (!e.response) {
                console.log(e);
            }
        }

        if (failure === undefined) {
            history.push('/');
        } else {
            setErrorMessage("Invalid email and/or password.");
        }
    };

    return (
        <>
            <div className="wrapper">
                <div className="form-wrapper">
                    <form>
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
                        <span dangerouslySetInnerHTML={{__html: errorMessage}} style={{color: 'red'}}/>
                        <div className="login">
                            <button type="submit" onClick={handleSubmit}>Submit</button>
                        </div>
                        <small>Don't have an account?</small>
                    </form>
                    <div className="createAccount">
                        <button type="button" onClick={() => history.push('/register')}>Create an Account</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login; 
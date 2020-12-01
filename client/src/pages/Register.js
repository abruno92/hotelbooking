import React, {useState} from "react";
import {Link} from 'react-router-dom';
import Axios from "axios";

const Register = () => {
    const [firstNameReg, setFirstNameReg] = useState('');
    const [lastNameReg, setLastNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [confirmPasswordReg, setConfirmPasswordReg] = useState('');
    // const firstNameErr
    //todo show errors for each field if something goes wrong

    const register = async (e) => {
        e.preventDefault();
        // try {
        //     await Axios.post('https://localhost:3001/auth/register', {
        //         firstName: firstNameReg,
        //         lastName: lastNameReg,
        //         email: emailReg,
        //         password: passwordReg,
        //         confirmPassword: confirmPasswordReg
        //     });
        // } catch (e) {
        //     console.log(e.response.data.errors);
        // }
        Axios.post('https://localhost:3001/auth/register', {
            firstName: firstNameReg,
            lastName: lastNameReg,
            email: emailReg,
            password: passwordReg,
            confirmPassword: confirmPasswordReg
        }).then((response) => {
            console.log(response.data);
        }).catch(reason => {
            console.log(reason.response.data.errors);
        });
    };

    return (
        <div className="wrapper">
            <div className="form-wrapper">
                <form>
                <h1>Sign Up</h1>
                <div className="firstname">
                    <label htmlFor="firstName">First Name</label>
                    <span>{}</span>
                    <input
                        type="text" 
                        name="firstname" 
                        placeholder="First Name"
                        id="firstName"
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
                    <div className="password">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="text"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            id="confirmPassword"
                            onChange={(e)=>{
                                setConfirmPasswordReg(e.target.value);
                            }}
                            required
                        />
                    </div>
                <div className="login">
                    <button type="submit" onClick={register}>Submit</button>
                </div> 
                <small>Already have an account?</small>
                <div className="createAccount">
                    <button>
                        <Link to='/login' style={{textDecoration: "none", color:"black"}}>Login</Link>
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}
export default Register; 
import './loginreg.css'
import React, {useState} from "react";
import Axios from  "axios";


const Register = (props) => {
    const [firstNameReg, setFirstNameReg] = useState('');
    const [lastNameReg, setLastNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

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
                    <button type="submit"  onClick={()=>props.history.push('/login')}>Login</button>
                </div>
                </form>
            </div>
        </div>
    );
}

export default Register; 
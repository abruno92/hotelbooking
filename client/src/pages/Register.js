import React from "react";
import {withRouter} from "react-router";
import {Map} from 'immutable';
import config from "../config";
import {AuthService} from "../services/auth";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: Map({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                privilegeLevel: config.users.customer,
            }),
            errors: Map({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                privilegeLevel: "",
            }),
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();

        try {
            await AuthService.register(this.state.account.toObject());
        } catch (e) {
            this.updateErrors(e.response.data.errors);
        }
    }

    handleChange(e) {
        this.setState({
            account: this.state.account.set(e.target.name, e.target.value),
            errors: this.state.errors,
        });
    };

    updateErrors(errors) {
        let stateErrors = this.state.errors.map((v, k) => {
            const error = errors.find(error => error.param === k);
            return error ? error.msg : "";
        });

        this.setState({
            account: this.state.account,
            errors: stateErrors,
        });
    }

    render() {
        return (
            <div className="wrapper">
                <div className="form-wrapper">
                    <form onSubmit={this.handleSubmit}>
                        <h1>Sign Up</h1>
                        <div className="firstname">
                            <label htmlFor="firstName">
                                <span>First Name <p style={{color: 'red'}}>{this.state.errors.get('firstName')}</p>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                id="firstName"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="lastname">
                            <label htmlFor="lastname">
                                <span>Last Name <p style={{color: 'red'}}>{this.state.errors.get('lastName')}</p>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                id="lastname"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="email">
                            <label htmlFor="email">
                                <span>Email <p style={{color: 'red'}}>{this.state.errors.get('email')}</p>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                id="email"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="password">
                            <label htmlFor="password">
                                <span>Password <p style={{color: 'red'}}>{this.state.errors.get('password')}</p>
                                </span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                id="password"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="password">
                            <label htmlFor="confirmPassword">
                                <span>Confirm Password <p
                                    style={{color: 'red'}}>{this.state.errors.get('confirmPassword')}</p>
                                </span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                id="confirmPassword"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Account Type</p>
                            <input type="radio" id="customer" name="privilegeLevel" onChange={this.handleChange}
                                   value="customer"
                                   defaultChecked/>
                            <label htmlFor="customer">Customer</label>
                            <input type="radio" id="manager" name="privilegeLevel" onChange={this.handleChange}
                                   value="manager"/>
                            <label htmlFor="manager">Manager</label>
                        </div>
                        <div className="login">
                            <button type="submit">Register</button>
                        </div>
                        <small>Already have an account?</small>
                    </form>
                    <div className="createAccount">
                        <button type="button" onClick={() => this.props.history.push('/login')}>Go to Login</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);
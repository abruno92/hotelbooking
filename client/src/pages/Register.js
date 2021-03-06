import React from "react";
import {withRouter} from "react-router";
import {Map} from 'immutable';
import config from "../config";
import {AuthService} from "../services/auth";
import {BehaviorSubject, fromEvent, Subscription} from "rxjs";
import {auditTime, tap} from "rxjs/operators";

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

        this.loading$ = new BehaviorSubject(false);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    async handleSubmit() {
        try {
            await AuthService.register(this.state.account.toObject());
        } catch (e) {
            if (e.response) {
                this.updateErrors(e.response.data.errors);
            } else {
                console.log(e);
            }
        }

        this.loading$.next(false);
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

    componentDidMount() {
        this.subscriptions = new Subscription();

        const submit$ = fromEvent(
            document.getElementById("registerForm"),
            'submit'
        ).pipe(
            tap(_ => this.loading$.next(true)),
            tap(submit => submit.preventDefault()),
            auditTime(200),
        );

        this.subscriptions.add(submit$.subscribe(async submit => await this.handleSubmit(submit)));
        this.subscriptions.add(this.loading$.subscribe(_ => this.forceUpdate()));
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <div className="wrapper">
                <div className="form-wrapper">
                    <form id="registerForm">
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
                        <div className="login">
                            <button type="submit"
                                    disabled={this.loading$.getValue()}>{this.loading$.getValue() ? "Loading..." : "Submit"}</button>
                        </div>
                        <small>Already have an account?</small>
                    </form>
                    <div className="createAccount">
                        <button type="button" onClick={() => {
                            if (!this.loading$.getValue()) this.props.history.push('/login');
                        }}>Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);
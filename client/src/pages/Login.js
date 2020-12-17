import React from 'react';
import {AuthService} from "../services/auth";
import {Map} from 'immutable';
import {withRouter} from "react-router";
import {BehaviorSubject, fromEvent, Subscription} from "rxjs";
import {auditTime, tap} from "rxjs/operators";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials: Map({
                email: "",
                password: "",
            }),
            errors: Map({
                email: "",
                password: "",
                default: "",
            })
        }

        this.loading$ = new BehaviorSubject(false);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    async handleSubmit() {
        try {
            await AuthService.login(this.state.credentials.toObject());
        } catch (e) {
            if (e.response.data.errors) {
                this.updateErrors(e.response.data.errors);
            } else if (e.response.data.error) {
                this.updateErrors([{msg: e.response.data.error, param: "default"}])
            } else {
                console.log(e);
            }
        }

        this.loading$.next(false);
    }

    handleChange(e) {
        this.setState({
            credentials: this.state.credentials.set(e.target.name, e.target.value),
            errors: this.state.errors,
        });
    };

    updateErrors(errors) {
        let stateErrors = this.state.errors.map((v, k) => {
            const error = errors.find(error => error.param === k);
            return error ? error.msg : "";
        });

        this.setState({
            credentials: this.state.credentials,
            errors: stateErrors,
        });
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        const submit$ = fromEvent(
            document.getElementById("loginForm"),
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

    //todo observable to disable buttons while page is loading something
    render() {
        return (
            <div className="wrapper">
                <div className="form-wrapper">
                    <form id="loginForm">
                        <h1>Login</h1>
                        <div className="email">
                            <label htmlFor="email">
                                <span>Email <p style={{color: 'red'}}>{this.state.errors.get('email')}</p>
                                </span>
                            </label>
                            <input
                                type="email"
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
                        <p style={{color: 'red'}}>{this.state.errors.get('default')}</p>
                        <div className="login">
                            <button type="submit"
                                    disabled={this.loading$.getValue()}>{this.loading$.getValue() ? "Loading..." : "Submit"}</button>
                        </div>
                        <small>Don't have an account?</small>
                    </form>
                    <div className="createAccount">
                        <button type="button" onClick={() => {
                            if (!this.loading$.getValue()) this.props.history.push('/register');
                        }}>Create an Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
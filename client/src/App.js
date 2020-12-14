import './App.css';
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Logout from "./pages/intermediary/Logout";
import Register from "./pages/Register";
import {Route, Switch} from 'react-router-dom';
import React from "react";
import AuthRoute from "./components/AuthRoute";
import {AuthService} from "./services/auth";
import {Subscription, timer} from "rxjs";
import config from "./config";

/**
 * The main React Component of the app.
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            subscriptions: null,
        };
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        // Subscribe to the loggedIn observable
        this.subscriptions.add(AuthService.loggedIn$.subscribe(loggedIn => {
            this.setState({
                authenticated: loggedIn,
            });
            this.forceUpdate();
        }));

        // Subscribe to a observable that repeats every refreshRateMillis milliseconds
        this.subscriptions.add(timer(0, config.users.refreshRateMillis)
            .subscribe(async () => {
                // Try to refresh the JWT cookie
                await AuthService.refresh();
                console.log("Refreshed Login Token")
            })
        );
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return <>
            <Switch>
                <AuthRoute exact path="/" component={Home} canAccess={this.state.authenticated} mustAuth/>
                <AuthRoute exact path="/rooms/" component={Rooms} canAccess={this.state.authenticated} mustAuth/>
                <AuthRoute exact path="/rooms/:id" component={SingleRoom} canAccess={this.state.authenticated}
                           mustAuth/>
                <AuthRoute exact path="/login" component={Login} canAccess={!this.state.authenticated}/>
                <AuthRoute exact path="/logout" component={Logout} canAccess={this.state.authenticated} mustAuth/>
                <AuthRoute exact path="/register" component={Register} canAccess={!this.state.authenticated}/>
                <AuthRoute exact path="/profile" component={Profile} canAccess={this.state.authenticated} mustAuth/>
                <Route component={Error}/>
            </Switch>
        </>
    }
}

export default App;

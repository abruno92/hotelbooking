import './App.css';
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {Route, Switch} from 'react-router-dom';
import React from "react";
import AuthRoute from "./components/AuthRoute";
import {AuthService} from "./services/auth";
import {Subscription, timer} from "rxjs";
import config from "./config";
import BookingCreate from "./pages/BookingCreate";
import ReviewCreate from "./pages/ReviewCreate";
import Bookings from "./pages/Bookings";
import ReplyCreate from "./pages/ReplyCreate";

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
                // todo fix refresh() not actually refreshing the token
                const result = await AuthService.refresh();
                console.log("token status: ", result);
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
                <AuthRoute exact path="/bookings/" component={Bookings} canAccess={this.state.authenticated && AuthService.isManager()} mustAuth/>
                <AuthRoute exact path="/rooms/:id" component={SingleRoom} canAccess={this.state.authenticated}
                           mustAuth/>
                <AuthRoute exact path="/book/:roomId" component={BookingCreate} canAccess={this.state.authenticated && AuthService.isCustomer()}
                           mustAuth/>
                <AuthRoute exact path="/review/:roomId" component={ReviewCreate} canAccess={this.state.authenticated && AuthService.isCustomer()} mustAuth/>
                <AuthRoute exact path="/reply/:reviewId" component={ReplyCreate} canAccess={this.state.authenticated && AuthService.isManager()} mustAuth/>
                <AuthRoute exact path="/login" component={Login} canAccess={!this.state.authenticated}/>
                <AuthRoute exact path="/register" component={Register} canAccess={!this.state.authenticated}/>
                <AuthRoute exact path="/profile" component={Profile} canAccess={this.state.authenticated} mustAuth/>
                <Route component={Error}/>
            </Switch>
        </>
    }
}

export default App;

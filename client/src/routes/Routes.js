import React from "react";
import { Switch } from "react-router-dom";
import Admin from "../components/admin/Admin";
import Homepage from "../components/home/Homepage";
import Login from "../components/login/Login";
import Profile from "../components/user/Profile";
import Room from "../components/rooms/Room";
import Rooms from "../components/rooms/Rooms";
import Register from "../components/login/Register";
import Route from "./Route";


export default function Routes() {
    return (
    <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/homepage" component={Homepage} isPrivate />
        <Route path="/room" component={Room} isPrivate />
        <Route path="/rooms" component={Rooms} isPrivate />
        <Route path="/admin" component={Admin} isPrivate />
        <Route path="/profile" component={Profile} isPrivate />
        <Route component={Homepage} />
    </Switch>
    );
}
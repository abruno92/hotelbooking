import React from "react";
import { Switch } from "react-router-dom";
import Login from "../components/login/Login";
import Admin from "../components/admin/Admin";
import Rooms from "../components/rooms/RoomGallery";
import RoomDetails from "../components/rooms/RoomDetails";
import Profile from "../components/user/Profile";
import Homepage from "../components/home/Homepage";
import Register from "../components/login/Register";
import Route from "./Route";


export default function Routes() {
    return (
    <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/homepage" component={Homepage} isPrivate />
        <Route path="/rooms" component={Rooms} isPrivate />
        <Route path="/roomDetails" component={RoomDetails} isPrivate />
        <Route path="/admin" component={Admin} isPrivate />
        <Route path="/profile" component={Profile} isPrivate />
        <Route component={Login} />
    </Switch>
    );
}
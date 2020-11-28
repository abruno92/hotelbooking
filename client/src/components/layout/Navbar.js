import "./layout.css";
import React, { useState } from 'react';
import {NavLink, Redirect} from "react-router-dom";

const Navbar = () => {

    const [isAuth, setIsAuth] = useState(true);
    

    if(!isAuth) {
        return <Redirect to="/login" />
    }

    return (
        <span>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/login">Logout</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/homepage" exact>Home</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/bookings">Rooms</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/profile">Profile</NavLink>
        </span>
    )
};

export default Navbar;
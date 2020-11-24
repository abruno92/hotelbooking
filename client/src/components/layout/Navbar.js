import './Navbar.css';
import React, { useState } from 'react';
import {NavLink, Redirect} from "react-router-dom";

const Navbar = () => {

    const [isAuth, setIsAuth] = useState(true);

    if(!isAuth) {
        return <Redirect to="/login" />
    }

    return (
        <span>

            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/login" onClick={()=> setIsAuth(false)}>Logout</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/home" exact>Home</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/rooms">Rooms</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/profile">Profile</NavLink>
        </span>
    )
};

export default Navbar;
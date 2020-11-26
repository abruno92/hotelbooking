import './Navbar.css';
import React from 'react';
import {NavLink} from "react-router-dom";


const Navbar = () => {
    return (
        <span>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/login">Login</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/home" exact>Home</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/rooms">Rooms</NavLink>
            <NavLink className="NavLink" activeClassName="ActiveNavLink" to="/profile">Profile</NavLink>
        </span>
    )
};

export default Navbar;
import React, {useState}  from 'react';
import { MenuItems } from "./MenuItems";


const Navbar = () => {

    return (
        <nav className="navbar">
            <h1 className="navbar-logo">Hotel Security<i className="far fa-hotel"></i></h1>
            <div className="menu-icon">
                <ul>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={item.cName} href={item.url}>
                                   {item.title}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
};    

export default Navbar;
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {FaAlignRight} from "react-icons/fa";
import Logout from "../pages/intermediary/Logout";
import UserContainer from "./UserContainer";

export default class Navbar extends Component {
    state = {
        isOpen: false
    };
    handleToggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    };

    render() {
        return (
            <nav className="navbar">
                <div className="nav-center">
                    <div className="nav-header">
                        <button
                            type="button"
                            className="nav-btn"
                            onClick={this.handleToggle}
                        >
                            <FaAlignRight className="nav-icon"/>
                        </button>
                    </div>
                    <ul
                        className={this.state.isOpen ? "nav-links show-nav" : "nav-links"}>
                        <li>
                            <Link to="/" style={{marginTop: "5px"}}>Home</Link>
                        </li>
                        <UserContainer userType='customer'>
                            <li>
                                <Link to="/rooms" style={{marginTop: "5px"}}>Rooms</Link>
                            </li>
                        </UserContainer>
                        <UserContainer userType='manager'>
                            <li>
                                <Link to="/rooms" style={{marginTop: "5px"}}>All Rooms</Link>
                            </li>
                            <li>
                                <Link to="/bookings" style={{marginTop: "5px"}}>Bookings</Link>
                            </li>
                        </UserContainer>
                        <li>
                            <Link to="/profile" style={{marginTop: "5px"}}>Profile</Link>
                        </li>
                        <li>
                            <Logout/>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

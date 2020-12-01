import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaAlignRight,  FaExpeditedssl } from "react-icons/fa";
export default class Navbar extends Component {
  state = {
    isOpen: false
  };
  handleToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
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
              <FaAlignRight className="nav-icon" />
            </button>
          </div>
          <ul
            className={this.state.isOpen ? "nav-links show-nav" : "nav-links"}>
            <li>
              <Link to="/" style={{marginTop:"5px"}}>Home</Link>
            </li>
            <li>
              <Link to="/rooms" style={{marginTop:"5px"}}>Rooms</Link>
            </li>
            <li>
              <Link to="/profile" style={{marginTop:"5px"}}>Profile</Link>
            </li>
            <li>
              <Link to="/login" style={{marginTop:"5px"}}>Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

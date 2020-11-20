import React from 'react';
import PropTypes from 'prop-types';

const Navbar = ({title, icon}) => {

    return (
        <nav className='navbar'>
            <h1>
                <i className={icon} /> {title}
            </h1>
        </nav>
    )
};    

Navbar.defaultProps = {
    title: 'Bookings Hotel',
    icon: 'fab fa-hotel'    
}

Navbar.prototype = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired    
}

export default Navbar;
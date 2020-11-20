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

}    

export default Navbar;
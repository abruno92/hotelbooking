import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

export default function RouteWrapper({
    component: Component, 
    isPrivate, 
    ...rest 
}) {

    //Lets add redux/formik to do this
    const loggedIn = false;

    // Route is private and user is not logged in
    if (isPrivate && !loggedIn) {     
        return <Redirect to="/" />;   
      }    
    
    if (!isPrivate && loggedIn) {     
        return <Redirect to="/homepage" />;   
    }    

    return <Route {...rest} component={Component} />; 
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
      .isRequired,
  };
  
RouteWrapper.defaultProps = {
isPrivate: false,
};


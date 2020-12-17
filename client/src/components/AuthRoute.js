import React from "react";
import {Redirect, Route} from "react-router";

/**
 * A Route guarded by the current state of the
 * authenticated user.
 * @param {React.Component} Component Component target of the route
 * @param {boolean} mustAuth Whether or not the user must be authenticated to access this route
 * @param {boolean} canAccess Whether or not the user can access the route at this time
 * @param rest Remaining Route attributes to be passed to the Route component
 * @returns {JSX.Element}
 */
function AuthRoute({component: Component, mustAuth, canAccess, ...rest}) {
    return (<Route {...rest} render={(props) =>
        canAccess
            ? <Component {...props}/>
            : <Redirect to={mustAuth ? "/login" : "/"}/>
    }/>);
}

export default AuthRoute;

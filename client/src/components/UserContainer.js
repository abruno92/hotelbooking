import {AuthService} from "../services/auth";

/**
 * A Component that displays its children components only if the type of
 * the logged in user matches the provided userType.
 * @param {string} userType Type of the user needed to display the components.
 * @param children Components to be conditionally displayed.
 * @returns {JSX.Element}
 */
export default function UserContainer({userType, children}) {
    if (userType === AuthService.getUser().privilegeLevel) {
        return children;
    } else {
        return null;
    }
}

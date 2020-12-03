import ApiAxios from "../utils/ApiAxios";
import config from "../config";
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";

/**
 * A Service responsible for managing the authenticated user
 * of the app.
 */
class AuthServiceImpl {
    #_currentUser$;
    loggedIn$;

    constructor() {
        // Observable that emits values over time
        this.#_currentUser$ = new BehaviorSubject(undefined);
        // Observable that maps the above observable from a User object to a boolean
        this.loggedIn$ = this.#_currentUser$.pipe(map(u => u !== undefined));
    }

    /**
     * Checks if there is a user currently logged in.
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.#_currentUser$.getValue() !== undefined;
    }

    /**
     * Checks if the user is of 'customer' type.
     * @returns {boolean}
     */
    isCustomer() {
        return this.isLoggedIn() && this.#_currentUser$.getValue().privilegeLevel === config.users.customer;
    }

    /**
     * Checks if the user is of 'manager' type.
     * @returns {boolean}
     */
    isManager() {
        return this.isCustomer() && this.#_currentUser$.getValue().privilegeLevel === config.user.manager;
    }

    /**
     * Attempts to authenticate the user using provided credentials.
     * @param email - Provided email
     * @param password - Provided password
     * @returns {undefined | string} Error message in case of presentable errors, undefined otherwise.
     */
    async login(email, password) {
        let result;
        try {
            result = (await ApiAxios.post('auth/login', {
                email: email,
                password: password
            })).data;
        } catch (e) {
            console.log(e);
            return "";
        }

        if (!result.id) {
            return "";
        }

        let user;
        try {
            user = (await ApiAxios.get('user/current')).data;
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
            } else {
                console.log(e);
            }

            return "";
        }

        this.#_currentUser$.next(user);
    }

    /**
     * Attempts to refresh the user that bears the JWT cookie.
     */
    async refresh() {
        try {
            const user = (await ApiAxios.get('user/current')).data;
            this.#_currentUser$.next(user);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 401 || e.response.status === 403) {
                    // Token is either expired or not present
                    this.#_currentUser$.next(undefined);
                } else {
                    console.log(e.response.data);
                }
            } else {
                console.log(e);
            }
        }
    }

    /**
     * Logs the user out.
     */
    async logout() {
        try {
            await ApiAxios.post('auth/logout');
        } catch (e) {
            console.log(e);
        }

        this.#_currentUser$.next(undefined);
    }

    /**
     * Returns the user.
     */
    getUser() {
        return this.#_currentUser$.getValue();
    }
}

export const AuthService = new AuthServiceImpl();
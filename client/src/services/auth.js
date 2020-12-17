import ApiAxios from "../utils/ApiAxios";
import config from "../config";
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";
import sleep from "../utils/time";

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
        return this.isLoggedIn() && this.#_currentUser$.getValue().privilegeLevel === config.users.manager;
    }

    /**
     * Attempts to authenticate the user using provided credentials.
     * @param {object} credentials - Provided email and password
     * @returns {undefined | string} Error message in case of presentable errors, undefined otherwise.
     */
    async login(credentials) {
        let result;
        try {
            result = (await ApiAxios.post('auth/login', credentials)).data;
            await sleep(300);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 400 || e.response.status === 401) {
                    throw e;
                } else {
                    console.log(e.response.data);
                }
            } else {
                console.log(e);
            }

            return;
        }

        if (!result.id) {
            return;
        }

        let user;
        try {
            user = (await ApiAxios.get('user/current')).data;
            await sleep(300);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 400 || e.response.status === 401) {
                    throw e;
                } else {
                    console.log(e.response.data);
                }
            } else {
                console.log(e);
            }

            return;
        }

        this.#_currentUser$.next(user);
    }

    /**
     * Attempts to create an account using provided details.
     * @param account - Details of the account
     * @returns {undefined | string} Error message in case of presentable errors, undefined otherwise.
     */
    async register(account) {
        try {
            await ApiAxios.post('auth/register', account);
            await sleep(300);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        return this.login(account);
    }

    /**
     * Attempts to refresh the user that bears the JWT cookie.
     */
    async refresh() {
        let message;
        try {
            message = (await ApiAxios.get('auth/refresh')).data.message;
        } catch (e) {
            if (e.response) {
                if (e.response.status === 401 || e.response.status === 403 || e.response.status === 409) {
                    // Token is either expired, not present or does not need to be refreshed
                    message = e.response.data.error;
                }
            } else {
                console.log(e);
            }
        }

        let user = undefined;
        try {
            user = (await ApiAxios.get('user/current')).data;
        } catch (e) {
            console.log(e);
        }

        this.#_currentUser$.next(user);

        return message;
    }

    /**
     * Logs the user out.
     */
    async logout() {
        try {
            await ApiAxios.post('auth/logout');
            await sleep(300);

            this.#_currentUser$.next(undefined);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 401) {
                    this.#_currentUser$.next(undefined);
                    return;
                }
            }

            console.log(e);
        }
    }

    /**
     * Returns the user.
     */
    getUser() {
        return this.#_currentUser$.getValue();
    }
}

export const AuthService = new AuthServiceImpl();
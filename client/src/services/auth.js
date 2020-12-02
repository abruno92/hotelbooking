import ApiAxios from "../utils/ApiAxios";
import config from "../config";



class AuthServiceImpl {
    #currentUser;

    /**
     * Checks if there is a user currently logged in.
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.#currentUser !== undefined;
    }

    /**
     * Checks if the user is of 'customer' type.
     * @returns {boolean}
     */
    isCustomer() {
        return this.isLoggedIn() && this.#currentUser.privilegeLevel === config.users.customer;
    }

    /**
     * Checks if the user is of 'manager' type.
     * @returns {boolean}
     */
    isManager() {
        return this.isCustomer() && this.#currentUser.privilegeLevel === config.user.manager;
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

        console.log(user);
        this.#currentUser = user;
    }

    async logout() {
        try {
            await ApiAxios.post('auth/login');
        } catch (e) {
            console.log(e);
        }

        this.#currentUser = undefined;
    }

    getUser() {
        return this.#currentUser;
    }
}

export const AuthService = new AuthServiceImpl();
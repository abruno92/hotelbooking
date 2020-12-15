import ApiAxios from "../utils/ApiAxios";

/**
 * A Service responsible for managing the bookings of the app.
 */
class UserServiceImpl {
    async getNameForUser(id) {
        try {
            const reviewUser = (await ApiAxios.get(`/user/${id}`)).data;
            return `${reviewUser.firstName} ${reviewUser.lastName}`;
        } catch (e) {
            if (!(e.response.status === 404)) {
                console.log(e);
            }
            return "";
        }
    }
}

export const UserService = new UserServiceImpl();
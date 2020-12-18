import ApiAxios from "../utils/ApiAxios";

/**
 * A Service responsible for managing the users of the app.
 */
class UserServiceImpl {
    /**
     * Returns the concatenation of first name and last name of an user.
     * @param id Id of the user
     * @returns {string} Full user name if user is found, or empty string otherwise
     */
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

    /**
     * Retrieves the profile picture of a user.
     * @param id Id of the user
     * @returns {string} base64 encoded image string
     */
    async getProfilePicture(id) {
        try {
            const response = await ApiAxios.get(`/user/${id}/picture`, {responseType: 'arraybuffer'});

            // create the prefix for the image buffer
            const prefix = `data:${response.headers['content-type']};base64,`;
            // convert the buffer from binary to base64 and append the prefix
            return prefix + Buffer.from(response.data, 'binary').toString('base64');
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
            } else {
                console.log(e);
            }
        }
    }

    /**
     * Changes the profile picture of an user.
     * @param id Id of the user
     * @param pictureFormData The form data containing the 'picture' field with the new profile picture.
     */
    async changeProfilePicture(id, pictureFormData) {
        try {
            await ApiAxios.put(`/user/${id}/picture`, pictureFormData);
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
            } else {
                console.log(e);
            }
        }
    }
}

export const UserService = new UserServiceImpl();
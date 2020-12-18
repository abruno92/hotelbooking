import axios from 'axios';
import config from "../config";

// creates an Axios instance with the default base url of the api
// and with credentials enabled
export default axios.create({
    baseURL: config.api.baseUrl,
    withCredentials: true,
});
import apiUrl from './apiUrl'

const config = {};

config.api = {};
config.users = {};

config.api.baseUrl = apiUrl;

config.users.customer = "0";
config.users.manager = "1";
config.users.refreshRateMillis = 60 * 10000;

export default config;
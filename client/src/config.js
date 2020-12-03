import apiUrl from './apiUrl'

const config = {};

config.api = {};
config.users = {};

config.api.baseUrl = apiUrl;

config.users.customer = "customer";
config.users.manager = "manager";
config.users.refreshRateMillis = 3 * 60 * 1000;

export default config;
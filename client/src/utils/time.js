// a function that returns a Promise with a delay of
// 'ms' milliseconds until it is resolved
export default function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
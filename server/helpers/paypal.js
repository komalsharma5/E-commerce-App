const paypal = require('@paypal/checkout-server-sdk');

let clientId = "AbV1wlZ_JG7EsQxPz4Dsr1mzLKkEsEC5jHf_ssSM6kuS-pMRyOAKFcfssLJPVOYkqUVGVjmtxgm_ddEr";
let clientSecret = "EMGgAVGgfbb7WwqaUsMJQhEbnaaFPGZbOHRMygDnV1rhPpAaujb7ZoNLvP0JOfSPathAUYyuTTNvG_1g";

function environment() {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };





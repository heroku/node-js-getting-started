/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');
var api = require('../api');

/**
 * Make payouts to multiple PayPal accounts, or multiple payments to same PayPal account
 * @return {Object} payout functions
 */
function payout() {
    var baseURL = '/v1/payments/payouts/';
    var operations = ['get'];

    var ret = {
        baseURL: baseURL,
        /**
         * Create a batch(asynchronous) or single(synchronous) payout
         * @param  {Object}   data      payout details
         * @param  {String}   sync_mode true for synchronous payouts, false by default
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb
         * @return {Object}             Payout object
         */
        create: function create(data, sync_mode, config, cb) {
            cb = (typeof sync_mode === 'function') ? sync_mode : cb;
            sync_mode = (typeof sync_mode === 'string' && sync_mode === 'true') ? 'true' : 'false';
            api.executeHttp('POST', this.baseURL + "?" + "sync_mode=" + sync_mode, data, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = payout;

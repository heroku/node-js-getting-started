/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');
var api = require('../api');

/**
 * Create or get details of payments
 * @return {Object} Payment functions
 */
function payment() {
    var baseURL = '/v1/payments/payment/';
    var operations = ['create', 'get', 'list'];

    var ret = {
        baseURL: baseURL,
        /**
         * Execute(complete) a PayPal or payment that has been approved by the payer
         * @param  {String}   id     Payment identifier
         * @param  {Object}   data   Transaction details if updating a payment
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb     
         * @return {Object}          Payment object for completed PayPal payment
         */
        execute: function execute(id, data, config, cb) {
            api.executeHttp('POST', this.baseURL + id + '/execute', data, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = payment;

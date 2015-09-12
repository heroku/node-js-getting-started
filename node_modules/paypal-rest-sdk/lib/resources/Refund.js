/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');

/**
 * Refunds on direct and captured payments
 * @return {Object} refund functions
 */
function refund() {
    var baseURL = '/v1/payments/refund/';
    var operations = ['get'];

    var ret = {
        baseURL: baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = refund;

/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');

/**
 * Look up and refund captured payments
 * @return {Object} capture functions
 */
function capture() {
    var baseURL = '/v1/payments/capture/';
    var operations = ['get', 'refund'];

    var ret = {
        baseURL: baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = capture;

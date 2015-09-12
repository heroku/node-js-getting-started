/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');

/**
 * Store credit cards information securely in vault
 * @return {Object} Credit Card functions
 */
function creditCard() {
    var baseURL = '/v1/vault/credit-card/';
    var operations = ['create', 'get', 'update', 'del', 'delete', 'list'];

    var ret = {
        baseURL: baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = creditCard;

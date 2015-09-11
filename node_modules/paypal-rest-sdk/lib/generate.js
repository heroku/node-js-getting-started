/* Copyright 2015 PayPal */
"use strict";
var api = require('./api');

/**
 * Attach REST operations from restFunctions as required by a PayPal API
 * resource e.g. create, get and list are attahed for Payment resource
 * @param  {Object} destObject A PayPal resource e.g. Invoice
 * @param  {Array} operations Rest operations that the destObject will allow e.g. get
 * @return {Object}            
 */
function mixin(destObject, operations) {
    operations.forEach(function (property) {
        destObject[property] = restFunctions[property];
    });
    return destObject;
}

/**
 * restFunctions Object containing the REST CRUD methods and paypal specific REST methods that
 * are shared between at least two of the REST endpoints, otherwise the function
 * will be defined within the resource definition itself
 * @type {Object}
 */
var restFunctions = {
    create: function create(data, config, cb) {
        api.executeHttp('POST', this.baseURL, data, config, cb);
    },
    get: function get(id, config, cb) {
        api.executeHttp('GET', this.baseURL + id, {}, config, cb);
    },
    list: function list(data, config, cb) {
        if (typeof data === 'function') {
            config = data;
            data = {};
        }
        api.executeHttp('GET', this.baseURL, data, config, cb);
    },
    del: function del(id, config, cb) {
        api.executeHttp('DELETE', this.baseURL + id, {}, config, cb);
    },
    //provided for compatibility with 0.* versions
    delete: function del(id, config, cb) {
        api.executeHttp('DELETE', this.baseURL + id, {}, config, cb);
    },
    capture: function capture(id, data, config, cb) {
        api.executeHttp('POST', this.baseURL + id + '/capture', data, config, cb);
    },
    refund: function refund(id, data, config, cb) {
        api.executeHttp('POST', this.baseURL + id + '/refund', data, config, cb);
    },
    update: function update(id, data, config, cb) {
        api.executeHttp('PATCH', this.baseURL + id, data, config, cb);
    },
    cancel: function cancel(id, data, config, cb) {
        api.executeHttp('POST', this.baseURL + id + '/cancel', data, config, cb);
    }
};

module.exports.mixin = mixin;

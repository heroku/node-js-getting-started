/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');
var api = require('../api');

/**
 * Exposes REST endpoints for providing a customizing Paypal checkout
 * flow for users, supports features such as noshipping.
 *
 * https://developer.paypal.com/webapps/developer/docs/integration/direct/rest-experience-overview/
 * @return {Object} web profile functions
 */
function webProfile() {
    var baseURL = '/v1/payment-experience/web-profiles/';
    var operations = ['create', 'list', 'get', 'del', 'delete'];

    var ret = {
        baseURL: baseURL,
        /**
         * Update an experience profile
         * @param  {String}   id     Web Profile Id
         * @param  {Object}   data   Object with name, flow_config, input_fields and presentation
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb     
         * @return {}          Returns the HTTP status of 204 if the call is successful
         */
        update: function update(id, data, config, cb) {
            api.executeHttp('PUT', this.baseURL + id, data, config, cb);
        },
        /**
         * Partially update a web experience profile
         * @param  {String}   id     Web Profile Id
         * @param  {Array}   data   Array of patch request objects (operation, path, value, from)
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb 
         * @return {}          Returns the HTTP status of 204 if the call is successful
         */
        replace: function replace(id, data, config, cb) {
            api.executeHttp('PATCH', this.baseURL + id, data, config, cb);
        },
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

module.exports = webProfile;

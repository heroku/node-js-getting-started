/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');
var api = require('../api');

/**
 * The billing agreements allows merchants to have users agree to be billed
 * for billing plans
 * @return {Object} billing agreement functions
 */
function billingAgreement() {
    var baseURL = '/v1/payments/billing-agreements/';
    var operations = ['create', 'get', 'update', 'cancel'];

    /**
     * Search for transactions within a billing agreement
     * @param  {String}   id         Identifier of the agreement resource for which to list transactions.
     * @param  {String}   start_date YYYY-MM-DD start date of range of transactions to list
     * @param  {String}   end_date   YYYY-MM-DD end date of range of transactions to list
     * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
     * @param  {Function} cb         
     * @return {Object}              agreement transaction list, array of agreement transaction objects
     */
    function searchTransactions(id, start_date, end_date, config, cb) {
        var date_range = {
            "start_date": start_date,
            "end_date": end_date
        };
        api.executeHttp('GET', baseURL + id + '/transactions', date_range, config, cb);
    }

    /**
     * Bill outstanding balance of an agreement
     * @param  {String}   id     Identifier of the agreement resource for which to bill balance
     * @param  {Object}   data   Agreement state descriptor, fields include note and amount which has two attributes, value and currency
     * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
     * @param  {Function} cb      
     * @return {}          Returns the HTTP status of 204 if the call is successful
     */
    function billBalance(id, data, config, cb) {
        api.executeHttp('POST', baseURL + id + '/bill-balance', data, config, cb);
    }

    /**
     * Set the outstanding amount of an agreement
     * @param  {String}   id     Identifier of the agreement resource for which to set balance
     * @param  {Object}   data   Two attributes currency e.g. "USD" and value e.g. "100"
     * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
     * @param  {Function} cb
     * @return {}          Returns the HTTP status of 204 if the call is successful
     */
    function setBalance(id, data, config, cb) {
        api.executeHttp('POST', baseURL + id + '/set-balance', data, config, cb);
    }

    var ret = {
        baseURL: baseURL,
        /**
         * Execute an agreement after the buyer approves it
         * @param  {String}   token  Payment Token of format EC-XXXXXX, appended to return url as a parameter after buyer approves agreement
         * @param  {Object|Function}   data Empty object or callback. Optional, will be removed in next major release. 
         * @param  {Object|Function}   config Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb     
         * @return {Object}          agreement object
         */
        execute: function execute(token, data, config, cb) {
            //support case where neither data nor config is provided
            if (typeof data === "function" && arguments.length === 2) {
                cb = data;
                data = {};
            }
            api.executeHttp('POST', this.baseURL + token + '/agreement-execute', data, config, cb);
        },
        /**
         * Changes agreement state to suspended, can be reactivated unlike cancelling agreement
         * @param  {String}   id     Identifier of the agreement resource for which to suspend
         * @param  {Object}   data   Add note attribute, reason for changing state of agreement
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb
         * @return {}          Returns the HTTP status of 204 if the call is successful
         */
        suspend: function suspend(id, data, config, cb) {
            api.executeHttp('POST', this.baseURL + id + '/suspend', data, config, cb);
        },
        /**
         * Reactivate a suspended agreement
         * @param  {String}   id     Identifier of the agreement resource for which to reactivate
         * @param  {Object}   data   Add note attribute, reason for changing state of agreement
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb
         * @return {}          Returns the HTTP status of 204 if the call is successful
         */
        reactivate: function reactivate(id, data, config, cb) {
            api.executeHttp('POST', this.baseURL + id + '/re-activate', data, config, cb);
        },
        billBalance: billBalance,
        setBalance: setBalance,
        searchTransactions: searchTransactions,
        //entries below are deprecated but provided for compatibility with 0.* versions
        bill_balance: billBalance,
        set_balance: setBalance,
        search_transactions: searchTransactions
    };
    ret = generate.mixin(ret, operations);
    return ret;
}
module.exports = billingAgreement;

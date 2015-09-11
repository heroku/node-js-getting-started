/* Copyright 2015 PayPal */
"use strict";

var generate = require('../generate');
var api = require('../api');
var https = require('https');
var crypto = require('crypto');
var crc32 = require('buffer-crc32');

/**
 * Exposes REST endpoints for creating and managing webhooks
 * @return {Object} webhook functions
 */
function webhook() {
    var baseURL = '/v1/notifications/webhooks/';
    var operations = ['create', 'list', 'get', 'del', 'delete'];

    var ret = {
        baseURL: baseURL,
        replace: function replace(id, data, config, cb) {
            api.executeHttp('PATCH', this.baseURL + id, data, config, cb);
        },
        eventTypes: function eventTypes(id, config, cb) {
            api.executeHttp('GET', this.baseURL + id + '/event-types', {}, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

/**
 * Exposes REST endpoints for working with subscribed webhooks events
 *
 * https://developer.paypal.com/webapps/developer/docs/integration/direct/rest-webhooks-overview/#events
 * @return {Object} webhook event functions
 */
function webhookEvent() {
    var baseURL = '/v1/notifications/webhooks-events/';
    var operations = ['list', 'get'];

    function verifyPayload(key, msg, hash, hashAlgo) {
        hashAlgo = hashAlgo || 'sha256WithRSAEncryption';

        return crypto.createVerify(hashAlgo)
            .update(msg)
            .verify(key, hash, 'base64');
    }

    /**
     * Make a get request to validate that the payload recieved was from paypal
     * and intended towards the correct recipient. This is highly
     * recommended to verify authenticity of webhook messages
     * 
     * @param  {[type]}   body raw body of request
     * @param  {Function} cb   callback function
     */
    function getAndVerify(body, cb) {
        var response = false;
        var err = null;
        try {
            var webhookEventId = JSON.parse(body).id;
            api.executeHttp('GET', baseURL + webhookEventId, {}, function (error, res) {
                if (error) {
                    cb(error, response);
                } else {
                    cb(err, true);
                }
            });
        } catch (e) {
            err = new Error("Webhook Event Id attribute not found. Possible reason could be invalid JSON Object.");
            cb(err, response);
        }
    }

    /**
     * @param {Object} headers from request
     * @param {String} raw body of request
     * @param {String} webhook id
     * @param {Function} callback function
     */
    function verify(headers, body, webhookId, callback) {
        // In an effort not to break existing applications, accept old arguments temporarily
        if (arguments.length > 4) {
            /* jshint validthis: true */
            return verifyLegacy.apply(this, arguments);
        }

        if (typeof headers !== 'object') {
            return callback(new Error("headers is not an object"), false);
        }

        // Normalizes headers
        Object.keys(headers).forEach(function (header) {
            headers[header.toUpperCase()] = headers[header];
        });

        // Convert PayPal's hashing algorithm to one Node supports
        // (assuming SHA is used indefinitely)
        if (typeof headers['PAYPAL-AUTH-ALGO'] === 'string') {
            headers['PAYPAL-AUTH-ALGO'] = headers['PAYPAL-AUTH-ALGO']
                                           .replace(/^SHA/, 'sha')
                                           .replace(/withRSA$/, 'WithRSAEncryption');
        }

        https.get(headers['PAYPAL-CERT-URL'], function (res) {
            var cert = '';
            res.on('error', function (e) {
                console.log('PayPal-Node-SDK: problem with cert dl - ' + e.message);
                callback(e, null);
            });
            res.on('data', function (chunk) {
                cert += chunk;
            });
            res.on('end', function () {
                var err = null;
                var response = false;
                try {
                    var expectedSignature = headers['PAYPAL-TRANSMISSION-ID'] + "|" + headers['PAYPAL-TRANSMISSION-TIME'] + "|" + webhookId + "|" + crc32.unsigned(body);
                    response = verifyPayload(cert, expectedSignature, headers['PAYPAL-TRANSMISSION-SIG'], headers['PAYPAL-AUTH-ALGO']);
                } catch (e) {
                    err = new Error("Error verifying webhook payload.");
                }
                callback(err, response);
            });
        });
    }

    function verifyLegacy(certURL, transmissionId, timeStamp, webhookId, eventBody, ppTransmissionSig, cb) {
        // Emit a warning that the arguments have changed
        if (process.env.NODE_ENV === 'development') {
            console.log('PayPal-Node-SDK: Webhook verify arguments have changed. Please check the latest documentation on https://developer.paypal.com/docs/integration/direct/rest-webhooks-overview/#event-signature.');
        }

        https.get(certURL, function (res) {
            var cert = '';
            res.on('error', function (e) {
                console.log('PayPal-Node-SDK: problem with cert dl - ' + e.message);
                cb(e, null);
            });
            res.on('data', function (chunk) {
                cert += chunk;
            });
            res.on('end', function () {
                var err = null;
                var response = false;
                try {
                    var expectedSignature = transmissionId + "|" + timeStamp + "|" + webhookId + "|" + crc32.unsigned(eventBody);
                    response = verifyPayload(cert, expectedSignature, ppTransmissionSig);
                } catch (e) {
                    err = new Error("Error verifying webhook payload.");
                }
                cb(err, response);
            });
        });
    }

    var ret = {
        baseURL: baseURL,
        verify: verify,
        getAndVerify: getAndVerify,
        resend: function resend(id, config, cb) {
            api.executeHttp('POST', this.baseURL + id + '/resend', {}, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

/**
 * Exposes REST endpoint for listing available event types for webhooks
 * @return {Object} webhook event type functions
 */
function webhookEventType() {
    var baseURL = '/v1/notifications/webhooks-event-types/';
    var operations = ['list'];

    var ret = {
        baseURL: baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

/**
 * Exposes the namespace for webhook and webhook event functionalities
 * 
 * https://developer.paypal.com/webapps/developer/docs/api/#notifications
 * @return {Object} notification functions
 */
function notification() {
    return {
        webhook: webhook(),
        webhookEvent: webhookEvent(),
        webhookEventType: webhookEventType()
    };
}

module.exports = notification;

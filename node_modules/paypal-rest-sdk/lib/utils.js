/* Copyright 2015 PayPal */
"use strict";
var isArray = Array.isArray;
var hasOwn = Object.prototype.hasOwnProperty;

var getDefaultEndpoint = exports.getDefaultEndpoint = function getDefaultEndpoint(mode) {
    return (typeof mode === "string" && mode === "live") ? "paypal.com" : "sandbox.paypal.com";
};

var getDefaultApiEndpoint = exports.getDefaultApiEndpoint = function getDefaultApiEndpoint(mode) {
    return 'api.' + getDefaultEndpoint(mode);
};

/**
 * Recursively copies given object into a new object. Helper method for merge
 * @param  {Object} v
 * @return {Object}   
 */
function clone(v) {
    if (v === null || typeof v !== "object") {
        return v;
    }

    if (isArray(v)) {
        var arr = v.slice();
        for (var i = 0; i < v.length; i++) {
            arr[i] = clone(arr[i]);
        }
        return arr;
    }
    else {
        var obj = {};
        for (var k in v) {
            obj[k] = clone(v[k]);
        }
        return obj;
    }
}

/**
 * Merges two Objects recursively, setting property of obj1 to those of obj2
 * and creating property as necessary. 
 *
 * Implementation suggested by @kobalicek on https://github.com/paypal/PayPal-node-SDK/issues/69
 * @param  {Object} obj1 
 * @param  {Object} obj2 
 * @return {Object}     
 */
var merge = exports.merge = function merge(obj1, obj2, appendOnly) {

    //Handle invalid arguments
    if (obj1 === null || typeof obj1 !== "object") {
        throw new TypeError("merge() - first parameter has to be an object, not " + typeof obj1 + ".");
    }

    if (obj2 === null || typeof obj2 !== "object") {
        throw new TypeError("merge() - first parameter has to be an object, not " + typeof obj2 + ".");
    }

    if (isArray(obj1) || isArray(obj2)) {
        throw new TypeError("merge() - Unsupported for arrays.");
    }

    for (var k in obj2) {
        var obj1Val, obj2Val = obj2[k];
        if (hasOwn.call(obj1, k)) {
            if (!appendOnly) {
                obj1Val = obj1[k];
                if (obj1Val !== null && typeof obj1Val === "object" &&
                        obj2Val !== null && typeof obj2Val === "object") {
                    merge(obj1Val, obj2Val);
                }
                else {
                    obj1[k] = clone(obj2Val);
                }
            }
        }
        else {
            obj1[k] = clone(obj2Val);
        }
    }
    return obj1;
};

/**
 * Checks if access token for client id has expired
 * @param  {Object} token_hash  object returned from paypal access token request
 *                              with expires_in set and sdk sets the created_at
 * @return {Boolean}            true if token expired else false
 */
var checkExpiredToken = exports.checkExpiredToken = function checkExpiredToken(token_hash) {
    var delta = (new Date().getTime() / 1000) - token_hash.created_at;
    return (delta < token_hash.expires_in) ? false : true;
};

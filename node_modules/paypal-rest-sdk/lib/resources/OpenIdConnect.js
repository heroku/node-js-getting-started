/* Copyright 2015 PayPal */
"use strict";
var configuration = require('../configure');
var client = require('../client');
var utils = require('../utils');
var querystring = require('querystring');

/**
 * Sets up request body for open id connect module requests
 * @param  {String}   path              url endpoint
 * @param  {Object}   data              Payload for HTTP Request
 * @param  {Object|Function}   config   Configuration parameters such as authorization code or refresh token
 * @param  {Function} cb     
 */
function openIdConnectRequest(path, data, config, cb) {
    var http_options = {
        schema: config.openid_connect_schema || configuration.default_options.openid_connect_schema,
        host: utils.getDefaultApiEndpoint(config.mode) || config.openid_connect_host,
        port: config.openid_connect_port || configuration.default_options.openid_connect_port,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    //Populate Basic Auth header only for endpoints that need it such as tokeninfo
    if (data.client_id && data.client_secret) {
        http_options.headers.Authorization = 'Basic ' + new Buffer(data.client_id + ':' + data.client_secret).toString('base64');
    }

    client.invoke('POST', path, querystring.stringify(data), http_options, cb);
}

/**
 * @param  {Object} config Configurations for settings and Auth
 * @return {String}        client id
 */
function getClientId(config) {
    return config.openid_client_id || config.client_id ||
        configuration.default_options.openid_client_id || configuration.default_options.client_id;
}

/**
 * @param  {Object} config Configurations for settings and Auth
 * @return {String}        client secret
 */
function getClientSecret(config) {
    return config.openid_client_secret || config.client_secret ||
        configuration.default_options.openid_client_secret || configuration.default_options.client_secret;
}

/**
 * Configurations for settings and Auth
 * @return {String}        redirect uri
 */
function getRedirectUri(config) {
    return config.openid_redirect_uri || configuration.default_options.openid_redirect_uri;
}

/**
 * Obtain a user’s consent to make Identity API calls on their behalf by redirecting them
 * to authorization endpoint
 * @param  {Data}   data      Payload associated with API request
 * @param  {Object} config    Configurations for settings and Auth
 * @return {String}        authorize url
 */
function authorizeUrl(data, config) {
    config = config || configuration.default_options;
    data   = data || {};

    //Use mode provided, live or sandbox to construct authorize_url, sandbox is default
    var url = 'https://www.' + utils.getDefaultEndpoint(config.mode) + '/webapps/auth/protocol/openidconnect/v1/authorize' || config.authorize_url;

    data = utils.merge({
        'client_id': getClientId(config),
        'scope': 'openid',
        'response_type': 'code',
        'redirect_uri': getRedirectUri(config)
    }, data);

    return url + '?' + querystring.stringify(data);
}

/**
 * Direct user to logout url to end session
 * @param  {Data}   data      Payload associated with API request
 * @param  {Object} config    Configurations for settings and Auth
 * @return {String}        logout url
 */
function logoutUrl(data, config) {
    config = config || configuration.default_options;
    data   = data || {};

    var url = 'https://www.' + utils.getDefaultEndpoint(config.mode) + '/webapps/auth/protocol/openidconnect/v1/endsession' || config.logout_url;

    if (typeof data === 'string') {
        data = { 'id_token': data };
    }

    data = utils.merge({
        'logout': 'true',
        'redirect_uri': getRedirectUri(config)
    }, data);

    return url + '?' + querystring.stringify(data);
}

/**
 * Grant a new access token, using a refresh token
 * @param  {Object}   data   Payload associated with API request
 * @param  {Object|Function}   config Configurations for settings and Auth
 * @param  {Function} cb     Callback function
 */
function tokenInfoRequest(data, config, cb) {

    if (typeof config === 'function') {
        cb = config;
        config = configuration.default_options;
    } else if (!config) {
        config = configuration.default_options;
    }

    data = utils.merge({
        'client_id': getClientId(config),
        'client_secret': getClientSecret(config)
    }, data);

    openIdConnectRequest('/v1/identity/openidconnect/tokenservice', data, config, cb);
}

/**
 * Retrieve user profile attributes
 * @param  {Object}   data   Payload associated with API request
 * @param  {Object|Function}   config Configurations for settings and Auth
 * @param  {Function} cb     Callback function
 */
function userInfoRequest(data, config, cb) {
    if (typeof config === 'function') {
        cb = config;
        config = configuration.default_options;
    } else if (!config) {
        config = configuration.default_options;
    }

    if (typeof data === 'string') {
        data = { 'access_token': data };
    }

    data = utils.merge({
        'schema': 'openid'
    }, data);

    openIdConnectRequest('/v1/identity/openidconnect/userinfo', data, config, cb);
}

/**
 * Use log in with PayPal to avoid storing user data on the system
 * @return {Object} openidconnect functions
 */
function openIdConnect() {
    return {
        tokeninfo: {
            create: function (data, config, cb) {
                if (typeof data === 'string') {
                    data = { 'code': data };
                }
                data.grant_type = 'authorization_code';
                tokenInfoRequest(data, config, cb);
            },
            refresh: function (data, config, cb) {
                if (typeof data === 'string') {
                    data = { 'refresh_token': data };
                }
                data.grant_type = 'refresh_token';
                tokenInfoRequest(data, config, cb);
            }
        },
        authorizeUrl: authorizeUrl,
        logoutUrl: logoutUrl,
        userinfo: {
            get: userInfoRequest
        },
        //entries below are deprecated but provided for compatibility with 0.* versions
        authorize_url: authorizeUrl,
        logout_url: logoutUrl
    };
}

module.exports = openIdConnect;

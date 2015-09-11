/**
 * Module dependencies.
 */
var Strategy = require('./strategy')
  , AuthorizationError = require('./errors/authorizationerror')
  , TokenError = require('./errors/tokenerror')
  , InternalOAuthError = require('./errors/internaloautherror');


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;

/**
 * Export errors.
 */
exports.AuthorizationError = AuthorizationError;
exports.TokenError = TokenError;
exports.InternalOAuthError = InternalOAuthError;

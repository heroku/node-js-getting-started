/**
 * Module dependencies.
 */
var Strategy = require('./strategy')
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
exports.InternalOAuthError = InternalOAuthError;

PayPal Node SDK release notes
============================

v1.6.3
----
* Update to uuid module for #106

v1.6.2
----
* Full request/response logged for non production environments with NODE_ENV=development set
* Update travis to build for Node 4.0

v1.6.1
----
* Openid userinfo header patch

v1.6.0
----
* Webhook events have getAndVerify available for validation
* Fix for credential resolution
* Improve debug id triaging and json parse error handling message
* Vault list all credit cards feature
* Patches to make easier use with Browserify

v1.5.3
----
* Webhook validation update patch

v1.5.2
----
* Content-Type Header parsing fix
* Merge updated
* NODE_ENV=development provides stringified response

v1.5.1
----
* utils.merge patch for empty header, fixes #69 and #70
* Automate JSDoc generation via Travis

v1.5.0
----
* Payouts cancel feature added
* Execute billing agreements more configurable
* Consolidate configuration of tests and samples
* JSDocs for most resource functions

v1.4.0
----
* Access token persistance added for performance boost in multiple client scenerios
* Add JSDoc for modules and refactor mixin method for rest objects

v1.3.1
----
* Version read from package.json for User Agent

v1.3.0
----
* Payouts API support added
* Samples documentation updated

v1.2.2
----
* Search transactions for billing agreements patched

v1.2.1
----
* User Agent conforms to new naming conventions

v1.2.0
----
* Webhook and Webhook events creation and management supported
* Verification that webhook events are unaltered and originate from PayPal

v1.1.0
----
* Payment Experience customizaton feature added via API for Web Profiles

v1.0.1
----
* Update Paypal-Client-Metadata-Id header for future payments
* Subscription API changes for searching transactions and listing billing plans

v1.0.0
----
### Features
* Subscription API support added
* Order/Auth/Capture support added
* Update credit card support added for vault
* Test/samples added for extra payment parameters
* activate method added for billing plans

### Breaking changes
* Exported methods are now camelCased instead of underscored in 0.* versions
* delete is now del
* support still maintained for above changes for compatibility with 0.* versions

### Refactoring
* Modularize into components api, client, config and utils
* Rest api resources separated into own functions/classes
* generate has the factory of rest methods attached to object literals e.g creditCard, reducing duplication
* Exported methods named and CamelCased across sdk, closer to JavaScript conventions, closes #34 and #35
* Test coverage increased

v0.9.1
----
* Fix for toggling host by using mode in config

v0.9.0
----
* Unit tests can run as mock mode
* Mode configuration for easier toggling between live/sandbox
* NODE_ENV=development can be added for getting debug-id

v0.8.0
-----
* Invoicing API support added 
* Added tests and samples for using the invoicing api via the sdk
* Modules pinned to versions for package.json

v0.7.0
-----
* Future Payments support added
* Linting

v0.6.4
-----
* Fixed content length to support utf-8 characters

v0.6.3
-----
* Added support for Reauthorization.

v0.6.2
-----
* Update HTTP User-Agent

v0.6.1
-----
* Allow payment.list with parameters

'use strict';
var semverRegex = require('semver-regex');
var arrayUniq = require('array-uniq');

function findLoose(str) {
	var match;
	var matches = [];
	var reVersion = /[^\d\.]v?(\d+\.\d+)[^\.\+\-]?/g; // match 1.1, but not semver 1.1.0

	while (match = reVersion.exec(' ' + str + ' ')) { // pad it to make crappy regex work
		if (match[1]) {
			matches.push(match[1]);
		}
	}

	return matches;
}

module.exports = function (str, opts) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	opts = opts || {};

	var loose = opts.loose === undefined ? false : opts.loose;
	var semverMatches = str.match(semverRegex()) || [];
	var looseMatches = loose ? findLoose(str) : [];

	return arrayUniq(semverMatches.concat(looseMatches).map(function (el) {
		return el.replace(/^v/, '').replace(/^\d+\.\d+$/, '$&.0');
	}));
};

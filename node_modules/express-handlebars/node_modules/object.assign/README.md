#object.assign <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][npm-url]

[![browser support][testling-png]][testling-url]

An Object.assign shim. Invoke its "shim" method to shim Object.assign if it is unavailable.

Takes a minimum of 2 object arguments: `target` and `source`.
Takes a variable sized list of source arguments - at least 1, as many as you want.
Throws a TypeError if any arguments are not objects.

Most common usage:
```js
var assign = Object.assign || require('object.assign');
```

## Example

```js
// Multiple sources!
var target = { a: true };
var source1 = { b: true };
var source2 = { c: true };
var sourceN = { n: true };

var expected = {
	a: true,
	b: true,
	c: true,
	n: true
};

var assign = require('object.assign');
var assert = require('assert');

assign(target, source1, source2, sourceN);
assert.deepEqual(target, expected); // AWESOME!
```

```js
var assign = require('object.assign');
var assert = require('assert');
var target = {
	a: true,
	b: true,
	c: true
};
var source1 = {
	c: false,
	d: false
};
var sourceN = {
	e: false
};

var assigned = assign(target, source1, sourceN);
assert.equal(target, assigned); // returns the target object
assert.deepEqual(assigned, {
	a: true,
	b: true,
	c: false,
	d: false,
	e: false
});
```

```js
var assign = require('object.assign');
var assert = require('assert');
/* when Object.assign is not present */
delete Object.assign;
var shimmedAssign = assign.shim();
assert.equal(shimmedAssign, assign);

var target = {
	a: true,
	b: true,
	c: true
};
var source = {
	c: false,
	d: false,
	e: false
};

var assigned = assign(target, source);
assert.deepEqual(Object.assign(target, source), assign(target, source));
```

```js
var assign = require('object.assign');
var assert = require('assert');
/* when Object.assign is present */
var shimmedAssign = assign.shim();
assert.equal(shimmedAssign, Object.assign);

var target = {
	a: true,
	b: true,
	c: true
};
var source = {
	c: false,
	d: false,
	e: false
};

assert.deepEqual(Object.assign(target, source), assign(target, source));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[npm-url]: https://npmjs.org/package/object.assign
[npm-version-svg]: http://vb.teelaun.ch/ljharb/object.assign.svg
[travis-svg]: https://travis-ci.org/ljharb/object.assign.svg
[travis-url]: https://travis-ci.org/ljharb/object.assign
[deps-svg]: https://david-dm.org/ljharb/object.assign.svg?theme=shields.io
[deps-url]: https://david-dm.org/ljharb/object.assign
[dev-deps-svg]: https://david-dm.org/ljharb/object.assign/dev-status.svg?theme=shields.io
[dev-deps-url]: https://david-dm.org/ljharb/object.assign#info=devDependencies
[testling-png]: https://ci.testling.com/ljharb/object.assign.png
[testling-url]: https://ci.testling.com/ljharb/object.assign
[npm-badge-png]: https://nodei.co/npm/object.assign.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/object.assign.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/object.assign.svg
[downloads-url]: http://npm-stat.com/charts.html?package=object.assign


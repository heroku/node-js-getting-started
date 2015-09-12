'use strict';

var test = require('tape');
var assign = require('../index.js');
var keys = require('object-keys');

test('error cases', function (t) {
	var target = {};
	t.throws(function () { assign(null); }, TypeError, 'target must be an object');
	t.end();
});

test('non-object sources', function (t) {
	t.deepEqual(assign({ a: 1 }, null, { b: 2 }), { a: 1, b: 2 }, 'ignores null source');
	t.deepEqual(assign({ a: 1 }, { b: 2 }, undefined), { a: 1, b: 2 }, 'ignores undefined source');
	t.end();
});

test('returns the modified target object', function (t) {
	var target = {};
	var returned = assign(target, { a: 1 });
	t.equal(returned, target, 'returned object is the same reference as the target object');
	t.end();
});

test('has the right length', function (t) {
	t.equal(assign.length, 2, 'length is 2 => 2 required arguments');
	t.end();
});

test('merge two objects', function (t) {
	var target = { a: 1 };
	var returned = assign(target, { b: 2 });
	t.deepEqual(returned, { a: 1, b: 2 }, 'returned object has properties from both');
	t.end();
});

test('works with functions', function (t) {
	var target = function () {};
	target.a = 1;
	var returned = assign(target, { b: 2 });
	t.equal(target, returned, 'returned object is target');
	t.equal(returned.a, 1);
	t.equal(returned.b, 2);
	t.end();
});

test('works with primitives', function (t) {
	var target = 2;
	var source = { b: 42 };
	var returned = assign(target, source);
	t.equal(Object.prototype.toString.call(returned), '[object Number]', 'returned is object form of number primitive');
	t.equal(Number(returned), target, 'returned and target have same valueOf');
	t.equal(returned.b, source.b);
	t.end();
});

test('merge N objects', function (t) {
	var target = { a: 1 };
	var source1 = { b: 2 };
	var source2 = { c: 3 };
	var returned = assign(target, source1, source2);
	t.deepEqual(returned, { a: 1, b: 2, c: 3 }, 'returned object has properties from all sources');
	t.end();
});

test('only iterates over own keys', function (t) {
	var Foo = function () {};
	Foo.prototype.bar = true;
	var foo = new Foo();
	foo.baz = true;
	var target = { a: 1 };
	var returned = assign(target, foo);
	t.equal(returned, target, 'returned object is the same reference as the target object');
	t.deepEqual(target, { baz: true, a: 1 }, 'returned object has only own properties from both');
	t.end();
});

test('exports a "shim" function', function (t) {
	t.equal(typeof assign.shim, 'function', 'assign.shim is a function');

	t.test('when Object.assign is present', function (st) {
		var originalObjectAssign = Object.assign;
		Object.assign = function () {};
		var shimmedAssign = assign.shim();
		st.notEqual(Object.assign, assign, 'Object.assign is not overridden');
		st.equal(shimmedAssign, Object.assign, 'Object.assign is returned');
		Object.assign = originalObjectAssign;
		st.end();
	});

	t.test('when Object.assign is not present', function (st) {
		var originalObjectAssign = Object.assign;
		delete Object.assign;
		var shimmedAssign = assign.shim();
		st.equal(Object.assign, assign, 'Object.assign is overridden');
		st.equal(shimmedAssign, assign, 'shim is returned');
		Object.assign = originalObjectAssign;
		st.end();
	});

	t.end();
});

test('working with actual shim', function (t) {
	t.notEqual(Object.assign, assign, 'assign shim is not native Object.assign');
	t.end();
});


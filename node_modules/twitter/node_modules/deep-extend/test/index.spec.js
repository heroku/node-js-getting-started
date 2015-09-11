var should = require('should');
var extend = require('../index');

describe('deep-extend', function () {

	it('can extend on 1 level', function () {
		var a = { hello: 1 };
		var b = { world: 2 };
		extend(a, b);
		a.should.eql({
			hello: 1,
			world: 2
		});
	});

	it('can extend on 2 levels', function () {
		var a = { person: { name: 'John' } };
		var b = { person: { age: 30 } };
		extend(a, b);
		a.should.eql({
			person: { name: 'John', age: 30 }
		});
	});

	it('can extend with Buffer values', function () {
		var a = { hello: 1 };
		var b = { value: new Buffer('world') };
		extend(a, b);
		a.should.eql({
			hello: 1,
			value: new Buffer('world')
		});
	});

	it('Buffer is cloned', function () {
		var a = { };
		var b = { value: new Buffer('foo') };
		extend(a, b);
		a.value.write('bar');
		a.value.toString().should.eql('bar');
		b.value.toString().should.eql('foo');
	});

	it('Date objects', function () {
		var a = { d: new Date() };
		var b = extend({}, a);
		b.d.should.instanceOf(Date);
	});

	it('Date object is cloned', function () {
		var a = { d: new Date() };
		var b = extend({}, a);
		b.d.setTime( (new Date()).getTime() + 100000 );
		b.d.getTime().should.not.eql( a.d.getTime() );
	});

	it('RegExp objects', function () {
		var a = { d: new RegExp() };
		var b = extend({}, a);
		b.d.should.instanceOf(RegExp);
	});

	it('RegExp object is cloned', function () {
		var a = { d: new RegExp('b', 'g') };
		var b = extend({}, a);
		b.d.test('abc');
		b.d.lastIndex.should.not.eql( a.d.lastIndex );
	});

	it('doesn\'t change sources', function () {
		var a = {a: [1]};
		var b = {a: [2]};
		var c = {c: 3};
		var d = extend({}, a, b, c);

		a.should.eql({a: [1]});
		b.should.eql({a: [2]});
		c.should.eql({c: 3});
	});

	it('example from README.md', function () {
		var obj1 = {
			a: 1,
			b: 2,
			d: {
				a: 1,
				b: [],
				c: { test1: 123, test2: 321 }
			},
			f: 5,
			g: 123
		};
		var obj2 = {
			b: 3,
			c: 5,
			d: {
				b: { first: 'one', second: 'two' },
				c: { test2: 222 }
			},
			e: { one: 1, two: 2 },
			f: [],
			g: (void 0),
			h: /abc/g,
			f: null
		};

		extend(obj1, obj2);

		obj1.should.eql({
			a: 1,
			b: 3,
			d: {
				a: 1,
				b: { first: 'one', second: 'two' },
				c: { test1: 123, test2: 222 }
			},
			f: null,
			g: undefined,
			c: 5,
			e: { one: 1, two: 2 },
			h: /abc/g
		});

		('g' in obj1).should.eql(true);
		('x' in obj1).should.eql(false);
	});

});

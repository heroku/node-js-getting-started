/**
 * Module dependencies.
 */
var dom = require('xmldom')
  , DOMParser = dom.DOMParser
  , XMLSerializer = dom.XMLSerializer;


/**
 * Wraps and returns a new collection of elements.
 *
 * Examples:
 *
 *     $('<xml/>');
 *
 * @param {String|Node|Collection|Array} nodes XML string or DOM nodes to wrap.
 * @return {Collection} The wrapped nodes.
 * @api public
 */
function wrap(nodes) {
  nodes = nodes || [];
  if ('string' == typeof nodes) {
    nodes = new DOMParser().parseFromString(nodes);
  }

  if (nodes.attrNS && nodes._related) {
    // attempt to re-wrap Collection, return it directly
    return nodes;
  } else if (nodes.documentElement) {
    nodes = [ nodes.documentElement ];
  } else if (nodes.nodeType) {
    nodes = [ nodes ];
  }
  return new Collection(nodes);
}

/**
 * Returns an array consisting of unique elements.
 *
 * @param {Array} ar
 * @return {Array}
 * @api private
 */
function unique(ar) {
  var a = []
    , i = -1
    , j
    , has;
  while (++i < ar.length) {
    j = -1;
    has = false;
    while (++j < a.length) {
      if (a[j] === ar[i]) {
        has = true;
        break;
      }
    }
    if (!has) { a.push(ar[i]); }
  }
  return a;
}


/**
 * Creates an instance of `Collection`.
 *
 * @constructor
 * @param {Array} nodes DOM elements to wrap.
 * @api protected
 */
function Collection(nodes) {
  this.length = 0;
  if (nodes) {
    nodes = unique(nodes);
    this.length = nodes.length;
    // add each node to an index-based property on collection, in order to
    // appear "array"-like
    for (var i = 0, len = nodes.length; i < len; i++) {
      this[i] = nodes[i];
    }
  }
}

/**
 * Iterate over a set, executing a function for each matched element.
 *
 * Examples:
 *
 *     els.forEach(function(el) {
 *       console.log($(el.text()));
 *     });
 *
 * @param {Function} fn Function to execute for each element.
 * @param {Object} [scope] Object to use as `this` when executing `fn`.
 * @return {Collection} The wrapped root element.
 * @api public
 */
Collection.prototype.each =
Collection.prototype.forEach = function(fn, scope) {
  for (var i = 0, len = this.length; i < len; i++) {
    fn.call(scope, this[i], i, this);
  }
  return this;
};

/**
 * Tests whether all elements in the set pass the test implemented by the
 * provided function.
 *
 * Examples:
 *
 *     els.every(function(el) {
 *       return el.name() == 'foo';
 *     });
 * 
 * @param {Function} fn Function to test for each element.
 * @param {Object} [scope] Object to use as `this` when executing `fn`.
 * @return {Boolean} `true` if all elements pass, otherwise `false`.
 * @api public
 */
Collection.prototype.every = function(fn, scope) {
  var rv;
  for (var i = 0, len = this.length; i < len; i++) {
    rv = fn.call(scope, this[i], i, this);
    if (!rv) { return false; }
  }
  return true;
};

/**
 * Tests whether some elements in the set pass the test implemented by the
 * provided function.
 *
 * Examples:
 *
 *     els.some(function(el) {
 *       return el.name() == 'foo';
 *     });
 *
 * @param {Function} fn Function to test for each element.
 * @param {Object} [scope] Object to use as `this` when executing `fn`.
 * @return {Boolean} `true` if all elements pass, otherwise `false`.
 * @api public
 */
Collection.prototype.some = function(fn, scope) {
  var rv;
  for (var i = 0, len = this.length; i < len; i++) {
    rv = fn.call(scope, this[i], i, this);
    if (rv) { return false; }
  }
  return false;
};

/**
 * Iterate over a set, creating a new array with the results of executing a
 * function for each matched element.
 *
 * Examples:
 *
 *     els.map(function(el) {
 *       return $(el.text());
 *     });
 *
 * @param {Function} fn Function that produces an item in the new array from an
 *                      element in the set.
 * @param {Object} [scope] Object to use as `this` when executing `fn`.
 * @return {Array} The mapped array.
 * @api public
 */
Collection.prototype.map = function(fn, scope, filter) {
  var m = [], n;
  for (var i = 0, len = this.length; i < len; i++) {
    n = fn.call(scope, this[i], i, this);
    if (n || n === false || !filter) { m.push(n); }
  }
  return m;
};

/**
 * Get the wrapped root element of the first element in the set of matched
 * elements.
 *
 * Examples:
 *
 *     var root = grandchild.root()
 *       , xml = root.toString();
 *
 * @return {Collection} The wrapped root element.
 * @api public
 */
Collection.prototype.root =
Collection.prototype.tree = function() {
  return wrap((this[0] ? this[0].ownerDocument : []));
};

/**
 * Get the parent of each element in the current set of matched elements,
 * optionally filtered by a name and namespace.
 *
 * Note that this will only select from immediate parents of elements in
 * the set.  It will not traverse multiple levels up; to do that, you must
 * chain calls to this function.
 *
 * Examples:
 *
 *     var p = el.parent();
 *
 *     var p = el.parent('foo');
 *
 *     var p = el.parent('foo', 'urn:example:foo');
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped parent element (or elements).
 * @api public
 */
Collection.prototype.up =
Collection.prototype.parent = function(name, ns) {
  return this._related('parentNode', name, ns, 1);
};

/**
 * Get the children of each element in the set of matched elements, optionally
 * filtered by a name and namespace.
 *
 * Note that this will only select from immediate children of elements in
 * the set.  It will not traverse multiple levels down; to do that, you must
 * chain calls to this function.
 *
 * Examples:
 *
 *     var c = el.children();
 *
 *     var c = el.children('foo');
 *
 *     var c = el.children('foo', 'urn:example:foo');
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped children elements.
 * @api public
 */
Collection.prototype.children = function(name, ns) {
  var arr = [];
  this.forEach(function(n) {
    for (var c = n.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1 && (!name || name === c.localName) && (!ns || ns === c.namespaceURI)) {
        arr.push(c);
      }
    }
  });
  return wrap(arr);
};

/**
 * Get the siblings of each element in the set of matched elements, optionally
 * filtered by a name and namespace.
 *
 * Examples:
 *
 *     var c = el.siblings();
 *
 *     var c = el.siblings('foo');
 *
 *     var c = el.siblings('foo', 'urn:example:foo');
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped sibling elements.
 * @api public
 */
Collection.prototype.siblings = function(name, ns) {
  var arr = [];
  this.forEach(function(n) {
    var it = n;
    for (n = n.parentNode.firstChild ; n; n = n.nextSibling) {
      if (n.nodeType === 1 && (!name || name === n.localName) && (!ns || ns === n.namespaceURI) && n !== it) {
        arr.push(n);
      }
    }
  });
  return wrap(arr);
};

/**
 * Get the wrapped element at position `i` in the set of matched elements.
 *
 * Examples:
 *
 *     var el = els.at(2);
 *
 * @param {String} i Index of element.
 * @return {Collection} The wrapped element.
 * @api public
 */
Collection.prototype.at = function(i) {
  return wrap(this[i]);
};

/**
 * Reduce the set of matched elements to the first in the set, optionally
 * filtered by a name and namespace.
 *
 * Examples:
 *
 *     var children = el.children();
 *
 *     for (var child = children.first(); child.length > 0; child = child.next()) {
 *       // process all child elements
 *     }
 *
 *     for (var child = children.first('foo'); child.length > 0; child = child.next('foo')) {
 *       // process <foo/> child elements
 *     }
 *
 *     for (var child = children.first('foo', 'urn:example:foo'); child.length > 0; child = child.next('foo', 'urn:example:foo')) {
 *       // process <foo xmlns="urn:example:foo"/> child elements
 *     }
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped first element.
 * @api public
 */
Collection.prototype.first = function(name, ns) {
  var n;
  for (var i = 0, len = this.length; i < len; ++i) {
    n = this[i];
    if ((!name || name === n.localName) && (!ns || ns === n.namespaceURI)) { return wrap(n); }
  }
  return wrap([]);
};

/**
 * Reduce the set of matched elements to the final one in the set, optionally
 * filtered by name and namespace.
 *
 * Examples:
 *
 *     var children = el.children();
 *
 *     for (var child = children.last(); child.length > 0; child = child.prev()) {
 *       // process all child elements in reverse
 *     }
 *
 *     for (var child = children.last('foo'); child.length > 0; child = child.prev('foo')) {
 *       // process <foo/> child elements in reverse
 *     }
 *
 *     for (var child = children.last('foo', 'urn:example:foo'); child.length > 0; child = child.prev('foo', 'urn:example:foo')) {
 *       // process <foo xmlns="urn:example:foo"/> child elements in reverse
 *     }
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped last element.
 * @api public
 */
Collection.prototype.last = function(name, ns) {
  var n;
  for (var i = this.length - 1; i > 0; --i) {
    n = this[i];
    if ((!name || name === n.localName) && (!ns || ns === n.namespaceURI)) { return wrap(n); }
  }
  return wrap([]);
};

/**
 * Get the immediately following sibling of each element in the set of matched
 * elements, optionally filtered by name and namespace.
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped next element (or elements).
 * @api public
 */
Collection.prototype.next = function(name, ns) {
  return this._related('nextSibling', name, ns);
};

/**
 * Get the immediately preceding sibling of each element in the set of matched
 * elements, optionally filtered by name and namespace.
 *
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @return {Collection} The wrapped next element (or elements).
 * @api public
 */
Collection.prototype.prev =
Collection.prototype.previous = function(name, ns) {
  return this._related('previousSibling', name, ns);
};

/**
 * Traverse a relation between elements, up to an optional limit and optionally
 * filtered by name and namespace.
 *
 * @param {String} rel Element relation.
 * @param {String} [name] XML element name.
 * @param {String} [ns] XML namespace in which element resides.
 * @param {Number} [limit] Maximum times the relation will be followed.
 * @return {Collection} The wrapped next element (or elements).
 * @api private
 */
Collection.prototype._related = function(rel, name, ns, limit) {
  limit = (limit !== undefined ? limit : Number.MAX_VALUE);
  return wrap(this.map(function(n) {
    var i = 0;
    n = n[rel];
    while (n && (n.nodeType !== 1 || (name && name !== n.localName) || (ns && ns !== n.namespaceURI)) && ++i < limit) {
      n = n[rel];
    }
    return (i < limit ? n : null);
  }, null, true));
};

/**
 * Test if the element has name, optionally within XML namspace.
 *
 * Examples:
 *
 *     var ok = el.is('foo');
 *
 *     var ok = el.is('foo', 'urn:example:foo');
 *
 * @param {String} name Element name to test for.
 * @param {String} [ns] XML namespace to test for.
 * @return {Boolean} `true` if test passes, otherwise `false`.
 * @api public
 */
Collection.prototype.is = function(name, ns) {
  return (name == this.name() && (!ns || ns === this.ns()));
};

/**
 * Returns XML element name of the first element in the set of matched elements.
 *
 * Examples:
 *
 *     var n = el.name();
 *
 * @return {String} XML element name.
 * @api public
 */
Collection.prototype.name = function() {
  return (this[0] ? this[0].localName : null);
};

/**
 * Returns XML namespace in which the first element in the set of matched
 * elements resides.
 *
 * Examples:
 *
 *     var ns = el.ns();
 *
 * @return {String} XML namespace.
 * @api public
 */
Collection.prototype.ns =
Collection.prototype.namespace = function() {
  return (this[0] ? this[0].namespaceURI : null);
};

/**
 * Get the value of an attribute for the first element in the set of matched
 * elements or set one or more attributes for every matched element.
 *
 * Examples:
 *
 *     var a = el.attr('foo');
 *
 *     el.attr('bar', 'baz');
 *
 *     el.attr({ bar: 'baz', qux: 'garply' });
 *
 * @param {String|Object} name Name of attribute or hash of keys and values.
 * @param {String} [val] Value to which attribute will be set.
 * @return {String|Collection} The value of attribute or `this` for chaining.
 * @api public
 */
Collection.prototype.attr = 
Collection.prototype.attrs = function(name, val) {
  if (val || typeof name == 'object') {
    var attrs = {};
    if (val) { attrs[name] = val; }
    else { attrs = name; }
    return this.forEach(function(n) {
      for (var name in attrs) {
        n && n.setAttribute(name, attrs[name]);
      }
    });
  }
  return (this[0] ? this[0].getAttribute(name) || null : null);
};

/**
 * Get the value of a namespaced attribute for the first element in the set of
 * matched elements or set the namespaced attributes for every matched element.
 *
 * Examples:
 *
 *     var a = el.attrNS('foo', 'urn:example:foo');
 *
 *     el.attr('bar', 'urn:example:foo', 'baz');
 *
 * @param {String} name Name of attribute.
 * @param {String} ns Namespace of attribute.
 * @param {String} [val] Value to which attribute will be set.
 * @return {String|Collection} The value of attribute or `this` for chaining.
 * @api public
 */
Collection.prototype.attrNS = function(name, ns, val) {
  if (val) {
    return this.forEach(function(n) {
      n && n.setAttributeNS(ns, name, val);
    });
  }
  return (this[0] ? this[0].getAttributeNS(ns, name) || null : null);
};

/**
 * Get the text contents for the first element in the set of matched elements or
 * set the text contents of the matched elements.
 *
 * Examples:
 *
 *     var t = el.text();
 *
 *     el.text('foo');
 *
 * @param {String} [val] Value to which text content will be set.
 * @return {String|Collection} The text content or `this` for chaining.
 * @api public
 */
Collection.prototype.t = 
Collection.prototype.text = function(val) {
  if (val) {
    return this.empty().forEach(function(n) {
      var doc = n.ownerDocument
        , c = doc.createTextNode(val);
      n.appendChild(c);
    });
  }
  return (this[0] ? this[0].textContent || null : null);
};

Collection.prototype.c = function(name, attrs, text) {
  var self = this;
  var arr = this.map(function(n) {
    var el = self._build(name, attrs);
    if (!el) { return; }
    if (text) {
      var doc = n.ownerDocument
        , txt = doc.createTextNode(text);
      el.appendChild(txt);
    }
    n.appendChild(el);
    return el;
  });
  return wrap(arr);
}

Collection.prototype._build = function(name, ns, attrs) {
  if (!this[0]) { return null; }
  if ('object' == typeof ns) {
    attrs = ns;
    ns = undefined;
  }
  attrs = attrs || {};

  if (attrs.xmlns) {
    ns = attrs.xmlns;
    delete attrs.xmlns;
  }
  
  var doc = this[0].ownerDocument
    , el;
  if (ns) {
    el = doc.createElementNS(ns, name);
    // FIXME: Hack to force xmldom to serialize the namespace.
    el.setAttribute('xmlns', ns);
  } else {
    el = doc.createElement(name);
  }
  for (var name in attrs) {
    el.setAttribute(name, attrs[name]);
  }
  return el;
};

/**
 * Remove all child nodes of the set of matched elements.
 *
 * Examples:
 *
 *     el.empty();
 *
 * @return {Collection} `this` for chaining.
 * @api public
 */
Collection.prototype.empty = function() {
  return this.forEach(function(n) {
    while (n.firstChild) {
      n.removeChild(n.firstChild);
    }
  });
};

/**
 * Returns serialized XML of the first element in the set of matched elements.
 *
 * Examples:
 *
 *     var xml = el.toString();
 *
 * @return {String} Serialized XML.
 * @api public
 */
Collection.prototype.toString = function() {
  return (this[0] ? new XMLSerializer().serializeToString(this[0]) : null);
};


/**
 * Expose `Collection`.
 */
exports = module.exports = Collection;

/**
 * Export functions.
 */
exports.wrap = wrap;

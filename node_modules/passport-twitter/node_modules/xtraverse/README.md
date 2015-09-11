# xtraverse

Simplified traversal and building of an XML DOM.

This module provides a [jQuery](http://jquery.com/)-like wrapper, but geared for
traversing and manipulating an XML DOM, as opposeed to an HTML DOM.  The API
aims to be compatible with [Strophe.js](https://github.com/strophe/strophejs)'
`Builder` and [Less-Than XML](https://github.com/astro/ltx).  The underlying DOM
is W3C standard, provided by [XMLDOM](https://github.com/jindw/xmldom).

## Install

    $ npm install xtraverse

## Usage

#### Parse XML

```javascript
var xml = fs.readFileSync('feed.xml', 'utf8');
var feed = XT(xml);
```

#### Traverse XML

```javascript
console.log(feed.children('title').text());
for (var link = feed.children().first('link'); link.length > 0; link = link.next('link')) {
  console.log(link.attr('href'));
}
for (var entry = feed.children().first('entry'); entry.length > 0; entry = entry.next('entry')) {
  console.log('Entry: ' + entry.children('title').text());
}
```

#### Build XML

```javascript
var feed = XT('<feed xmlns="http://www.w3.org/2005/Atom"/>')
  .c('title').t('Example Feed').up()
  .c('link', { href: 'http://example.org/' })
  .c('entry').c('title').t('Atom-Powered Robots Run Amok').up().up()
  .c('entry').c('title').t('Today I Ate Pancakes');
```

## Tests

    $ npm install
    $ npm test

## Status

[![Build Status](https://secure.travis-ci.org/jaredhanson/node-xtraverse.png)](http://travis-ci.org/jaredhanson/node-xtraverse)
[![David DM](https://david-dm.org/jaredhanson/node-xtraverse.png)](http://david-dm.org/jaredhanson/node-xtraverse)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

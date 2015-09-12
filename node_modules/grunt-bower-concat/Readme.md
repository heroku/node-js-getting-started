# Bower components builder for Grunt

[![Build Status](https://travis-ci.org/sapegin/grunt-bower-concat.png)](https://travis-ci.org/sapegin/grunt-bower-concat)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Automatic concatenation of installed [Bower](https://github.com/twitter/bower) components in right order.


## Installation

This plugin requires Grunt 0.4.

```
$ npm install grunt-bower-concat --save-dev
```


## Configuration

Add somewhere in your `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-bower-concat');
```

Inside your `Gruntfile.js` file add a section named `bower_concat`. See Parameters section below for details.


### Parameters

#### dest

Type: `String`, optional (at least one of [`dest`, `cssDest`] must exist).

Name of JS file where result of concatenation will be saved.

#### cssDest

Type: `String`, optional (at least one of [`dest`, `cssDest`] must exist).

Name of CSS file where result of concatenation will be saved.

#### exclude

Type: `String|Array`, optional.

List of components you want to exclude.

```js
exclude: [
	'jquery',
	'modernizr'
]
```

#### include

Type: `String|Array`, optional.

By default bower-concat will include all installed in project components. Using `include` option you can manually specify which components should be included.

```js
include: [
	'underscore',
	'backbone'
]
```

#### dependencies

Type: `Object`, optional.

Unfortunately not all Bower components list their dependencies. If components concatenate in the wrong order, use this option to manually specify dependencies for those components.

```js
dependencies: {
  'underscore': 'jquery',
  'mygallery': ['jquery', 'fotorama']
}
```

#### mainFiles

Type: `Object`, optional.

Some Bower components don’t list their main files or (more likely) don’t have `bower.json` file at all. In this case `bower-concat` will try to guess main file but sometimes it can’t or choose wrong one. You could explicitly define main files for that components.

```js
mainFiles: {
  'svg.js': 'dist/svg.js',
  'mygallery': ['src/base.js', 'src/gallery.js', 'src/style.css']
}
```

#### callback

Type: `Function`, optional.

This function will be called for every Bower component and allows you to change main files chosen by `bower-concat`.

```js
callback: function(mainFiles, component) {
  return _.map(mainFiles, function(filepath) {
  	// Use minified files if available
    var min = filepath.replace(/\.js$/, '.min.js');
    return grunt.file.exists(min) ? min : filepath;
  });
}
```

#### bowerOptions

Type: `Object`, optional.

Bower specific options that will be passed in during the `bower.commands` calls.

```js
bowerOptions: {
  relative: false
}
```


### Config Example

``` javascript
bower_concat: {
  all: {
    dest: 'build/_bower.js',
	cssDest: 'build/_bower.css',
    exclude: [
    	'jquery',
    	'modernizr'
    ],
    dependencies: {
      'underscore': 'jquery',
      'backbone': 'underscore',
      'jquery-mousewheel': 'jquery'
    },
    bowerOptions: {
      relative: false
    }
  }
}
```

## Changelog

The changelog can be found in the Changelog.md file.

---

## License

The MIT License, see the included `License.md` file.

# underscore-express

Use Underscore templates easily in Express.

## Install

This package is registered in npm as `underscore-express`, so a simple...

```bash
npm install underscore-express
```

...will do it.

## Usage

In your Express app setup...

```js
// To use the default 'tmpl' extension...
require('underscore-express')(app);
// Or set your own...
require('underscore-express')(app, 'ut');
```

...and that's it!

## Including Subtemplates

`underscore-express` comes with a baked in include method. Here's an example...

**views/header.tmpl**
```tmpl
<html>

  <head>
    <title>Header!</title>
  </head>

  <body>
```

**views/footer.tmpl**
```tmpl
  </body>
</html>
```

**views/index.tmpl**
```tmpl
<%= include('header') %>
    Welcome to my homepage!
<%= include('footer') %>
```

**app.js**
```js
res.render('index');
```

**RESULT**
```html
<html>

  <head>
    <title>Header!</title>
  </head>

  <body>
    Welcome to my homepage!
  </body>
</html>
```

`include` is relative to the file it is called from. Feel free to use relative paths like `../../some/other/subtemplate`.

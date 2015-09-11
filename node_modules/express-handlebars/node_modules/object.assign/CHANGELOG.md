1.0.3 / 2014-11-29
==================
  * Revert "optimize --production installs"

1.0.2 / 2014-11-27
==================
  * Update `jscs`, `is`, `object-keys`, `tape`
  * Add badges to README
  * Name URLs in README
  * Lock `covert` to `v1.0.0`
  * Optimize --production installs

1.0.1 / 2014-08-26
==================
  * Update `is`, `covert`

1.0.0 / 2014-08-07
==================
  * Update `object-keys`, `tape`

0.5.0 / 2014-07-31
==================
  * Object.assign no longer throws on null or undefined sources, per https://bugs.ecmascript.org/show_bug.cgi?id=3096

0.4.3 / 2014-07-30
==================
  * Don’t modify vars in the function signature, since it deoptimizes v8

0.4.2 / 2014-07-30
==================
  * Fixing the version number: v0.4.2

0.4.1 / 2014-07-19
==================
  * Revert "Use the native Object.keys if it’s available."

0.4.0 / 2014-07-19
==================
  * Use the native Object.keys if it’s available.
  * Fixes [#2](https://github.com/ljharb/object.assign/issues/2).
  * Adding failing tests for [#2](https://github.com/ljharb/object.assign/issues/2).
  * Fix indentation.
  * Adding `npm run lint`
  * Update `tape`, `covert`
  * README: Use SVG badge for Travis [#1](https://github.com/ljharb/object.assign/issues/1) from mathiasbynens/patch-1

0.3.1 / 2014-04-10
==================
  * Object.assign does partially modify objects if it throws, per https://twitter.com/awbjs/status/454320863093862400

0.3.0 / 2014-04-10
==================
  * Update with newest ES6 behavior - Object.assign now takes a variable number of source objects.
  * Update `tape`
  * Make sure old and unstable nodes don’t fail Travis

0.2.1 / 2014-03-16
==================
  * Let object-keys handle the fallback
  * Update dependency badges
  * Adding bower.json

0.2.0 / 2014-03-16
==================
  * Use a for loop, because ES3 browsers don’t have "reduce"

0.1.1 / 2014-03-14
==================
  * Updating readme

0.1.0 / 2014-03-14
==================
  * Initial release.


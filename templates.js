var fs = require('fs');
var Handlebars = require('handlebars');
require('./helpers');

var templates = {};

module.exports = {
    get: function(name) {
        if ( !templates[name] ) {
            templates[name] = Handlebars.compile(fs.readFileSync('./templates/' + name + '.hbs', "utf8"))
        }
        return templates[name];
    }
};
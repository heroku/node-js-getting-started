var Handlebars = require('handlebars');
var accounting = require('accounting');
var _ = require('underscore');
var moment = require('moment');

var DATE_FORMAT = "MMM D, 'YY";

var formatNumber = function(val, precision) {
    if (_.isNumber(val) ) {
        if (!_.isNumber(precision) ) {
            precision = 0;
        }
        return accounting.formatNumber(val, precision);
    }
}

Handlebars.registerHelper('formatNumber', formatNumber);

Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


Handlebars.registerHelper('formatPercent', function(val, precision) {
    if ( val <= 1 ) {
        val = val * 100;
    }
    return formatNumber(val, precision) + '%';
});

Handlebars.registerHelper('toJSON', function(obj) {
    return obj ? new Handlebars.SafeString(JSON.stringify(obj)) : null;
});

Handlebars.registerHelper('formatMinutes', function(val, includeSeconds) {
    if (_.isString(val) ) {
        var array = val.split(":");
        if ( array && array.length == 2 ) {
            var minutes = array[0];
            var seconds = array[1];
            if (includeSeconds === true) {
                return val;
            } else {
                return minutes;
            }
        }
    }
});

Handlebars.registerHelper('formatDate', function(date, format) {
    if (typeof date == "string" || _.isNumber(date) || _.isDate(date)) {
        if (!format || !_.isString(format)) {
            format = DATE_FORMAT;
        }
        return moment.utc(date).format(format);
    }
    return '';
});

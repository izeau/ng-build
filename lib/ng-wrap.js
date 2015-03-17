'use strict';

var through  = require('through2');
var template = require('lodash.template');
var fs       = require('fs');
var File     = require('vinyl');
var extend   = require('xtend');
var utils    = {};

module.exports = ngWrap;

function ngWrap() {
    return through.obj(_ngWrap);

    function _ngWrap(module, enc, done) {
        fs.readFile(__dirname + '/../tpl/module.template.js', render);

        function render(err, str) {
            if (err) {
                throw err;
            }

            var out = template(str)(extend(module, { $: utils }));

            done(null, new File({
                path: module.name + '.js',
                contents: new Buffer(out)
            }));
        }
    }
}

utils.json = function json(obj) {
    return JSON.stringify(obj, true, 4);
};

utils.trim = function trim(str) {
    return String(str).trim();
};

'use strict';

var through   = require('through2');
var extend    = require('xtend');
var path      = require('path');
var camelCase = require('camel-case');

module.exports = ngTemplate;

function ngTemplate() {
    return through.obj(_ngTemplate);

    function _ngTemplate(file, enc, done) {
        var dirname   = path.dirname(path.relative(file.base, file.path));
        var extension = path.extname(file.path);
        var basename  = path.basename(file.path, extension);
        var type      = path.extname(basename).slice(1);
        var canonical = getCanonicalName(basename, type);

        file.data = extend(file.data, {
            dirname: dirname,
            name: canonical,
            contents: file.contents.toString()
        });

        done(null, file);
    }
}

function getCanonicalName(basename, type) {
    return camelCase(basename.slice(0, -(type.length + 1)));
}

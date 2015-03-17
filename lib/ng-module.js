'use strict';

var camelCase = require('camel-case');
var extend    = require('xtend');
var path      = require('path');
var through   = require('through2');

module.exports = ngModule;

function ngModule(opts) {
    return through.obj(_ngModule);

    function _ngModule(file, enc, done) {
        var dirname    = path.dirname(path.relative(file.base, file.path));
        var moduleName = dirname.split(path.sep).map(camelCase).join('.');
        var defaults   = {
            dirname: dirname,
            name: moduleName,
            providers: [],
            blocks: [],
            prefix: null,
            requires: [],
            templates: []
        };

        var module = extend(defaults, opts, JSON.parse(file.contents));

        if (module.prefix) {
            module.name = module.prefix + '.' + module.name;
        }

        file.data = extend(file.data, module);

        done(null, file);
    }
}

'use strict';

var sass      = require('node-sass');
var through   = require('through2');
var path      = require('path');
var camelCase = require('camel-case');
var extend    = require('xtend');

module.exports = ngStyle;

function ngStyle(opts) {
    return through.obj(_ngStyle);

    function _ngStyle(file, enc, done) {
        var dirname    = path.dirname(file.path);
        var json       = require(path.join(dirname, 'module.json'));
        var reldirname = path.dirname(path.relative(file.base, file.path));
        var paths      = [dirname, file.base];
            paths      = opts.includePaths ? paths.concat(opts.includePaths) : paths;
        var module     = extend(opts, {
            name: reldirname.split(path.sep).map(camelCase).join('.'),
            imagePath: '/img'
        }, json);

        if (module.prefix) {
            module.name = module.prefix + '.' + module.name;
        }

        sass.render({
            data: file.contents.toString(),
            success: success,
            error: error,
            includePaths: paths,
            imagePath: module.imagePath,
            // outputStyle: 'compressed'
        });

        function success(results) {
            file.path     = file.base + module.name + '.css';
            file.contents = new Buffer(results.css);

            done(null, file);
        }

        function error(error) {
            done(error.message + dirname, null);
        }
    }
}

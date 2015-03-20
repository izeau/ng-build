'use strict';

var through   = require('through2');
var extend    = require('xtend');
var path      = require('path');
var camelCase = require('camel-case');
var acorn     = require('acorn');

module.exports = ngProvider;

function ngProvider() {
    return through.obj(_ngProvider);

    function _ngProvider(file, enc, done) {
        var dirname   = path.dirname(path.relative(file.base, file.path));
        var extension = path.extname(file.path);
        var basename  = path.basename(file.path, extension);
        var env       = basename.split('@', 2)[1];
        var type      = path.extname(basename).slice(1);

        if (env && ['config', 'constant'].indexOf(type) >= 0) {
            if (env.slice(0, -(type.length + 1)) !== process.env.ENV) {
                return done();
            }

            basename  = basename.slice(0, -(env.length + 1)) + '.' + type;
        }

        var canonical = getCanonicalName(basename, type);
        var name      = canonical;
        var contents  = file.contents.toString();
        var ast;

        try {
            ast = acorn.parseExpressionAt(contents, 0);
        } catch (e) {
            ast = {};
        }

        if (ast.type === 'FunctionExpression') {
            if (ast.id) {
                name = ast.id.name;
            } else {
                file.contents = new Buffer([
                    contents.slice(ast.start, 'function'.length),
                    ' ' + canonical,
                    contents.slice(ast.start + 'function'.length)
                ].join(''));
            }
        }

        if (!file.contents.length) {
            return done();
        }

        file.data = extend(file.data, {
            path: file.path,
            extension: extension,
            dirname: dirname,
            name: name,
            type: type,
            contents: file.contents.toString()
        });

        done(null, file);
    }
}

function getCanonicalName(basename, type) {
    var name = camelCase(basename.slice(0, -(type.length + 1)));

    switch (type) {
        case 'controller':
            return name.charAt(0).toUpperCase() + name.slice(1) + 'Controller';

        case 'provider':
            return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return name;
}

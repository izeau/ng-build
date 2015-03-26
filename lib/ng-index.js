'use strict';

var through  = require('through2');
var template = require('lodash.template');
var path     = require('path');
var fs       = require('fs');
var File     = require('vinyl');

module.exports = ngIndex;

function ngIndex(opts) {
    if (typeof opts === 'string') {
        opts = { main: opts };
    }

    var tplData = {
        main: opts.main,
        base: opts.base,
        scripts: [],
        styles: []
    };

    return through.obj(ngIndexTransform, ngIndexFlush);

    function ngIndexTransform(file, enc, done) {
        var relative    = path.relative(file.base, file.path);
        var correctPath = relative.split(path.sep).join('/');

        switch (path.extname(file.path)) {
            case '.js':
                tplData.scripts.push(correctPath);
                break;

            case '.css':
                tplData.styles.push(correctPath);
                break;
        }

        done();
    }

    function ngIndexFlush(done) {
        /* jshint validthis: true */
        var stream = this;

        fs.readFile(__dirname + '/../tpl/index.template.html', render);

        function render(err, str) {
            if (err) {
                throw err;
            }

            stream.push(new File({
                path: 'index.html',
                contents: new Buffer(template(str)(tplData))
            }));
            done();
        }
    }
}

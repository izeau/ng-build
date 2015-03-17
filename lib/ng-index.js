'use strict';

var through  = require('through2');
var template = require('lodash.template');
var path     = require('path');
var fs       = require('fs');
var File     = require('vinyl');

module.exports = ngIndex;

function ngIndex(main) {
    var tplData = {
        main: main,
        scripts: [],
        styles: []
    };

    return through.obj(ngIndexTransform, ngIndexFlush);

    function ngIndexTransform(file, enc, done) {
        var relative = path.relative(file.base, file.path);

        switch (path.extname(file.path)) {
            case '.js':
                tplData.scripts.push(relative);
                break;

            case '.css':
                tplData.styles.push(relative);
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

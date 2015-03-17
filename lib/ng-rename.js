'use strict';

var through = require('through2');

module.exports = ngRename;

function ngRename() {
    return through.obj(_ngRename);

    function _ngRename(file, enc, done) {
        file.path = file.base + file.data.module.name + '.js';
        done(null, file);
    }
}

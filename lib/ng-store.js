'use strict';

var through = require('through2');
var stream  = require('stream');

module.exports = new NgStore();

function NgStore() {
    this.store = {};
}

NgStore.prototype.register =
function register(type) {
    if (!this.store[type]) {
        this.store[type] = [];
    }

    var store = this.store[type];

    return through.obj(_register);

    function _register(file, enc, done) {
        store.push(file.data);
        done(null, file);
    }
};

NgStore.prototype.stream =
function toStream() {
    var storeStream = new stream.Readable({ objectMode: true });

    storeStream._read = Function.prototype;
    storeStream.push(this.store);
    storeStream.push(null);

    return storeStream;
};

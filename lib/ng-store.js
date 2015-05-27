'use strict';

var through = require('through2');
var stream  = require('stream');
var File    = require('vinyl');

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

        var uniqueId = file.data.dirname + '.' + file.data.name;
        if (!store[uniqueId]) {
            store[uniqueId] = file.data;
        }

        //Override if more specific
        if (store[uniqueId].path && store[uniqueId].path.length < file.data.path.length) {
            store[uniqueId] = file.data;
        }

        return done(null, file);
    }
};

NgStore.prototype.stream =
function toStream() {
    var storeStream = new stream.Readable({ objectMode: true });
    var store       = this.store;
    var contents    = {};
    var type;

    for (type in store) {
        contents[type] = Object.keys(store[type]).map(function(path) {
            return store[type][path];
        });
    }

    storeStream._read = Function.prototype;
    storeStream.push(new File({
        contents: new Buffer(JSON.stringify(contents))
    }));
    storeStream.push(null);

    return storeStream;
};

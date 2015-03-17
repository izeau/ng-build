'use strict';

var through  = require('through2');
var jshint   = require('jshint').JSHINT;
var Finder   = require('rcfinder');
var extend   = require('xtend');
var path     = require('path');
var reporter = require('jshint/src/reporters/default').reporter;
var finder   = new Finder('.jshintrc');

module.exports = ngLint;

function ngLint() {
    return through.obj(_ngLint);

    function _ngLint(module, enc, done) {
        /* jshint validthis: true */
        var stream  = this;

        Array.prototype.concat(module.blocks, module.providers)
            .filter(isLintable)
            .forEach(findConfiguration);

        done();

        function isLintable(file) {
            return file.extension === '.js';
        }

        function findConfiguration(file) {

// We use the synchronous version because jshint is a singleton and if two files
// are linted at the exact same time then there's no way for us to tell if an
// error happened and in what file. Linting is just a Gulp task so at the end of
// the day it doesn't even matter.

            var opts = finder.find(path.dirname(file.path));

// We change the contents before linting to add a simple return statement. This
// fixes these JSHint false positives:
//
//   * W025 (Missing name in function declaration.)
//   * W098 ('{a}' is defined but never used.)
//
// We could have whitelisted these warnings, but they can be relevant elsewhere
// in the codebase and we just need JSHint to understand our awesome build
// system.

            var str     = "return " + file.contents.toString() + ";";
            var globals = opts.globals;
            var clean   = jshint(str, opts, globals);
            var data    = extend(jshint.data(), {
                file: file.path
            });

            if (!clean) {
                stream.push({
                    opt: opts,
                    data: data,
                    errors: data.errors.map(function(error) {
                        return {
                            file: file.path,
                            error: error
                        };
                    }),
                });
            }
        }
    }
}

ngLint.reporter =
function NgLintReporter() {
    return through.obj(_NgLintReporter);

    function _NgLintReporter(report, enc, done) {
        reporter(report.errors, [report.data], report.opt);
        done(null);
    }
};

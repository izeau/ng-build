'use strict';

var through   = require('through2');
var camelCase = require('camel-case');
var path      = require('path');

module.exports = ngWire;

function ngWire() {
    return through.obj(_ngWire);

    function _ngWire(store, enc, done) {
        /* jshint validthis: true */
        var stream = this;
        var module;

        store.templates.forEach(function(template) {
            module = findModule(store.modules, template);

            if (module) {
                module.templates.push(template);
            }

            template.name = Array.prototype.concat(
                module.name,
                path
                    .relative(module.dirname, template.dirname)
                    .split(path.sep)
                    .map(camelCase),
                template.name
            ).filter(Boolean).join('.');
        });

        store.blocks.forEach(function(block) {
            module = findModule(store.modules, block);

            if (module) {
                module.blocks.push(block);
            }
        });

        store.providers.forEach(function(provider) {
            module = findModule(store.modules, provider);

            if (!module) {
                return;
            }

            provider.name = camelCase(module.name + '.' + provider.name);

            if (provider.type === 'controller') {
                provider.name = [
                    provider.name.charAt(0).toUpperCase(),
                    provider.name.slice(1)
                ].join('');
            }

            module.providers.push(provider);
        });

        store.modules.forEach(function(module) {
            stream.push(module);
        });

        done();
    }
}

function findModule(modules, object) {
    var i, module;
    var candidate;

    for (i = 0; (module = modules[i]); i = i + 1) {
        if (object.dirname === module.dirname) {
            return module;
        }

        if (object.dirname.indexOf(module.dirname)) {
            continue;
        }

        if (!candidate || candidate.dirname.length < module.dirname.length) {
            candidate = module;
        }
    }

    return candidate;
}

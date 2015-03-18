var ngBlock = require('..').ngBlock;
var through = require('through2');
var gulp    = require('gulp');
var expect  = require('chai').expect;

describe('ngBlock', function() {
    it('should retrieve a named block\'s name', function(done) {
        gulp.src(__dirname + '/fixtures/named.config.js')
            .pipe(ngBlock())
            .pipe(through.obj(function(file, enc, done) {
                expect(file.data.name).to.equal('override');
                expect(file.contents).to.match(/function override/);
                done();
            }))
            .on('finish', done);
    });

    it('should name an unnamed block based on its filename', function(done) {
        gulp.src(__dirname + '/fixtures/unnamed.config.js')
            .pipe(ngBlock())
            .pipe(through.obj(function(file, enc, done) {
                expect(file.data.name).to.equal('unnamed');
                expect(file.contents).to.match(/function unnamed/);
                done();
            }))
            .on('finish', done);
    });
});

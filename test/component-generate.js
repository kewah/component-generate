/*global describe, it, beforeEach, after */
var assert = require('chai').assert;
var fs = require('fs-extra');
var path = require('path');
var resolve = path.resolve;
var exec = require('child_process').exec;

var fixtureDir = resolve(__dirname, 'fixtures');
var tmpDir = resolve(__dirname, '../tmp');
var generate = resolve(__dirname, '../bin/component-generate');


describe('component generate', function() {
  beforeEach(function(done) {
    fs.copy(fixtureDir, tmpDir, done);
  });

  after(function(done) {
    fs.remove(tmpDir, done);
  });

  it('should complain about missing component.json', function(done) {
    fs.removeSync(resolve(tmpDir, 'component.json'));

    generateExec('index.js', function(err) {
      assert.match(err, /missing component.json/);
      done();
    });
  });

  it('should complain about missing template', function(done) {
    generateExec('foo.js -t bar', function(err) {
      assert.match(err, /the template "bar" doesn't exist/);
      done();
    });
  });

  it('should create a file', function(done) {
    generateExec('foo.js', function(err) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.include(component.scripts, 'foo.js');
        assert.isTrue(fileExists('foo.js'));
        done();
      });
    });
  });

  it('should create a file inside a folder', function(done) {
    generateExec('deep/path/index.html', function(err) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.include(component.templates, 'deep/path/index.html');
        assert.isTrue(fileExists('deep/path/index.html'));
        done();
      });
    });
  });

  it('should create a file based on a template using parameters', function(done) {
    generateExec('bar.js -t exports -p name:FooBar', function(err) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.include(component.scripts, 'bar.js');
        assert.isTrue(fileExists('bar.js'));

        var content = fs.readFileSync(resolve(tmpDir, 'bar.js'));
        assert.isTrue(content.toString() === '\'use strict\';\n\nmodule.exports = FooBar;\n\nfunction FooBar() {\n\n}');

        done();
      });
    });
  });
});


function generateExec(param, cb) {
  exec('cd ' + tmpDir + ' && ' + generate + ' ' + param, cb);
}

function readComponent(cb) {
  fs.readJson(resolve(tmpDir, 'component.json'), cb);
}

function fileExists(dep) {
  return fs.existsSync(resolve(tmpDir, dep));
}

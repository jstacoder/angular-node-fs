'use strict';

var app;

app = angular.module('node.fs.app', []);

app.service('nodeFs', [
  function() {
    return require('fs');
  }
]);

app.factory('ngStat', [
  'ngIfy', function(ngIfy) {
    return ngIfy('stat');
  }
]);

app.factory('ngReaddir', [
  'ngIfy', function(ngIfy) {
    return ngIfy('readdir');
  }
]);

app.factory('ngIfy', [
  'nodeFs', function(nodeFs) {
    return function(name) {
      return promisify(nodeFs[name]);
    };
  }
]);

app.factory('_isDir', [
  function() {
    return function(res) {
      return res.blksize === res.size;
    };
  }
]);

app.factory('_isFile', [
  function() {
    return function(res) {
      return res.blksize !== res.size;
    };
  }
]);

app.factory('isFileSync', [
  'nodeFs', '_isFile', function(nodeFs, _isFile) {
    return function(name) {
      return _isFile(nodeFs.statSync(name));
    };
  }
]);

app.factory('isFile', [
  'ngStat', '_isFile', function(ngStat, _isFile) {
    return function(name) {
      return ngStat(name).then(function(res) {
        var actualResult;
        return actualResult = _isFile(res);
      });
    };
  }
]);

app.factory('readFile', [
  '$q', 'nodeFs', 'ngIfy', function($q, nodeFs, ngIfy) {
    return ngIfy(nodeFs.readFile);
  }
]);

app.factory('writeFile', [
  '$q', 'nodeFs', function($q, nodeFs) {
    var def;
    def = $q.defer();
    return function(filename, data) {
      nodeFs.writeFile(filename, data, function(err, res) {
        if (err) {
          def.reject(err);
        } else {
          def.resolve(true);
        }
      });
      return def.promise;
    };
  }
]);

app.factory('isDirSync', [
  'nodeFs', '_isDir', function(nodeFs, _isDir) {
    return function(name) {
      return _isDir(nodeFs.statSync(name));
    };
  }
]);

app.factory('isDir', [
  'ngStat', function(ngStat) {
    return function(name) {
      return ngStat(name).then(function(res) {
        var actualResult;
        return actualResult = res.blksize === res.size;
      });
    };
  }
]);

app.factory('listDir', [
  'ngReaddir', function(ngReaddir) {
    return function(name) {
      return ngReaddir(name);
    };
  }
]);

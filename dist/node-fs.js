'use strict';
var app;

app = angular.module('node.fs.app', []);

app.service('nodeFs', [
  function() {
    return require('fs');
  }
]);

app.factory('ngIfy', [
  'nodeFs', function(nodeFs) {
    return function(name) {
      return promisify(nodeFs[name]);
    };
  }
]);

app.factory('ngStat', [
  'ngIfy', function(ngIfy) {
    return ngIfy('stat');
  }
]);

app.factory('ngStatSync', [
  'nodeFs', function(nodeFs) {
    return function(path) {
      return nodeFs.statSync(path);
    };
  }
]);

app.factory('ngReaddir', [
  'ngIfy', function(ngIfy) {
    return ngIfy('readdir');
  }
]);

app.factory('_isType', [
  'ngStatSync', function(ngStatSync) {
    var typeFuncs;
    typeFuncs = {
      "dir": "isDirectory",
      "file": "isFile"
    };
    return function(name, type) {
      return ngStatSync(name([typeFuncs([type])]))();
    };
  }
]);

app.factory('_isDir', [
  '_isType', function(_isType) {
    return function(path) {
      return _isType(path, 'dir');
    };
  }
]);

app.factory('_isFile', [
  '_isType', function(_isType) {
    return function(path) {
      return _isType(path, 'file');
    };
  }
]);

app.factory('isFileSync', [
  'nodeFs', '_isFile', function(nodeFs, _isFile) {
    return function(name) {
      return nodeFs.statSync(name).isFile();
    };
  }
]);

app.factory('isFile', [
  'ngStat', '_isFile', function(ngStat, _isFile) {
    return function(name) {
      return ngStat(name).then(function(res) {
        var actualResult;
        return actualResult = res.isFile();
      });
    };
  }
]);

app.factory('readFile', [
  '$q', 'nodeFs', function($q, nodeFs) {
    var def;
    def = $q.defer();
    return function(filename) {
      nodeFs.readFile(filename, function(err, res) {
        if (err) {
          def.reject(err);
        } else {
          def.resolve(res);
        }
      });
      return def.promise;
    };
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
      return nodeFs.statSync(name).isDirectory();
    };
  }
]);

app.factory('isDir', [
  'ngStat', '_isDir', function(ngStat, _isDir) {
    return function(name) {
      return ngStat(name).then(function(res) {
        var actualResult;
        return actualResult = res.isDirectory();
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

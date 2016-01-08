'use strict';

var app;

app = angular.module('node.fs.app', []);

app.constant('EQ', '===');

app.constant('NQ', '!==');

app.factory('getOperator', [
  'EQ', 'NQ', function(EQ, NQ) {
    var opLst;
    opLst = {
      "EQ": EQ,
      "NQ": NQ
    };
    return function(op) {
      return opLst[op];
    };
  }
]);

app.factory('produceResult', [
  'getOperator', function(getOperator) {
    return function(leftSide, rightSide, op) {
      return eval("" + leftSide + (getOperator(op)) + rightSide);
    };
  }
]);

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

app.factory('ngReaddir', [
  'ngIfy', function(ngIfy) {
    return ngIfy('readdir');
  }
]);

app.factory('_isType', [
  'produceResult', function(produceResult) {
    var typeOps;
    typeOps = {
      "dir": "EQ",
      "file": "NQ"
    };
    return function(leftSide, rightSide, type) {
      return produceResult(leftSide, rightSide, typeOps[type]);
    };
  }
]);

app.factory('_isDir', [
  '_isType', function(_isType) {
    return function(res) {
      return _isType(res.blksize, res.size, 'dir');
    };
  }
]);

app.factory('_isFile', [
  '_isType', function(_isType) {
    return function(res) {
      return _isType(res.blksize, res.size, 'file');
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
      return _isDir(nodeFs.statSync(name));
    };
  }
]);

app.factory('isDir', [
  'ngStat', '_isDir', function(ngStat, _isDir) {
    return function(name) {
      return ngStat(name).then(function(res) {
        var actualResult;
        return actualResult = _isDir(res);
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

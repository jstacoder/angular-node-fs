'use strict';

var app,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app = angular.module('node.fs.app', []);

app.factory('nodeFs', [
  function() {
    return require('fs');
  }
]);

app.factory('ngStat', [
  'nodeFs', function(nodeFs) {
    return promisify(nodeFs.stat);
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
  'nodeFs', function(nodeFs) {
    var promiseStat;
    promiseStat = promisify(nodeFs.stat);
    return function(name) {
      return promiseStat(name).then(function(res) {
        var actualResult;
        return actualResult = res.blksize === res.size;
      });
    };
  }
]);

app.service('listDirResult', [
  function() {
    var add, get, remove, results, rtn;
    results = [];
    add = function(itm) {
      var _ref;
      if (_ref = !itm, __indexOf.call(results, _ref) >= 0) {
        return results.push(itm);
      }
    };
    remove = function(itm) {
      var idx;
      idx = results.indexOf(itm);
      return results.splice(idx, 1);
    };
    get = function() {
      return results;
    };
    rtn = {
      add: add,
      remove: remove,
      get: get
    };
    return rtn;
  }
]);

app.factory('doListDir', [
  'nodeFs', 'listDirResult', function(nodeFs, listDirResult) {
    return function(name) {
      var func, ldr;
      ldr = listDirResult;
      func = promisify(nodeFs.readdir);
      return func(name).then(function(r) {
        var itm, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = r.length; _i < _len; _i++) {
          itm = r[_i];
          _results.push(ldr.add(itm));
        }
        return _results;
      });
    };
  }
]);

app.service('listDir', [
  '$q', 'nodeFs', 'isDir', function($q, nodeFs, isDir) {
    var def, listFunc, r, res, rtn;
    def = $q.defer();
    res = '';
    r = '';
    listFunc = function(name) {
      isDir(name).then(function(res) {
        var func;
        if (!res) {
          console.log("rejecting: " + res + "," + name);
          def.reject("" + name + " is a file");
        } else {
          func = promisify(nodeFs.readdir);
          func(name).then(function(r) {
            return def.resolve(r);
          });
        }
      });
      return def.promise;
    };
    rtn = {
      run: listFunc
    };
    return rtn;
  }
]);

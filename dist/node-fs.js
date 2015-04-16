'use strict';

var app;

app = angular.module('node.fs.app', []);

app.factory('nodeFs', [
  function() {
    return require('fs');
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

app.factory('isDir', [
  '$q', 'nodeFs', function($q, nodeFs) {
    var def;
    def = $q.defer();
    return function(name) {
      nodeFs.stat(name, function(err, res) {
        if (err) {
          def.reject(err);
        } else {
          def.resolve(res.blksize === res.size);
        }
      });
      return def.promise;
    };
  }
]);

app.factory('listDir', [
  '$q', 'nodeFs', 'isDir', function($q, nodeFs, isDir) {
    var def;
    def = $q.defer();
    return function(name) {
      isDir(name).then(function(res) {
        if (!res) {
          console.log("rejecting: " + res + "," + name);
          def.reject("" + name + " is a file");
        } else {
          nodeFs.readdir(name, function(err, res) {
            if (err) {
              console.log("rejected by: " + err);
              def.reject(err);
            } else {
              def.resolve(res);
            }
          });
        }
      });
      return def.promise;
    };
  }
]);

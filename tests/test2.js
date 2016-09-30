module.exports = function() {
  var $q, doDirTests, doFileTests, doListDirTests, doReadWriteTests, firstTestItem, fmtstr, fourthTestItem, i, isDir, isDirSync, isFile, isFileSync, itm, listDir, readFile, secondTestItem, testDirItem, testFileItem, testItem, testItems, thirdTestItem, writeFile, _i, _j, _k, _len, _len1, _len2, _ref;
  require('coffee-script/register');
  require('../dist/node-fs.js');
  fmtstr = require('../fstr.coffee');
  isDir = ng_load('isDir', ['node.fs.app']);
  isDirSync = ng_load('isDirSync');
  isFile = ng_load('isFile');
  isFileSync = ng_load('isFileSync');
  listDir = ng_load('listDir');
  readFile = ng_load('readFile');
  writeFile = ng_load('writeFile');
  $q = ng_load('$q');
  firstTestItem = './dist/node-fs.js';
  secondTestItem = './dist';
  thirdTestItem = './src';
  fourthTestItem = './src/node-fs.coffee';
  testItems = [];
  _ref = [firstTestItem, secondTestItem, thirdTestItem, fourthTestItem];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    i = _ref[_i];
    testItems.push(i);
  }
  console.log('Starting blocking tests\n');
  console.log('\ntesting isDirSync\n');
  testItem = function(func, itm) {
    return func(itm);
  };
  testDirItem = function(itm) {
    var result;
    result = testItem(isDirSync, itm);
    return "is " + itm + " a directory? ---> [" + result + "]";
  };
  for (_j = 0, _len1 = testItems.length; _j < _len1; _j++) {
    itm = testItems[_j];
    console.log(fmtstr(testDirItem(itm), "--", 60));
  }
  console.log("\ntesting isFileSync\n");
  testFileItem = function(itm) {
    var result;
    result = testItem(isFileSync, itm);
    return "is " + itm + " a file? ---> [" + result + "]";
  };
  for (_k = 0, _len2 = testItems.length; _k < _len2; _k++) {
    itm = testItems[_k];
    console.log(fmtstr(testFileItem(itm), "--", 60));
  }
  doDirTests = function() {
    var testDirItem2, _l, _len3, _results;
    testDirItem2 = function(itm) {
      return testItem(isDir, itm).then(function(res) {
        return "\nWe are testing if " + itm + " is a dir, is it? ---> [" + res + "]\n";
      });
    };
    _results = [];
    for (_l = 0, _len3 = testItems.length; _l < _len3; _l++) {
      itm = testItems[_l];
      _results.push(testDirItem2(itm).then(function(res) {
        return console.log(fmtstr(res, '--', 80));
      }, function(err) {
        return console.log("ERROR@!:", err);
      }));
    }
    return _results;
  };
  doFileTests = function() {
    var testFileItem2, _l, _len3, _results;
    testFileItem2 = function(itm) {
      return testItem(isFile, itm).then(function(res) {
        return "\nWe are testing if " + itm + " is a file, is it? ---> [" + res + "]\n";
      });
    };
    _results = [];
    for (_l = 0, _len3 = testItems.length; _l < _len3; _l++) {
      itm = testItems[_l];
      testFileItem2(itm).then(function(res) {
        return console.log(fmtstr("" + res, '--', 80));
      }, function(err) {
        return console.log("ERROR@!:", err);
      });
      _results.push(console.log("counting " + (testItems.indexOf(itm))));
    }
    return _results;
  };
  doListDirTests = function() {
    listDir('./dist').then(function(res) {
      var count, r, _l, _len3;
      count = 0;
      for (_l = 0, _len3 = res.length; _l < _len3; _l++) {
        r = res[_l];
        count++;
      }
      return console.log("Should have 1 file, had: " + count);
    });
    return listDir('./src').then(function(res) {
      var count, r, _l, _len3;
      count = 0;
      for (_l = 0, _len3 = res.length; _l < _len3; _l++) {
        r = res[_l];
        count++;
      }
      return console.log("Should have 1 file, had: " + count);
    });
  };
  doReadWriteTests = function() {
    var tstName, tstTxt;
    tstTxt = "this is a test file";
    tstName = "tst.txt";
    return writeFile(tstName, tstTxt).then(function(res) {
      return readFile(tstName).then(function(res) {
        return console.log("Data from " + tstName + "\n" + res + "\n\nData from variable\n" + tstTxt);
      });
    });
  };
  console.log('\nstarting non-blocking tests\n');
  doDirTests();
  doFileTests();
  doListDirTests();
  return doReadWriteTests();
};

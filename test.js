module.exports = function(){ require('./dist/node-fs.js');

    var isDirSync = ng_load('isDirSync',['node.fs.app']);
    var isDir = ng_load('isDir');
    var isFile = ng_load('isFile');
    var isFileSync = ng_load('isFileSync');
    var listDir = ng_load('listDir');
    var $q = ng_load('$q');
    var writeFile = ng_load('writeFile');
    var readFile = ng_load('readFile');

    var $rootScope = ng_load("$rootScope");
    var $scope = $rootScope.$new();
                
    
    console.log(new $q(function(res){ return 55;}));
    //ng_bootstrap(angular.module('app',[]));

    var firstTestItem = './dist/node-fs.js',
        secondTestItem = './dist',
        thirdTestItem = './src',
        fourthTestItem = './src/node-fs.coffee';


  console.log(firstTestItem + " is a directory? --> ["+isDirSync(firstTestItem)+"]");
  console.log(fourthTestItem + " is a directory? --> ["+isDirSync(fourthTestItem)+"]");
  console.log(secondTestItem + " is a directory? --> ["+isDirSync(secondTestItem)+"]");                                
            

  isDir(thirdTestItem).then(function(res){
      console.log('AAAAA');
      assert(1);
      console.log("we are testing if " + thirdTestItem + " is a dir, is it? ["+res+"]");
      //assert(res);
      console.log("PASSED");      
  });
  isDir(fourthTestItem).then(function(res){
        console.log("we are testing if " + fourthTestItem + " is a dir, is it? ["+res+"]");
        //assert(!res);
        console.log("PASSED");
      
  });

  console.log(isFileSync(firstTestItem),"sb - true");
  console.log(isFileSync(secondTestItem),"sb - false");
  console.log(isFileSync(thirdTestItem),"sb - fasle");

  isFile(fourthTestItem).then(function(res){
    console.log(res,"sb - true");
  });
  function showFiles(name){
      var def = $q.defer(),
          res;
      return (function(){
          var p = listDir(name);
          $q.when(p.then(function(res){

              console.log('listing items in ',name,JSON.stringify(res));
              for(var i = 0; i < res.length; i++){
                  console.log(res[i]);
              }    

              def.resolve(res);
          },function(err){
              console.log("EEEEE",err);
          }))
        //.then(function(){
        //  $rootScope.$apply();
        //  });
          return def.promise;
      })();
  }

  $q.all(showFiles("./").then(showFiles(thirdTestItem)));

    //var p = listDir.run("./dist");
  //console.log(JSON.stringify(p.$$state.pending[0].promise));
  /*p.then(function(res){
      console.log('listing items in ',"./",JSON.stringify(res));
      for(var i = 0; i < res.length; i++){
          console.log(res[i]);
          console.log(JSON.stringify(res));
      }    
      showFiles("./");
      showFiles(secondTestItem);
  },function(err){
    console.log("Late Error: ",err);
  });
  doListDir('./').then(function(r){
      console.log("AAAAAAA",JSON.stringify(ldr));
  });*/

  var testFileContent = 'this is a string';

  writeFile("tst.txt",testFileContent).then(function(res){ 
      return readFile("tst.txt");
  }).then(function(res){ 
      console.log('read this data: ',String(res));
  });
};

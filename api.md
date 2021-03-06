
Angular was designed from the start as a frontend framework.
This helps explain (or justify, depending on how you may feel about it) many of the 
choices made by the team that created it then and now (since angular is still 
being activly developed at this time), while also shedding light on why some features 
were kept while others were not. 

This is why we have the `angular.module.directive` function, allowing us to manipulate 
the DOM, and associcate it with our javascript, making all of our fun web page features
angular allows, ie: drag and drop, animations, etc... and this is also why angulars 
digest loop is focused around dom changes, and does a lot of coping and replacing DOM nodes
based on  how you place your various directives in your html, quite a powerful system. Thankfully 
there is more to angular than just DOM nodes and the digest loop, otherwise, it might not be of 
much use outside of the browser, angular has many features which will come in handy server side, DI, 
services, etc.. now i will start building our command line tool, piece by piece, implementing each feature 
set as an angular module, installable via npm. Today we will work with nodes file handling functions.

first we need our app, and please notice we are using coffeescript, it allows a cleaner
more concise way to write javascript, if you are not familiar, i highly suggest taking a few
moments to read up on it. 

The first thing we do is create our angular module object using the `angular.module` function.

<kbd>node-fs.coffee</kbd>
```coffeescript
'use strict`

app = angular.module 'node.fs.app', []
```

Now we need a quick way to wrap the functions from node, into a form 
useable by angular, as well as angulars $q based promises. For the initial wrapper
object i will just inject the node `fs` module into an angular service, for us to use
later. Then for the promises i will use the `promisify` function that i explained in part one 
of this series. That function takes a single non-blocking function as its only argument and returns a new 
function that angular can work with. 

```coffeescript
# first we need our service, to call node functions from
app.service 'nodeFs',[->
    require 'fs'
]

# next we will create a factory that will wrap our functions
app.factory 'ngIfy',['nodeFs',(nodeFs)->
    (name)->
        promisify nodeFs[name]
]

# now we need to wrap a few of the basic fs functions for $q 
app.factory 'ngStat',['ngIfy',(ngIfy)->
    ngIfy 'stat'
]

app.factory 'ngReaddir',['ngIfy',(ngIfy)->
    ngIfy 'readdir'
]

# and we also need some private functions, that implement some of the 
# functionality we need, i am going to be showing that the 
# functions are private by starting their names with a single _
app.factory '_isDir',[->
    (res)->
        res.blksize == res.size
]
app.factory '_isFile',[->
    (res)->
        res.blksize !== res.size
]
# now we use those implementation functions to implement the 
# syncronys and asyncronys versions of isFile and isDir
app.factory 'isDir',['_isDir','ngStat',[(_isDir,ngStat)->
    (name)->
        ngStat(name).then (res)->
            actualResult = _isDir res
]
app.factory 'isDirSync',['_isDir','nodeFs',(_isDir,nodeFs)->
    (name)->
        _isDir nodeFs.statSync(name)
]
app.factory 'isFile',['_isFile','ngStat',(_isFile,ngStat)->
    (name)->
        ngStat(name).then (res)->
            actualResult = _isFile res
]
app.factory 'isFileSync',['_isFile','nodeFs',(_isFile,nodeFs)->
    (name)->
        _isFile nodeFs.statSync(name)
]
```
Now we are almost done, we only have a few more things we need here.
the next issue we will tackle will be reading from and writing to files, 
for the moment we will avoid actually deleting files, because thats not 
one of our requirements, but you can try that yourself as an exercise
after were done. Also we are not going to do blocking versions of these functions
because reading and writing to files could really take a long time, so no need to block
our progress while we do that. 

```coffeescript
app.factory 'readFile',['$q','nodeFs',($q,nodeFs)->
    def = $q.defer()
    (filename)->
        nodeFs.readFile filename,(err,res)->
            if err
                def.reject err
            else
                def.resolve res
            return
        def.promise
]
app.factory 'writeFile',['$q','nodeFs',($q,nodeFs)->
    def = $q.defer()
    (filename,data)->
        nodeFs.writeFile filename,data,(err,res)->
            if err
                def.reject err
            else
                def.resolve true
            return
        def.promise
]
```
And finally our last requirement from the `fs` node module, is going to be listing 
directory contents. Which will be pretty easy as well. We just need to use the ngReaddir 
factory we defined eariler.

```coffeescript
app.factory 'listDir',['ngReaddir',(ngReaddir)->
    (name)->
        ngReaddir name
]
```

now we can write a few little tests to be sure things worked as planned.

```coffeescript
module.exports = ()->
    require '../dist/node-fs.js'

    fmtstr = require '../fstr.coffee'

    isDir = ng_load 'isDir',['node.fs.app']
    isDirSync = ng_load 'isDirSync'
    isFile = ng_load 'isFile'
    isFileSync = ng_load 'isFileSync'
    listDir = ng_load 'listDir'
    readFile = ng_load 'readFile'
    writeFile = ng_load 'writeFile'
    $q = ng_load '$q'


    # test data 
    firstTestItem = './dist/node-fs.js'
    secondTestItem = './dist'
    thirdTestItem = './src'
    fourthTestItem = './src/node-fs.coffee'

    testItems = []
    for i in [firstTestItem,secondTestItem,thirdTestItem,fourthTestItem]
        testItems.push i

    # blocking tests
    console.log 'Starting blocking tests\n'

    console.log '\ntesting isDirSync\n'

    testItem = (func,itm)->
        func itm

    testDirItem = (itm)->
        result = testItem isDirSync,itm
        "is #{itm} a directory? ---> [#{result}]"

    for itm in testItems
        console.log fmtstr(testDirItem(itm),"--",60)
    
    console.log "\ntesting isFileSync\n"

    testFileItem = (itm)->
        result = testItem isFileSync,itm
        "is #{itm} a file? ---> [#{result}]"
    
    for itm in testItems
        console.log fmtstr(testFileItem(itm),"--",60)

    doDirTests = ->
        testDirItem2 = (itm)->
            testItem(isDir,itm).then (res)->
                "\nWe are testing if #{itm} is a dir, is it? ---> [#{res}]\n"

        for itm in testItems
            testDirItem2(itm).then (res)->
                console.log fmtstr(res, '--',80)
            ,(err)->
                console.log "ERROR@!:",err

    doFileTests = ->
        testFileItem2 = (itm)->
            testItem(isFile,itm).then (res)->
                "\nWe are testing if #{itm} is a file, is it? ---> [#{res}]\n"

        for itm in testItems
            testFileItem2(itm).then (res)->
                console.log fmtstr("#{res}", '--',80)
            ,(err)->
                console.log "ERROR@!:",err
            console.log "counting #{testItems.indexOf(itm)}"

    doListDirTests = ->
        listDir('./dist').then (res)->
            count = 0
            count++ for r in res
            console.log "Should have 1 file, had: #{count}"

        listDir('./src').then (res)->
            count = 0
            count++ for r in res
            console.log "Should have 1 file, had: #{count}"

    doReadWriteTests = ->
        tstTxt = "this is a test file"
        tstName = "tst.txt"

        writeFile(tstName,tstTxt).then (res)->
            readFile(tstName).then (res)->
                console.log "Data from #{tstName}\n#{res}\n\nData from variable\n#{tstTxt}"

    console.log '\nstarting non-blocking tests\n'
    do doDirTests
    do doFileTests
    do doListDirTests
    do doReadWriteTests
```

Also you may have noticed im using a function `fmtstr` which i am 
pulling from `fstr.coffee`, this is just a string formatting abstraction
which i felt was so unrelated to this projects goals that it needed to be in its own 
file, here is the contents of `fstr.coffee`:

```coffeescript
makePadd = (char,num)->
    res = []
    for x in [1..num]
        res.push char
    res.join ""

fmtstr = (s,splitchar,size,padchar)->
    splitchar = splitchar or '--'
    size = size or 40
    padchar = padchar or ' '
    #console.log s
    parts = String(s).split(splitchar)
    padlen = size - (parts[0].length + parts[1].length)
    padd = makePadd padchar,padlen
    "#{parts[0]}#{padd}#{parts[1]}"

module.exports = fmtstr
```

Now that's all we need from nodes `fs` module for now. Lets take a look
at the different things weve managed to accomplish:
- checking if file is dir or not
- reading files
- writing files
- and listing directorys
- and all of these features are integrated into the angular workflow

Thanks for coming along on this journey with me, we have made progress, but still have a ways to go.
This was part 2 of an ongoing saga, where i attempt to use angular serverside.
Join me next time, when we will be working on rendering templates from strings and files, in part by
using the module we coded today, `node.fs.app`

also all of the code from this blog post can be found on github => [here](https://github.com/jstacoder/angular-node-fs)



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

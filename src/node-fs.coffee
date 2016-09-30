'use strict'

app = angular.module 'node.fs.app',[]

app.service 'nodeFs',[->
    require 'fs'
]

app.factory 'ngIfy',['nodeFs',(nodeFs)->
    (name)->
        promisify nodeFs[name]
]

app.factory 'ngStat',['ngIfy',(ngIfy)->
    ngIfy 'stat'
]

app.factory 'ngStatSync',['nodeFs',(nodeFs)->
    (path)->
        nodeFs.statSync path
]

app.factory 'ngReaddir',['ngIfy',(ngIfy)->
    ngIfy 'readdir'
]

app.factory '_isType',['ngStatSync',(ngStatSync)->
    typeFuncs =
        "dir" : "isDirectory"
        "file": "isFile"
        
    (name,type)->
        do ngStatSync ( name ) [ typeFuncs [ type ] ]
]

app.factory '_isDir', ['_isType', (_isType)->
    (path)->
        _isType path , 'dir'
]

app.factory '_isFile', ['_isType',(_isType)->
    (path)->
        _isType path,'file'
]

app.factory 'isFileSync',['nodeFs','_isFile',(nodeFs,_isFile)->
    (name)->
        do nodeFs.statSync(name).isFile
]

app.factory 'isFile',['ngStat','_isFile',(ngStat,_isFile)->
    (name)->
        ngStat(name).then (res)->
            actualResult = do res.isFile
]

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
        nodeFs.writeFile filename, data,(err,res)->
            if err
                def.reject err
            else
                def.resolve true
            return
        def.promise
]

app.factory 'isDirSync',['nodeFs','_isDir',(nodeFs,_isDir)->
    (name)->
        do nodeFs.statSync(name).isDirectory
]

app.factory 'isDir',['ngStat','_isDir',(ngStat,_isDir)->
    (name)->
        ngStat(name).then (res)->
            actualResult = do res.isDirectory
]

app.factory 'listDir',['ngReaddir',(ngReaddir)->
    (name)->
        ngReaddir name
]

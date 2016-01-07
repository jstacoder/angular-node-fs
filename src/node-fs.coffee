'use strict'

app = angular.module 'node.fs.app',[]

app.service 'nodeFs',[->
    require 'fs'
]

app.factory 'ngStat',['ngIfy',(ngIfy)->
    ngIfy 'stat'
]

app.factory 'ngReaddir',['ngIfy',(ngIfy)->
    ngIfy 'readdir'
]

app.factory 'ngIfy',['nodeFs',(nodeFs)->
    (name)->
        promisify nodeFs[name]
]

app.factory '_isDir', [->
    (res)->
        res.blksize == res.size
]

app.factory '_isFile', [->
    (res)->
        res.blksize != res.size
]

app.factory 'isFileSync',['nodeFs','_isFile',(nodeFs,_isFile)->
    (name)->
        _isFile nodeFs.statSync(name)
]

app.factory 'isFile',['ngStat','_isFile',(ngStat,_isFile)->
    (name)->
        ngStat(name).then (res)->
            actualResult = _isFile(res)
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
        _isDir nodeFs.statSync(name)
]

app.factory 'isDir',['ngStat',(ngStat)->
    (name)->
        ngStat(name).then (res)->
            actualResult =  res.blksize == res.size
]

app.factory 'listDir',['ngReaddir',(ngReaddir)->
    (name)->
        ngReaddir name
]

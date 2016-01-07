'use strict'

app = angular.module 'node.fs.app',[]

app.service 'nodeFs',[->
    require 'fs'
]

app.factory 'ngStat',['ngIfy',(ngIfy)->
    return  ngIfy 'stat'
]

app.factory 'ngReaddir',['ngIfy',(ngIfy)->
    return ngIfy 'readdir'
]

app.factory 'ngIfy',['nodeFs',(nodeFs)->
    return (name)->
        return promisify nodeFs[name]
]

app.factory '_isDir', [->
    return (res)->
        res.blksize == res.size
]

app.factory '_isFile', [->
    return (res)->
        res.blksize != res.size
]

app.factory 'isFileSync',['nodeFs','_isFile',(nodeFs,_isFile)->
    return (name)->
        _isFile nodeFs.statSync(name)
]

app.factory 'isFile',['ngStat','_isFile',(ngStat,_isFile)->
    return (name)->
        return ngStat(name).then (res)->
            return actualResult = _isFile(res)
]

app.factory 'readFile',['$q','nodeFs',($q,nodeFs)->
    def = $q.defer()

    return (filename)->
        nodeFs.readFile filename,(err,res)->
            if err
                def.reject err
            else
                def.resolve res
            return
        return def.promise
]

app.factory 'writeFile',['$q','nodeFs',($q,nodeFs)->
    def = $q.defer()

    return (filename,data)->
        nodeFs.writeFile filename, data,(err,res)->
            if err
                def.reject err
            else
                def.resolve true
            return
        return def.promise
]

app.factory 'isDirSync',['nodeFs','_isDir',(nodeFs,_isDir)->
    return (name)->
        _isDir nodeFs.statSync(name)
]

app.factory 'isDir',['ngStat',(ngStat)->
    return (name)->
        return ngStat(name).then (res)->
            return actualResult =  res.blksize == res.size
]

app.factory 'listDir',['ngReaddir',(ngReaddir)->
    return (name)->
        return ngReaddir name
]

'use strict'

app = angular.module 'node.fs.app',[]

app.constant 'EQ','==='

app.constant 'NQ','!=='

app.factory 'getOperator',['EQ','NQ',(EQ,NQ)->
    opLst =
        "EQ":EQ
        "NQ":NQ
   
    (op)->
        opLst[op]
]

app.factory 'produceResult',['getOperator',(getOperator)->
    (leftSide,rightSide,op)->
        eval "#{leftSide}#{getOperator op }#{rightSide}"
]

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

app.factory 'ngReaddir',['ngIfy',(ngIfy)->
    ngIfy 'readdir'
]

app.factory '_isType',['produceResult',(produceResult)->
    typeOps =
        "dir" : "EQ"
        "file": "NQ"
        
    (leftSide,rightSide,type)->
        produceResult leftSide,rightSide,typeOps[type]
]

app.factory '_isDir', ['_isType', (_isType)->
    (res)->
        _isType res.blksize, res.size, 'dir'
]

app.factory '_isFile', ['_isType',(_isType)->
    (res)->
        _isType res.blksize,res.size,'file'
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

app.factory 'isDir',['ngStat','_isDir',(ngStat,_isDir)->
    (name)->
        ngStat(name).then (res)->
            actualResult =  _isDir res
]

app.factory 'listDir',['ngReaddir',(ngReaddir)->
    (name)->
        ngReaddir name
]

'use strict'

app = angular.module 'node.fs.app',[]

app.factory 'nodeFs',[->
    return require 'fs'
]

app.factory 'ngStat',['nodeFs',(nodeFs)->
    return promisify nodeFs.stat
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

app.factory 'isDir',['nodeFs',(nodeFs)->
    promiseStat = promisify(nodeFs.stat)
    return (name)->
        return promiseStat(name).then (res)->
            return actualResult =  res.blksize == res.size
]

app.service 'listDirResult',[->
    results = []
    add = (itm)->
        results.push(itm) if not itm in results
    remove = (itm)->
        idx = results.indexOf itm
        results.splice(idx,1)
    get = ->
        results
    rtn =
        add:add
        remove:remove
        get:get
    return rtn
]

app.factory 'doListDir',['nodeFs','listDirResult',(nodeFs,listDirResult)->
    return (name)->
        ldr = listDirResult
        func = promisify(nodeFs.readdir)
        func(name).then (r)->
            for itm in r
                ldr.add itm
]

app.service 'listDir',['$q','nodeFs','isDir',($q,nodeFs,isDir)->
    def = $q.defer()
    res = null
    r = null

    listFunc = (name)->
        isDir(name).then (res)->
            if not res
                console.log "rejecting: #{res},#{name}"
                def.reject "#{name} is a file"
            else
                func = promisify(nodeFs.readdir)
                func(name).then (r)->
                        def.resolve r
            return
        return def.promise
    rtn =
        run:listFunc
    rtn
]


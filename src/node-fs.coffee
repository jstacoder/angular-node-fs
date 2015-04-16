'use strict'

app = angular.module 'node.fs.app',[]

app.factory 'nodeFs',[()->
    return require 'fs'
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

app.factory 'isDir',['$q','nodeFs',($q,nodeFs)->
    def = $q.defer()

    return (name)->
        nodeFs.stat name,(err,res)->
            if err
                def.reject err
            else
                def.resolve res.blksize == res.size
            return
        return def.promise
]

app.factory 'listDir',['$q','nodeFs','isDir',($q,nodeFs,isDir)->
    def = $q.defer()

    return (name)->
        isDir(name).then (res)->
            if not res
                console.log "rejecting: #{res},#{name}"
                def.reject "#{name} is a file"
            else
                nodeFs.readdir name,(err,res)->
                    if err
                        console.log "rejected by: #{err}"
                        def.reject err
                    else
                        def.resolve res
                    return
            return
        return def.promise
]


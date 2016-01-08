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


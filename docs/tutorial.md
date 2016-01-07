# __Angular-Node-FS__

## pt.1 - __Intro__: use angular server side

### use angular concepts and structre with node apps server side


## pt.2 - __API__
### nodeFs - service
use the `nodeFs` service to access nodes builtin file system functions, 
    - `readdir`
    - `stat`
    - `readfile`
    - `writefile`
    - etc...


### ngIfy - factory
morph native node functions into angular promises

### ngStat - factory
nodes stat function, but returns an angular promise

### ngReaddir - factory 
nodes readdir function, but returns an angular promise

### readFile - factory
read from files in the local file system
    
### writeFile - factory
write to files in the local file system

### listDir - factory
list files in current or given directory

### isDir - factory
check if argument is a directory

### isDirSync - factory
same but returns result, not a promise
    
### isFile - factory
check if argument is file

### isFileSync - factory
same but returns result, not a promise
    
## pt.3 - __Examples__

- nodeFs

- readFile

- writeFile

- isDir

- isDirSync

- isFile

- isFileSync

- listDir


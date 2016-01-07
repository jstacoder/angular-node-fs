
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

<kbd>node-fs.coffee</kbd>
```coffeescript
'use strict`

app = angular.module 'node.fs.app', []
```

service 'nodeFs'

factory 'ngStat'

factory 'ngReaddir'

factory 'ngIfy'

private factory '_isDir'

private factory '_isFile'

factory 'isFileSync'
    
factory 'isFile'

factory 'readFile'

factory 'writeFile'

factory 'isDirSync'

factory 'isDir'

factory 'listDir'

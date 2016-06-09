# gcloud-storage-api 

An easy google storage tool to upload file and generate public link as return (both file uploading and buffer streaming).


A wrapper base on gcloud, which around the google storage functions for upload (both file uploading and streaming) and delete.[![NPM](https://nodei.co/npm/gcloud-storage-api.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/gcloud-storage-api)


## Install

```
$ npm install --save gcloud-storage-api
```

## Functions of this package:

```js
googleAPI.uploadLocalFile(BUCKET_NAME, fileName, fileLocalPath)
googleAPI.uploadBuffer(BUCKET_NAME, fileName, buffer)
googleAPI.deleteStorageFile(url)
```


## Usage
To get the projectId and key.json, it is needed to Visit the Google Developers Console. There is the instruction from gcloud: https://www.npmjs.com/package/gcloud 


#### Initialization

Paste and service-key which download from google console

![alt tag](http://gdriv.es/gpeter/desktop.png)

service-key.json 

![alt tag](http://gdriv.es/gpeter/sublime_.png)

Initializing gcloud 
```js
var googleAPI = require('gcloud-storage-api')
googleAPI.init('projectId',"service-key.json")
```

#### Upload local file 
- **googleAPI.formParsing** is a fomidable function which parsing local file with POST is multipart
- **googleAPI.uploadLocalFile(BUCKET_NAME, fileName, fileLocalPath)** is a function that does local file uploading, respose the public link and resolve a promise.
```js
## Usage
app.post('/upload', googleAPI.formParsing, function(req, res, next) {

    var fileName = "path/to/"+req.uploadFile.name
    var fileLocalPath  = req.uploadFile.path
    var BUCKET_NAME = "yourbucket"

    googleAPI.uploadLocalFile(BUCKET_NAME, fileName, fileLocalPath).then(function(result) {
        console.log("finished uploadLocalFile: "+result)
        res.send(result)
    },function(err){
        console.log(err)
    })
});
```


#### Upload Streaming/Buffer
- **fileName = "path/to/upload/abc.file"**
- **googleAPI.uploadBuffer(BUCKET_NAME, fileName, buffer)** is a function that does buffer uploading, respose the public link and resolve a promise.

```js
app.post('/streamupload', googleAPI.formParsing, function(req, res, next) {

    var fileName = "path/to/"+req.uploadFile.name
    var fileLocalPath  = req.uploadFile.path
    var BUCKET_NAME = "peterbucket"

    fs.readFile(fileLocalPath,function(err, buffer){
        googleAPI.uploadBuffer(BUCKET_NAME, fileName, buffer).then(function(result) {
            console.log("after googleAPI.deleteDownloadableFile: "+result)
            res.send(result)
        })
    })
});
```


#### Delete storage file
- **url = "https://storage.googleapis.com/yourbucket/path/to/upload/abc.file"**
- **googleAPI.deleteStorageFile(url)** is a function that deletes file on google storage.

```js
app.post('/delete', function(req, res, next) {
    var url = req.query.url
    googleAPI.deleteStorageFile(url).then(function(result) {
        console.log("after googleAPI.deleteStorageFile: "+result)
        res.send(result)
    })
});
```

## License


[MIT](http://vjpr.mit-license.org)
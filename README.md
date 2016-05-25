# gcloud-storage-api 
A wrapper base on gcloud, which around the google storage functions for upload (both upload and streaming) and delete.[npm]](https://www.npmjs.com/package/gcloud-storage-api)


## Install

```
$ npm install --save gcloud-storage-api
```


## Usage
To get the projectId and key.json, it is needed to Visit the Google Developers Console. There is the instruction from gcloud: https://www.npmjs.com/package/gcloud 
- ##### Functions of this package:
```js
googleAPI.uploadLocalFile(BUCKET_NAME, fileName, fileLocalPath)
googleAPI.uploadBuffer(BUCKET_NAME, fileName, buffer)
googleAPI.deleteStorageFile(url)
```

#### Initialization
```js
var googleAPI = require('gcloud-storage-api')
googleAPI.init('projectId',"service-key.json")
```

#### Upload local file 
- **googleAPI.formParsing** is a fomidable function parsing local file which is multipart
- **googleAPI.uploadLocalFile(BUCKET_NAME, fileName, fileLocalPath)** is a function that does local file uploading and respose a promise.
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
- **googleAPI.uploadBuffer(BUCKET_NAME, fileName, buffer)** is a function that does buffer uploading and respose a promise.

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
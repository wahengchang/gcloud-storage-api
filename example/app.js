var express = require('express');
var app = express();

app.use('/', express.static('public'));
// app.use(express.static('public'));


var googleAPI = require('../index.js')
var fs = require('fs');

googleAPI.init("your-projectId","service-key.json")

app.post('/upload', googleAPI.formParsing, function(req, res, next) {

    console.log("_dataHandle file: " + req.uploadFile.name)
    console.log("_dataHandle parameter: " + req.uploadField)

    var fileName = "path/to/"+req.uploadFile.name
    var fileLocalPath  = req.uploadFile.path
    var BUCKET_NAME = "peterbucket"

    googleAPI.uploadLocalFile(BUCKET_NAME, fileName, fileLocalPath).then(function(result) {
        console.log("after googleAPI.uploadLocalFile: "+result)
        res.send(result)
    },function(err){
    				console.log(err)
    })

});


app.post('/streamupload', googleAPI.formParsing, function(req, res, next) {

    var fileName = "path/to/"+req.uploadFile.name
    var fileLocalPath  = req.uploadFile.path
    var BUCKET_NAME = "peterbucket"

    fs.readFile(fileLocalPath,function(err, buffer){
        googleAPI.uploadBuffer(BUCKET_NAME, fileName, buffer).then(function(result) {
            console.log("after googleAPI.uploadBuffer: "+result)
            res.send(result)
        })
    })

});

app.post('/delete', function(req, res, next) {

    var googleDownloadUrl = req.query.url

    googleAPI.deleteStorageFile(googleDownloadUrl).then(function(result) {
        console.log("after googleAPI.deleteStorageFile: "+result)
        res.send(result)
    })

});


app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});
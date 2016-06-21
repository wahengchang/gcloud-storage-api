var gcloud = require('gcloud')
var downloadableAPI = require('url-valid')
var formidable = require('formidable')
var _ = require('underscore')


var fileToStreamAPI = require('./fileToStreamAPI.js')
var stringAPI = require('./stringAPI.js')

var gcs 

var _parseBucketFilePath = function(url) {
    url = url.split("https://storage.googleapis.com/")[1]
    var bucketname = url.substr(0, url.indexOf('/')),
        filepath = url.substr(url.indexOf('/') + 1),
        fileExtension = url.substr(url.lastIndexOf('.') + 1);

    return [bucketname, filepath, fileExtension]
}


var API = function() {}

API.init = function(projectId, googleJsonFile) {
  gcs = gcloud.storage({
      projectId: projectId,
      keyFilename: googleJsonFile
  })
}


API.gstorageMakePublic = function(bucketname, fileName) {
    return new Promise(function(resolve, reject) {

        var mpF = function() {
            return new Promise(function(resolve, reject) {
                var filet = gcs.bucket(bucketname).file(fileName)

                filet.exists(function(err, exists) {
                    if (err) {
                        reject(err)
                    } else if (!exists) {
                        reject('File not exists')
                    } else {
                        filet.makePublic(function(err, api) {
                            if (err) reject(err)
                            else resolve()
                        })
                    }
                })
            })
        }

        var recursive = function(fun, i) {

            fun().then(function() {
                resolve("make public finished");
            }, function(error) {
                if (i > 30) {
                    reject('make publid fail')
                } else {
                    setTimeout(function() {
                        recursive(fun, ++i)
                    }, 500)
                }
            })
        }

        recursive(mpF, 0)
    })
}

API.isDownloadable = function(url) {
    return new Promise(function(resolve, reject) {

        downloadableAPI(url, function(err, valid) {
            if (err) {
                reject(err)
            } else {
                resolve(valid);
            }
        });

    })
}

API.isExistGcloud = function(bucketname, fileName) {
    return new Promise(function(resolve, reject) {
        var bucket = gcs.bucket(bucketname),
            file = bucket.file(fileName);

        file.exists(function(err, exists) {
            if (err) reject(err)
            else resolve(exists)
        })
    })
}

API.uploadLocalFile = function(bucketname, fileName, tempPath) {
    return new Promise(function(resolve, reject) {

        fileName = stringAPI.valiFileName(fileName)

        var bucket = gcs.bucket(bucketname),
            file = bucket.file(fileName),
            downloadlink = "https://storage.googleapis.com/" + bucketname + "/" + fileName;

        var start = new Date().getTime();
        bucket.upload(tempPath, {
            destination: fileName
        }, function(err, filet) {
            if (err) {
                reject(err)
            } else {
                filet.makePublic(function(err, api) {
                    if (err) {
                        reject(err)
                    } else {
                        var end = new Date().getTime();
                        var time = end - start;
                        console.log("uploadLocalFile time: " + time / 1000 + "s")
                        resolve(downloadlink)
                    }
                })
            }
        })
    })
}

API.uploadBuffer = function(bucketname, fileName, buffer) {

    return new Promise(function(resolve, reject) {

        fileName = stringAPI.valiFileName(fileName)

        var bucket = gcs.bucket(bucketname)

        var localReadStream = new fileToStreamAPI(buffer)

        var downloadlink = 'https://storage.googleapis.com/' + bucketname + '/' + fileName;

        var remoteWriteStream = bucket.file(fileName).createWriteStream()

        API.isExistGcloud(bucketname, fileName).then(function(isExist) {
            if (!isExist) {
                remoteWriteStream = bucket.file(fileName).createWriteStream()
                bucket.file(fileName).createWriteStream()
                localReadStream.pipe(remoteWriteStream)
                localReadStream.on('end', function() {
                    API.gstorageMakePublic(bucketname, fileName).then(function(result1) {
                        resolve(downloadlink)
                    }, function(error) {
                        reject(error)
                    })
                })

                localReadStream.on('error', function() {
                    reject("Upload streaming Error")
                })
                localReadStream.on('finish', function() {
                    resolve(downloadlink)
                })

            } else {
                resolve(downloadlink)
            }

        }, function(error) {
            reject(error)
        })
    })
}

API.isDownloadLinkExist = function(googleDownloadUrl) {
    return new Promise(function(resolve, reject) {
        var path
        try {

            path = _parseBucketFilePath(googleDownloadUrl);
            var bucket = gcs.bucket(path[0]),
                file = bucket.file(path[1]);

            file.exists(function(err, exists) {
                if (err) {
                    reject(err)
                } else {
                    resolve(exists)
                }
            })
        } catch (ex) {
            console.log(ex)
                // might be caused by file not stored in google cloud storage
            reject('parse google download link failed.')
        }
    })
}

_gstorageDelete = function(googleDownloadUrl) {
    return new Promise(function(resolve, reject) {

        try {
            var path = _parseBucketFilePath(googleDownloadUrl),
                bucket = gcs.bucket(path[0]),
                file = bucket.file(path[1]);

            file.delete(function(err, apiResponse) {
                if (err) {
                    console.log(err)
                    reject('delete file failed E: ' + googleDownloadUrl);
                } else {
                    resolve(apiResponse);
                }
            });

        } catch (ex) {
            // Parsing error
            // might be caused by file not stored in google cloud storage
            resolve('skip delete file: ', googleDownloadUrl);
        }

    })
}


//download file
API.deleteStorageFile = function(googleDownloadUrl) {
    return new Promise(function(resolve, reject) {

        API.isDownloadable(googleDownloadUrl).then(function(t) {

            if (t) {
                API._gstorageDelete(googleDownloadUrl).then(function() {
                    resolve()
                }, function(err) {
                    console.log(err)
                    reject(err)
                })
            } else {
                resolve("deleted: "+deleteStorageFile)
            }
        }, function(err) {
            console.log(err)
            reject(err)
        })
    })
}

//  this is a function to parse multipart http request
//  req.uploadFile
//  req.uploadField
API.formParsing = function(req, res, next) {

    new formidable.IncomingForm().parse(req)
        .on('file', function(name, file) {
            req.uploadFile = file
        })
        .on('field', function(name, field) {
            field = JSON.parse(field)
            req.uploadField = field
        })
        .on('end', function(value) {
            next()
        })
}



//  input : {key1:"a",key2:"b",key3:"c"}
//  output : "a/b/c/"
API.genUrlPathByJ = function(json, fileName) {
    var url = ''
    _.each(json, function(val, key) {
        url += val + '/'
    })
    return url + fileName
}


//  input : ["a","b","c"]
//  output : "a/b/c/"
API.genUrlPathByArr = function(arr, fileName) {
    var url = ''
    _.each(arr, function(val) {
        url += val + '/'
    })
    return url + fileName
}


module.exports = API
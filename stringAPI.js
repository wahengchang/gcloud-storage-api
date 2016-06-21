var _ = require('underscore')


var stringAPI = function() {
}

stringAPI.validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

stringAPI.urlFileName = function(url) {
    return url.split('/').pop()
}

stringAPI.urlPath = function(url) {
    return url.substring(0, url.lastIndexOf("/"));
}

stringAPI.removeString = function(str,rm) {
    return str.replace(rm,"")
}

stringAPI.removeFileExtension = function(str) {
    console.log("   removeFileExtension")

    return str.substr(0, str.lastIndexOf('.')) 
}

stringAPI.getFileExtension = function(str) {
    return str.substr(str.lastIndexOf('.'),str.length) 
}

stringAPI.singleToArray = function(str) {

    return (str) ? _.flatten([str]) : undefined;
}


stringAPI.stringToArray = function(str){
  if(str[0] == '['){
    return JSON.parse(str)
  }
  else if(str[0] == '"' || str[0] == "'"){
    return JSON.parse(JSON.parse(str))
  }
}



stringAPI.timestamp = function(){
  var date = new Date();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var mseconds = d.getMilliseconds();
  var year = "0" + date.getYear();
  var month = "0" + date.getMonth();
  var day = "0" + date.getDay();

  // Will display time in 10:30:23 format
  var formattedTime = year + '.' +month + '.' +day + '.' +hours + '.' + minutes.substr(-2) + '.' + seconds.substr(-2)+'.'+mseconds;

  return formattedTime
}

// remove all the non - letter   :   abc._@^&#%$&   -> abc._
stringAPI.stringFilter = function(str) {
  var t = str.replace(/[^a-zA-Z0-9/._]/g, '')
  return t
}

// remove all the non - letter   :   abc@^&#%$&   -> abc
stringAPI.charNum = function(str) {
  return str.replace(/[^a-zA-Z0-9/]/g, '')
}

// when file name is chinese, use timestamp for instead
stringAPI.valiFileName = function(fileName) {

  fileName = stringAPI.stringFilter(fileName)
  var tFileName = stringAPI.urlFileName(fileName)

  if(stringAPI.removeFileExtension(tFileName).length <= 0){
    var tUrlPath = stringAPI.urlPath(fileName)
    var extension = stringAPI.getFileExtension(fileName)
    fileName = tUrlPath+"/"+stringAPI.timestamp()+extension
  }

  return fileName
}


module.exports = stringAPI

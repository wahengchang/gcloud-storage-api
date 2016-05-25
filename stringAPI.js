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

stringAPI.removeFileName = function(url) {
    return url.substring(0, url.lastIndexOf("/"));
}

stringAPI.removeString = function(str,rm) {
    return str.replace(rm,"")
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


// remove all the non - letter   :   abc._@^&#%$&   -> abc._
stringAPI.stringFilter = function(str) {
  return str.replace(/[^a-zA-Z0-9/._]/g, '')
}

// remove all the non - letter   :   abc@^&#%$&   -> abc
stringAPI.charNum = function(str) {
  return str.replace(/[^a-zA-Z0-9/]/g, '')
}


module.exports = stringAPI

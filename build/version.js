#!/usr/bin/env node
var fs = require('fs');
var Error = function(){}

function writeNewVersion(major, minor, build){
  var versionString = major + '.' + minor + '.' + build;

  fs.writeFile('./version.txt', versionString, function(err){
    if(err){
      throw new Error();
    }else{
      console.log(versionString);
    }
  });
}

function incrementVersion(versions){
  var major = parseInt(versions[0]),
    minor = parseInt(versions[1]),
    build = parseInt(versions[2]);

  ++build;

  if(build > 9){
    build = 0;
    ++minor;
    // for now ignore major releases as those should be specified by the builder
  }

  writeNewVersion(major, minor, build);
}

function run(){
  fs.readFile('./version.txt', 'utf-8', function(err, data){
    var versions;

    if(err){
      throw new Error();
    }else{
      versions = data.split('.');
      incrementVersion(versions);
    }
  });
}

run();
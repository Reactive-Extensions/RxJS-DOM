'use strict';
var fs = require('fs');
var execSync = require('child_process').execSync;

var files = fs.readdirSync(process.cwd());
for (var i = 0; i < files.length; i++) {
  var file = files[i];
  var stat = fs.statSync(file);
  if (stat.isDirectory()) {
    console.log('publishing %s', file);
    try {
      execSync('npm publish ' + file);
    } catch (e) {
      console.log('error in publishing %s: %s', file, e);
    }

    console.log('published %s', file);
  }
}

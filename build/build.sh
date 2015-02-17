#!/bin/bash

# increment the current version
# use backquotes to assign the output to a variable
version=`node version.js`
baseName='Hawk-'
allSuffix='.js'
minSuffix='.min.js'

buildName=$baseName$version

allPath=../$buildName$allSuffix
minPath=../$buildName$minSuffix

# append all script contents
./cat_all.sh >> $allPath

# write a new min file
uglifyjs $allPath -o $minPath
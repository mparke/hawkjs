### Hawk.js
(deprecated) An experimental micro framework

You're Here All Week, have Hawk on your side.

Hawk.js provides flexibility and structure to web apps through a class system based on mixins,  
a configurable publish and subscribe model, and data management / state management utilities.  

API Docs, Intro, and Downloads at [http://hawkjs.org](http://hawkjs.org/)

### Building
Run <code>./build/build.sh</code>
This script does the following:
- increments and updates the version number ( not including major release )
- concatentates all source files and outputs a file to the base directory
- uses uglifyjs to minify the concatenated file and output a minified file to the base directory

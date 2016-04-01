Templicated
===========

[![NPM version](https://img.shields.io/npm/v/templicated.svg?style=flat-square)](https://www.npmjs.com/package/templicated)
[![License](https://img.shields.io/npm/l/templicated.svg?style=flat-square)](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

## Intro
A build and dev step that takes [Jade](http://jade-lang.com/) preprocessed HTML templates to use in JavaScript apps. Because I found I't was way to difficult to get templates in smallish JS apps, mainly when using [Vue](http://vuejs.org/).

This project is work inprogress.

## Example
```JavaScript
var input = new Buffer('console.log("@tpl.Master")'); // It's a buffer because, that is what node.readFileSync would give me

(new t.Templicated(input, {views: './views/'})).compile(); // Returns a node Buffer with the new source file

// In the "views" directory, I'd have a Master.jade" file.
```

### Build
- `npm i tsc typings -g`
- `npm i`
- `typings i`
- `npm run build`

## License
[GPL-2.0](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

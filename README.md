Templicated
===========

[![NPM version](https://img.shields.io/npm/v/templicated.svg?style=flat-square)](https://www.npmjs.com/package/templicated)
[![License](https://img.shields.io/npm/l/templicated.svg?style=flat-square)](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

## Intro
A build and dev step that takes Jade preprocessed HTML templates to use in JavaScript apps. Because I found I't was way to difficult to get templates in smallish JS apps, mainly when using Vuw.

This project is work inprogress.

## Example
```JavaScript
var input = new Buffer('console.log(templicated('my component'))'); // It's a buffer because, that is what node.readFileSync would give me

(new t.Templicated(input, {views: './views/'})).compile(); // Returns a node Buffer with the new source file

// In the "views" directory, I'd have a "my component.jade" file.
```

### Build
- `npm i tsc -g`
- `npm i typings -g`
- `npm i`
- `typings i`
- `npm run build`

## License
[GPL-2.0](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

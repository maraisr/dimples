Templicated
===========

[![NPM version](https://img.shields.io/npm/v/templicated.svg?style=flat-square)](https://www.npmjs.com/package/templicated)
[![License](https://img.shields.io/npm/l/templicated.svg?style=flat-square)](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

## Intro
A build step that manages [Jade templates](http://jade-lang.com/) for use in JavaScript applications. [DEMO](https://github.com/maraisr/waybackthen)

## Example build step
```JavaScript
var input = 'console.log("@tpl.Master")';

var code = (new t.Templicated(input, {views: './views/'})).code;

// In the "views" directory, I'd have a Master.jade file.
```

## Exmaple usuage with Vue
```JavaScript
var vm = new Vue({
	el: '#app',
	template: '@tpl.Master'
});

// And then this file ran through Templicated
```

## API

### constructor(input: Buffer|string, options: Config)
`input` is either a Buffer or a string of the source JavaScript
`options` is an object containing 1 required property: `views` which is the directory of where to start finding templates.

#### .compile(void): Buffer
Returns a Buffer of the new source with Jade templates.

#### .code: string
Returns a string of the new source with Jade templates.

### Build
- `npm i tsc typings -g`
- `npm i`
- `typings i`
- `npm run build`

## License
[GPL-2.0](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

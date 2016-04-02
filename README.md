Templicated
===========

[![NPM version](https://img.shields.io/npm/v/templicated.svg?style=flat-square)](https://www.npmjs.com/package/templicated)
[![License](https://img.shields.io/npm/l/templicated.svg?style=flat-square)](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

## Intro
A build step that manages [Jade templates](http://jade-lang.com/) for use in JavaScript applications. [DEMO](https://github.com/maraisr/waybackthen)

## Installation
via [npm](https://www.npmjs.com/)

```sh
npm i templicated --save
```

## Example build step
```js
var templicated = require('templicated');

// Some input, Buffer or string
var input = 'console.log("@tpl.Master");';

// Compile
var code = (new t.Templicated(input, {views: './views/'})).code;
```

becomes

```js
var $templicated = (function() {
	function Templicated(tpls) {
		this.tpls = tpls;
	}

	Templicated.prototype['get'] = function(which) {
		return this.tpls[which];
	}

	return new Templicated({"1997400446":"<h1>Hello World</h1>"});
})();

console.log($templicated.get('1997400446'));
```

## Exmaple usuage with Vue
```js
var vm = new Vue({
	el: '#app',
	template: '@tpl.Master'
});
```

becomes

```js
var $templicated = (function() {
	function Templicated(tpls) {
		this.tpls = tpls;
	}

	Templicated.prototype['get'] = function(which) {
		return this.tpls[which];
	}

	return new Templicated({"1997400446":"<h1>Hello World</h1>"});
})();

var vm = new Vue({
	el: '#app',
	template: $templicated.get('1997400446')
});
```

---

## API

### constructor(input: Buffer|string, options: Config)
`input` is either a Buffer or a string of the source JavaScript
`options` is an object containing 1 required property: `views` which is the directory of where to start finding templates.

#### .compile(void): Buffer
Returns a Buffer of the new source with Jade templates.

#### .code: string
Returns a string of the new source with Jade templates.

---

## Build
- `npm i tsc typings -g`
- `npm i`
- `typings i`
- `npm run build`

## License
[GPL-2.0](https://github.com/maraisr/templicated/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

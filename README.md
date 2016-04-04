<p align="center">
	<a href="https://github.com/maraisr/dimples">
		<img height="240" width="240" src="http://dimples.io/static/dimples.svg">
	</a>
	<h1 align="center">Dimples</h1>
	<p align="center">JavaScript and HTML templates can be just as cute as pair of dimples!</p>
</p>

[![NPM version](https://img.shields.io/npm/v/dimples.svg?style=flat-square)](https://www.npmjs.com/package/dimples)
[![Travis](https://img.shields.io/travis/maraisr/dimples.svg?style=flat-square)](https://travis-ci.org/maraisr/dimples)
[![License](https://img.shields.io/npm/l/dimples.svg?style=flat-square)](https://github.com/maraisr/dimples/blob/master/LICENSE.md)

## Intro
A build step that manages [Jade templates](http://jade-lang.com/) for use in JavaScript applications. Here's a [demo](https://github.com/maraisr/waybackthen) of it being used.

## Installation
via [npm](https://www.npmjs.com/)

```sh
npm i dimples --save
```

## Example build step
```js
var dimples = require('dimples'),
	fs = require('fs');

fs.readFile('app.js', function(e, input) {
	if (e !== null) {
		throw e;
	}

	var code = (
		new dimples.Dimples(input, {
			views: './views/',
			compress: false
		})
	).code;

	fs.writeFile('output.js', code);
});
```

becomes

```js
var $dimples = (function(dimples) {
	if (dimples == void 0) {
		function Dimples() {
			this.cache = new Array();
		}

		Dimples.prototype['get'] = function(what,uid) {
			uid = (typeof uid === 'undefined') ? 0 : uid;
			return this.cache[uid].get(what);
		}

		Dimples.prototype['add'] = function(uid,factory) {
			this.cache[uid] = factory;
		}

		dimples = new Dimples();
	}

	function Factory(tpls) {
		this.tpls = tpls;
	}

	Factory.prototype['get'] = function(id) {
		return this.tpls[id];
	}

	dimples.add(0, new Factory({"1997400446":"<h1>Hello World</h1>"}));

	return dimples;
})($dimples);

console.log($dimples.get('1997400446',0));
```

---

## API

### constructor(input: Buffer|string, options: Config)
`input` is either a Buffer or a string of the source JavaScript
`options` is an object containing 1 required property: `views` which is the directory of where to start finding templates. Also specify a `compress` property, which will compress the output of the dimples manager.

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
[GPL-2.0](https://github.com/maraisr/dimples/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

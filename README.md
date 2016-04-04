<p align="center">
	<a href="https://github.com/maraisr/dimples">
		<img height="240" width="240" src="http://dimples.io/static/dimples.svg">
	</a>
	<h1 align="center">Dimples</h1>
	<p align="center">JavaScript HTML templates can be just as cute as dimples!</p>
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
			views: './views/'
		})
	).code;

	fs.writeFile('output.js', code);
});
```

becomes

```js
var $dimples = (function() {
	function Dimples(tpls) {
		this.tpls = tpls;
	}

	Dimples.prototype['get'] = function(which) {
		return this.tpls[which];
	}

	return new Dimples({"1997400446":"<h1>Hello World</h1>"});
})();

console.log($dimples.get('1997400446'));
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
var $dimples = (function() {
	function Dimples(tpls) {
		this.tpls = tpls;
	}

	Dimples.prototype['get'] = function(which) {
		return this.tpls[which];
	}

	return new Dimples({"1997400446":"<h1>Hello World</h1>"});
})();

var vm = new Vue({
	el: '#app',
	template: $dimples.get('1997400446')
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
[GPL-2.0](https://github.com/maraisr/dimples/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

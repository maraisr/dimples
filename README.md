<p align="center">
	<h1 align="center">Dimples</h1>
	<p align="center">JavaScript and HTML templates can be just as cute as pair of dimples!</p>
</p>

[![NPM version](https://img.shields.io/npm/v/dimples.svg?style=flat-square)](https://www.npmjs.com/package/dimples)
[![Travis](https://img.shields.io/travis/maraisr/dimples.svg?style=flat-square)](https://travis-ci.org/maraisr/dimples)
[![Codecov](https://img.shields.io/codecov/c/github/maraisr/dimples.svg?style=flat-square)](https://codecov.io/github/maraisr/dimples)
[![License](https://img.shields.io/npm/l/dimples.svg?style=flat-square)](https://github.com/maraisr/dimples/blob/master/LICENSE.md)

## Intro
A build step that manages [Pug templates](http://jade-lang.com/) for use in JavaScript applications. Here's a [demo](https://github.com/maraisr/waybackthen) of it being used.

## Installation

via [npm](https://www.npmjs.com/)
```sh
npm i dimples --save
```

## Example

Input (`app.js`)
```js
document.body.innerHTML = '@tpl.Master';
```

build step
```js
var dimples = require('dimples'),
	fs = require('fs');

fs.readFile('app.js', function(e, input) {
	if (e !== null) {
		throw e;
	}

	var code = (
		new dimples(input, {
			views: './views/',
			compress: false
		})
	).code;

	fs.writeFile('output.js', code);
});
```

becomes (`output.js`)

```js
var $dimples = (function(d) {
	return (d == void 0) ? ({
		data: {},
		get: function(a) {
			return this.data[a];
		},
		add: function(tpls) {
			for (var key in tpls) {
				if (tpls.hasOwnProperty(key)) this.data[key] = tpls[key];
			}
		}
	}) : d;
})($dimples);

$dimples.add({1997400449: '<h1>Hello World</h1>'});

document.body.innerHTML = $dimples.get(1997400449);
```

---

## API

### constructor(input: Buffer|string, options: Config)
`input` is either a Buffer or a string of the source JavaScript
`options` is an object containing 1 required property: `views` which is the directory of where to start finding templates. Also specify a `compress` property, which will compress the output of the dimples manager.

#### .compile(void): Buffer
Returns a Buffer of the new source with pug templates.

#### .code: string
Returns a string of the new source with pug templates.

---

## Build
- `npm i typscript typings -g`
- `npm i`
- `typings i`
- `npm run build`

## License
[MIT](https://github.com/maraisr/dimples/blob/master/LICENSE.md)

Copyright(c) 2016 Marais Rossouw

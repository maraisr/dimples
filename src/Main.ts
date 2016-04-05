/// <reference path="../typings/main.d.ts" />

var fs = require('graceful-fs'),
	uglify = require('uglify-js');

import {Config, has} from './Common';

import Views, {ViewInterface} from './Views';

let uid = 0;

export class Dimples {
	private source: string;
	private config: Config;
	private uid: number;

	public views: Views;

	constructor(source: Buffer | string, config: Config) {
		this.source = (source instanceof Buffer) ? source.toString('utf-8') : source

		if (this.source == void 0 || this.source == '') {
			throw new ReferenceError('Dimples: No source passed.');
		}

		this.source = this.source.trim();
		this.uid = uid++;

		this.config = config || <Config>{};

		if (!has(this.config, 'compress')) {
			this.config.compress = true;
		}

		if (!has(this.config, 'views')) {
			throw new ReferenceError('Dimples: No views folder defined.');
		}

		this.config.jades = this.config.views + '**/*.jade';

		this.views = new Views(this.config);
	}

	compile(): Buffer {
		let re: RegExp = /['"]@tpl\.(.+)['"]/gm,
			m: RegExpExecArray;

		let viewFilesFound: Array<ViewInterface> = new Array();

		while ((m = re.exec(this.source)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}

			if (<string>m[1]) {
				viewFilesFound.push(this.views.find(<string>m[1]));
			}
		}

		return this.sourceAugment(viewFilesFound);
	}

	private sourceAugment(views: Array<ViewInterface>): Buffer {
		var tplFunc: string = function() {
			return (`
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

	dimples.add(${this.uid}, new Factory(${JSON.stringify(views.reduce((r: any, view: ViewInterface) => {
					return r[view.mangle] = view.compiled, r;
				}, {}))}));

	return dimples;
})($dimples);
			`);
		}.bind(this)().toString();

		if (this.config.compress) {
			tplFunc = uglify.minify(tplFunc, { fromString: true, compress: { unsafe: true, hoist_vars: true } }).code + '\n\n';
		}

		views.forEach((view: ViewInterface) => {
			this.source = this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), `$dimples.get('${view.mangle}',${this.uid})`);
		});

		this.source = tplFunc + this.source;

		return new Buffer(this.source);
	}

	get code(): string {
		return this.compile().toString();
	}
}

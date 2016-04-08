var fs = require('graceful-fs'),
	uglify = require('uglify-js');

import {has} from '../util/Object';

import {Config} from '../Config';
import Views, {ViewInterface} from './internal/Views';

let uid: number = 0;

export default class Dimples {
	private source: string;
	private config: Config;
	private uid: number;

	public views: Views;

	constructor(source: string | Buffer, config: Config) {
		this.source = (source instanceof Buffer) ? source.toString('utf-8') : source

		if (this.source == void 0 || this.source == '') {
			throw new ReferenceError('Dimples: No source passed.');
		}

		this.source = this.source.trim();
		this.uid = uid++;

		this.config = config || <Config>new Object();

		if (!has(this.config, 'compress')) {
			this.config.compress = true;
		}

		if (!has(this.config, 'views')) {
			throw new ReferenceError('Dimples: No views folder defined.');
		}

		this.views = new Views(this.config);
	}

	private sourceAugment(): string {
		let re: RegExp = /['"]@tpl\.(.*?)['"]/gm,
			m: RegExpExecArray;

		let views: Array<ViewInterface> = new Array();

		while ((m = re.exec(this.source)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}

			if (<string>m[1]) {
				let viewName: string = <string>m[1],
					found: ViewInterface = this.views.find(viewName);

				if (found) {
					views.push(found);
				}
			}
		}

		var tplFunc: string = function() {
			return (`
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

$dimples.add(${JSON.stringify(views.reduce((r: any, view: ViewInterface) => {
					return r[view.mangle + this.uid] = view.compiled, r;
				}, {}))});
			`);
		}.bind(this)().toString();

		if (this.config.compress) {
			tplFunc = uglify.minify(tplFunc, { fromString: true, compress: { unsafe: true, hoist_vars: true } }).code + '\n\n';
		}

		views.forEach((view: ViewInterface) => {
			this.source = this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), `$dimples.get(${view.mangle + this.uid})`);
		});

		this.source = tplFunc + this.source;

		return this.source;
	}

	get code(): string {
		return this.sourceAugment();
	}

	get buffer(): Buffer {
		return new Buffer(this.sourceAugment());
	}
}

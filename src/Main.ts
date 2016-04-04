/// <reference path="../typings/main.d.ts" />

var fs = require('graceful-fs');

import {Config, has} from './Common';

import Views, {ViewInterface} from './Views';

export class Dimples {
	private source: string;
	private config: Config;
	public views: Views;

	constructor(source: Buffer|string, config: Config) {
		this.source = (source instanceof Buffer) ?  source.toString('utf-8') : source

		if (this.source == void 0 || this.source == '') {
			throw new ReferenceError('Dimples: No source passed.');
		}

		this.source = this.source.trim();
		this.config = config;

		if (!has(this.config, 'views')) {
			throw new ReferenceError('Dimples: No views folder defined.');
		}

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
var $dimples = (function() {
	function Dimples(tpls) {
		this.tpls = tpls;
	}

	Dimples.prototype['get'] = function(which) {
		return this.tpls[which];
	}

	return new Dimples(${JSON.stringify(views.reduce((r: any, view: ViewInterface) => {
		return r[view.mangle] = view.compiled, r;
	}, {}))});
})();
			`);
		} ().toString();

		views.forEach((view: ViewInterface) => {
			this.source = this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$dimples.get(\'' + view.mangle + '\')');
		});

		this.source = tplFunc + this.source;

		return new Buffer(this.source);
	}

	get code(): string {
		return this.compile().toString();
	}
}

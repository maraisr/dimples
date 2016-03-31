/// <reference path="../typings/main.d.ts" />

import fs = require('graceful-fs');

import {Config} from './Common';

import Views, {ViewInterface} from './Views';

export class Templicated {
	private source: string;
	private config: Config;
	public views: Views;

	constructor(source: Buffer, config: Config) {
		this.source = source.toString('utf-8');
		this.config = config;

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
			return `
				var $templicated = (function() {
					function Templicated(tpls) {
						this.tpls = tpls;
					}

					Templicated.prototype['get'] = function(which) {
						return this.tpls[which];
					}

					return new Templicated(${JSON.stringify(views.reduce((r: any, view: ViewInterface) => {
						return r[view.mangle] = view.compiled, r;
					}, {}))});
				})();
			`;
		} ().toString();

		views.forEach((view:ViewInterface) => {
			this.source = this.source.replace(new RegExp('[\'"]@tpl\\.'+view.name+'[\'"]', 'g'), '$templicated.get(\''+view.mangle+'\')');
		});

		this.source = tplFunc + this.source;

		return new Buffer(this.source);
	}
}

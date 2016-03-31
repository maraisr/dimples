/// <reference path="../typings/main.d.ts" />

import fs = require('graceful-fs');

import {Config} from './Common';

import Views, {ViewInterface} from './Views';

export class Templicated {
	private source: Buffer;
	private config: Config;
	public views: Views;

	constructor(source: Buffer, config: Config) {
		this.source = source;
		this.config = config;

		this.views = new Views(this.config);
	}

	private compile(): Buffer {
		// Find the views needed
		let re: RegExp = /templicated\([\'\"]([\w\s]+)[\'\"]\)/gm,
			m: RegExpExecArray;

		let sourceString: string = this.source.toString('utf-8'),
			viewFilesFound: Array<string> = new Array();

		while ((m = re.exec(sourceString)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}

			viewFilesFound.push(<string>m[1]);
		}

		var viewsList: any = {};

		// Look for the views found, in our original found jade templates
		viewFilesFound.forEach((file: string) => {
			var found: ViewInterface = this.views.find(file);

			if (found) {
				// 1. Replace found.name with found.mangle
				sourceString = sourceString.replace(new RegExp(`templicated\\([\'\"]${found.name}[\'\"]\\)`, 'gm'), 'templicated(\'' + found.mangle + '\')');
				// 2. Insert found.mangle as a index
				// 3. Add the found.compiled as a template
				viewsList[found.mangle] = found.compiled;
			}
		});

		var func = 'function templicated(id) {return tpls[id];}';
		var tpls = 'var tpls = ' + JSON.stringify(viewsList);

		var final = tpls + ';' +func;

		return new Buffer(final + ';' + sourceString);
	}
}

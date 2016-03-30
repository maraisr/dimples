/// <reference path="../typings/main.d.ts" />

import fs = require('graceful-fs');
import parser = require('acorn');

import util = require('util');

import {Config} from './Common';

import Views from './Views';

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
		let parsed = new Parse(this.source);

		console.log(parsed.findTpls());

		return new Buffer('');
	}
}


class Parse {
	private parsed: any;

	constructor(source: Buffer) {
		this.parsed = parser.parse(source.toString('utf-8')).body;
	}

	public findTpls(): Array<string> {
		return new Array();
	}
}

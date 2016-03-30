/// <reference path="../typings/main.d.ts" />

import fs = require('graceful-fs');

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
}

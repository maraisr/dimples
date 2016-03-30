/// <reference path="../typings/main.d.ts" />

import jade = require('jade');
import fs = require('graceful-fs');

let viewUid = -1;

interface Config {
	views: string;
}

export class Templicated {
	private source: Buffer;
	private config: Config;
	public views: Array<View>;

	constructor(source: Buffer, config: Config) {
		this.source = source;
		this.config = config;

		this.views = this.getViews();
	}

	private getViews(): Array<View> {

		let returns = new Array();

		fs.readdirSync(this.config.views).forEach((path) => {
			returns.push(new View(path, this.config));
		})

		return returns;
	}
}

class View {
	private path: string;

	public compiled: string;
	public name:string;

	public uid:number;

	constructor(path: string, config: Config) {
		this.path = path;
		this.uid = viewUid += 1;

		this.compiled = jade.compile(fs.readFileSync(config.views + this.path, 'utf-8'))();

		this.name = this.path.replace(/\.jade/, '').trim();
	}
}

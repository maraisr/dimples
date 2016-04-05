var jade = require('jade'),
	fs = require('graceful-fs'),
	glob = require('globby');

import {Config} from './Common';

export interface ViewInterface {
	name: string;
	compiled: string;
	mangle: number;
}

export default class Views {
	private config: Config;
	private views: Array<View>;

	constructor(config: Config) {
		this.config = config;
		this.views = this.init();
	}

	private init(): Array<View> {
		var returns: Array<View> = new Array();

		glob.sync(this.config.jades).forEach((path: string) => {
			if (path.match(/\.jade$/)) {
				returns.push(new View(path, this.config));
			}
		});

		return returns;
	}

	find(name: string): View {
		return this.views.filter((v: View): boolean => {
			return v.name == name;
		}).pop();
	}
}

class View implements ViewInterface {
	private path: string;

	public compiled: string;
	public name: string;

	constructor(path: string, config: Config) {
		this.path = path;

		this.compiled = jade.compile(fs.readFileSync(this.path, 'utf-8'))();

		this.name = this.path.replace(config.views, '').replace(/\.jade/, '').trim();
	}

	get mangle(): number {
		let hash: number = 0,
			i: number,
			chr: number,
			len: number;

		if (this.name.length === 0) return hash;

		for (i = 0, len = this.name.length; i < len; i++) {
			chr = this.name.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}

		return Math.abs(hash);
	}
}

var pug = require('pug'),
	fs = require('graceful-fs'),
	glob = require('globby');

import {Config} from '../../Config';
import {has} from '../../util/Object';

export interface ViewInterface {
	name: string;
	compiled: string;
	mangle: number;
}

export default class Views {
	private config: Config;

	private views: Object = new Object();

	constructor(config: Config) {
		this.config = config;
	}

	find(name: string): View {
		if (has(this.views, name)) {
			return this.views[name];
		}

		let path: Array<string> = glob.sync(this.config.views + name + '.pug');

		if (path.length == 1 && path[0].match(/\.pug$/)) {
			return this.views[name] = new View(path[0], this.config);
		}

		return void 0;
	}
}

class View implements ViewInterface {
	private path: string;

	public compiled: string;
	public name: string;

	constructor(path: string, config: Config) {
		this.path = path;

		this.compiled = pug.compile(fs.readFileSync(this.path, 'utf-8'), {
			filename: this.path,
			cache: true
		})();

		this.name = this.path.replace(config.views, '').replace(/\.pug/, '').trim();
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

import jade = require('jade');
import fs = require('graceful-fs');

import {Config} from './Common';

export interface ViewInterface {
	name: string;
	compiled: string;
}

export default class Views {
	private config: Config;
	private views: Array<View>;

	constructor(config: Config) {
		this.config = config;
		this.views = this.init();
	}

	private init(): Array<View> {
		// TODO: Need this.config.views to also allow glob file matching
		return fs.readdirSync(this.config.views).map((path) => {
			return new View(path, this.config);
		});
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

		this.compiled = jade.compile(fs.readFileSync(config.views + this.path, 'utf-8'))();

		this.name = this.path.replace(/\.jade/, '').trim();
	}
}

var babel = require('rollup-plugin-babel'),
	includePaths = require('rollup-plugin-includepaths');

module.exports = {
	entry: 'tmp/Main.js',
	dest: 'dist/templicated.js',
	plugins: [
		includePaths({
			paths: ['tmp'],
			extensions: ['.js']
		}),
		babel()
	],
	format: 'cjs',
	moduleName: 'Templicated',
	moduleId: 'templicated'
};

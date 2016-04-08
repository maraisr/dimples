var babel = require('rollup-plugin-babel'),
	includePaths = require('rollup-plugin-includepaths');

module.exports = {
	entry: 'tmp/Index.js',
	dest: 'dist/dimples.js',
	plugins: [
		includePaths({
			paths: ['tmp'],
			extensions: ['.js']
		}),
		babel()
	],
	format: 'cjs',
	moduleName: 'Dimples',
	moduleId: 'dimples',
	sourceMap: 'inline'
};

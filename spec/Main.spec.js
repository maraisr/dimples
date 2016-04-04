var chai = require('chai'),
	expect = chai.expect;

var templicated = require('../dist/templicated.js').Templicated;

var config = { views: 'spec/helpers/views/' };

describe('Creation', function() {
	it('requires a string or Buffer source', function() {
		expect(function() {
			new templicated();
		}).to.throw(ReferenceError);
	});

	it('requires a views folder', function() {
		expect(function() {
			new templicated('@tpl.Master');
		}).to.throw(ReferenceError);
	});

	describe('#string', function() {
		it('reads string', function() {
			var input = '@tpl.Master';

			expect(function() {
				return (new templicated(input, config)).source;
			} ()).to.equal(input);
		});
	});

	describe('#buffer', function() {
		it('reads buffer', function() {
			var input = '@tpl.Master';

			expect(function() {
				return (new templicated(new Buffer(input), config)).source;
			} ()).to.equal(input);
		});
	});
});


describe('Compile', function() {
	describe('jade', function() {
		it('finds Master.jade', function() {
			var input = 'console.log(\'@tpl.Master\');',
				t = new templicated(new Buffer(input), config),
				tpl = t.views.find('Master');

			expect(tpl).property('name', 'Master');
		});
	});

	describe('eval of code output', function() {
		var input = '\'@tpl.Master\'',
			t = new templicated(new Buffer(input), config);

		expect(eval(t.code)).to.equal('<h1>Hello World</h1>');
	})
});

var chai = require('chai'),
	expect = chai.expect;

var templicated = require('../dist/Main.js').Templicated;

var config = {views: 'spec/helpers/views/'};

describe('Creation', function() {
	it('requires a string or Buffer source', function () {
		expect(function() {
			new templicated();
		}).to.throw(ReferenceError);
	});

	it('requires a views folder', function () {
		expect(function() {
			new templicated('@tpl.Master');
		}).to.throw(ReferenceError);
	});

	describe('#string', function () {
		it('reads string', function () {
			var input = '@tpl.Master';

			expect(function() {
				return (new templicated(input, config)).source;
			}()).to.equal(input);
		});
	});
});

var chai = require('chai'),
	jsdom = require('mocha-jsdom'),
	expect = chai.expect;

var dimples = require('../dist/dimples.js').Dimples;

var config = { views: 'spec/helpers/views/', compress: true };

jsdom();

function toHtml(html) {
	var cont = document.createElement('div');
	cont.innerHTML = html;
	return cont.childNodes;
}

describe('Creation', function() {
	it('requires a string or Buffer source', function() {
		expect(function() {
			new dimples();
		}).to.throw(ReferenceError);
	});

	it('requires a views folder', function() {
		expect(function() {
			new dimples('@tpl.Master');
		}).to.throw(ReferenceError);
	});

	describe('#string', function() {
		it('reads string', function() {
			var input = '@tpl.Master';

			expect(function() {
				return (new dimples(input, config)).source;
			} ()).to.equal(input);
		});

		it('returns a string', function() {
			var input = '@tpl.Master';

			expect(function() {
				return (new dimples(input, config)).code;
			} ()).to.be.a('string');
		});
	});

	describe('#buffer', function() {
		it('reads buffer', function() {
			var input = '@tpl.Master';

			expect(function() {
				return (new dimples(new Buffer(input), config)).source;
			} ()).to.equal(input);
		});

		it('returns a buffer', function() {
			var input = '@tpl.Master';

			expect(function() {
				return (new dimples(input, config)).buffer;
			} ()).to.be.an.instanceof(Buffer)
		});
	});
});

describe('Compile', function() {
	describe('jade', function() {
		it('finds Master.jade', function() {
			var input = 'console.log(\'@tpl.Master\');',
				t = new dimples(input, config),
				tpl = t.views.find('Master');

			expect(tpl).property('name', 'Master');
		});

		it('finds a globbed jade file', function() {
			var input = 'console.log(\'@tpl.partial/Profile\');',
				t = new dimples(input, config),
				tpl = t.views.find('partial/Profile');

			expect(tpl).property('name', 'partial/Profile');
		});
	});

	describe('output', function() {
		it('has a template', function() {
			var input = '\'@tpl.partial/Profile\'',
				t = new dimples(input, config);

			var data = (function() {
				eval(t.code);

				return $dimples.data;
			})();

			expect(Object.keys(data)).to.have.length(1);
		});

		it('caches the same template used twice', function() {
			var input = '\'@tpl.Master\'\n\'@tpl.Master\'',
				t = new dimples(input, config);

			t.code;

			expect(Object.keys(t.views.views)).to.have.length(1);
		});

		describe('correct templates', function() {
			it('spits out Master.jade', function() {
				var input = 'var x = \'@tpl.Master\'',
					t = new dimples(input, config);

				var data = (function() {
					eval(t.code);

					return x;
				})();

				expect(toHtml(data)[0].nodeName).to.equal('H1');
			});

			it('spits out partial/Profile.jade', function() {
				var input = 'var x = \'@tpl.partial/Profile\'',
					t = new dimples(input, config);

				var data = (function() {
					eval(t.code);

					return x;
				})();

				data = toHtml(data)[0];

				expect(data.nodeName).to.equal('DIV');
				expect(data.className).to.equal('profile');
			});
		});
	});
});

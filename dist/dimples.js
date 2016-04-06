'use strict';

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

function has(object, key) {
    return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
}

var jade = require('jade');
var fs$1 = require('graceful-fs');
var glob = require('globby');
var Views = function () {
    function Views(config) {
        babelHelpers.classCallCheck(this, Views);

        this.config = config;
        this.views = this.init();
    }

    babelHelpers.createClass(Views, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var returns = new Array();
            glob.sync(this.config.jades).forEach(function (path) {
                if (path.match(/\.jade$/)) {
                    returns.push(new View(path, _this.config));
                }
            });
            return returns;
        }
    }, {
        key: 'find',
        value: function find(name) {
            return this.views.filter(function (v) {
                return v.name == name;
            }).pop();
        }
    }]);
    return Views;
}();

var View = function () {
    function View(path, config) {
        babelHelpers.classCallCheck(this, View);

        this.path = path;
        this.compiled = jade.compileClient(fs$1.readFileSync(this.path, 'utf-8'), {
            filename: this.path,
            cache: true
        });
        this.name = this.path.replace(config.views, '').replace(/\.jade/, '').trim();
    }

    babelHelpers.createClass(View, [{
        key: 'mangle',
        get: function get() {
            var hash = 0,
                i = void 0,
                chr = void 0,
                len = void 0;
            if (this.name.length === 0) return hash;
            for (i = 0, len = this.name.length; i < len; i++) {
                chr = this.name.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0;
            }
            return Math.abs(hash);
        }
    }]);
    return View;
}();

/// <reference path="../typings/main.d.ts" />
var fs = require('graceful-fs');
var uglify = require('uglify-js');
var uid = 0;
var Dimples = function () {
    function Dimples(source, config) {
        babelHelpers.classCallCheck(this, Dimples);

        this.source = source instanceof Buffer ? source.toString('utf-8') : source;
        if (this.source == void 0 || this.source == '') {
            throw new ReferenceError('Dimples: No source passed.');
        }
        this.source = this.source.trim();
        this.uid = uid++;
        this.config = config || {};
        if (!has(this.config, 'compress')) {
            this.config.compress = true;
        }
        if (!has(this.config, 'views')) {
            throw new ReferenceError('Dimples: No views folder defined.');
        }
        this.config.jades = this.config.views + '**/*.jade';
        this.views = new Views(this.config);
    }

    babelHelpers.createClass(Dimples, [{
        key: 'compile',
        value: function compile() {
            var re = /['"]@tpl\.(.+)['"]/gm,
                m = void 0;
            var viewFilesFound = new Array();
            while ((m = re.exec(this.source)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                if (m[1]) {
                    viewFilesFound.push(this.views.find(m[1]));
                }
            }
            return this.sourceAugment(viewFilesFound);
        }
    }, {
        key: 'sourceAugment',
        value: function sourceAugment(views) {
            var _this2 = this;

            var tplFunc = function () {
                var _this = this;

                return '\nvar $dimples = (function(d) {\n\treturn (d == void 0) ? ({\n\t\tdata: {},\n\t\tget: function(a,b) {\n\t\t\treturn this.data[a](b);\n\t\t},\n\t\tadd: function(tpls) {\n\t\t\tfor (var key in tpls) {\n\t\t\t\tif (tpls.hasOwnProperty(key)) this.data[key] = tpls[key];\n\t\t\t}\n\t\t}\n\t}) : d;\n})($dimples);\n\n$dimples.add({' + views.reduce(function (r, view) {
                    return r += view.mangle + _this.uid + ': ' + view.compiled + ',', r;
                }, '').replace(/\,$/, '') + '});\n\t\t\t';
            }.bind(this)().toString();
            if (this.config.compress) {
                tplFunc = uglify.minify(tplFunc, { fromString: true, compress: { unsafe: true, hoist_vars: true } }).code + '\n\n';
            }
            views.forEach(function (view) {
                _this2.source = _this2.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$dimples.get(' + (view.mangle + _this2.uid) + ')');
            });
            this.source = tplFunc + this.source;
            return new Buffer(this.source);
        }
    }, {
        key: 'code',
        get: function get() {
            return this.compile().toString();
        }
    }]);
    return Dimples;
}();

exports.Dimples = Dimples;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB2YXIgcmV0dXJucyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBnbG9iLnN5bmModGhpcy5jb25maWcuamFkZXMpLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXRoLm1hdGNoKC9cXC5qYWRlJC8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJucy5wdXNoKG5ldyBWaWV3KHBhdGgsIHRoaXMuY29uZmlnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJucztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZUNsaWVudChmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCAndXRmLTgnKSwge1xuICAgICAgICAgICAgZmlsZW5hbWU6IHRoaXMucGF0aCxcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLnBhdGgucmVwbGFjZShjb25maWcudmlld3MsICcnKS5yZXBsYWNlKC9cXC5qYWRlLywgJycpLnRyaW0oKTtcbiAgICB9XG4gICAgZ2V0IG1hbmdsZSgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSAwLCBpLCBjaHIsIGxlbjtcbiAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gaGFzaDtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gdGhpcy5uYW1lLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjaHIgPSB0aGlzLm5hbWUuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNocjtcbiAgICAgICAgICAgIGhhc2ggfD0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoaGFzaCk7XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbWFpbi5kLnRzXCIgLz5cbnZhciBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJyksIHVnbGlmeSA9IHJlcXVpcmUoJ3VnbGlmeS1qcycpO1xuaW1wb3J0IHsgaGFzIH0gZnJvbSAnLi9Db21tb24nO1xuaW1wb3J0IFZpZXdzIGZyb20gJy4vVmlld3MnO1xubGV0IHVpZCA9IDA7XG5leHBvcnQgY2xhc3MgRGltcGxlcyB7XG4gICAgY29uc3RydWN0b3Ioc291cmNlLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSAoc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKSA/IHNvdXJjZS50b1N0cmluZygndXRmLTgnKSA6IHNvdXJjZTtcbiAgICAgICAgaWYgKHRoaXMuc291cmNlID09IHZvaWQgMCB8fCB0aGlzLnNvdXJjZSA9PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdEaW1wbGVzOiBObyBzb3VyY2UgcGFzc2VkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc291cmNlID0gdGhpcy5zb3VyY2UudHJpbSgpO1xuICAgICAgICB0aGlzLnVpZCA9IHVpZCsrO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICAgICAgaWYgKCFoYXModGhpcy5jb25maWcsICdjb21wcmVzcycpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb21wcmVzcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXModGhpcy5jb25maWcsICd2aWV3cycpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0RpbXBsZXM6IE5vIHZpZXdzIGZvbGRlciBkZWZpbmVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uZmlnLmphZGVzID0gdGhpcy5jb25maWcudmlld3MgKyAnKiovKi5qYWRlJztcbiAgICAgICAgdGhpcy52aWV3cyA9IG5ldyBWaWV3cyh0aGlzLmNvbmZpZyk7XG4gICAgfVxuICAgIGNvbXBpbGUoKSB7XG4gICAgICAgIGxldCByZSA9IC9bJ1wiXUB0cGxcXC4oLispWydcIl0vZ20sIG07XG4gICAgICAgIGxldCB2aWV3RmlsZXNGb3VuZCA9IG5ldyBBcnJheSgpO1xuICAgICAgICB3aGlsZSAoKG0gPSByZS5leGVjKHRoaXMuc291cmNlKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtWzFdKSB7XG4gICAgICAgICAgICAgICAgdmlld0ZpbGVzRm91bmQucHVzaCh0aGlzLnZpZXdzLmZpbmQobVsxXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUF1Z21lbnQodmlld0ZpbGVzRm91bmQpO1xuICAgIH1cbiAgICBzb3VyY2VBdWdtZW50KHZpZXdzKSB7XG4gICAgICAgIHZhciB0cGxGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChgXG52YXIgJGRpbXBsZXMgPSAoZnVuY3Rpb24oZCkge1xuXHRyZXR1cm4gKGQgPT0gdm9pZCAwKSA/ICh7XG5cdFx0ZGF0YToge30sXG5cdFx0Z2V0OiBmdW5jdGlvbihhLGIpIHtcblx0XHRcdHJldHVybiB0aGlzLmRhdGFbYV0oYik7XG5cdFx0fSxcblx0XHRhZGQ6IGZ1bmN0aW9uKHRwbHMpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiB0cGxzKSB7XG5cdFx0XHRcdGlmICh0cGxzLmhhc093blByb3BlcnR5KGtleSkpIHRoaXMuZGF0YVtrZXldID0gdHBsc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkgOiBkO1xufSkoJGRpbXBsZXMpO1xuXG4kZGltcGxlcy5hZGQoeyR7dmlld3MucmVkdWNlKChyLCB2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIgKz0gKHZpZXcubWFuZ2xlICsgdGhpcy51aWQpICsgJzogJyArIHZpZXcuY29tcGlsZWQgKyAnLCcsIHI7XG4gICAgICAgICAgICB9LCAnJykucmVwbGFjZSgvXFwsJC8sICcnKX19KTtcblx0XHRcdGApO1xuICAgICAgICB9LmJpbmQodGhpcykoKS50b1N0cmluZygpO1xuICAgICAgICBpZiAodGhpcy5jb25maWcuY29tcHJlc3MpIHtcbiAgICAgICAgICAgIHRwbEZ1bmMgPSB1Z2xpZnkubWluaWZ5KHRwbEZ1bmMsIHsgZnJvbVN0cmluZzogdHJ1ZSwgY29tcHJlc3M6IHsgdW5zYWZlOiB0cnVlLCBob2lzdF92YXJzOiB0cnVlIH0gfSkuY29kZSArICdcXG5cXG4nO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gdGhpcy5zb3VyY2UucmVwbGFjZShuZXcgUmVnRXhwKCdbXFwnXCJdQHRwbFxcXFwuJyArIHZpZXcubmFtZSArICdbXFwnXCJdJywgJ2cnKSwgYCRkaW1wbGVzLmdldCgke3ZpZXcubWFuZ2xlICsgdGhpcy51aWR9KWApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0cGxGdW5jICsgdGhpcy5zb3VyY2U7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyKHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUoKS50b1N0cmluZygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQjtXQUN0QixTQUFTLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFULEdBQTZELEtBQTdELENBRHNCOzs7SUNBN0IsT0FBTyxRQUFRLE1BQVIsQ0FBUDtJQUF3QkEsT0FBSyxRQUFRLGFBQVIsQ0FBTDtJQUE2QixPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ3BDO2FBQUEsS0FDakIsQ0FBWSxNQUFaLEVBQW9COzBDQURILE9BQ0c7O2FBQ1gsTUFBTCxHQUFjLE1BQWQsQ0FEZ0I7YUFFWCxLQUFMLEdBQWEsS0FBSyxJQUFMLEVBQWIsQ0FGZ0I7S0FBcEI7OzZCQURpQjs7K0JBS1Y7OztnQkFDQyxVQUFVLElBQUksS0FBSixFQUFWLENBREQ7aUJBRUUsSUFBTCxDQUFVLEtB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
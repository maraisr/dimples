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

            // TODO: Need this.config.views to also allow glob file matching
            return fs$1.readdirSync(this.config.views).map(function (path) {
                return new View(path, _this.config);
            });
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
        this.compiled = jade.compile(fs$1.readFileSync(config.views + this.path, 'utf-8'))();
        this.name = this.path.replace(/\.jade/, '').trim();
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
var Templicated = function () {
    function Templicated(source, config) {
        babelHelpers.classCallCheck(this, Templicated);

        this.source = source instanceof Buffer ? source.toString('utf-8') : source;
        if (this.source == void 0 || this.source == '') {
            throw new ReferenceError('Templicated: No source passed.');
        }
        this.source = this.source.trim();
        this.config = config;
        if (!has(this.config, 'views')) {
            throw new ReferenceError('Templicated: No views folder defined.');
        }
        this.views = new Views(this.config);
    }

    babelHelpers.createClass(Templicated, [{
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
            var _this = this;

            var tplFunc = function () {
                return '\nvar $templicated = (function() {\n\tfunction Templicated(tpls) {\n\t\tthis.tpls = tpls;\n\t}\n\n\tTemplicated.prototype[\'get\'] = function(which) {\n\t\treturn this.tpls[which];\n\t}\n\n\treturn new Templicated(' + JSON.stringify(views.reduce(function (r, view) {
                    return r[view.mangle] = view.compiled, r;
                }, {})) + ');\n})();\n\t\t\t';
            }().toString();
            views.forEach(function (view) {
                _this.source = _this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$templicated.get(\'' + view.mangle + '\')');
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
    return Templicated;
}();

exports.Templicated = Templicated;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxpY2F0ZWQuanMiLCJzb3VyY2VzIjpbIi4uL3RtcC9Db21tb24uanMiLCIuLi90bXAvVmlld3MuanMiLCIuLi90bXAvTWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaGFzKG9iamVjdCwga2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA/IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgOiBmYWxzZTtcbn1cbiIsInZhciBqYWRlID0gcmVxdWlyZSgnamFkZScpO1xudmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdzIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMudmlld3MgPSB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gVE9ETzogTmVlZCB0aGlzLmNvbmZpZy52aWV3cyB0byBhbHNvIGFsbG93IGdsb2IgZmlsZSBtYXRjaGluZ1xuICAgICAgICByZXR1cm4gZnMucmVhZGRpclN5bmModGhpcy5jb25maWcudmlld3MpLm1hcCgocGF0aCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWaWV3KHBhdGgsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZpbmQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3cy5maWx0ZXIoKHYpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB2Lm5hbWUgPT0gbmFtZTtcbiAgICAgICAgfSkucG9wKCk7XG4gICAgfVxufVxuY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IocGF0aCwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuY29tcGlsZWQgPSBqYWRlLmNvbXBpbGUoZnMucmVhZEZpbGVTeW5jKGNvbmZpZy52aWV3cyArIHRoaXMucGF0aCwgJ3V0Zi04JykpKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMucGF0aC5yZXBsYWNlKC9cXC5qYWRlLywgJycpLnRyaW0oKTtcbiAgICB9XG4gICAgZ2V0IG1hbmdsZSgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSAwLCBpLCBjaHIsIGxlbjtcbiAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gaGFzaDtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gdGhpcy5uYW1lLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjaHIgPSB0aGlzLm5hbWUuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNocjtcbiAgICAgICAgICAgIGhhc2ggfD0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoaGFzaCk7XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbWFpbi5kLnRzXCIgLz5cbnZhciBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJyk7XG5pbXBvcnQgeyBoYXMgfSBmcm9tICcuL0NvbW1vbic7XG5pbXBvcnQgVmlld3MgZnJvbSAnLi9WaWV3cyc7XG5leHBvcnQgY2xhc3MgVGVtcGxpY2F0ZWQge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcikgPyBzb3VyY2UudG9TdHJpbmcoJ3V0Zi04JykgOiBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSA9PSB2b2lkIDAgfHwgdGhpcy5zb3VyY2UgPT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignVGVtcGxpY2F0ZWQ6IE5vIHNvdXJjZSBwYXNzZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltKCk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignVGVtcGxpY2F0ZWQ6IE5vIHZpZXdzIGZvbGRlciBkZWZpbmVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlld3MgPSBuZXcgVmlld3ModGhpcy5jb25maWcpO1xuICAgIH1cbiAgICBjb21waWxlKCkge1xuICAgICAgICBsZXQgcmUgPSAvWydcIl1AdHBsXFwuKC4rKVsnXCJdL2dtLCBtO1xuICAgICAgICBsZXQgdmlld0ZpbGVzRm91bmQgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgd2hpbGUgKChtID0gcmUuZXhlYyh0aGlzLnNvdXJjZSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobS5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmUubGFzdEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobVsxXSkge1xuICAgICAgICAgICAgICAgIHZpZXdGaWxlc0ZvdW5kLnB1c2godGhpcy52aWV3cy5maW5kKG1bMV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VBdWdtZW50KHZpZXdGaWxlc0ZvdW5kKTtcbiAgICB9XG4gICAgc291cmNlQXVnbWVudCh2aWV3cykge1xuICAgICAgICB2YXIgdHBsRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoYFxudmFyICR0ZW1wbGljYXRlZCA9IChmdW5jdGlvbigpIHtcblx0ZnVuY3Rpb24gVGVtcGxpY2F0ZWQodHBscykge1xuXHRcdHRoaXMudHBscyA9IHRwbHM7XG5cdH1cblxuXHRUZW1wbGljYXRlZC5wcm90b3R5cGVbJ2dldCddID0gZnVuY3Rpb24od2hpY2gpIHtcblx0XHRyZXR1cm4gdGhpcy50cGxzW3doaWNoXTtcblx0fVxuXG5cdHJldHVybiBuZXcgVGVtcGxpY2F0ZWQoJHtKU09OLnN0cmluZ2lmeSh2aWV3cy5yZWR1Y2UoKHIsIHZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gclt2aWV3Lm1hbmdsZV0gPSB2aWV3LmNvbXBpbGVkLCByO1xuICAgICAgICAgICAgfSwge30pKX0pO1xufSkoKTtcblx0XHRcdGApO1xuICAgICAgICB9KCkudG9TdHJpbmcoKTtcbiAgICAgICAgdmlld3MuZm9yRWFjaCgodmlldykgPT4ge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXCdcIl1AdHBsXFxcXC4nICsgdmlldy5uYW1lICsgJ1tcXCdcIl0nLCAnZycpLCAnJHRlbXBsaWNhdGVkLmdldChcXCcnICsgdmlldy5tYW5nbGUgKyAnXFwnKScpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0cGxGdW5jICsgdGhpcy5zb3VyY2U7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyKHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUoKS50b1N0cmluZygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQjtXQUN0QixTQUFTLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFULEdBQTZELEtBQTdELENBRHNCOzs7QUNBakMsSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSUEsT0FBSyxRQUFRLGFBQVIsQ0FBTDs7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
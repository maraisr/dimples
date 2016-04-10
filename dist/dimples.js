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

var pug = require('pug');
var fs$1 = require('graceful-fs');
var glob = require('globby');
var Views = function () {
    function Views(config) {
        babelHelpers.classCallCheck(this, Views);

        this.views = new Object();
        this.config = config;
    }

    babelHelpers.createClass(Views, [{
        key: 'find',
        value: function find(name) {
            if (has(this.views, name)) {
                return this.views[name];
            }
            var path = glob.sync(this.config.views + name + '.pug');
            if (path.length == 1 && path[0].match(/\.pug$/)) {
                return this.views[name] = new View(path[0], this.config);
            }
            return void 0;
        }
    }]);
    return Views;
}();

var View = function () {
    function View(path, config) {
        babelHelpers.classCallCheck(this, View);

        this.path = path;
        this.compiled = pug.compile(fs$1.readFileSync(this.path, 'utf-8'), {
            filename: this.path,
            cache: true
        })();
        this.name = this.path.replace(config.views, '').replace(/\.pug/, '').trim();
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
        this.config = config || new Object();
        if (!has(this.config, 'compress')) {
            this.config.compress = true;
        }
        if (!has(this.config, 'views')) {
            throw new ReferenceError('Dimples: No views folder defined.');
        }
        this.views = new Views(this.config);
    }

    babelHelpers.createClass(Dimples, [{
        key: 'sourceAugment',
        value: function sourceAugment() {
            var _this2 = this;

            var re = /['"]@tpl\.(.*?)['"]/gm,
                m = void 0;
            var views = new Array();
            while ((m = re.exec(this.source)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                if (m[1]) {
                    var viewName = m[1],
                        found = this.views.find(viewName);
                    if (found) {
                        views.push(found);
                    }
                }
            }
            var tplFunc = function () {
                var _this = this;

                return '\nvar $dimples = (function(d) {\n\treturn (d == void 0) ? ({\n\t\tdata: {},\n\t\tget: function(a) {\n\t\t\treturn this.data[a];\n\t\t},\n\t\tadd: function(tpls) {\n\t\t\tfor (var key in tpls) {\n\t\t\t\tif (tpls.hasOwnProperty(key)) this.data[key] = tpls[key];\n\t\t\t}\n\t\t}\n\t}) : d;\n})($dimples);\n\n$dimples.add(' + JSON.stringify(views.reduce(function (r, view) {
                    return r[view.mangle + _this.uid] = view.compiled, r;
                }, {})) + ');\n\t\t\t';
            }.bind(this)().toString();
            if (this.config.compress) {
                tplFunc = uglify.minify(tplFunc, { fromString: true, compress: { unsafe: true, hoist_vars: true } }).code + '\n\n';
            }
            views.forEach(function (view) {
                _this2.source = _this2.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$dimples.get(' + (view.mangle + _this2.uid) + ')');
            });
            this.source = tplFunc + this.source;
            return this.source;
        }
    }, {
        key: 'code',
        get: function get() {
            return this.sourceAugment();
        }
    }, {
        key: 'buffer',
        get: function get() {
            return new Buffer(this.sourceAugment());
        }
    }]);
    return Dimples;
}();

module.exports = Dimples;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL3V0aWwvT2JqZWN0LmpzIiwiLi4vdG1wL2luc3RhbmNlL2ludGVybmFsL1ZpZXdzLmpzIiwiLi4vdG1wL2luc3RhbmNlL0RpbXBsZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGhhcyhvYmplY3QsIGtleSkge1xuICAgIHJldHVybiBvYmplY3QgPyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpIDogZmFsc2U7XG59XG4iLCJ2YXIgcHVnID0gcmVxdWlyZSgncHVnJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuaW1wb3J0IHsgaGFzIH0gZnJvbSAnLi4vLi4vdXRpbC9PYmplY3QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLnZpZXdzID0gbmV3IE9iamVjdCgpO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIGlmIChoYXModGhpcy52aWV3cywgbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpZXdzW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwYXRoID0gZ2xvYi5zeW5jKHRoaXMuY29uZmlnLnZpZXdzICsgbmFtZSArICcucHVnJyk7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAxICYmIHBhdGhbMF0ubWF0Y2goL1xcLnB1ZyQvKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlld3NbbmFtZV0gPSBuZXcgVmlldyhwYXRoWzBdLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IHB1Zy5jb21waWxlKGZzLnJlYWRGaWxlU3luYyh0aGlzLnBhdGgsICd1dGYtOCcpLCB7XG4gICAgICAgICAgICBmaWxlbmFtZTogdGhpcy5wYXRoLFxuICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgfSkoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYXRoLnJlcGxhY2UoY29uZmlnLnZpZXdzLCAnJykucmVwbGFjZSgvXFwucHVnLywgJycpLnRyaW0oKTtcbiAgICB9XG4gICAgZ2V0IG1hbmdsZSgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSAwLCBpLCBjaHIsIGxlbjtcbiAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gaGFzaDtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gdGhpcy5uYW1lLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjaHIgPSB0aGlzLm5hbWUuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNocjtcbiAgICAgICAgICAgIGhhc2ggfD0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoaGFzaCk7XG4gICAgfVxufVxuIiwidmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgdWdsaWZ5ID0gcmVxdWlyZSgndWdsaWZ5LWpzJyk7XG5pbXBvcnQgeyBoYXMgfSBmcm9tICcuLi91dGlsL09iamVjdCc7XG5pbXBvcnQgVmlld3MgZnJvbSAnLi9pbnRlcm5hbC9WaWV3cyc7XG5sZXQgdWlkID0gMDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpbXBsZXMge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcikgPyBzb3VyY2UudG9TdHJpbmcoJ3V0Zi04JykgOiBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSA9PSB2b2lkIDAgfHwgdGhpcy5zb3VyY2UgPT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gc291cmNlIHBhc3NlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW0oKTtcbiAgICAgICAgdGhpcy51aWQgPSB1aWQrKztcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwgbmV3IE9iamVjdCgpO1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ2NvbXByZXNzJykpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbXByZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gdmlld3MgZm9sZGVyIGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3cyA9IG5ldyBWaWV3cyh0aGlzLmNvbmZpZyk7XG4gICAgfVxuICAgIHNvdXJjZUF1Z21lbnQoKSB7XG4gICAgICAgIGxldCByZSA9IC9bJ1wiXUB0cGxcXC4oLio/KVsnXCJdL2dtLCBtO1xuICAgICAgICBsZXQgdmlld3MgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgd2hpbGUgKChtID0gcmUuZXhlYyh0aGlzLnNvdXJjZSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobS5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmUubGFzdEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobVsxXSkge1xuICAgICAgICAgICAgICAgIGxldCB2aWV3TmFtZSA9IG1bMV0sIGZvdW5kID0gdGhpcy52aWV3cy5maW5kKHZpZXdOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlld3MucHVzaChmb3VuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciB0cGxGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChgXG52YXIgJGRpbXBsZXMgPSAoZnVuY3Rpb24oZCkge1xuXHRyZXR1cm4gKGQgPT0gdm9pZCAwKSA/ICh7XG5cdFx0ZGF0YToge30sXG5cdFx0Z2V0OiBmdW5jdGlvbihhKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5kYXRhW2FdO1xuXHRcdH0sXG5cdFx0YWRkOiBmdW5jdGlvbih0cGxzKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gdHBscykge1xuXHRcdFx0XHRpZiAodHBscy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB0aGlzLmRhdGFba2V5XSA9IHRwbHNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdH0pIDogZDtcbn0pKCRkaW1wbGVzKTtcblxuJGRpbXBsZXMuYWRkKCR7SlNPTi5zdHJpbmdpZnkodmlld3MucmVkdWNlKChyLCB2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJbdmlldy5tYW5nbGUgKyB0aGlzLnVpZF0gPSB2aWV3LmNvbXBpbGVkLCByO1xuICAgICAgICAgICAgfSwge30pKX0pO1xuXHRcdFx0YCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSgpLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5jb21wcmVzcykge1xuICAgICAgICAgICAgdHBsRnVuYyA9IHVnbGlmeS5taW5pZnkodHBsRnVuYywgeyBmcm9tU3RyaW5nOiB0cnVlLCBjb21wcmVzczogeyB1bnNhZmU6IHRydWUsIGhvaXN0X3ZhcnM6IHRydWUgfSB9KS5jb2RlICsgJ1xcblxcbic7XG4gICAgICAgIH1cbiAgICAgICAgdmlld3MuZm9yRWFjaCgodmlldykgPT4ge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXCdcIl1AdHBsXFxcXC4nICsgdmlldy5uYW1lICsgJ1tcXCdcIl0nLCAnZycpLCBgJGRpbXBsZXMuZ2V0KCR7dmlldy5tYW5nbGUgKyB0aGlzLnVpZH0pYCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHRwbEZ1bmMgKyB0aGlzLnNvdXJjZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlO1xuICAgIH1cbiAgICBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlQXVnbWVudCgpO1xuICAgIH1cbiAgICBnZXQgYnVmZmVyKCkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLnNvdXJjZUF1Z21lbnQoKSk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbImZzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTLEdBQVQsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLEVBQTBCO1dBQ3RCLFNBQVMsT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLEdBQTdDLENBQVQsR0FBNkQsS0FBN0QsQ0FEc0I7OztJQ0E3QixNQUFNLFFBQVEsS0FBUixDQUFOO0lBQXNCQSxPQUFLLFFBQVEsYUFBUixDQUFMO0lBQTZCLE9BQU8sUUFBUSxRQUFSLENBQVA7SUFFbEM7YUFBQSxLQUNqQixDQUFZLE1BQVosRUFBb0I7MENBREgsT0FDRzs7YUFDWCxLQUFMLEdBQWEsSUFBSSxNQUFKLEVBQWIsQ0FEZ0I7YUFFWCxNQUFMLEdBQWMsTUFBZCxDQUZnQjtLQUFwQjs7NkJBRGlCOzs2QkFLWixNQUFNO2dCQUNILElBQUksS0FBSyxLQUFMLEVBQVksSUFBaEIsQ0FBSixFQUEyQjt1QkFDaEIsS0FBSyxLQUFM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
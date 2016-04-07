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

        this.views = new Object();
        this.config = config;
    }

    babelHelpers.createClass(Views, [{
        key: 'find',
        value: function find(name) {
            if (has(this.views, name)) {
                return this.views[name];
            }
            var path = glob.sync(this.config.views + name + '.jade');
            if (path.length == 1 && path[0].match(/\.jade$/)) {
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
        this.compiled = jade.compile(fs$1.readFileSync(this.path, 'utf-8'), {
            filename: this.path,
            cache: true
        })();
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
        this.config = config || new Object();
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

exports.Dimples = Dimples;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuaW1wb3J0IHsgaGFzIH0gZnJvbSAnLi9Db21tb24nO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLnZpZXdzID0gbmV3IE9iamVjdCgpO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIGlmIChoYXModGhpcy52aWV3cywgbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpZXdzW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwYXRoID0gZ2xvYi5zeW5jKHRoaXMuY29uZmlnLnZpZXdzICsgbmFtZSArICcuamFkZScpO1xuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT0gMSAmJiBwYXRoWzBdLm1hdGNoKC9cXC5qYWRlJC8pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aWV3c1tuYW1lXSA9IG5ldyBWaWV3KHBhdGhbMF0sIHRoaXMuY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbn1cbmNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKHBhdGgsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLmNvbXBpbGVkID0gamFkZS5jb21waWxlKGZzLnJlYWRGaWxlU3luYyh0aGlzLnBhdGgsICd1dGYtOCcpLCB7XG4gICAgICAgICAgICBmaWxlbmFtZTogdGhpcy5wYXRoLFxuICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgfSkoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYXRoLnJlcGxhY2UoY29uZmlnLnZpZXdzLCAnJykucmVwbGFjZSgvXFwuamFkZS8sICcnKS50cmltKCk7XG4gICAgfVxuICAgIGdldCBtYW5nbGUoKSB7XG4gICAgICAgIGxldCBoYXNoID0gMCwgaSwgY2hyLCBsZW47XG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMubmFtZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2hyID0gdGhpcy5uYW1lLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaHI7XG4gICAgICAgICAgICBoYXNoIHw9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGhhc2gpO1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21haW4uZC50c1wiIC8+XG52YXIgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpLCB1Z2xpZnkgPSByZXF1aXJlKCd1Z2xpZnktanMnKTtcbmltcG9ydCB7IGhhcyB9IGZyb20gJy4vQ29tbW9uJztcbmltcG9ydCBWaWV3cyBmcm9tICcuL1ZpZXdzJztcbmxldCB1aWQgPSAwO1xuZXhwb3J0IGNsYXNzIERpbXBsZXMge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcikgPyBzb3VyY2UudG9TdHJpbmcoJ3V0Zi04JykgOiBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSA9PSB2b2lkIDAgfHwgdGhpcy5zb3VyY2UgPT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gc291cmNlIHBhc3NlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW0oKTtcbiAgICAgICAgdGhpcy51aWQgPSB1aWQrKztcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwgbmV3IE9iamVjdCgpO1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ2NvbXByZXNzJykpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbXByZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gdmlld3MgZm9sZGVyIGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcuamFkZXMgPSB0aGlzLmNvbmZpZy52aWV3cyArICcqKi8qLmphZGUnO1xuICAgICAgICB0aGlzLnZpZXdzID0gbmV3IFZpZXdzKHRoaXMuY29uZmlnKTtcbiAgICB9XG4gICAgc291cmNlQXVnbWVudCgpIHtcbiAgICAgICAgbGV0IHJlID0gL1snXCJdQHRwbFxcLiguKj8pWydcIl0vZ20sIG07XG4gICAgICAgIGxldCB2aWV3cyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB3aGlsZSAoKG0gPSByZS5leGVjKHRoaXMuc291cmNlKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtWzFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZpZXdOYW1lID0gbVsxXSwgZm91bmQgPSB0aGlzLnZpZXdzLmZpbmQodmlld05hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3cy5wdXNoKGZvdW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRwbEZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGBcbnZhciAkZGltcGxlcyA9IChmdW5jdGlvbihkKSB7XG5cdHJldHVybiAoZCA9PSB2b2lkIDApID8gKHtcblx0XHRkYXRhOiB7fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdHJldHVybiB0aGlzLmRhdGFbYV07XG5cdFx0fSxcblx0XHRhZGQ6IGZ1bmN0aW9uKHRwbHMpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiB0cGxzKSB7XG5cdFx0XHRcdGlmICh0cGxzLmhhc093blByb3BlcnR5KGtleSkpIHRoaXMuZGF0YVtrZXldID0gdHBsc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkgOiBkO1xufSkoJGRpbXBsZXMpO1xuXG4kZGltcGxlcy5hZGQoJHtKU09OLnN0cmluZ2lmeSh2aWV3cy5yZWR1Y2UoKHIsIHZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gclt2aWV3Lm1hbmdsZSArIHRoaXMudWlkXSA9IHZpZXcuY29tcGlsZWQsIHI7XG4gICAgICAgICAgICB9LCB7fSkpfSk7XG5cdFx0XHRgKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKCkudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNvbXByZXNzKSB7XG4gICAgICAgICAgICB0cGxGdW5jID0gdWdsaWZ5Lm1pbmlmeSh0cGxGdW5jLCB7IGZyb21TdHJpbmc6IHRydWUsIGNvbXByZXNzOiB7IHVuc2FmZTogdHJ1ZSwgaG9pc3RfdmFyczogdHJ1ZSB9IH0pLmNvZGUgKyAnXFxuXFxuJztcbiAgICAgICAgfVxuICAgICAgICB2aWV3cy5mb3JFYWNoKCh2aWV3KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnJlcGxhY2UobmV3IFJlZ0V4cCgnW1xcJ1wiXUB0cGxcXFxcLicgKyB2aWV3Lm5hbWUgKyAnW1xcJ1wiXScsICdnJyksIGAkZGltcGxlcy5nZXQoJHt2aWV3Lm1hbmdsZSArIHRoaXMudWlkfSlgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlID0gdHBsRnVuYyArIHRoaXMuc291cmNlO1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2U7XG4gICAgfVxuICAgIGdldCBjb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VBdWdtZW50KCk7XG4gICAgfVxuICAgIGdldCBidWZmZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyKHRoaXMuc291cmNlQXVnbWVudCgpKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiZnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVMsR0FBVCxDQUFhLE1BQWIsRUFBcUIsR0FBckIsRUFBMEI7V0FDdEIsU0FBUyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsTUFBckMsRUFBNkMsR0FBN0MsQ0FBVCxHQUE2RCxLQUE3RCxDQURzQjs7O0lDQTdCLE9BQU8sUUFBUSxNQUFSLENBQVA7SUFBd0JBLE9BQUssUUFBUSxhQUFSLENBQUw7SUFBNkIsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUVwQzthQUFBLEtBQ2pCLENBQVksTUFBWixFQUFvQjswQ0FESCxPQUNHOzthQUNYLEtBQUwsR0FBYSxJQUFJLE1BQUosRUFBYixDQURnQjthQUVYLE1BQUwsR0FBYyxNQUFkLENBRmdCO0tBQXBCOzs2QkFEaUI7OzZCQUtaLE1BQU07Z0JBQ0gsSUFB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
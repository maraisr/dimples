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
            var re = /['"]@tpl\.(.*?)['"]/gm,
                m = void 0;
            var viewFilesFound = new Array();
            while ((m = re.exec(this.source)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                if (m[1]) {
                    var viewName = m[1];
                    viewFilesFound.push(this.views.find(viewName));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB2YXIgcmV0dXJucyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBnbG9iLnN5bmModGhpcy5jb25maWcuamFkZXMpLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXRoLm1hdGNoKC9cXC5qYWRlJC8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJucy5wdXNoKG5ldyBWaWV3KHBhdGgsIHRoaXMuY29uZmlnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJucztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZShmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCAndXRmLTgnKSwge1xuICAgICAgICAgICAgZmlsZW5hbWU6IHRoaXMucGF0aCxcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgIH0pKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMucGF0aC5yZXBsYWNlKGNvbmZpZy52aWV3cywgJycpLnJlcGxhY2UoL1xcLmphZGUvLCAnJykudHJpbSgpO1xuICAgIH1cbiAgICBnZXQgbWFuZ2xlKCkge1xuICAgICAgICBsZXQgaGFzaCA9IDAsIGksIGNociwgbGVuO1xuICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLm5hbWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNociA9IHRoaXMubmFtZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xuICAgICAgICAgICAgaGFzaCB8PSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhoYXNoKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tYWluLmQudHNcIiAvPlxudmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgdWdsaWZ5ID0gcmVxdWlyZSgndWdsaWZ5LWpzJyk7XG5pbXBvcnQgeyBoYXMgfSBmcm9tICcuL0NvbW1vbic7XG5pbXBvcnQgVmlld3MgZnJvbSAnLi9WaWV3cyc7XG5sZXQgdWlkID0gMDtcbmV4cG9ydCBjbGFzcyBEaW1wbGVzIHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBCdWZmZXIpID8gc291cmNlLnRvU3RyaW5nKCd1dGYtOCcpIDogc291cmNlO1xuICAgICAgICBpZiAodGhpcy5zb3VyY2UgPT0gdm9pZCAwIHx8IHRoaXMuc291cmNlID09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0RpbXBsZXM6IE5vIHNvdXJjZSBwYXNzZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltKCk7XG4gICAgICAgIHRoaXMudWlkID0gdWlkKys7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ2NvbXByZXNzJykpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbXByZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gdmlld3MgZm9sZGVyIGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcuamFkZXMgPSB0aGlzLmNvbmZpZy52aWV3cyArICcqKi8qLmphZGUnO1xuICAgICAgICB0aGlzLnZpZXdzID0gbmV3IFZpZXdzKHRoaXMuY29uZmlnKTtcbiAgICB9XG4gICAgY29tcGlsZSgpIHtcbiAgICAgICAgbGV0IHJlID0gL1snXCJdQHRwbFxcLiguKj8pWydcIl0vZ20sIG07XG4gICAgICAgIGxldCB2aWV3RmlsZXNGb3VuZCA9IG5ldyBBcnJheSgpO1xuICAgICAgICB3aGlsZSAoKG0gPSByZS5leGVjKHRoaXMuc291cmNlKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtWzFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZpZXdOYW1lID0gbVsxXTtcbiAgICAgICAgICAgICAgICB2aWV3RmlsZXNGb3VuZC5wdXNoKHRoaXMudmlld3MuZmluZCh2aWV3TmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUF1Z21lbnQodmlld0ZpbGVzRm91bmQpO1xuICAgIH1cbiAgICBzb3VyY2VBdWdtZW50KHZpZXdzKSB7XG4gICAgICAgIHZhciB0cGxGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChgXG52YXIgJGRpbXBsZXMgPSAoZnVuY3Rpb24oZCkge1xuXHRyZXR1cm4gKGQgPT0gdm9pZCAwKSA/ICh7XG5cdFx0ZGF0YToge30sXG5cdFx0Z2V0OiBmdW5jdGlvbihhKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5kYXRhW2FdO1xuXHRcdH0sXG5cdFx0YWRkOiBmdW5jdGlvbih0cGxzKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gdHBscykge1xuXHRcdFx0XHRpZiAodHBscy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB0aGlzLmRhdGFba2V5XSA9IHRwbHNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdH0pIDogZDtcbn0pKCRkaW1wbGVzKTtcblxuJGRpbXBsZXMuYWRkKCR7SlNPTi5zdHJpbmdpZnkodmlld3MucmVkdWNlKChyLCB2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJbdmlldy5tYW5nbGUgKyB0aGlzLnVpZF0gPSB2aWV3LmNvbXBpbGVkLCByO1xuICAgICAgICAgICAgfSwge30pKX0pO1xuXHRcdFx0YCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSgpLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5jb21wcmVzcykge1xuICAgICAgICAgICAgdHBsRnVuYyA9IHVnbGlmeS5taW5pZnkodHBsRnVuYywgeyBmcm9tU3RyaW5nOiB0cnVlLCBjb21wcmVzczogeyB1bnNhZmU6IHRydWUsIGhvaXN0X3ZhcnM6IHRydWUgfSB9KS5jb2RlICsgJ1xcblxcbic7XG4gICAgICAgIH1cbiAgICAgICAgdmlld3MuZm9yRWFjaCgodmlldykgPT4ge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXCdcIl1AdHBsXFxcXC4nICsgdmlldy5uYW1lICsgJ1tcXCdcIl0nLCAnZycpLCBgJGRpbXBsZXMuZ2V0KCR7dmlldy5tYW5nbGUgKyB0aGlzLnVpZH0pYCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHRwbEZ1bmMgKyB0aGlzLnNvdXJjZTtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIodGhpcy5zb3VyY2UpO1xuICAgIH1cbiAgICBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZSgpLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbImZzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTLEdBQVQsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLEVBQTBCO1dBQ3RCLFNBQVMsT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLEdBQTdDLENBQVQsR0FBNkQsS0FBN0QsQ0FEc0I7OztJQ0E3QixPQUFPLFFBQVEsTUFBUixDQUFQO0lBQXdCQSxPQUFLLFFBQVEsYUFBUixDQUFMO0lBQTZCLE9BQU8sUUFBUSxRQUFSLENBQVA7SUFDcEM7YUFBQSxLQUNqQixDQUFZLE1BQVosRUFBb0I7MENBREgsT0FDRzs7YUFDWCxNQUFMLEdBQWMsTUFBZCxDQURnQjthQUVYLEtBQUwsR0FBYSxLQUFLLElBQUwsRUFBYixDQUZnQjtLQUFwQjs7NkJBRGlCOzsrQkFLVjs7O2dCQUNDLFVBQVUsSUFBSSxLQUFKLEVBQVYsQ0FERDtpQkFFRSxJ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
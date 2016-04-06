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

                return '\nvar $dimples = (function(d) {\n\treturn (d == void 0) ? ({\n\t\tdata: {},\n\t\tget: function(i) {\n\t\t\treturn this.data[i];\n\t\t},\n\t\tadd: function(tpls) {\n\t\t\tfor (var key in tpls) {\n\t\t\t\tif (tpls.hasOwnProperty(key)) this.data[key] = tpls[key];\n\t\t\t}\n\t\t}\n\t}) : d;\n})($dimples);\n\n$dimples.add(' + JSON.stringify(views.reduce(function (r, view) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB2YXIgcmV0dXJucyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBnbG9iLnN5bmModGhpcy5jb25maWcuamFkZXMpLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXRoLm1hdGNoKC9cXC5qYWRlJC8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJucy5wdXNoKG5ldyBWaWV3KHBhdGgsIHRoaXMuY29uZmlnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJucztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZShmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCAndXRmLTgnKSwge1xuICAgICAgICAgICAgZmlsZW5hbWU6IHRoaXMucGF0aCxcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgIH0pKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMucGF0aC5yZXBsYWNlKGNvbmZpZy52aWV3cywgJycpLnJlcGxhY2UoL1xcLmphZGUvLCAnJykudHJpbSgpO1xuICAgIH1cbiAgICBnZXQgbWFuZ2xlKCkge1xuICAgICAgICBsZXQgaGFzaCA9IDAsIGksIGNociwgbGVuO1xuICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLm5hbWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNociA9IHRoaXMubmFtZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xuICAgICAgICAgICAgaGFzaCB8PSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhoYXNoKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tYWluLmQudHNcIiAvPlxudmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgdWdsaWZ5ID0gcmVxdWlyZSgndWdsaWZ5LWpzJyk7XG5pbXBvcnQgeyBoYXMgfSBmcm9tICcuL0NvbW1vbic7XG5pbXBvcnQgVmlld3MgZnJvbSAnLi9WaWV3cyc7XG5sZXQgdWlkID0gMDtcbmV4cG9ydCBjbGFzcyBEaW1wbGVzIHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBCdWZmZXIpID8gc291cmNlLnRvU3RyaW5nKCd1dGYtOCcpIDogc291cmNlO1xuICAgICAgICBpZiAodGhpcy5zb3VyY2UgPT0gdm9pZCAwIHx8IHRoaXMuc291cmNlID09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0RpbXBsZXM6IE5vIHNvdXJjZSBwYXNzZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltKCk7XG4gICAgICAgIHRoaXMudWlkID0gdWlkKys7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ2NvbXByZXNzJykpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbXByZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gdmlld3MgZm9sZGVyIGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcuamFkZXMgPSB0aGlzLmNvbmZpZy52aWV3cyArICcqKi8qLmphZGUnO1xuICAgICAgICB0aGlzLnZpZXdzID0gbmV3IFZpZXdzKHRoaXMuY29uZmlnKTtcbiAgICB9XG4gICAgY29tcGlsZSgpIHtcbiAgICAgICAgbGV0IHJlID0gL1snXCJdQHRwbFxcLiguKylbJ1wiXS9nbSwgbTtcbiAgICAgICAgbGV0IHZpZXdGaWxlc0ZvdW5kID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHdoaWxlICgobSA9IHJlLmV4ZWModGhpcy5zb3VyY2UpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG0uaW5kZXggPT09IHJlLmxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1bMV0pIHtcbiAgICAgICAgICAgICAgICB2aWV3RmlsZXNGb3VuZC5wdXNoKHRoaXMudmlld3MuZmluZChtWzFdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlQXVnbWVudCh2aWV3RmlsZXNGb3VuZCk7XG4gICAgfVxuICAgIHNvdXJjZUF1Z21lbnQodmlld3MpIHtcbiAgICAgICAgdmFyIHRwbEZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGBcbnZhciAkZGltcGxlcyA9IChmdW5jdGlvbihkKSB7XG5cdHJldHVybiAoZCA9PSB2b2lkIDApID8gKHtcblx0XHRkYXRhOiB7fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKGkpIHtcblx0XHRcdHJldHVybiB0aGlzLmRhdGFbaV07XG5cdFx0fSxcblx0XHRhZGQ6IGZ1bmN0aW9uKHRwbHMpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiB0cGxzKSB7XG5cdFx0XHRcdGlmICh0cGxzLmhhc093blByb3BlcnR5KGtleSkpIHRoaXMuZGF0YVtrZXldID0gdHBsc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkgOiBkO1xufSkoJGRpbXBsZXMpO1xuXG4kZGltcGxlcy5hZGQoJHtKU09OLnN0cmluZ2lmeSh2aWV3cy5yZWR1Y2UoKHIsIHZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gclt2aWV3Lm1hbmdsZSArIHRoaXMudWlkXSA9IHZpZXcuY29tcGlsZWQsIHI7XG4gICAgICAgICAgICB9LCB7fSkpfSk7XG5cdFx0XHRgKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKCkudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNvbXByZXNzKSB7XG4gICAgICAgICAgICB0cGxGdW5jID0gdWdsaWZ5Lm1pbmlmeSh0cGxGdW5jLCB7IGZyb21TdHJpbmc6IHRydWUsIGNvbXByZXNzOiB7IHVuc2FmZTogdHJ1ZSwgaG9pc3RfdmFyczogdHJ1ZSB9IH0pLmNvZGUgKyAnXFxuXFxuJztcbiAgICAgICAgfVxuICAgICAgICB2aWV3cy5mb3JFYWNoKCh2aWV3KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnJlcGxhY2UobmV3IFJlZ0V4cCgnW1xcJ1wiXUB0cGxcXFxcLicgKyB2aWV3Lm5hbWUgKyAnW1xcJ1wiXScsICdnJyksIGAkZGltcGxlcy5nZXQoJHt2aWV3Lm1hbmdsZSArIHRoaXMudWlkfSlgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlID0gdHBsRnVuYyArIHRoaXMuc291cmNlO1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLnNvdXJjZSk7XG4gICAgfVxuICAgIGdldCBjb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21waWxlKCkudG9TdHJpbmcoKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiZnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVMsR0FBVCxDQUFhLE1BQWIsRUFBcUIsR0FBckIsRUFBMEI7V0FDdEIsU0FBUyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsTUFBckMsRUFBNkMsR0FBN0MsQ0FBVCxHQUE2RCxLQUE3RCxDQURzQjs7O0lDQTdCLE9BQU8sUUFBUSxNQUFSLENBQVA7SUFBd0JBLE9BQUssUUFBUSxhQUFSLENBQUw7SUFBNkIsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNwQzthQUFBLEtBQ2pCLENBQVksTUFBWixFQUFvQjswQ0FESCxPQUNHOzthQUNYLE1BQUwsR0FBYyxNQUFkLENBRGdCO2FBRVgsS0FBTCxHQUFhLEtBQUssSUFBTCxFQUFiLENBRmdCO0tBQXBCOzs2QkFEaUI7OytCQUtWOzs7Z0JBQ0MsVUFBVSxJQUFJLEtBQUosRUFBVixDQUREO2lCQUVFLElBQUwsQ0FBVSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQVYsQ0FBNkIsT0FB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
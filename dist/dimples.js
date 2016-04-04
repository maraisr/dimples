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
            var _this = this;

            var tplFunc = function () {
                return '\nvar $dimples = (function(dimples) {\n\tif (dimples == void 0) {\n\t\tfunction Dimples() {\n\t\t\tthis.cache = new Array();\n\t\t}\n\n\t\tDimples.prototype[\'get\'] = function(what,uid) {\n\t\t\tuid = (typeof uid === \'undefined\') ? 0 : uid;\n\t\t\treturn this.cache[uid].get(what);\n\t\t}\n\n\t\tDimples.prototype[\'add\'] = function(uid,factory) {\n\t\t\tthis.cache[uid] = factory;\n\t\t}\n\n\t\tdimples = new Dimples();\n\t}\n\n\tfunction Factory(tpls) {\n\t\tthis.tpls = tpls;\n\t}\n\n\tFactory.prototype[\'get\'] = function(id) {\n\t\treturn this.tpls[id];\n\t}\n\n\tdimples.add(' + this.uid + ', new Factory(' + JSON.stringify(views.reduce(function (r, view) {
                    return r[view.mangle] = view.compiled, r;
                }, {})) + '));\n\n\treturn dimples;\n})($dimples);\n\t\t\t';
            }.bind(this)().toString();
            if (this.config.compress) {
                tplFunc = uglify.minify(tplFunc, { fromString: true, compress: { unsafe: true, hoist_vars: true } }).code + '\n\n';
            }
            views.forEach(function (view) {
                _this.source = _this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$dimples.get(\'' + view.mangle + '\',' + _this.uid + ')');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyk7XG52YXIgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBUT0RPOiBOZWVkIHRoaXMuY29uZmlnLnZpZXdzIHRvIGFsc28gYWxsb3cgZ2xvYiBmaWxlIG1hdGNoaW5nXG4gICAgICAgIHJldHVybiBmcy5yZWFkZGlyU3luYyh0aGlzLmNvbmZpZy52aWV3cykubWFwKChwYXRoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZpZXcocGF0aCwgdGhpcy5jb25maWcpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZShmcy5yZWFkRmlsZVN5bmMoY29uZmlnLnZpZXdzICsgdGhpcy5wYXRoLCAndXRmLTgnKSkoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYXRoLnJlcGxhY2UoL1xcLmphZGUvLCAnJykudHJpbSgpO1xuICAgIH1cbiAgICBnZXQgbWFuZ2xlKCkge1xuICAgICAgICBsZXQgaGFzaCA9IDAsIGksIGNociwgbGVuO1xuICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLm5hbWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNociA9IHRoaXMubmFtZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xuICAgICAgICAgICAgaGFzaCB8PSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhoYXNoKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tYWluLmQudHNcIiAvPlxudmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgdWdsaWZ5ID0gcmVxdWlyZSgndWdsaWZ5LWpzJyk7XG5pbXBvcnQgeyBoYXMgfSBmcm9tICcuL0NvbW1vbic7XG5pbXBvcnQgVmlld3MgZnJvbSAnLi9WaWV3cyc7XG5sZXQgdWlkID0gMDtcbmV4cG9ydCBjbGFzcyBEaW1wbGVzIHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBCdWZmZXIpID8gc291cmNlLnRvU3RyaW5nKCd1dGYtOCcpIDogc291cmNlO1xuICAgICAgICBpZiAodGhpcy5zb3VyY2UgPT0gdm9pZCAwIHx8IHRoaXMuc291cmNlID09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0RpbXBsZXM6IE5vIHNvdXJjZSBwYXNzZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltKCk7XG4gICAgICAgIHRoaXMudWlkID0gdWlkKys7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ2NvbXByZXNzJykpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbXByZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gdmlld3MgZm9sZGVyIGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3cyA9IG5ldyBWaWV3cyh0aGlzLmNvbmZpZyk7XG4gICAgfVxuICAgIGNvbXBpbGUoKSB7XG4gICAgICAgIGxldCByZSA9IC9bJ1wiXUB0cGxcXC4oLispWydcIl0vZ20sIG07XG4gICAgICAgIGxldCB2aWV3RmlsZXNGb3VuZCA9IG5ldyBBcnJheSgpO1xuICAgICAgICB3aGlsZSAoKG0gPSByZS5leGVjKHRoaXMuc291cmNlKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtWzFdKSB7XG4gICAgICAgICAgICAgICAgdmlld0ZpbGVzRm91bmQucHVzaCh0aGlzLnZpZXdzLmZpbmQobVsxXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUF1Z21lbnQodmlld0ZpbGVzRm91bmQpO1xuICAgIH1cbiAgICBzb3VyY2VBdWdtZW50KHZpZXdzKSB7XG4gICAgICAgIHZhciB0cGxGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChgXG52YXIgJGRpbXBsZXMgPSAoZnVuY3Rpb24oZGltcGxlcykge1xuXHRpZiAoZGltcGxlcyA9PSB2b2lkIDApIHtcblx0XHRmdW5jdGlvbiBEaW1wbGVzKCkge1xuXHRcdFx0dGhpcy5jYWNoZSA9IG5ldyBBcnJheSgpO1xuXHRcdH1cblxuXHRcdERpbXBsZXMucHJvdG90eXBlWydnZXQnXSA9IGZ1bmN0aW9uKHdoYXQsdWlkKSB7XG5cdFx0XHR1aWQgPSAodHlwZW9mIHVpZCA9PT0gJ3VuZGVmaW5lZCcpID8gMCA6IHVpZDtcblx0XHRcdHJldHVybiB0aGlzLmNhY2hlW3VpZF0uZ2V0KHdoYXQpO1xuXHRcdH1cblxuXHRcdERpbXBsZXMucHJvdG90eXBlWydhZGQnXSA9IGZ1bmN0aW9uKHVpZCxmYWN0b3J5KSB7XG5cdFx0XHR0aGlzLmNhY2hlW3VpZF0gPSBmYWN0b3J5O1xuXHRcdH1cblxuXHRcdGRpbXBsZXMgPSBuZXcgRGltcGxlcygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gRmFjdG9yeSh0cGxzKSB7XG5cdFx0dGhpcy50cGxzID0gdHBscztcblx0fVxuXG5cdEZhY3RvcnkucHJvdG90eXBlWydnZXQnXSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMudHBsc1tpZF07XG5cdH1cblxuXHRkaW1wbGVzLmFkZCgke3RoaXMudWlkfSwgbmV3IEZhY3RvcnkoJHtKU09OLnN0cmluZ2lmeSh2aWV3cy5yZWR1Y2UoKHIsIHZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gclt2aWV3Lm1hbmdsZV0gPSB2aWV3LmNvbXBpbGVkLCByO1xuICAgICAgICAgICAgfSwge30pKX0pKTtcblxuXHRyZXR1cm4gZGltcGxlcztcbn0pKCRkaW1wbGVzKTtcblx0XHRcdGApO1xuICAgICAgICB9LmJpbmQodGhpcykoKS50b1N0cmluZygpO1xuICAgICAgICBpZiAodGhpcy5jb25maWcuY29tcHJlc3MpIHtcbiAgICAgICAgICAgIHRwbEZ1bmMgPSB1Z2xpZnkubWluaWZ5KHRwbEZ1bmMsIHsgZnJvbVN0cmluZzogdHJ1ZSwgY29tcHJlc3M6IHsgdW5zYWZlOiB0cnVlLCBob2lzdF92YXJzOiB0cnVlIH0gfSkuY29kZSArICdcXG5cXG4nO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gdGhpcy5zb3VyY2UucmVwbGFjZShuZXcgUmVnRXhwKCdbXFwnXCJdQHRwbFxcXFwuJyArIHZpZXcubmFtZSArICdbXFwnXCJdJywgJ2cnKSwgYCRkaW1wbGVzLmdldCgnJHt2aWV3Lm1hbmdsZX0nLCR7dGhpcy51aWR9KWApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0cGxGdW5jICsgdGhpcy5zb3VyY2U7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyKHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUoKS50b1N0cmluZygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQjtXQUN0QixTQUFTLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFULEdBQTZELEtBQTdELENBRHNCOzs7QUNBakMsSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSUEsT0FBSyxRQUFRLGFBQVIsQ0FBTDs7SUFDaUI7YUFBQSxLQUNqQixDQUFZLE1BQVosRUFBb0I7MENBREgsT0FDRzs7YUFDWCxNQUFMLEdBQWMsTUFBZCxDQURnQjthQUVYLEtBQUwsR0FBYSxLQUFLLElBQUwsRUFBYixDQUZnQjtLQUFwQjs7NkJBRGlCOzsrQkFLVjs7OzttQkFFSUEsS0FBRyxXQUFILENBQWUsS0FBSyxNQUFMLENBQVksS0FBWixDQUFmLENBQWtDLEdBQWxDLENBQXNDLFVBQUMsSUFBRCxFQUFVO3VCQUM1QyxJQUFJLElBQUosQ0FBUyxJQUFULEVBQWUsTUFBSyxNQUFMLENBQXRCLENBRG1EO2FBQVYsQ0FBN0MsQ0FGRzs7Ozs2QkFNRixNQUFNO21CQUNBLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsVUFBQyxDQUFELEVBQU87dUJBQ3JCLEVBQUUsSUFBRixJQUFVLElBQVYsQ0FEcUI7YUFBUCxDQUFsQixDQUVKLEdBRkksRUFBUCxDQURPOzs7V0FYTTs7O0lBaUJmO2FBQUEsSUFDRixDQUFZLElBQVosRUFBa0IsTUFBbEIsRUFBMEI7MENBRHhCLE1BQ3dCOzthQUNqQixJQUFMLEdBQVksSUFBWixDQURzQjthQUVqQixRQUFMLEdBQWdCLEtBQUssT0FBTCxDQUFhQSxLQUFHLFlBQUgsQ0FBZ0IsT0FBTyxLQUFQLEdBQWUsS0FBSyxJQUFMLEVBQVcsT0FBMUMsQ0FBYixHQUFoQixDQUZzQjthQUdqQixJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixRQUFsQixFQUE0QixFQUE1QixFQUFnQyxJQUFoQyxFQUFaLENBSHNCO0tBQTFCOzs2QkFERTs7NEJBTVc7Z0JBQ0wsT0FBTyxDQUFQO2dCQUFVLFVBQWQ7Z0JBQWlCLFlBQWpCO2dCQUFzQixZQUF0QixDQURTO2dCQUVMLEtBQUssSUFBTCxDQUFVLE1BQVYsS0FBcUIsQ0FBckIsRUFDQSxPQUFPLElBQVAsQ0FESjtpQkFFSyxJQUFJLENBQUosRUFBTyxNQUFNLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsSUFBSSxHQUFKLEVBQVMsR0FBN0MsRUFBa0Q7c0JBQ3hDLEtBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsQ0FBckIsQ0FBTixDQUQ4Qzt1QkFFdkMsQ0FBRSxRQUFRLENBQVIsQ0FBRCxHQUFjLElBQWQsR0FBc0IsR0FBdkIsQ0FGdUM7d0JBR3RDLENBQVIsQ0FIOEM7YUFBbEQ7bUJBS08sS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFQLENBVFM7OztXQU5YOzs7O0FDbEJOLElBQUksS0FBSyxRQUFRLGFBQVIsQ0FBTDtJQUE2QixTQUFTLFFBQVEsV0FBUixDQUFUO0FBR2pDLElBQUksTUFBTSxDQUFOO0FBQ0osSUFBYTthQUFBLE9BQ1QsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCOzBDQURuQixTQUNtQjs7YUFDbkIsTUFBTCxHQUFjLE1BQUMsWUFBa0IsTUFBbEIsR0FBNEIsT0FBTyxRQUFQLENBQWdCLE9BQWhCLENBQTdCLEdBQXdELE1BQXhELENBRFU7WUFFcEIsS0FBSyxNQUFMLElBQWUsS0FBSyxDQUFMLElBQVUsS0FBSyxNQUFMLElBQWUsRUFBZixFQUFtQjtrQkFDdEMsSUFBSSxjQUFKLENBQW1CLDRCQUFuQixDQUFOLENBRDRDO1NBQWhEO2FBR0ssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUFZLElBQVosRUFBZCxDQUx3QjthQU1uQixHQUFMLEdBQVcsS0FBWCxDQU53QjthQU9uQixNQUFMLEdBQWMsVUFBVSxFQUFWLENBUFU7WUFRcEIsQ0FBQyxJQUFJLEtBQUssTUFBTCxFQUFhLFVBQWpCLENBQUQsRUFBK0I7aUJBQzFCLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLElBQXZCLENBRCtCO1NBQW5DO1lBR0ksQ0FBQyxJQUFJLEtBQUssTUFBTCxFQUFhLE9BQWpCLENBQUQsRUFBNEI7a0JBQ3RCLElBQUksY0FBSixDQUFtQixtQ0FBbkIsQ0FBTixDQUQ0QjtTQUFoQzthQUdLLEtBQUwsR0FBYSxJQUFJLEtBQUosQ0FBVSxLQUFLLE1BQUwsQ0FBdkIsQ0Fkd0I7S0FBNUI7OzZCQURTOztrQ0FpQkM7Z0JBQ0YsS0FBSyxzQkFBTDtnQkFBNkIsVUFBakMsQ0FETTtnQkFFRixpQkFBaUIsSUFBSSxLQUFKLEVBQWpCLENBRkU7bUJBR0MsQ0FBQyxJQUFJLEdBQUcsSUFBSCxDQUFRLEtBQUssTUFBTCxDQUFaLENBQUQsS0FBK0IsSUFBL0IsRUFBcUM7b0JBQ3BDLEVBQUUsS0FBRixLQUFZLEdBQUcsU0FBSCxFQUFjO3VCQUN2QixTQUFILEdBRDBCO2lCQUE5QjtvQkFHSSxFQUFFLENBQUYsQ0FBSixFQUFVO21DQUNTLElBQWYsQ0FBb0IsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixFQUFFLENBQUYsQ0FBaEIsQ0FBcEIsRUFETTtpQkFBVjthQUpKO21CQVFPLEtBQUssYUFBTCxDQUFtQixjQUFuQixDQUFQLENBWE07Ozs7c0NBYUksT0FBTzs7O2dCQUNiLFVBQVUsWUFBWTtzbUJBNEJuQixLQUFLLEdBQUwsc0JBQXlCLEtBQUssU0FBTCxDQUFlLE1BQU0sTUFBTixDQUFhLFVBQUMsQ0FBRCxFQUFJLElBQUosRUFBYTsyQkFDMUQsRUFBRSxLQUFLLE1BQUwsQ0FBRixHQUFpQixLQUFLLFFBQUwsRUFBZSxDQUFoQyxDQUQwRDtpQkFBYixFQUVyRCxFQUZ3QyxDQUFmLHFEQTNCNUIsQ0FEc0I7YUFBWixDQW1DWixJQW5DWSxDQW1DUCxJQW5DTyxJQW1DQyxRQW5DRCxFQUFWLENBRGE7Z0JBcUNiLEtBQUssTUFBTCxDQUFZLFFBQVosRUFBc0I7MEJBQ1osT0FBTyxNQUFQLENBQWMsT0FBZCxFQUF1QixFQUFFLFlBQVksSUFBWixFQUFrQixVQUFVLEVBQUUsUUFBUSxJQUFSLEVBQWMsWUFBWSxJQUFaLEVBQTFCLEVBQTNDLEVBQTJGLElBQTNGLEdBQWtHLE1BQWxHLENBRFk7YUFBMUI7a0JBR00sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO3NCQUNmLE1BQUwsR0FBYyxNQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLElBQUksTUFBSixDQUFXLGlCQUFpQixLQUFLLElBQUwsR0FBWSxPQUE3QixFQUFzQyxHQUFqRCxDQUFwQixzQkFBNEYsS0FBSyxNQUFMLFdBQWdCLE1BQUssR0FBTCxNQUE1RyxDQUFkLENBRG9CO2FBQVYsQ0FBZCxDQXhDaUI7aUJBMkNaLE1BQUwsR0FBYyxVQUFVLEtBQUssTUFBTCxDQTNDUDttQkE0Q1YsSUFBSSxNQUFKLENBQVcsS0FBSyxNQUFMLENBQWxCLENBNUNpQjs7Ozs0QkE4Q1Y7bUJBQ0EsS0FBSyxPQUFMLEdBQWUsUUFBZixFQUFQLENBRE87OztXQTVFRjs7OyJ9
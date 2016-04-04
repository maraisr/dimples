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
var Dimples = function () {
    function Dimples(source, config) {
        babelHelpers.classCallCheck(this, Dimples);

        this.source = source instanceof Buffer ? source.toString('utf-8') : source;
        if (this.source == void 0 || this.source == '') {
            throw new ReferenceError('Dimples: No source passed.');
        }
        this.source = this.source.trim();
        this.config = config;
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
                return '\nvar $dimples = (function() {\n\tfunction Dimples(tpls) {\n\t\tthis.tpls = tpls;\n\t}\n\n\tDimples.prototype[\'get\'] = function(which) {\n\t\treturn this.tpls[which];\n\t}\n\n\treturn new Dimples(' + JSON.stringify(views.reduce(function (r, view) {
                    return r[view.mangle] = view.compiled, r;
                }, {})) + ');\n})();\n\t\t\t';
            }().toString();
            views.forEach(function (view) {
                _this.source = _this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$dimples.get(\'' + view.mangle + '\')');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyk7XG52YXIgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBUT0RPOiBOZWVkIHRoaXMuY29uZmlnLnZpZXdzIHRvIGFsc28gYWxsb3cgZ2xvYiBmaWxlIG1hdGNoaW5nXG4gICAgICAgIHJldHVybiBmcy5yZWFkZGlyU3luYyh0aGlzLmNvbmZpZy52aWV3cykubWFwKChwYXRoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZpZXcocGF0aCwgdGhpcy5jb25maWcpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZShmcy5yZWFkRmlsZVN5bmMoY29uZmlnLnZpZXdzICsgdGhpcy5wYXRoLCAndXRmLTgnKSkoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYXRoLnJlcGxhY2UoL1xcLmphZGUvLCAnJykudHJpbSgpO1xuICAgIH1cbiAgICBnZXQgbWFuZ2xlKCkge1xuICAgICAgICBsZXQgaGFzaCA9IDAsIGksIGNociwgbGVuO1xuICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLm5hbWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNociA9IHRoaXMubmFtZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xuICAgICAgICAgICAgaGFzaCB8PSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhoYXNoKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tYWluLmQudHNcIiAvPlxudmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKTtcbmltcG9ydCB7IGhhcyB9IGZyb20gJy4vQ29tbW9uJztcbmltcG9ydCBWaWV3cyBmcm9tICcuL1ZpZXdzJztcbmV4cG9ydCBjbGFzcyBEaW1wbGVzIHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBCdWZmZXIpID8gc291cmNlLnRvU3RyaW5nKCd1dGYtOCcpIDogc291cmNlO1xuICAgICAgICBpZiAodGhpcy5zb3VyY2UgPT0gdm9pZCAwIHx8IHRoaXMuc291cmNlID09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0RpbXBsZXM6IE5vIHNvdXJjZSBwYXNzZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltKCk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICBpZiAoIWhhcyh0aGlzLmNvbmZpZywgJ3ZpZXdzJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gdmlld3MgZm9sZGVyIGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3cyA9IG5ldyBWaWV3cyh0aGlzLmNvbmZpZyk7XG4gICAgfVxuICAgIGNvbXBpbGUoKSB7XG4gICAgICAgIGxldCByZSA9IC9bJ1wiXUB0cGxcXC4oLispWydcIl0vZ20sIG07XG4gICAgICAgIGxldCB2aWV3RmlsZXNGb3VuZCA9IG5ldyBBcnJheSgpO1xuICAgICAgICB3aGlsZSAoKG0gPSByZS5leGVjKHRoaXMuc291cmNlKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtWzFdKSB7XG4gICAgICAgICAgICAgICAgdmlld0ZpbGVzRm91bmQucHVzaCh0aGlzLnZpZXdzLmZpbmQobVsxXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUF1Z21lbnQodmlld0ZpbGVzRm91bmQpO1xuICAgIH1cbiAgICBzb3VyY2VBdWdtZW50KHZpZXdzKSB7XG4gICAgICAgIHZhciB0cGxGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChgXG52YXIgJGRpbXBsZXMgPSAoZnVuY3Rpb24oKSB7XG5cdGZ1bmN0aW9uIERpbXBsZXModHBscykge1xuXHRcdHRoaXMudHBscyA9IHRwbHM7XG5cdH1cblxuXHREaW1wbGVzLnByb3RvdHlwZVsnZ2V0J10gPSBmdW5jdGlvbih3aGljaCkge1xuXHRcdHJldHVybiB0aGlzLnRwbHNbd2hpY2hdO1xuXHR9XG5cblx0cmV0dXJuIG5ldyBEaW1wbGVzKCR7SlNPTi5zdHJpbmdpZnkodmlld3MucmVkdWNlKChyLCB2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJbdmlldy5tYW5nbGVdID0gdmlldy5jb21waWxlZCwgcjtcbiAgICAgICAgICAgIH0sIHt9KSl9KTtcbn0pKCk7XG5cdFx0XHRgKTtcbiAgICAgICAgfSgpLnRvU3RyaW5nKCk7XG4gICAgICAgIHZpZXdzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gdGhpcy5zb3VyY2UucmVwbGFjZShuZXcgUmVnRXhwKCdbXFwnXCJdQHRwbFxcXFwuJyArIHZpZXcubmFtZSArICdbXFwnXCJdJywgJ2cnKSwgJyRkaW1wbGVzLmdldChcXCcnICsgdmlldy5tYW5nbGUgKyAnXFwnKScpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0cGxGdW5jICsgdGhpcy5zb3VyY2U7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyKHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUoKS50b1N0cmluZygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQjtXQUN0QixTQUFTLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFULEdBQTZELEtBQTdELENBRHNCOzs7QUNBakMsSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSUEsT0FBSyxRQUFRLGFBQVIsQ0FBTDs7SUFDaUI7YUFBQSxLQUNqQixDQUFZLE1BQVosRUFBb0I7MENB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
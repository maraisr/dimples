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
        this.compiled = jade.compile(fs$1.readFileSync(this.path, 'utf-8'))();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB2YXIgcmV0dXJucyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBnbG9iLnN5bmModGhpcy5jb25maWcuamFkZXMpLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXRoLm1hdGNoKC9cXC5qYWRlJC8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJucy5wdXNoKG5ldyBWaWV3KHBhdGgsIHRoaXMuY29uZmlnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJucztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZShmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCAndXRmLTgnKSkoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYXRoLnJlcGxhY2UoY29uZmlnLnZpZXdzLCAnJykucmVwbGFjZSgvXFwuamFkZS8sICcnKS50cmltKCk7XG4gICAgfVxuICAgIGdldCBtYW5nbGUoKSB7XG4gICAgICAgIGxldCBoYXNoID0gMCwgaSwgY2hyLCBsZW47XG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMubmFtZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2hyID0gdGhpcy5uYW1lLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaHI7XG4gICAgICAgICAgICBoYXNoIHw9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGhhc2gpO1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21haW4uZC50c1wiIC8+XG52YXIgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpLCB1Z2xpZnkgPSByZXF1aXJlKCd1Z2xpZnktanMnKTtcbmltcG9ydCB7IGhhcyB9IGZyb20gJy4vQ29tbW9uJztcbmltcG9ydCBWaWV3cyBmcm9tICcuL1ZpZXdzJztcbmxldCB1aWQgPSAwO1xuZXhwb3J0IGNsYXNzIERpbXBsZXMge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcikgPyBzb3VyY2UudG9TdHJpbmcoJ3V0Zi04JykgOiBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSA9PSB2b2lkIDAgfHwgdGhpcy5zb3VyY2UgPT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gc291cmNlIHBhc3NlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW0oKTtcbiAgICAgICAgdGhpcy51aWQgPSB1aWQrKztcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG4gICAgICAgIGlmICghaGFzKHRoaXMuY29uZmlnLCAnY29tcHJlc3MnKSkge1xuICAgICAgICAgICAgdGhpcy5jb25maWcuY29tcHJlc3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzKHRoaXMuY29uZmlnLCAndmlld3MnKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdEaW1wbGVzOiBObyB2aWV3cyBmb2xkZXIgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbmZpZy5qYWRlcyA9IHRoaXMuY29uZmlnLnZpZXdzICsgJyoqLyouamFkZSc7XG4gICAgICAgIHRoaXMudmlld3MgPSBuZXcgVmlld3ModGhpcy5jb25maWcpO1xuICAgIH1cbiAgICBjb21waWxlKCkge1xuICAgICAgICBsZXQgcmUgPSAvWydcIl1AdHBsXFwuKC4rKVsnXCJdL2dtLCBtO1xuICAgICAgICBsZXQgdmlld0ZpbGVzRm91bmQgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgd2hpbGUgKChtID0gcmUuZXhlYyh0aGlzLnNvdXJjZSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobS5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmUubGFzdEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobVsxXSkge1xuICAgICAgICAgICAgICAgIHZpZXdGaWxlc0ZvdW5kLnB1c2godGhpcy52aWV3cy5maW5kKG1bMV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VBdWdtZW50KHZpZXdGaWxlc0ZvdW5kKTtcbiAgICB9XG4gICAgc291cmNlQXVnbWVudCh2aWV3cykge1xuICAgICAgICB2YXIgdHBsRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoYFxudmFyICRkaW1wbGVzID0gKGZ1bmN0aW9uKGRpbXBsZXMpIHtcblx0aWYgKGRpbXBsZXMgPT0gdm9pZCAwKSB7XG5cdFx0ZnVuY3Rpb24gRGltcGxlcygpIHtcblx0XHRcdHRoaXMuY2FjaGUgPSBuZXcgQXJyYXkoKTtcblx0XHR9XG5cblx0XHREaW1wbGVzLnByb3RvdHlwZVsnZ2V0J10gPSBmdW5jdGlvbih3aGF0LHVpZCkge1xuXHRcdFx0dWlkID0gKHR5cGVvZiB1aWQgPT09ICd1bmRlZmluZWQnKSA/IDAgOiB1aWQ7XG5cdFx0XHRyZXR1cm4gdGhpcy5jYWNoZVt1aWRdLmdldCh3aGF0KTtcblx0XHR9XG5cblx0XHREaW1wbGVzLnByb3RvdHlwZVsnYWRkJ10gPSBmdW5jdGlvbih1aWQsZmFjdG9yeSkge1xuXHRcdFx0dGhpcy5jYWNoZVt1aWRdID0gZmFjdG9yeTtcblx0XHR9XG5cblx0XHRkaW1wbGVzID0gbmV3IERpbXBsZXMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIEZhY3RvcnkodHBscykge1xuXHRcdHRoaXMudHBscyA9IHRwbHM7XG5cdH1cblxuXHRGYWN0b3J5LnByb3RvdHlwZVsnZ2V0J10gPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiB0aGlzLnRwbHNbaWRdO1xuXHR9XG5cblx0ZGltcGxlcy5hZGQoJHt0aGlzLnVpZH0sIG5ldyBGYWN0b3J5KCR7SlNPTi5zdHJpbmdpZnkodmlld3MucmVkdWNlKChyLCB2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJbdmlldy5tYW5nbGVdID0gdmlldy5jb21waWxlZCwgcjtcbiAgICAgICAgICAgIH0sIHt9KSl9KSk7XG5cblx0cmV0dXJuIGRpbXBsZXM7XG59KSgkZGltcGxlcyk7XG5cdFx0XHRgKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKCkudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNvbXByZXNzKSB7XG4gICAgICAgICAgICB0cGxGdW5jID0gdWdsaWZ5Lm1pbmlmeSh0cGxGdW5jLCB7IGZyb21TdHJpbmc6IHRydWUsIGNvbXByZXNzOiB7IHVuc2FmZTogdHJ1ZSwgaG9pc3RfdmFyczogdHJ1ZSB9IH0pLmNvZGUgKyAnXFxuXFxuJztcbiAgICAgICAgfVxuICAgICAgICB2aWV3cy5mb3JFYWNoKCh2aWV3KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnJlcGxhY2UobmV3IFJlZ0V4cCgnW1xcJ1wiXUB0cGxcXFxcLicgKyB2aWV3Lm5hbWUgKyAnW1xcJ1wiXScsICdnJyksIGAkZGltcGxlcy5nZXQoJyR7dmlldy5tYW5nbGV9Jywke3RoaXMudWlkfSlgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc291cmNlID0gdHBsRnVuYyArIHRoaXMuc291cmNlO1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLnNvdXJjZSk7XG4gICAgfVxuICAgIGdldCBjb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21waWxlKCkudG9TdHJpbmcoKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiZnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVMsR0FBVCxDQUFhLE1BQWIsRUFBcUIsR0FBckIsRUFBMEI7V0FDdEIsU0FBUyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsTUFBckMsRUFBNkMsR0FBN0MsQ0FBVCxHQUE2RCxLQUE3RCxDQURzQjs7O0lDQTdCLE9BQU8sUUFBUSxNQUFSLENBQVA7SUFBd0JBLE9BQUssUUFBUSxhQUFSLENB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
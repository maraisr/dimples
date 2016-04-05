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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltcGxlcy5qcyIsInNvdXJjZXMiOlsiLi4vdG1wL0NvbW1vbi5qcyIsIi4uL3RtcC9WaWV3cy5qcyIsIi4uL3RtcC9NYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSA6IGZhbHNlO1xufVxuIiwidmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyksIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKSwgZ2xvYiA9IHJlcXVpcmUoJ2dsb2JieScpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy52aWV3cyA9IHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB2YXIgcmV0dXJucyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBnbG9iLnN5bmModGhpcy5jb25maWcuamFkZXMpLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXRoLm1hdGNoKC9cXC5qYWRlJC8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJucy5wdXNoKG5ldyBWaWV3KHBhdGgsIHRoaXMuY29uZmlnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJucztcbiAgICB9XG4gICAgZmluZChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcigodikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYubmFtZSA9PSBuYW1lO1xuICAgICAgICB9KS5wb3AoKTtcbiAgICB9XG59XG5jbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5jb21waWxlZCA9IGphZGUuY29tcGlsZShmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCAndXRmLTgnKSkoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYXRoLnJlcGxhY2UoY29uZmlnLnZpZXdzLCAnJykucmVwbGFjZSgvXFwuamFkZS8sICcnKS50cmltKCk7XG4gICAgfVxuICAgIGdldCBtYW5nbGUoKSB7XG4gICAgICAgIGxldCBoYXNoID0gMCwgaSwgY2hyLCBsZW47XG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMubmFtZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2hyID0gdGhpcy5uYW1lLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaHI7XG4gICAgICAgICAgICBoYXNoIHw9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGhhc2gpO1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21haW4uZC50c1wiIC8+XG52YXIgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpLCB1Z2xpZnkgPSByZXF1aXJlKCd1Z2xpZnktanMnKTtcbmltcG9ydCB7IGhhcyB9IGZyb20gJy4vQ29tbW9uJztcbmltcG9ydCBWaWV3cyBmcm9tICcuL1ZpZXdzJztcbmxldCB1aWQgPSAwO1xuZXhwb3J0IGNsYXNzIERpbXBsZXMge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcikgPyBzb3VyY2UudG9TdHJpbmcoJ3V0Zi04JykgOiBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSA9PSB2b2lkIDAgfHwgdGhpcy5zb3VyY2UgPT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignRGltcGxlczogTm8gc291cmNlIHBhc3NlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW0oKTtcbiAgICAgICAgdGhpcy51aWQgPSB1aWQrKztcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG4gICAgICAgIGlmICghaGFzKHRoaXMuY29uZmlnLCAnY29tcHJlc3MnKSkge1xuICAgICAgICAgICAgdGhpcy5jb25maWcuY29tcHJlc3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzKHRoaXMuY29uZmlnLCAndmlld3MnKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdEaW1wbGVzOiBObyB2aWV3cyBmb2xkZXIgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbmZpZy5qYWRlcyA9IHRoaXMuY29uZmlnLnZpZXdzICsgJyoqLyouamFkZSc7XG4gICAgICAgIHRoaXMudmlld3MgPSBuZXcgVmlld3ModGhpcy5jb25maWcpO1xuICAgIH1cbiAgICBjb21waWxlKCkge1xuICAgICAgICBsZXQgcmUgPSAvWydcIl1AdHBsXFwuKC4rKVsnXCJdL2dtLCBtO1xuICAgICAgICBsZXQgdmlld0ZpbGVzRm91bmQgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgd2hpbGUgKChtID0gcmUuZXhlYyh0aGlzLnNvdXJjZSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobS5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmUubGFzdEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobVsxXSkge1xuICAgICAgICAgICAgICAgIHZpZXdGaWxlc0ZvdW5kLnB1c2godGhpcy52aWV3cy5maW5kKG1bMV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VBdWdtZW50KHZpZXdGaWxlc0ZvdW5kKTtcbiAgICB9XG4gICAgc291cmNlQXVnbWVudCh2aWV3cykge1xuICAgICAgICB2YXIgdHBsRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoYFxudmFyICRkaW1wbGVzID0gKGZ1bmN0aW9uKGQpIHtcblx0cmV0dXJuIChkID09IHZvaWQgMCkgPyAoe1xuXHRcdGRhdGE6IHt9LFxuXHRcdGdldDogZnVuY3Rpb24oaSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZGF0YVtpXTtcblx0XHR9LFxuXHRcdGFkZDogZnVuY3Rpb24odHBscykge1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIHRwbHMpIHtcblx0XHRcdFx0aWYgKHRwbHMuaGFzT3duUHJvcGVydHkoa2V5KSkgdGhpcy5kYXRhW2tleV0gPSB0cGxzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSA6IGQ7XG59KSgkZGltcGxlcyk7XG5cbiRkaW1wbGVzLmFkZCgke0pTT04uc3RyaW5naWZ5KHZpZXdzLnJlZHVjZSgociwgdmlldykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByW3ZpZXcubWFuZ2xlICsgdGhpcy51aWRdID0gdmlldy5jb21waWxlZCwgcjtcbiAgICAgICAgICAgIH0sIHt9KSl9KTtcblx0XHRcdGApO1xuICAgICAgICB9LmJpbmQodGhpcykoKS50b1N0cmluZygpO1xuICAgICAgICBpZiAodGhpcy5jb25maWcuY29tcHJlc3MpIHtcbiAgICAgICAgICAgIHRwbEZ1bmMgPSB1Z2xpZnkubWluaWZ5KHRwbEZ1bmMsIHsgZnJvbVN0cmluZzogdHJ1ZSwgY29tcHJlc3M6IHsgdW5zYWZlOiB0cnVlLCBob2lzdF92YXJzOiB0cnVlIH0gfSkuY29kZSArICdcXG5cXG4nO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gdGhpcy5zb3VyY2UucmVwbGFjZShuZXcgUmVnRXhwKCdbXFwnXCJdQHRwbFxcXFwuJyArIHZpZXcubmFtZSArICdbXFwnXCJdJywgJ2cnKSwgYCRkaW1wbGVzLmdldCgke3ZpZXcubWFuZ2xlICsgdGhpcy51aWR9KWApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSB0cGxGdW5jICsgdGhpcy5zb3VyY2U7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyKHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUoKS50b1N0cmluZygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQjtXQUN0QixTQUFTLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFULEdBQTZELEtBQTdELENBRHNCOzs7SUNBN0IsT0FBTyxRQUFRLE1BQVIsQ0FBUDtJQUF3QkEsT0FBSyxRQUFRLGFBQVIsQ0FBTDtJQUE2QixPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ3BDO2FBQUEsS0FDakIsQ0FBWSxNQUFaLEVBQW9COzBDQURILE9BQ0c7O2FBQ1gsTUFBTCxHQUFjLE1BQWQsQ0FEZ0I7YUFFWCxLQUFMLEdBQWEsS0FBSyxJQUFMLEVBQWIsQ0FGZ0I7S0FBcEI7OzZCQURpQjs7K0JBS1Y7OztnQkFDQyxVQUFVLElBQUksS0FBSixFQUFWLENBREQ7aUJBRUUsSUFBTCxDQUFVLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBVixDQUE2QixPQUE3QixDQUFxQyxVQUFDLElBQUQsRUFBVTtvQkFDdkMsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFKLEVBQTJCOzRCQUNmLElBQVIs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
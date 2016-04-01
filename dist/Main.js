/// <reference path="../typings/main.d.ts" />
"use strict";
var Views_1 = require('./Views');
var Templicated = (function () {
    function Templicated(source, config) {
        this.source = (source instanceof Buffer) ? source.toString('utf-8') : source;
        this.config = config;
        this.views = new Views_1.default(this.config);
    }
    Templicated.prototype.compile = function () {
        var re = /['"]@tpl\.(.+)['"]/gm, m;
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
    };
    Templicated.prototype.sourceAugment = function (views) {
        var _this = this;
        var tplFunc = function () {
            return ("\nvar $templicated = (function() {\n\tfunction Templicated(tpls) {\n\t\tthis.tpls = tpls;\n\t}\n\n\tTemplicated.prototype['get'] = function(which) {\n\t\treturn this.tpls[which];\n\t}\n\n\treturn new Templicated(" + JSON.stringify(views.reduce(function (r, view) {
                return r[view.mangle] = view.compiled, r;
            }, {})) + ");\n})();\n\t\t\t");
        }().toString();
        views.forEach(function (view) {
            _this.source = _this.source.replace(new RegExp('[\'"]@tpl\\.' + view.name + '[\'"]', 'g'), '$templicated.get(\'' + view.mangle + '\')');
        });
        this.source = tplFunc + this.source;
        return new Buffer(this.source);
    };
    Object.defineProperty(Templicated.prototype, "code", {
        get: function () {
            return this.compile().toString();
        },
        enumerable: true,
        configurable: true
    });
    return Templicated;
}());
exports.Templicated = Templicated;

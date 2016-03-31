/// <reference path="../typings/main.d.ts" />
"use strict";
var Views_1 = require('./Views');
var Templicated = (function () {
    function Templicated(source, config) {
        this.source = source;
        this.config = config;
        this.views = new Views_1.default(this.config);
    }
    Templicated.prototype.compile = function () {
        var _this = this;
        // Find the views needed
        var re = /templicated\([\'\"]([\w\s]+)[\'\"]\)/gm, m;
        var sourceString = this.source.toString('utf-8'), viewFilesFound = new Array();
        while ((m = re.exec(sourceString)) !== null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            viewFilesFound.push(m[1]);
        }
        var viewsList = {};
        // Look for the views found, in our original found jade templates
        viewFilesFound.forEach(function (file) {
            var found = _this.views.find(file);
            if (found) {
                // 1. Replace found.name with found.mangle
                sourceString = sourceString.replace(new RegExp("templicated\\(['\"]" + found.name + "['\"]\\)", 'gm'), 'templicated(\'' + found.mangle + '\')');
                // 2. Insert found.mangle as a index
                // 3. Add the found.compiled as a template
                viewsList[found.mangle] = found.compiled;
            }
        });
        var func = 'function templicated(id) {return tpls[id];}';
        var tpls = 'var tpls = ' + JSON.stringify(viewsList);
        var final = tpls + ';' + func;
        return new Buffer(final + ';' + sourceString);
    };
    return Templicated;
}());
exports.Templicated = Templicated;

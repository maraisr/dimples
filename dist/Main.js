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
        // Look for the views found, in our original found jade templates
        viewFilesFound.forEach(function (file) {
            var found = _this.views.find(file);
            // TODO: Inject the views I need to, and "mangle" the view names and so forth
            if (found) {
            }
        });
        return new Buffer('');
    };
    return Templicated;
}());
exports.Templicated = Templicated;

/// <reference path="../typings/main.d.ts" />
"use strict";
var jade = require('jade');
var fs = require('graceful-fs');
var viewUid = -1;
var Templicated = (function () {
    function Templicated(source, config) {
        this.source = source;
        this.config = config;
        this.views = this.getViews();
    }
    Templicated.prototype.getViews = function () {
        var _this = this;
        return fs.readdirSync(this.config.views).map(function (path) {
            return new View(path, _this.config);
        });
    };
    return Templicated;
}());
exports.Templicated = Templicated;
var View = (function () {
    function View(path, config) {
        this.path = path;
        this.uid = viewUid += 1;
        this.compiled = jade.compile(fs.readFileSync(config.views + this.path, 'utf-8'))();
        this.name = this.path.replace(/\.jade/, '').trim();
    }
    return View;
}());

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
        var returns = new Array();
        fs.readdirSync(this.config.views).forEach(function (path) {
            returns.push(new View(path, _this.config));
        });
        return returns;
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

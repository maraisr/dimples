/// <reference path="../typings/main.d.ts" />
"use strict";
var parser = require('acorn');
var Views_1 = require('./Views');
var Templicated = (function () {
    function Templicated(source, config) {
        this.source = source;
        this.config = config;
        this.views = new Views_1.default(this.config);
    }
    Templicated.prototype.compile = function () {
        var parsed = new Parse(this.source);
        console.log(parsed.findTpls());
        return new Buffer('');
    };
    return Templicated;
}());
exports.Templicated = Templicated;
var Parse = (function () {
    function Parse(source) {
        this.parsed = parser.parse(source.toString('utf-8')).body;
    }
    Parse.prototype.findTpls = function () {
        return new Array();
    };
    return Parse;
}());

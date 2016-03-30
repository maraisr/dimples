/// <reference path="../typings/main.d.ts" />
"use strict";
var Views_1 = require('./Views');
var Templicated = (function () {
    function Templicated(source, config) {
        this.source = source;
        this.config = config;
        this.views = new Views_1.default(this.config);
    }
    return Templicated;
}());
exports.Templicated = Templicated;

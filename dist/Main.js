"use strict";
var jade = require('jade');
var Test = (function () {
    function Test() {
        console.log(jade);
    }
    return Test;
}());
exports.Test = Test;

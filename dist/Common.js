"use strict";
function has(object, key) {
    return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
}
exports.has = has;

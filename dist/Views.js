var jade = require('jade');
var fs = require('graceful-fs');
var Views = (function () {
    function Views(config) {
        this.config = config;
        this.views = this.init();
    }
    Views.prototype.init = function () {
        var _this = this;
        // TODO: Need this.config.views to also allow glob file matching
        return fs.readdirSync(this.config.views).map(function (path) {
            return new View(path, _this.config);
        });
    };
    Views.prototype.find = function (name) {
        return this.views.filter(function (v) {
            return v.name == name;
        }).pop();
    };
    return Views;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Views;
var View = (function () {
    function View(path, config) {
        this.path = path;
        this.compiled = jade.compile(fs.readFileSync(config.views + this.path, 'utf-8'))();
        this.name = this.path.replace(/\.jade/, '').trim();
    }
    Object.defineProperty(View.prototype, "mangle", {
        get: function () {
            var hash = 0, i, chr, len;
            if (this.name.length === 0)
                return hash;
            for (i = 0, len = this.name.length; i < len; i++) {
                chr = this.name.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return Math.abs(hash);
        },
        enumerable: true,
        configurable: true
    });
    return View;
})();

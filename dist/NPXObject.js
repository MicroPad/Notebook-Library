"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NPXObject = (function () {
    function NPXObject(title, internalRef) {
        this.title = this.clean(title);
        this.internalRef = internalRef || this.generateGuid();
    }
    NPXObject.prototype.generateGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    NPXObject.prototype.clean = function (str) {
        return str.replace(/<[^>]*>/, "");
    };
    return NPXObject;
}());
exports.NPXObject = NPXObject;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var Notepad = (function () {
    function Notepad(title, lastModified) {
        this.title = title;
        this.sections = [];
        this.lastModified = date_fns_1.format(lastModified || new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    }
    return Notepad;
}());
exports.Notepad = Notepad;

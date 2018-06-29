"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var Notepad = (function () {
    function Notepad(title, opts) {
        if (opts === void 0) { opts = {}; }
        this.title = title;
        this.lastModified = date_fns_1.format(opts.lastModified || new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        this.sections = opts.sections || [];
        this.notepadAssets = opts.notepadAssets || [];
        this.assets = opts.assets || [];
    }
    Notepad.prototype.addSection = function (section) {
        var notepad = this.clone({
            sections: __spread(this.sections, [
                section
            ])
        });
        section.parent = notepad;
        return notepad;
    };
    Notepad.prototype.toJson = function () {
        return JSON.stringify(__assign({}, this, { assets: undefined }));
    };
    Notepad.prototype.toXml = function () {
        return '';
    };
    Notepad.prototype.clone = function (opts, title) {
        if (opts === void 0) { opts = {}; }
        return new Notepad(title || this.title, __assign({ lastModified: date_fns_1.parse(this.lastModified), sections: this.sections, notepadAssets: this.notepadAssets, assets: this.notepadAssets }, opts));
    };
    return Notepad;
}());
exports.default = Notepad;

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
var index_1 = require("./index");
var date_fns_1 = require("date-fns");
var FlatNotepad = (function () {
    function FlatNotepad(title, opts) {
        if (opts === void 0) { opts = {}; }
        this.title = title;
        this.lastModified = date_fns_1.format(opts.lastModified || new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        this.sections = opts.sections || {};
        this.notes = opts.notes || {};
        this.notepadAssets = opts.notepadAssets || [];
    }
    FlatNotepad.prototype.addSection = function (section) {
        var _a;
        return this.clone({
            sections: __assign({}, this.sections, (_a = {}, _a[section.internalRef] = section, _a))
        });
    };
    FlatNotepad.prototype.addNote = function (note) {
        var _a;
        if (typeof note.parent !== 'string')
            note.parent = note.parent.internalRef;
        return this.clone({
            notes: __assign({}, this.notes, (_a = {}, _a[note.internalRef] = note, _a))
        });
    };
    FlatNotepad.prototype.addAsset = function (uuid) {
        return this.clone({
            notepadAssets: __spread(this.notepadAssets, [
                uuid
            ])
        });
    };
    FlatNotepad.prototype.modified = function (lastModified) {
        if (lastModified === void 0) { lastModified = new Date(); }
        return this.clone({
            lastModified: lastModified
        });
    };
    FlatNotepad.prototype.search = function (query) {
        return Object.values(this.notes).filter(function (n) { return n.search(query).length > 0; });
    };
    FlatNotepad.prototype.toNotepad = function () {
        var _this = this;
        var buildSection = function (flat) {
            var section = new index_1.Section(flat.title, [], [], flat.internalRef);
            Object.values(_this.sections)
                .filter(function (s) { return s.parentRef === flat.internalRef; })
                .map(function (s) { return section = section.addSection(buildSection(s)); });
            Object.values(_this.notes)
                .filter(function (n) { return n.parent === flat.internalRef; })
                .map(function (n) { return section = section.addNote(n); });
            return section;
        };
        var notepad = new index_1.Notepad(this.title, {
            lastModified: date_fns_1.parse(this.lastModified),
            notepadAssets: this.notepadAssets
        });
        Object.values(this.sections)
            .filter(function (s) { return !s.parentRef; })
            .forEach(function (s) { return notepad = notepad.addSection(buildSection(s)); });
        return notepad;
    };
    FlatNotepad.prototype.clone = function (opts, title) {
        if (opts === void 0) { opts = {}; }
        if (title === void 0) { title = this.title; }
        return new FlatNotepad(title, __assign({ lastModified: date_fns_1.parse(this.lastModified), sections: this.sections, notes: this.notes, notepadAssets: this.notepadAssets }, opts));
    };
    return FlatNotepad;
}());
exports.default = FlatNotepad;

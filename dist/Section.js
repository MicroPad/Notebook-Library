"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var NPXObject_1 = require("./NPXObject");
var Section = (function (_super) {
    __extends(Section, _super);
    function Section(title, sections, notes, internalRef) {
        if (sections === void 0) { sections = []; }
        if (notes === void 0) { notes = []; }
        var _this = _super.call(this, title, internalRef) || this;
        _this.title = title;
        _this.sections = sections;
        _this.notes = notes;
        return _this;
    }
    Section.prototype.addSection = function (section) {
        var parent = this.clone({
            sections: __spread(this.sections, [
                section
            ])
        });
        section.parent = parent;
        return parent;
    };
    Section.prototype.addNote = function (note) {
        var parent = this.clone({
            notes: __spread(this.notes, [
                note
            ])
        });
        note.parent = parent;
        return parent;
    };
    Section.prototype.toXmlObject = function () {
        return {
            section: {
                $: {
                    title: this.title
                },
                section: this.sections.map(function (s) { return s.toXmlObject().section; }),
                note: this.notes.map(function (n) { return n.toXmlObject().note; })
            }
        };
    };
    Section.prototype.clone = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Section(opts.title || this.title, opts.sections || this.sections, opts.notes || this.notes, opts.internalRef || this.internalRef);
    };
    return Section;
}(NPXObject_1.NPXObject));
exports.default = Section;

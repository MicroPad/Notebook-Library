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
var NPXObject_1 = require("./NPXObject");
var date_fns_1 = require("date-fns");
var Note = (function (_super) {
    __extends(Note, _super);
    function Note(title, time, elements, bibliography, internalRef) {
        if (time === void 0) { time = new Date().getTime(); }
        if (elements === void 0) { elements = []; }
        if (bibliography === void 0) { bibliography = []; }
        var _this = _super.call(this, title, internalRef) || this;
        _this.title = title;
        _this.time = time;
        _this.elements = elements;
        _this.bibliography = bibliography;
        return _this;
    }
    Note.prototype.addElement = function (element) {
        return this.clone({
            elements: __spread(this.elements, [
                element
            ])
        });
    };
    Note.prototype.addSource = function (source) {
        return this.clone({
            bibliography: __spread(this.bibliography, [
                source
            ])
        });
    };
    Note.prototype.toXmlObject = function () {
        var elements = {};
        this.elements.forEach(function (e) {
            if (!elements[e.type])
                elements[e.type] = [];
            elements[e.type].push({
                $: __assign({}, e.args),
                _: e.content
            });
        });
        return {
            note: __assign({ $: {
                    title: this.title,
                    time: date_fns_1.format(this.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
                }, addons: [], bibliography: this.bibliography.map(function (source) {
                    return {
                        source: {
                            $: {
                                id: source.id,
                                item: source.item
                            },
                            _: source.content
                        }
                    };
                }) }, elements)
        };
    };
    Note.prototype.clone = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Note(opts.title || this.title, opts.time || this.time, opts.elements || this.elements, opts.bibliography || this.bibliography, opts.internalRef || this.internalRef);
    };
    return Note;
}(NPXObject_1.NPXObject));
exports.default = Note;

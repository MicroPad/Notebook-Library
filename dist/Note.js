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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    Note.prototype.search = function (query) {
        var pattern = new RegExp("\\b" + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'i');
        if (pattern.test(this.title))
            return [this];
        if (query.length > 1 && query.charAt(0) === '#') {
            pattern = new RegExp("(^|\\s)" + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + "(\\b)", 'i');
            if (this.elements
                .filter(function (e) { return e.type === 'markdown'; })
                .some(function (e) { return pattern.test(e.content); }))
                return [this];
        }
        return [];
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
        var bibliography = this.bibliography.map(function (source) {
            return {
                source: {
                    $: {
                        id: source.id,
                        item: source.item
                    },
                    _: source.content
                }
            };
        });
        return {
            note: __assign({ $: {
                    title: this.title,
                    time: date_fns_1.format(this.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
                }, addons: [[]], bibliography: (bibliography.length > 0) ? bibliography : [[]] }, elements)
        };
    };
    Note.prototype.toMarkdown = function (assets) {
        return __awaiter(this, void 0, void 0, function () {
            var assetMap, md;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetMap = {};
                        assets.forEach(function (a) { return assetMap[a.uuid] = a; });
                        return [4, Promise.all(this.elements
                                .filter(function (e) { return ['markdown', 'drawing', 'image'].includes(e.type); })
                                .map(function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var md, _a, asset, _b, bib;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = e.type;
                                            switch (_a) {
                                                case 'markdown': return [3, 1];
                                                case 'drawing': return [3, 2];
                                                case 'image': return [3, 2];
                                            }
                                            return [3, 4];
                                        case 1:
                                            md = e.content + '\n\n';
                                            return [3, 4];
                                        case 2:
                                            asset = assetMap[e.args.ext || 0];
                                            if (!asset)
                                                return [2, ''];
                                            _b = "![](";
                                            return [4, asset.toString()];
                                        case 3:
                                            md = _b + (_c.sent()) + ")\n\n";
                                            return [3, 4];
                                        case 4:
                                            if (!md)
                                                return [2, ''];
                                            bib = this.bibliography
                                                .filter(function (s) { return s.item === e.args.id; })
                                                .map(function (s) { return s.content; });
                                            if (bib.length > 0) {
                                                md += "***Bibliography***  \n";
                                                md += bib
                                                    .map(function (content) { return "- <" + content + ">\n"; })
                                                    .reduce(function (str, source) { return str += source; }, '') + '\n';
                                            }
                                            return [2, md];
                                    }
                                });
                            }); }))];
                    case 1:
                        md = (_a.sent())
                            .reduce(function (str, elementMd) { return str += elementMd; }, '');
                        return [2, { title: this.title, md: md }];
                }
            });
        });
    };
    Note.prototype.clone = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Note(opts.title || this.title, opts.time || this.time, opts.elements || this.elements, opts.bibliography || this.bibliography, opts.internalRef || this.internalRef);
    };
    return Note;
}(NPXObject_1.NPXObject));
exports.default = Note;

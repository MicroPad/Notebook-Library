"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var json_stringify_safe_1 = __importDefault(require("json-stringify-safe"));
var xml2js_1 = require("xml2js");
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
    Notepad.prototype.addAsset = function (asset) {
        return this.clone({
            assets: __spread(this.assets, [
                asset
            ])
        });
    };
    Notepad.prototype.toJson = function () {
        return json_stringify_safe_1.default(__assign({}, this, { assets: undefined }));
    };
    Notepad.prototype.toXml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var builder, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        builder = new xml2js_1.Builder({
                            cdata: true,
                            renderOpts: {
                                'pretty': false
                            },
                            xmldec: {
                                version: '1.0',
                                encoding: 'UTF-8',
                                standalone: false
                            }
                        });
                        return [4, this.toXmlObject()];
                    case 1:
                        obj = _a.sent();
                        return [2, builder.buildObject(obj).replace(/&#xD;/g, '')];
                }
            });
        });
    };
    Notepad.prototype.clone = function (opts, title) {
        if (opts === void 0) { opts = {}; }
        return new Notepad(title || this.title, __assign({ lastModified: date_fns_1.parse(this.lastModified), sections: this.sections, notepadAssets: this.notepadAssets, assets: this.assets }, opts));
    };
    Notepad.prototype.toXmlObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = {};
                        _b = {
                            $: {
                                'xsi:noNamespaceSchemaLocation': 'https://getmicropad.com/schema.xsd',
                                title: this.title,
                                lastModified: this.lastModified,
                                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
                            }
                        };
                        _c = {};
                        return [4, Promise.all(this.assets.map(function (a) { return a.toXmlObject(); }))];
                    case 1: return [2, (_a.notepad = (_b.assets = [
                            (_c.asset = _d.sent(),
                                _c)
                        ],
                            _b.section = this.sections.map(function (s) { return s.toXmlObject().section; }),
                            _b),
                            _a)];
                }
            });
        });
    };
    return Notepad;
}());
exports.default = Notepad;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var date_fns_1 = require("date-fns");
var Translators;
(function (Translators) {
    var Json;
    (function (Json) {
        function toNotepad(json) {
            var jsonObj = JSON.parse(json);
            var notepad = new index_1.Notepad(jsonObj.title, {
                lastModified: date_fns_1.parse(jsonObj.lastModified),
                notepadAssets: jsonObj.notepadAssets || []
            });
            jsonObj.sections.forEach(function (section) { return notepad = notepad.addSection(section); });
            return notepad;
        }
        Json.toNotepad = toNotepad;
    })(Json = Translators.Json || (Translators.Json = {}));
})(Translators = exports.Translators || (exports.Translators = {}));

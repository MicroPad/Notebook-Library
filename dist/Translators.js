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
            jsonObj.sections.forEach(function (section) { return notepad = notepad.addSection(restoreSection(section)); });
            return notepad;
        }
        Json.toNotepad = toNotepad;
        function restoreSection(section) {
            var restored = new index_1.Section(section.title);
            section.sections.forEach(function (s) { return restored = restored.addSection(restoreSection(s)); });
            section.notes.forEach(function (n) { return restored = restored.addNote(n); });
            return restored;
        }
        function restoreNote(note) {
            var restored = new index_1.Note(note.title, note.time, note.elements);
        }
    })(Json = Translators.Json || (Translators.Json = {}));
})(Translators = exports.Translators || (exports.Translators = {}));

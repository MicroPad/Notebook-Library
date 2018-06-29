import { Note, Notepad, Section } from './index';
import { parse } from 'date-fns';

export namespace Translators {
	export namespace Json {
		export function toNotepad(json: string): Notepad {
			const jsonObj: Notepad = JSON.parse(json);
			let notepad = new Notepad(jsonObj.title, {
				lastModified: parse(jsonObj.lastModified),
				notepadAssets: jsonObj.notepadAssets || []
			});

			// Restore sections
			jsonObj.sections.forEach(section => notepad = notepad.addSection(restoreSection(section)));

			// TODO: Restore assets

			return notepad;
		}

		function restoreSection(section: Section): Section {
			let restored = new Section(section.title).clone({ internalRef: section.internalRef });
			section.sections.forEach(s => restored = restored.addSection(restoreSection(s)));
			section.notes.forEach(n => restored = restored.addNote(restoreNote(n)));

			return restored;
		}

		function restoreNote(note: Note) {
			return new Note(note.title, note.time, note.elements, note.bibliography, note.internalRef);
		}
	}
}

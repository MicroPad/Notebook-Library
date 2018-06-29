import { Notepad } from './index';
import { parse } from 'date-fns';

export namespace Translators {
	export namespace Json {
		export function toNotepad(json: string): Notepad {
			const jsonObj: Notepad = JSON.parse(json);
			let notepad = new Notepad(jsonObj.title, {
				lastModified: parse(jsonObj.lastModified),
				notepadAssets: jsonObj.notepadAssets || []
			});

			// TODO: Restore sections
			jsonObj.sections.forEach(section => notepad = notepad.addSection(section));

			// TODO: Restore assets

			return notepad;
		}
	}
}

import { Note, Notepad, Section } from './index';
import { parse } from 'date-fns';
import { OptionsV2, parseString } from 'xml2js';
import { NoteElement, Source } from './Note';

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

	export namespace Xml {
		export async function toNotepadFromNpx(xml: string): Promise<Notepad> {
			const res = await parseXml(xml);
			let notepad = new Notepad(res.notepad.$.title, { lastModified: res.notepad.$.lastModified });

			// Parse sections/notes
			if (res.notepad.section) {
				res.notepad.section.forEach(s => notepad = notepad.addSection(parseSection(s)));
			}

			// TODO: Parse assets

			return notepad;

			function parseSection(sectionObj: any): Section {
				let section = new Section(sectionObj.$.title);

				// Insert sub-sections recursively because notepads are trees
				(sectionObj.section || []).forEach(item => section = section.addSection(parseSection(item)));

				// Parse notes
				(sectionObj.note || []).forEach(item =>
					section = section.addNote(new Note(
						item.$.title,
						item.$.time,
						[
							...([
									'markdown',
									'drawing',
									'image',
									'file',
									'recording'
								]
								.map(type =>
									(item[type] || []).map(e => {
										return {
											type: type,
											args: e.$,
											content: e._
										} as NoteElement;
									})
								)
							).reduce((acc: NoteElement[], element: NoteElement) => acc.concat(element))
						],
						[
							...(item.bibliography[0].source || []).map(s => {
								return {
									id: s.$.id,
									item: s.$.item,
									content: s._
								} as Source;
							})
						]
					))
				);

				return section;
			}
		}

		function parseXml(xml: string, opts: OptionsV2 = {}): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				parseString(xml, { trim: true, ...opts }, (err, res) => {
					if (err) reject(err);
					resolve(res);
				});
			});
		}
	}
}

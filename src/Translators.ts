import { Asset, FlatNotepad, Note, Notepad, Section } from './index';
import { parse } from 'date-fns';
import { OptionsV2, parseString } from 'xml2js';
import { NoteElement, Source } from './Note';
import { FlatSection } from './FlatNotepad';

export namespace Translators {
	export namespace Json {
		export function toNotepadFromNotepad(json: string): Notepad {
			const jsonObj: Notepad = JSON.parse(json);
			let notepad = new Notepad(jsonObj.title, {
				lastModified: parse(jsonObj.lastModified),
				notepadAssets: jsonObj.notepadAssets || []
			});

			// Restore sections
			jsonObj.sections.forEach(section => notepad = notepad.addSection(restoreSection(section)));

			return notepad;

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

		export function toFlatNotepadFromNotepad(json: string): FlatNotepad {
			const jsonObj: Notepad = JSON.parse(json);
			let notepad = new FlatNotepad(jsonObj.title, {
				lastModified: parse(jsonObj.lastModified),
				notepadAssets: jsonObj.notepadAssets || []
			});

			// Restore sections
			jsonObj.sections.forEach(section => restoreFlatSection(section));

			return notepad;

			function restoreFlatSection(section: Section) {
				let flat: FlatSection = { title: section.title, internalRef: section.internalRef };
				if (section.parent) flat.parentRef = (section.parent as Section).internalRef;

				// Add this flat section
				notepad = notepad.addSection(flat);
				section.notes.forEach(n => notepad = notepad.addNote(n));

				// Add all of its children recursively
				section.sections.forEach(s => restoreFlatSection(s));
			}
		}

		export function toMarkdownFromJupyter(json: string): string {
			const np = JSON.parse(json);

			let mdString = '';
			np.cells.forEach(cell => {
				if (cell.cell_type === 'markdown') cell.source.forEach(line => mdString += line+'\n');

				if (cell.cell_type === 'code') {
					mdString += '\n```\n';
					cell.source.forEach(line => mdString += line+'\n');

					cell.outputs.forEach(output => {
						if (!output.text) return;
						mdString += '\n--------------------\n';
						mdString += 'Output:\n';
						output.text.forEach(t => mdString += t);
						mdString += '\n--------------------\n';
					});

					mdString += '```\n';
				}
			});

			return mdString;
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

			// Parse assets
			if (res.notepad.assets) {
				((res.notepad.assets[0] || {}).asset || []).forEach(item => {
					try {
						notepad = notepad.addAsset(new Asset(dataURItoBlob(item._), item.$.uuid))
					} catch (e) {
						console.warn(`Can't parse the asset ${item.$.uuid}`);
					}
				});
			}

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
							).reduce((acc: NoteElement[], element: NoteElement[]) => acc.concat(element))
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

	// Thanks to http://stackoverflow.com/a/12300351/998467
	function dataURItoBlob(dataURI: string) {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		let byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to an ArrayBuffer
		let ab = new ArrayBuffer(byteString.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		return new Blob([ab], { type: mimeString });
	}
}

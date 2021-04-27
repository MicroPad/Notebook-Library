import { moveNote, moveSection } from './move-notes';
import fs from 'fs';
import path from 'path';
import { Translators } from '../Translators';
import FlatNotepad from '../FlatNotepad';

describe('Move Notes', () => {
	const helpNpx = fs.readFileSync(path.join(__dirname, '..', 'tests', '__data__', 'Help.npx')).toString();

	describe('moveNote', () => {
		it('should move the note and all of its asset references to the other notebook', async () => {
			// Arrange
			const source = (await Translators.Xml.toNotepadFromNpx(helpNpx)).flatten();
			const dest = new FlatNotepad('Destination', {
				lastModified: new Date(0),
				notepadAssets: ['fake-asset']
			});

			const noteToMove = Object.values(source.notes).find(note => note.title === 'Notepad Structure')!;
			const expectedAsset = '75dffe4d-bb75-2975-984d-9e43f911d675';

			// Act
			const { source: sourceRes, destination: destRes } = moveNote(noteToMove.internalRef, source, dest);

			// Assert
			expect(sourceRes.notes[noteToMove.internalRef]).toBeUndefined();
			expect(sourceRes.notepadAssets).not.toContain(expectedAsset);

			expect(destRes.notes[noteToMove.internalRef]).toEqual(noteToMove.clone({
				parent: Object.values(destRes.sections).find(s => s.title = 'Moved Notes')!.internalRef
			}));
			expect(destRes.notepadAssets).toContain(expectedAsset);
		});
	});

	describe('moveSection', () => {
		it('should move the section, all the notes, and assets to the other notebook', async () => {
			// Arrange
			const source = (await Translators.Xml.toNotepadFromNpx(helpNpx)).flatten();
			const dest = new FlatNotepad('Destination', {
				lastModified: new Date(0),
				notepadAssets: ['fake-asset']
			});

			const sectionToMove = Object.values(source.sections).find(section => section.title === 'General Use')!;
			const expectedAsset = '75dffe4d-bb75-2975-984d-9e43f911d675';

			// Act
			const { source: sourceRes, destination: destRes } = moveSection(sectionToMove.internalRef, source, dest);

			// Assert
			expect(sourceRes.sections[sectionToMove.internalRef]).toBeUndefined();
			expect(sourceRes.notepadAssets).not.toContain(expectedAsset);

			expect(destRes.sections[sectionToMove.internalRef]).toEqual({
				...sectionToMove,
				parentRef: Object.values(destRes.sections).find(s => s.title = 'Moved Notes')!.internalRef
			});
			expect(destRes.notepadAssets).toContain(expectedAsset);
		});

		it('should move sub-sections', async () => {
			// Arrange
			const source = (await Translators.Xml.toNotepadFromNpx(helpNpx)).flatten();
			const dest = new FlatNotepad('Destination', {
				lastModified: new Date(0),
				notepadAssets: ['fake-asset']
			});

			const sectionToMove = Object.values(source.sections).find(section => section.title === 'Development')!;
			const subSection = Object.values(source.sections).find(section => section.parentRef === sectionToMove.internalRef)!;

			// Act
			const { source: sourceRes, destination: destRes } = moveSection(sectionToMove.internalRef, source, dest);

			// Assert
			expect(sourceRes.sections[sectionToMove.internalRef]).toBeUndefined();
			expect(sourceRes.sections[subSection.internalRef]).toBeUndefined();

			expect(destRes.sections[sectionToMove.internalRef]).toEqual({
				...sectionToMove,
				parentRef: Object.values(destRes.sections).find(s => s.title = 'Moved Notes')!.internalRef
			});
			expect(destRes.sections[subSection.internalRef]).toEqual(subSection);
		});
	});
});
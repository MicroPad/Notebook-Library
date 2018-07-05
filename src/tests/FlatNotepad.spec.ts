import { FlatNotepad, Note, Section } from '../index';
import { FlatNotepadOptions, FlatSection } from '../FlatNotepad';
import { TestUtils } from './TestUtils';

describe('FlatNotepad', () => {
	let options = getOptions();

	beforeEach(() => {
		options = getOptions();
	});

	describe('constructor', () => {
		it('should construct with just a title', () => {
			// Arrange
			const title = 'test';

			// Act
			const n = new FlatNotepad(title);

			// Assert
			expect(n).toBeInstanceOf(FlatNotepad);
			expect(n.title).toEqual(title);
		});

		Object.entries(options).forEach(option =>
			it(`should construct with ${option[0]}`, () => {
				// Arrange
				const title = 'test';

				// Act
				const n = new FlatNotepad(title, {
					[option[0]]: option[1]
				});

				// Assert
				expect(n).toBeInstanceOf(FlatNotepad);
				expect(n.title).toEqual(title);
				expect(n[option[0]]).toMatchSnapshot();
			})
		);
	});

	it('should make a flat section', () => {
		// Arrange
		const expected = 'test section';

		// Act
		const res = FlatNotepad.makeFlatSection(expected);

		// Assert
		expect(res.title).toEqual(expected);
		expect(res.internalRef).toBeDefined();
		expect(res.parentRef).toBeUndefined();
	});

	describe('addSection', () => {
		let notepad: FlatNotepad;
		let section: FlatSection;

		beforeEach(() => {
			notepad = new FlatNotepad('test');
			section = { title: 'test', internalRef: 'abc' };
		});

		it('should add a new section', () => {
			//Arrange
			// Act
			const res = notepad.addSection(section);

			// Assert
			expect(res.sections[section.internalRef]).toEqual(section);
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = notepad.addSection(section);

			// Assert
			expect(res).not.toBe(notepad);
		});
	});

	describe('addNote', () => {
		let notepad: FlatNotepad;
		let section: FlatSection;
		let note: Note;

		beforeEach(() => {
			notepad = new FlatNotepad('test');
			section = { title: 'test', internalRef: 'abc' };

			note = new Note('test', new Date(1).getTime()).clone({ internalRef: 'etc' });
			note.parent = 'abc';
		});

		it('should add a new note', () => {
			//Arrange
			// Act
			const res = notepad.addNote(note);

			// Assert
			expect(res.notes[note.internalRef]).toEqual(note);
		});

		it(`should add a new note and convert the parent if it isn't a string`, () => {
			//Arrange
			note.parent = new Section('test').clone({ internalRef: 'abc' });

			// Act
			const res = notepad.addNote(note);

			// Assert
			expect(res.notes[note.internalRef].parent).toEqual('abc');
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = notepad.addNote(note);

			// Assert
			expect(res).not.toBe(notepad);
		});
	});

	describe('addAsset', () => {
		let notepad: FlatNotepad;
		const asset = 'test';

		beforeEach(() => {
			notepad = new FlatNotepad('test');
		});

		it('should add a new asset', () => {
			//Arrange
			// Act
			const res = notepad.addAsset(asset);

			// Assert
			expect(res.notepadAssets[0]).toEqual(asset);
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = notepad.addAsset(asset);

			// Assert
			expect(res).not.toBe(notepad);
		});
	});

	describe('modified', () => {
		it('should update lastModified', () => {
			// Arrange
			const expected = new FlatNotepad('expected', { lastModified: new Date(32) });
			let notepad = new FlatNotepad('test');

			// Act
			notepad = notepad.modified(new Date(32));

			// Assert
			expect(notepad.lastModified).toEqual(expected.lastModified);
		});
	});

	describe('search', () => {
		it('should call search on all notes', () => {
			// Arrange
			const notepad = new FlatNotepad('test', {
				lastModified: new Date(1),
				notes: {
					abc: TestUtils.makeNote('hi')
				}
			});

			Note.prototype.search = jest.fn(() => [TestUtils.makeNote('hi')]);

			// Act
			notepad.search('h');

			// Assert
			expect(Note.prototype.search).toHaveBeenCalledWith('h');
		});
	});

	describe('toNotepad', () => {
		it('should convert to a full Notepad object', () => {
			// Arrange
			let notepad = new FlatNotepad('test', options);
			notepad = notepad.addSection({ title: 'one-deep', internalRef: '1d', parentRef: 'abc' });
			notepad = notepad.addSection({ title: 'another root one', internalRef: 'r' });

			// Act
			const res = notepad.toNotepad();

			// Assert
			expect(res).toMatchSnapshot();
		});
	});

	describe('pathFrom', () => {
		const testNote = new Note('test note');
		testNote.parent = '1d';

		const notepad = new FlatNotepad('test', options)
			.addSection({ title: 'one-deep', internalRef: '1d', parentRef: 'abc' })
			.addSection({ title: 'another root one', internalRef: 'r' })
			.addNote(testNote);

		const mapToTitle = (obj: FlatNotepad | FlatSection): string => obj.title;

		it('should return a list of parents for a note', () => {
			// Arrange
			// Act
			const res = notepad.pathFrom(testNote);

			// Assert
			expect(res.map(mapToTitle)).toEqual([notepad.title, 'test section', 'one-deep']);
		});

		it('should return a list of parents for a FlatSection', () => {
			// Arrange
			// Act
			const res = notepad.pathFrom({ parentRef: 'r' } as FlatSection);

			// Assert
			expect(res.map(mapToTitle)).toEqual([notepad.title, 'another root one']);
		});

		it('should return an empty list for root-level items', () => {
			// Arrange
			// Act
			const res = notepad.pathFrom({} as FlatSection);

			// Assert
			expect(res.map(mapToTitle)).toEqual([notepad.title]);
		});
	});
});

function getOptions(): FlatNotepadOptions {
	const testSection: FlatSection = { title: 'test section', internalRef: 'abc' };
	const testNote = new Note('test note', new Date(1).getTime()).clone({ internalRef: 'etc' });
	testNote.parent = 'abc';

	return {
		lastModified: new Date(1),
		sections: { abc: testSection },
		notes: { etc: testNote },
		notepadAssets: ['test']
	};
}

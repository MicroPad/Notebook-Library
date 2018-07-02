import { TestUtils } from './TestUtils';
import { Note } from '../index';
import { ElementArgs, NoteElement, Source } from '../Note';

describe('Note', () => {
	let element: NoteElement;
	let source: Source;

	beforeEach(() => {
		element = {
			content: 'Hello, World!',
			type: 'markdown',
			args: {
				id: 'markdown1',
				x: '10px',
				y: '10px'
			}
		};

		source = {
			id: 1,
			item: 'markdown1',
			content: 'https://nick.geek.nz'
		};
	});

	it('should construct', () => {
		// Arrange
		const title = 'test';

		// Act
		const res = TestUtils.makeNote(title);

		// Assert
		expect(res).toBeInstanceOf(Note);
		expect(res.title).toEqual(title);
	});

	describe('addElement', () => {
		let note: Note;

		beforeEach(() => {
			note = TestUtils.makeNote('test note');
		});

		it('should add a new element', () => {
			//Arrange
			// Act
			const res = note.addElement(element);

			// Assert
			expect(res.elements[0]).toEqual(element);
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = note.addElement(element);

			// Assert
			expect(res).not.toBe(note);
		});
	});

	describe('addSource', () => {
		let note: Note;

		beforeEach(() => {
			note = TestUtils.makeNote('test note');
		});

		it('should add a new source', () => {
			//Arrange
			// Act
			const res = note.addSource(source);

			// Assert
			expect(res.bibliography[0]).toEqual(source);
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = note.addSource(source);

			// Assert
			expect(res).not.toBe(note);
		});
	});

	describe('search', () => {
		describe('title search', () => {
			it('should return empty array on no match', () => {
				// Arrange
				const note = TestUtils.makeNote('test');

				// Act
				const res = note.search('invalid');

				// Assert
				expect(res).toEqual([]);
			});

			it('should return an array with the note on a match', () => {
				// Arrange
				const note = TestUtils.makeNote('test');

				// Act
				const res = note.search('te');

				// Assert
				expect(res).toEqual([note]);
			});

			it('should return an array with the note on an empty query', () => {
				// Arrange
				const note = TestUtils.makeNote('test');

				// Act
				const res = note.search('');

				// Assert
				expect(res).toEqual([note]);
			});
		});

		describe('hashtag search', () => {
			it('should return empty array on no match', () => {
				// Arrange
				const note = TestUtils.makeNote('test');

				// Act
				const res = note.search('#test');

				// Assert
				expect(res).toEqual([]);
			});

			it('should not accept a partial match', () => {
				// Arrange
				let note = TestUtils.makeNote('test');
				note = note.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: '#match'
				});

				// Act
				const res = note.search('#mat');

				// Assert
				expect(res).toEqual([]);
			});

			it('should return an array with the note on a full match', () => {
				// Arrange
				let note = TestUtils.makeNote('test');
				note = note.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: '#match'
				});

				// Act
				const res = note.search('#match');

				// Assert
				expect(res).toEqual([note]);
			});
		});
	});

	it('should generate XML Object with required data', () => {
		// Arrange
		let note = TestUtils.makeNote('test note');
		note = note.addElement(element);
		note = note.addSource(source);

		// Act
		const res = note.toXmlObject();

		// Assert
		expect(res).toMatchSnapshot();
	});
});

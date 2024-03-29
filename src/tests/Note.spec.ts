import { TestUtils } from './TestUtils';
import { Note } from '../index';
import { canOptimiseElement, ElementArgs, NoteElement, Source } from '../Note';

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
			(note as any).bibliography = [];
		});

		it('should add a new source', () => {
			//Arrange
			// Act
			const res = note.addSource(source);

			// Assert
			expect(res.bibliography[0]).toEqual(source);
		});

		it('should store sources under one bibliography array', () => {
			//Arrange
			// Act
			const res = note
				.addSource(source)
				.addSource({
					...source,
					id: 2
				});

			// Assert
			expect(res.bibliography).toHaveLength(2);
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

	describe('getHashTags', () => {
		it('should return no matches with no hashtags', () => {
			// Arrange
			let note = TestUtils.makeNote('test');
			note = note.addElement({
				type: 'markdown',
				args: {} as ElementArgs,
				content: 'Hello.\n\nThere are no hashtags here.'
			});

			// Act
			const res = note.getHashtags();

			// Assert
			expect(res).toEqual([]);
		});

		it('should return all the hashtags in all the elements', () => {
			// Arrange
			let note = TestUtils.makeNote('test');
			note = note
				.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: 'Hello.\n\nThere is #todo here.'
				})
				.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: 'We have #blah and #bloop here.'
				});

			// Act
			const res = note.getHashtags();

			// Assert
			expect(res).toEqual(['#todo', '#blah', '#bloop']);
		});
	});

	describe('getHeadingWords', () => {
		it('should return no matches with no headings', () => {
			// Arrange
			let note = TestUtils.makeNote('test');
			note = note.addElement({
				type: 'markdown',
				args: {} as ElementArgs,
				content: 'Hello.\n\nThere are no headings here.'
			});

			// Act
			const res = note.getHeadingWords();

			// Assert
			expect(res.size).toBe(0);
		});

		it('should return all the heading words in all the elements', () => {
			// Arrange
			let note = TestUtils.makeNote('test');
			note = note
				.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: '# Hello\n\nThere is #todo here.'
				})
				.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: 'This\n\n## Has a sub-heading'
				})
				.addElement({
					type: 'markdown',
					args: {} as ElementArgs,
					content: 'This\n\n## Has a sub-heading\n# And a primary'
				});

			// Act
			const res = note.getHeadingWords();

			// Assert
			expect(res).toEqual(new Set(['Hello', 'Has', 'a', 'sub-heading', 'And', 'primary']));
		});
	});

	it('should generate XML Object with required data', () => {
		// Arrange
		let note = TestUtils.makeNote('test note');
		note = note.addElement(element);

		// Act
		const res = note.toXmlObject();

		// Assert
		expect(res).toMatchSnapshot();
	});

	describe('canOptimiseElement', () => {
		it('should be true for image elements when not specified', () => {
			expect(canOptimiseElement({
				type: 'image',
				content: 'AS',
				args: {
					id: 'image46-ghjg',
					x: '0',
					y: '0',
					width: '100px',
					height: '100px',
				}
			})).toBe(true);
		});

		it('should be true for any element when tagged', () => {
			expect(canOptimiseElement({
				type: 'markdown',
				content: 'AS',
				args: {
					id: 'markdown46-ghjg',
					x: '0',
					y: '0',
					width: '100px',
					height: '100px',
					canOptimise: true
				}
			})).toBe(true);
		});

		it('should be false for image elements when width is auto', () => {
			expect(canOptimiseElement({
				type: 'image',
				content: 'AS',
				args: {
					id: 'image46-ghjg',
					x: '0',
					y: '0',
					width: 'auto',
					height: '100px',
				}
			})).toBe(false);
		});

		it('should be false for image elements when height is auto', () => {
			expect(canOptimiseElement({
				type: 'image',
				content: 'AS',
				args: {
					id: 'image46-ghjg',
					x: '0',
					y: '0',
					width: '100px',
					height: 'auto',
				}
			})).toBe(false);
		});

		it('should be false for image elements when width and height is auto', () => {
			expect(canOptimiseElement({
				type: 'image',
				content: 'AS',
				args: {
					id: 'image46-ghjg',
					x: '0',
					y: '0',
					width: 'auto',
					height: 'auto',
				}
			})).toBe(false);
		});

		it('should be false for image elements when tagged as false', () => {
			expect(canOptimiseElement({
				type: 'image',
				content: 'AS',
				args: {
					id: 'image46-ghjg',
					x: '0',
					y: '0',
					width: 'auto',
					canOptimise: false
				}
			})).toBe(false);
		});

		it('should be false for any element when not tagged', () => {
			expect(canOptimiseElement({
				type: 'markdown',
				content: 'AS',
				args: {
					id: 'markdown46-ghjg',
					x: '0',
					y: '0',
					width: 'auto'
				}
			})).toBe(false);
		});
	});
});

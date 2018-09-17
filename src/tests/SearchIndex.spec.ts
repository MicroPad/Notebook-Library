import { FlatNotepad, Trie } from '../index';
import { TestUtils } from './TestUtils';
import { ElementArgs } from '../Note';

describe('SearchIndex', () => {
	let trie: Trie;

	beforeEach(() => {
		trie = new Trie();
	});

	it('should return the notes that match the search', () => {
		// Arrange
		let notepad = new FlatNotepad('test');
		notepad = notepad.clone({
			lastModified: new Date(1),
			notes: {
				abc: TestUtils.makeNote('hi'),
				abc2: TestUtils.makeNote('nope'),
				abc3: TestUtils.makeNote('hello')
			}
		});
		const trie = Trie.buildTrie(notepad.notes);

		// Act
		const res = notepad.search(trie, 'h');

		// Assert
		expect(res).toMatchSnapshot();
	});

	it('should search by hashtag', () => {
		// Arrange
		const notepad = new FlatNotepad('test', {
			lastModified: new Date(1),
			notes: {
				abc: TestUtils.makeNote('hi'),
				abc2: TestUtils.makeNote('nope'),
				abc3: TestUtils.makeNote('hello')
					.addElement({
						type: 'markdown',
						args: {} as ElementArgs,
						content: 'Sup #test'
					})
			}
		});
		const trie = Trie.buildTrie(notepad.notes);

		// Act
		const res = notepad.search(trie, '#test');

		// Assert
		expect(res).toMatchSnapshot();
	});

	it('should not partial match hashtags', () => {
		// Arrange
		const notepad = new FlatNotepad('test', {
			lastModified: new Date(1),
			notes: {
				abc: TestUtils.makeNote('hi'),
				abc2: TestUtils.makeNote('nope'),
				abc3: TestUtils.makeNote('hello')
					.addElement({
						type: 'markdown',
						args: {} as ElementArgs,
						content: 'Sup #test'
					})
			}
		});
		const trie = Trie.buildTrie(notepad.notes);

		// Act
		const res = notepad.search(trie, '#te');

		// Assert
		expect(res).toEqual([]);
	});

	describe('shouldReindex', () => {
		it('should reindex if the notepad has changed in date', () => {
			// Arrange
			const notepad = new FlatNotepad('test', {
				lastModified: new Date(1),
				notes: {
					abc: TestUtils.makeNote('hi'),
					abc2: TestUtils.makeNote('nope'),
					abc3: TestUtils.makeNote('hello')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: 'Sup #test'
						})
				}
			});
			const trie = Trie.buildTrie(notepad.notes, new Date(1));

			// Act
			const res = trie.shouldReindex(new Date(5), 3);

			// Assert
			expect(res).toEqual(true);
		});

		it('should reindex if the notepad has changed in number of notes', () => {
			// Arrange
			const notepad = new FlatNotepad('test', {
				lastModified: new Date(1),
				notes: {
					abc: TestUtils.makeNote('hi'),
					abc2: TestUtils.makeNote('nope'),
					abc3: TestUtils.makeNote('hello')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: 'Sup #test'
						})
				}
			});
			const trie = Trie.buildTrie(notepad.notes, new Date(1));

			// Act
			const res = trie.shouldReindex(new Date(1), 5);

			// Assert
			expect(res).toEqual(true);
		});

		it(`should not reindex if the notepad hasn't changed`, () => {
			// Arrange
			const notepad = new FlatNotepad('test', {
				lastModified: new Date(1),
				notes: {
					abc: TestUtils.makeNote('hi'),
					abc2: TestUtils.makeNote('nope'),
					abc3: TestUtils.makeNote('hello')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: 'Sup #test'
						})
				}
			});
			const trie = Trie.buildTrie(notepad.notes, new Date(1));

			// Act
			const res = trie.shouldReindex(new Date(1), 3);

			// Assert
			expect(res).toEqual(false);
		});
	});
});
import { FlatNotepad, Translators, Trie } from '../index';
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

	it('should search by word', () => {
		// Arrange
		let notepad = new FlatNotepad('test');
		notepad = notepad.clone({
			lastModified: new Date(1),
			notes: {
				abc: TestUtils.makeNote('hi'),
				abc2: TestUtils.makeNote('nope'),
				abc3: TestUtils.makeNote('hello there')
			}
		});
		const trie = Trie.buildTrie(notepad.notes);

		// Act
		const res = notepad.search(trie, 'there');

		// Assert
		expect(res).toMatchSnapshot();
	});

	it('should ignore brackets', () => {
		// Arrange
		const expected = TestUtils.makeNote('hello (there)');
		let notepad = new FlatNotepad('test');
		notepad = notepad.clone({
			lastModified: new Date(1),
			notes: {
				abc: TestUtils.makeNote('hi'),
				abc2: TestUtils.makeNote('nope'),
				abc3: expected
			}
		});
		const trie = Trie.buildTrie(notepad.notes);

		// Act
		const res = notepad.search(trie, 'there');

		// Assert
		expect(res).toEqual([expected]);
	});

	it('should split by slashes and commas', () => {
		// Arrange
		const expected = [
			TestUtils.makeNote('hello/that'),
			TestUtils.makeNote('hi\\that'),
			TestUtils.makeNote('hi,that')
		];

		let notepad = new FlatNotepad('test');
		notepad = notepad.clone({
			lastModified: new Date(1),
			notes: {
				abc: TestUtils.makeNote('hi'),
				abc2: TestUtils.makeNote('nope'),
				abc3: expected[0],
				abc4: expected[1],
				abc5: expected[2]
			}
		});
		const trie = Trie.buildTrie(notepad.notes);

		// Act
		const res = notepad.search(trie, 'that');

		// Assert
		expect(res).toEqual(expected);
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

	describe('heading search', () => {
		it('should search by heading', () => {
			// Arrange
			const notepad = new FlatNotepad('test', {
				lastModified: new Date(1),
				notes: {
					abc: TestUtils.makeNote('hi')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: '# Nothing interesting here\nNot at _all_'
						}),
					abc2: TestUtils.makeNote('nope')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: '# This is a heading'
						}),
					abc3: TestUtils.makeNote('hello')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: '## This is also a heading'
						}),
					abc4: TestUtils.makeNote('nah')
						.addElement({
							type: 'markdown',
							args: {} as ElementArgs,
							content: '## This #heading will not match because hashtag'
						})
				}
			});
			const trie = Trie.buildTrie(notepad.notes);

			// Act
			const res = notepad.search(trie, 'headi');

			// Assert
			expect(res).toMatchSnapshot();
		});
	});

	it('should be able to return a list of all known hashtags', () => {
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

		const expected = ['#test'];

		// Act
		const res = trie.availableHashtags;

		// Assert
		expect(res).toEqual(expected);
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

	// See https://github.com/MicroPad/MicroPad-Core/issues/215
	it('should handle sections with trailing spaces in their name', async () => {
		// Arrange
		const npx = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<notepad lastModified="2020-04-03T16:27:09.722+13:00" title="Trailing space bug" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://getmicropad.com/schema.xsd">
	<assets/>
	<section title="I have a space at the end ">
		<note time="2020-04-03T16:26:46.716+13:00" title="Click me">
			<addons/>
			<bibliography/>
		</note>
	</section>
</notepad>`;

		const notepad = await Translators.Xml.toNotepadFromNpx(npx);
		const expected = notepad.sections[0]?.notes[0]?.internalRef;
		if (!expected) throw new Error('Missing internalRef');

		const trie = Trie.buildTrie(notepad.flatten().notes);

		// Act
		const res = Trie.search(trie, "Click");

		// Assert
		expect(res).toEqual([expected])
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
			const res = Trie.shouldReindex(trie, new Date(5), 3);

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
			const res = Trie.shouldReindex(trie, new Date(1), 5);

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
			const res = Trie.shouldReindex(trie, new Date(1), 3);

			// Assert
			expect(res).toEqual(false);
		});
	});
});

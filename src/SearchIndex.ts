import { Note } from './index';

export class Trie {
	public static buildTrie(notes: { [internalRef: string]: Note }, date = new Date()): Trie {
		const trie = new Trie(date);
		Object.entries(notes).forEach(([noteRef, note]) => {
			// Add the note title
			const title = note.title.replace(/[()]/, '');
			title.split(/[\s\/\\,]/).forEach(word => Trie.add(trie, word, noteRef));

			// More explicit matching on headings than titles to limit false-positives
			note.getHeadingWords().forEach(headingWord => Trie.add(trie, headingWord, noteRef));

			note.getHashtags().forEach(hashtag => Trie.add(trie, hashtag, noteRef));
		});

		return trie;
	}

	public static shouldReindex(trie: Trie, lastModified: Date, numberOfNotes: number): boolean {
		return lastModified.getTime() > trie.lastModified.getTime() || numberOfNotes !== trie._size;
	}

	public static add(trie: Trie, key: string, ref: string): void {
		key = key.toLowerCase();
		if (key.charAt(0) === '#') {
			const notes = trie.hashtags[key] || [];
			if (notes.indexOf(ref) !== -1) return;

			trie.hashtags[key] = [...notes, ref];
			return;
		}

		const keyChars = [...key];
		let node: TrieNode = trie.root;

		for (let ch of keyChars) {
			if (!node.children[ch]) node.children[ch] = new TrieNode(ch);
			node = node.children[ch];
		}

		node.notes.push(ref);
		trie._size++;
	}

	public static search(trie: Trie, query: string): string[] {
		query = query.toLowerCase();
		if (query.charAt(0) === '#') {
			return trie.hashtags[query] || [];
		}

		const keyChars = [...query];
		let node: TrieNode = trie.root;

		for (let ch of keyChars) {
			if (!node.children[ch]) return [];
			node = node.children[ch];
		}

		return [...new Set(node.getAllFrom())];
	}

	private _size: number = 0;

	private readonly root: TrieNode;
	private readonly lastModified: Date;
	private readonly hashtags: { [hashtag: string]: string[] } = {};

	constructor(lastModified = new Date()) {
		this.root = new TrieNode();
		this.lastModified = lastModified;
	}

	public get size(): number {
		return this._size;
	}

	public get availableHashtags(): string[] {
		return Object.keys(this.hashtags);
	}

	/**
	 * @deprecated Use static methods instead
	 */
	public shouldReindex(lastModified: Date, numberOfNotes: number): boolean {
		return Trie.shouldReindex(this, lastModified, numberOfNotes);
	}

	/**
	 * @deprecated Use static methods instead
	 */
	public add(key: string, ref: string): void {
		return Trie.add(this, key, ref);
	}

	/**
	 * @deprecated Use static methods instead
	 */
	public search(query: string): string[] {
		return Trie.search(this, query);
	}
}

class TrieNode {
	public static getAllFrom(node: TrieNode): string[] {
		return [
			...node.notes,
			...(Object.values(node.children))
				.reduce((acc, val) => acc.concat(val.getAllFrom()), [] as string[])
		];
	}

	public readonly key: string;
	public readonly notes: string[] = [];
	public readonly children: { [ch: string]: TrieNode } = {};

	constructor(key = '\0') {
		this.key = key;
	}

	public getAllFrom(): string[] {
		return TrieNode.getAllFrom(this);
	}
}

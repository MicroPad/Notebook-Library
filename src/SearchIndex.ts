import { Note } from './index';

export class Trie {
	public static buildTrie(notes: { [internalRef: string]: Note }, date = new Date()): Trie {
		const trie = new Trie(date);
		Object.entries(notes).forEach(entry => {
			// Add the note title
			trie.add(entry[1].title, entry[0]);

			// Add note hashtags
			entry[1].getHashtags().forEach(hashtag => trie.add(hashtag, entry[0]));
		});

		return trie;
	}

	private readonly root: TrieNode;
	private readonly lastModified: Date;
	private readonly hashtags: { [hashtag: string]: string[] } = {};
	private _size: number = 0;

	constructor(lastModified = new Date()) {
		this.root = new TrieNode();
		this.lastModified = lastModified;
	}

	public shouldReindex(lastModified: Date, numberOfNotes: number): boolean {
		return lastModified.getTime() > this.lastModified.getTime() || numberOfNotes !== this.size;
	}

	public add(key: string, ref: string): void {
		if (key.charAt(0) === '#') {
			const notes = this.hashtags[key] || [];
			if (notes.indexOf(ref) !== -1) return;

			this.hashtags[key] = [...notes, ref];
			return;
		}

		const keyChars = [...key];
		let node: TrieNode = this.root;

		for (let ch of keyChars) {
			if (!node.children[ch]) node.children[ch] = new TrieNode(ch);
			node = node.children[ch];
		}

		node.notes.push(ref);
		this._size++;
	}

	public search(query: string): string[] {
		if (query.charAt(0) === '#') {
			return this.hashtags[query] || [];
		}

		const keyChars = [...query];
		let node: TrieNode = this.root;

		for (let ch of keyChars) {
			if (!node.children[ch]) return [];
			node = node.children[ch];
		}

		return [...new Set(node.getAllFrom())];
	}

	public get size() {
		return this._size;
	}
}

class TrieNode {
	public readonly key: string;
	public readonly notes: string[] = [];
	public readonly children: { [ch: string]: TrieNode } = {};

	constructor(key = '\0') {
		this.key = key;
	}

	public getAllFrom(): string[] {
		return [
			...this.notes,
			...(Object.values(this.children))
				.reduce((acc, val) => acc.concat(val.getAllFrom()), [] as string[])
		];
	}
}
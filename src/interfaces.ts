import Section from './Section';
import Note, { MarkdownNote } from './Note';
import Asset from './Asset';
import { EncryptionMethod } from './crypto';

export interface Parent {
	title: string;
	addSection: (section: Section) => Parent;
	search: (query: string) => Note[];
	toMarkdown: (asset: Asset[]) => Promise<MarkdownNote[]>;
}

export interface NotepadShell {
	title: string;
	lastModified: string;
	notepadAssets: string[];
	assets?: Asset[];

	/**
	 * This is the either the cypher-text of the {@link Section} array or the actual {@link Section} array
	 */
	sections: string | Section[];

	crypto?: EncryptionMethod;
}

export interface FileReaderEventTarget extends EventTarget {
	result: string;
}

import { format, parse } from 'date-fns';
import { Asset, FlatNotepad, Note, Parent, Section } from './';
import stringify from 'json-stringify-safe';
import { Builder } from 'xml2js';
import { FlatSection } from './FlatNotepad';
import { MarkdownNote } from './Note';

export type NotepadOptions = {
	lastModified?: Date;
	sections?: Section[];
	notepadAssets?: string[];
	assets?: Asset[];
};

/**
 * This class is identical in structure to the old Notepad class from the original parser.
 * This represents the notepad as a tree. If you're looking for a flatter structure you can use {@link FlatNotepad}.
 *
 * Something to remember is that all operations on this class like addSection, will return a <strong>new</strong>
 * object of this class, and not modify the existing one.
 */
export default class Notepad implements Parent {
	public readonly lastModified: string;
	public readonly sections: Section[];
	public readonly notepadAssets: string[];
	public readonly assets: Asset[];

	constructor(
		public readonly title: string,
		opts: NotepadOptions = {}
	) {
		this.lastModified = format(opts.lastModified || new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
		this.sections = opts.sections || [];
		this.notepadAssets = opts.notepadAssets || [];
		this.assets = opts.assets || [];
	}

	public addSection(section: Section): Notepad {
		const notepad = this.clone({
			sections: [
				...this.sections,
				section
			]
		});
		section.parent = notepad;

		return notepad;
	}

	public addAsset(asset: Asset): Notepad {
		return this.clone({
			assets: [
				...this.assets,
				asset
			],
			notepadAssets: [
				...this.notepadAssets,
				asset.uuid
			]
		});
	}

	/**
	 * This updates the lastModified date on the notepad. This date is used for syncing so it's important
	 * to call this method whenever a change is made that will need to be synced.
	 * @param {Date} lastModified
	 * @returns {Notepad}
	 */
	public modified(lastModified: Date = new Date()): Notepad {
		return this.clone({
			lastModified
		});
	}

	/**
	 * @param {string} query Can either be a title-search or a hashtag-search
	 * @returns {Note[]}
	 */
	public search(query: string): Note[] {
		return this.sections
			.map(s => s.search(query))
			.reduce((acc, val) => acc.concat(val), []);
	}

	public toJson(): string {
		return stringify({
			...(<object> this),
			assets: undefined
		});
	}

	public async toXml(): Promise<string> {
		const builder = new Builder({
			cdata: true,
			renderOpts: {
				'pretty': false
			},
			xmldec: {
				version: '1.0',
				encoding: 'UTF-8',
				standalone: false
			}
		});

		// Generate the XML
		const obj = await this.toXmlObject();
		return builder.buildObject(obj).replace(/&#xD;/g, '');
	}

	public flatten(): FlatNotepad {
		let notepad = new FlatNotepad(this.title, {
			lastModified: parse(this.lastModified),
			notepadAssets: this.notepadAssets
		});

		const flattenSection = (section: Section) => {
			let flat: FlatSection = { title: section.title, internalRef: section.internalRef };
			if (section.parent) flat.parentRef = (section.parent as Section).internalRef;

			// Add this flat section
			notepad = notepad.addSection(flat);
			section.notes.forEach(n => notepad = notepad.addNote(n));

			// Add all of its children recursively
			section.sections.forEach(s => flattenSection(s));
		};
		this.sections.forEach(s => flattenSection(s));

		return notepad;
	}

	public async toMarkdown(assets: Asset[]): Promise<MarkdownNote[]> {
		return (
			await Promise.all(
				this.sections.map(s => s.toMarkdown(assets))
			)
		).reduce((acc, val) => acc.concat(val), []);
	}

	public clone(opts: Partial<NotepadOptions> = {}, title: string = this.title): Notepad {
		return new Notepad(title, {
			lastModified: parse(this.lastModified),
			sections: [...this.sections],
			notepadAssets: [...this.notepadAssets],
			assets: [...this.assets],
			...opts
		});
	}

	private async toXmlObject(): Promise<object> {
		return {
			notepad: {
				$: {
					'xsi:noNamespaceSchemaLocation': 'https://getmicropad.com/schema.xsd',
					title: this.title,
					lastModified: this.lastModified,
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
				},
				assets: [
					{
						asset: await Promise.all(this.assets.map(a => a.toXmlObject()))
					}
				],
				section: this.sections.map(s => s.toXmlObject().section)
			}
		};
	}
}

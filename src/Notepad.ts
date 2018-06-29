import { format, parse } from 'date-fns';
import { Asset, Parent, Section } from './';
import stringify from 'json-stringify-safe';

export type NotepadOptions = {
	lastModified?: Date;
	sections?: Section[];
	notepadAssets?: string[];
	assets?: Asset[];
};

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

	public toJson(): string {
		return stringify({
			...(<object> this),
			assets: undefined
		});
	}

	public toXml() {
		// TODO: XML export
		return '';
	}

	private clone(opts: Partial<NotepadOptions> = {}, title?: string): Notepad {
		return new Notepad(title || this.title, {
			lastModified: parse(this.lastModified),
			sections: this.sections,
			notepadAssets: this.notepadAssets,
			assets: this.assets,
			...opts
		});
	}

	private async toXmlObject(): Promise<object> {
		return {};
	}
}

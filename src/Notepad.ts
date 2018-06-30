import { format, parse } from 'date-fns';
import { Asset, Parent, Section } from './';
import stringify from 'json-stringify-safe';
import { Builder } from 'xml2js';

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

	public modified(lastModified: Date = new Date()): Notepad {
		return this.clone({
			lastModified
		});
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

	public clone(opts: Partial<NotepadOptions> = {}, title: string = this.title): Notepad {
		return new Notepad(title, {
			lastModified: parse(this.lastModified),
			sections: this.sections,
			notepadAssets: this.notepadAssets,
			assets: this.assets,
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

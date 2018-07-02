import { NPXObject } from './NPXObject';
import { format } from 'date-fns';
import { Asset } from './index';

export type NoteElement = {
	type: 'markdown' | 'image' | 'drawing' | 'file' | 'recording';
	content: string;
	args: ElementArgs;
};

export type ElementArgs = {
	id: string;
	x: string;
	y: string;
	width?: string;
	height?: string;
	fontSize?: string;
	filename?: string;
	ext?: string;
};

export type Source = {
	id: number;
	item: string;
	content: string;
};

export type MarkdownNote = {
	title: string;
	md: string;
};

export default class Note extends NPXObject {
	constructor(
		public readonly title: string,
		public readonly time: number = new Date().getTime(),
		public readonly elements: NoteElement[] = [],
		public readonly bibliography: Source[] = [],
		internalRef?: string
	) {
		super(title, internalRef);
	}

	public addElement(element: NoteElement): Note {
		return this.clone({
			elements: [
				...this.elements,
				element
			]
		});
	}

	public addSource(source: Source): Note {
		return this.clone({
			bibliography: [
				...this.bibliography,
				source
			]
		});
	}

	public search(query: string): Note[] {
		// Title search
		let pattern = new RegExp("\\b" + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'i');
		if (pattern.test(this.title)) return [this];

		// Hashtag search
		if (query.length > 1 && query.charAt(0) === '#') {
			pattern = new RegExp("(^|\\s)" + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + "(\\b)", 'i');

			// Check if any markdown elements contain the hashtag
			if (
				this.elements
					.filter(e => e.type === 'markdown')
					.some(e => pattern.test(e.content))
			) return [this];
		}

		return [];
	}

	public toXmlObject(): any {
		const elements = {};
		this.elements.forEach(e => {
			if (!elements[e.type]) elements[e.type] = [];
			elements[e.type].push({
				$: { ...e.args },
				_: e.content
			});
		});

		const bibliography = this.bibliography.map(source => {
			return {
				source: {
					$: {
						id: source.id,
						item: source.item
					},
					_: source.content
				}
			};
		});

		return {
			note: {
				$: {
					title: this.title,
					time: format(this.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
				},
				addons: [[]], // We aren't supporting addons in v3 of the parser but we'll keep this for NPX compatibility
				bibliography: (bibliography.length > 0) ? bibliography : [[]],
				...elements
			}
		};
	}

	public async toMarkdown(assets: Asset[]): Promise<MarkdownNote> {
		const assetMap = {};
		assets.forEach(a => assetMap[a.uuid] = a);

		const md: string = (await Promise.all(this.elements
			.filter(e => ['markdown', 'drawing', 'image'].includes(e.type))
			.map(async e => {
				let md: string | undefined;

				switch (e.type) {
					case 'markdown':
						md = e.content + '\n\n';
						break;

					case 'drawing':
					case 'image':
						const asset = assetMap[e.args.ext || 0];
						if (!asset) return '';

						md = `![](${await asset.toString()})\n\n`;
						break;
				}
				if (!md) return '';

				// Bibliography
				const bib = this.bibliography
					.filter(s => s.item === e.args.id)
					.map(s => s.content);

				if (bib.length > 0) {
					md += `***Bibliography***  \n`;
					md += bib
						.map(content => `- <${content}>\n`)
						.reduce((str, source) => str += source, '') + '\n';
				}

				return md;
			})))
			.reduce((str, elementMd) => str += elementMd, '');

		return { title: this.title, md };
	}

	public clone(opts: Partial<Note> = {}): Note {
		return new Note(
			opts.title || this.title,
			opts.time || this.time,
			opts.elements || this.elements,
			opts.bibliography || this.bibliography,
			opts.internalRef || this.internalRef
		);
	}
}

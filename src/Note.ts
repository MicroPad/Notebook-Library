import { NPXObject } from './NPXObject';
import { format } from 'date-fns';

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

	public toXmlObject(): any {
		const elements = {};
		this.elements.forEach(e => {
			if (!elements[e.type]) elements[e.type] = [];
			elements[e.type].push({
				$: { ...e.args },
				_: e.content
			});
		});

		return {
			note: {
				$: {
					title: this.title,
					time: format(this.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
				},
				addons: [], // We aren't supporting addons in v3 of the parser but we'll keep this for NPX compatibility
				bibliography: this.bibliography.map(source => {
					return {
						source: {
							$: {
								id: source.id,
								item: source.item
							},
							_: source.content
						}
					};
				}),
				...elements
			}
		};
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

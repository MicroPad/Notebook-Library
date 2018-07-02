import { Parent } from './interfaces';
import { Note } from './index';
import { NPXObject } from './NPXObject';

export default class Section extends NPXObject implements Parent {
	constructor(
		public readonly title: string,
		public readonly sections: Section[] = [],
		public readonly notes: Note[] = [],
		internalRef?: string
	) {
		super(title, internalRef);
	}

	public addSection(section: Section): Section {
		const parent = this.clone({
			sections: [
				...this.sections,
				section
			]
		});
		section.parent = parent;

		return parent;
	}

	public addNote(note: Note): Section {
		const parent = this.clone({
			notes: [
				...this.notes,
				note
			]
		});
		note.parent = parent;

		return parent;
	}

	public search(query: string): Note[] {
		const subSectionNotes: Note[] = this.sections
			.map(s => s.search(query))
			.reduce((acc, val) => acc.concat(val), []);

		return [
			...this.notes.filter(n => n.search(query).length > 0),
			...subSectionNotes
		];
	}

	public toXmlObject(): any {
		return {
			section: {
				$: {
					title: this.title
				},
				section: this.sections.map(s => s.toXmlObject().section),
				note: this.notes.map(n => n.toXmlObject().note)
			}
		};
	}

	public clone(opts: Partial<Section> = {}): Section {
		return new Section(
			opts.title || this.title,
			opts.sections || this.sections,
			opts.notes || this.notes,
			opts.internalRef || this.internalRef
		);
	}
}

import { Parent } from './interfaces';
import { Note } from './index';
import { NPXObject } from './NPXObject';

export default class Section extends NPXObject implements Parent {
	public parent: Parent | undefined;

	constructor(
		public readonly title: string,
		public readonly sections: Section[] = [],
		public readonly notes: Note[] = []
	) {
		super(title);
	}

	public toXmlObject(): any {
		return {
			section: {
				$: {
					title: this.title
				},
				section: this.sections.map(s => s.toXmlObject().section),
				notes: [] // TODO: Notes
			}
		};
	}
}

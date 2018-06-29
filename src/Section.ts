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

	public async toXmlObject(): Promise<object> {
		return {};
	}
}

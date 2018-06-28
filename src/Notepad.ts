import { format } from 'date-fns';
import { Section } from './Section';

export class Notepad {
	public readonly lastModified: string;
	private readonly sections: Section[] = [];
	private readonly notepadAssets: string[] = [];

	constructor(
		public readonly title: string,
		lastModified?: Date
	) {
		this.lastModified = format(lastModified || new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
	}

	public toJson() {
		return JSON.stringify(this);
	}

	public toXml() {
		// TODO: XML export
		return '';
	}
}

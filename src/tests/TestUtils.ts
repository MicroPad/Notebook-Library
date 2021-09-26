import { Asset, Note, Section } from '../index';
import { Source } from '../Note';

if (typeof Blob === 'undefined') {
	const { Blob, FileReader } = require('vblob');
	global.Blob = Blob;
	global.FileReader = FileReader;
}

export namespace TestUtils {
	export function makeSection(title: string, sections?: Section[], notes?: Note[], ref: string = 'abc'): Section {
		const section = new Section(title, sections, notes);
		(section as any).internalRef = ref;

		return section;
	}

	export function makeNote(title: string, time: Date = new Date(1), ref: string = 'abc'): Note {
		const source: Omit<Source, 'id'> = {
			content: 'test',
			item: 'markdown1'
		};

		const note = new Note(title, time.getTime())
			.addSource({ ...source, id: 1 })
			.addSource({ ...source, id: 2 });

		(note as any).internalRef = ref;

		return note;
	}

	export function makeAsset(data: string = 'test', ref: string = 'abc'): Asset {
		return new Asset(new Blob([data]), ref);
	}
}

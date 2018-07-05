import { Asset, Note, Section } from '../index';

export namespace TestUtils {
	export function makeSection(title: string, sections?: Section[], notes?: Note[], ref: string = 'abc'): Section {
		const section = new Section(title, sections, notes);
		(section as any).internalRef = ref;

		return section;
	}

	export function makeNote(title: string, time: Date = new Date(1), ref: string = 'abc'): Note {
		const note = new Note(title, time.getTime());
		(note as any).internalRef = ref;

		return note;
	}

	export function makeAsset(data: string = 'test', ref: string = 'abc'): Asset {
		// @ts-ignore Ignore the error here, Jest will manage this
		return new Asset(new Blob([data]), ref);
	}
}
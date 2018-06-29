import { Note, Section } from '../index';

export namespace TestUtils {
	export function makeSection(title: string, sections?: Section[], notes?: Note[]): Section {
		const section = new Section(title, sections, notes);
		(section as any).internalRef = 'abc';

		return section;
	}

	export function makeNote(title: string, time: Date = new Date(1)): Note {
		const note = new Note(title, time);
		(note as any).internalRef = 'abc';

		return note;
	}
}
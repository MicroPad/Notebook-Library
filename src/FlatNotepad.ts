import { Note, Notepad, Section } from './index';
import { format, parse } from 'date-fns';

export type FlatNotepadOptions = {
	lastModified?: Date;
	notepadAssets?: string[];
	sections?: { [internalRef: string]: FlatSection };
	notes?: { [internalRef: string]: Note };
};

export type FlatSection = {
	title: string;
	internalRef: string;
	parentRef?: string;
};

/**
 * A FlatNotepad is similar to the {@link Notepad} class, but it stores all the notes/sections
 * as in flat structures. FlatNotepads will likely be better for internal use in many situations.
 *
 * Something to remember is that all operations on this class like addSection, will return a <strong>new</strong>
 * object of this class, and not modify the existing one.
 */
export default class FlatNotepad {
	public readonly lastModified: string;
	public readonly sections: { [internalRef: string]: FlatSection };
	public readonly notes: { [internalRef: string]: Note };
	public readonly notepadAssets: string[];

	constructor(
		public readonly title: string,
		opts: FlatNotepadOptions = {}
	) {
		this.lastModified = format(opts.lastModified || new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
		this.sections = opts.sections || {};
		this.notes = opts.notes || {};
		this.notepadAssets = opts.notepadAssets || [];
	}

	static makeFlatSection(title: string, parentRef?: string): FlatSection {
		const tmpSection = new Section(title);
		return { title: tmpSection.title, internalRef: tmpSection.internalRef, parentRef };
	}

	public addSection(section: FlatSection): FlatNotepad {
		return this.clone({
			sections: {
				...this.sections,
				[section.internalRef]: section
			}
		});
	}

	public addNote(note: Note): FlatNotepad {
		// Ensure our parent is just a string for the section's internalRef, not the whole Parent object
		if (typeof note.parent !== 'string') {
			note = note.clone({
				parent: (note.parent as Section).internalRef
			});
		}

		return this.clone({
			notes: {
				...this.notes,
				[note.internalRef]: note
			}
		});
	}

	public addAsset(uuid: string): FlatNotepad {
		return this.clone({
			notepadAssets: [
				...this.notepadAssets,
				uuid
			]
		});
	}

	public modified(lastModified: Date = new Date()): FlatNotepad {
		return this.clone({
			lastModified
		});
	}

	/**
	 * @param {string} query Can either be a title-search or a hashtag-search
	 * @returns {Note[]}
	 */
	public search(query: string): Note[] {
		return Object.values(this.notes).filter(n => n.search(query).length > 0);
	}

	/**
	 * This will convert everything into the formal {@link Notepad} structure, however no {@link Asset}s will
	 * be restored. The client should rebuild the assets after this using the values in {@link notepadAssets}
	 * @returns {Notepad}
	 */
	public toNotepad(): Notepad {
		const buildSection = (flat: FlatSection): Section => {
			let section = new Section(flat.title, [], [], flat.internalRef);

			// Restore sub-sections
			Object.values(this.sections)
				.filter(s => s.parentRef === flat.internalRef)
				.map(s => section = section.addSection(buildSection(s)));

			// Restore notes
			Object.values(this.notes)
				.filter(n => n.parent === flat.internalRef)
				.map(n => section = section.addNote(n));

			return section;
		};

		let notepad = new Notepad(this.title, {
			lastModified: parse(this.lastModified),
			notepadAssets: this.notepadAssets
		});

		// Add all the sections + notes
		Object.values(this.sections)
			.filter(s => !s.parentRef)
			.forEach(s => notepad = notepad.addSection(buildSection(s)));

		return notepad;
	}

	public clone(opts: Partial<FlatNotepadOptions> = {}, title: string = this.title): FlatNotepad {
		return new FlatNotepad(title, {
			lastModified: parse(this.lastModified),
			sections: this.sections,
			notes: this.notes,
			notepadAssets: this.notepadAssets,
			...opts
		});
	}

	public pathFrom(obj: Note | FlatSection): (FlatSection | FlatNotepad)[] {
		const parents: FlatSection[] = [];

		if (obj.constructor.name === 'Note') {
			obj = this.sections[(obj as Note).parent as string];
		} else {
			const parent = (obj as FlatSection).parentRef;
			if (!parent) return [this];

			obj = this.sections[(obj as FlatSection).parentRef!];
		}


		let tmp: FlatSection = obj;
		while (true) {
			parents.unshift(tmp);

			if (!tmp.parentRef) return [ this, ...parents ];
			tmp = this.sections[tmp.parentRef];
		}
	}
}
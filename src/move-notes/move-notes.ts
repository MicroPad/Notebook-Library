import FlatNotepad from '../FlatNotepad';

export type RestructuredNotepads = {
	source: FlatNotepad,
	destination: FlatNotepad
};

// All notes get moved into a section called "Moved Notes"
const MOVED_NOTES_SECTION_TITLE = 'Moved Notes';

/**
 * Move a note between notebooks.
 *
 * @param internalRef The reference for the note that is being moved
 * @param source The source notebook
 * @param destination The destination notebook
 */
export function moveNote(internalRef: string, source: FlatNotepad, destination: FlatNotepad): RestructuredNotepads {
	let destSection = Object.values(destination.sections).find(section => section.title === MOVED_NOTES_SECTION_TITLE);
	if (!destSection) {
		destSection = FlatNotepad.makeFlatSection(MOVED_NOTES_SECTION_TITLE);
		destination = destination.addSection(destSection);
	}

	source = source.clone({ lastModified: new Date() });
	destination = destination.clone({ lastModified: new Date() });

	return moveNoteHelper(internalRef, source, destination, destSection.internalRef);
}

/**
 * Move a section between notebooks.
 *
 * @param internalRef The reference for the section that is being moved
 * @param source The source notebook
 * @param destination The destination notebook
 */
export function moveSection(internalRef: string, source: FlatNotepad, destination: FlatNotepad): RestructuredNotepads {
	let destSection = Object.values(destination.sections).find(section => section.title === MOVED_NOTES_SECTION_TITLE);
	if (!destSection) {
		destSection = FlatNotepad.makeFlatSection(MOVED_NOTES_SECTION_TITLE);
		destination = destination.addSection(destSection);
	}

	source = source.clone({ lastModified: new Date() });
	destination = destination.clone({ lastModified: new Date() });

	return moveSectionHelper(internalRef, source, destination, destSection.internalRef);
}

function moveNoteHelper(internalRef: string, source: FlatNotepad, destination: FlatNotepad, destSectionRef: string): RestructuredNotepads {
	/* Moving a note is basically a two-step process
	 * 1. Copy over the note
	 * 2. Copy over the changed asset refs
	 *
	 * Note: this relies on FlatNotepad behaviour to avoid actually transferring any asset blobs.
	 */

	// Get the note
	const note = source.notes[internalRef];
	if (!note) {
		throw new Error('Error moving note: The note does not exist in the source notebook.');
	}

	// Move the note
	const sourceNotes = { ...source.notes };
	delete sourceNotes[internalRef];
	source = source.clone({ notes: sourceNotes });

	destination = destination.addNote(note.clone({
		parent: destSectionRef
	}));

	// Get the used asset refs
	const usedRefs: Set<string> = note.elements
		.map(element => element.args)
		.map(args => args.ext)
		.filter((assetRef): assetRef is string => !!assetRef)
		.reduce((acc, assetRef) => acc.add(assetRef), new Set<string>());

	// Move the asset refs
	source = source.clone({
		notepadAssets: source.notepadAssets.filter(assetRef => !usedRefs.has(assetRef))
	});
	destination = destination.clone({
		notepadAssets: [...destination.notepadAssets, ...usedRefs]
	});

	return { source, destination };
}

function moveSectionHelper(internalRef: string, source: FlatNotepad, destination: FlatNotepad, destSectionRef: string): RestructuredNotepads {
	// First, move this section
	destination = destination.addSection({
		...source.sections[internalRef],
		parentRef: destSectionRef
	});

	const sourceSections = { ...source.sections };
	delete sourceSections[internalRef];
	source = source.clone({ sections: sourceSections });

	// Move all the notes in this section
	Object.values(source.notes)
		.filter(note => note.parent === internalRef)
		.forEach(note => {
			const res = moveNoteHelper(note.internalRef, source, destination, internalRef);
			source = res.source;
			destination = res.destination;
		});

	// Move all the subsections in this section
	Object.values(source.sections)
		.filter(section => section.parentRef === internalRef)
		.forEach(section => {
			const res = moveSectionHelper(section.internalRef, source, destination, internalRef);
			source = res.source;
			destination = res.destination;
		});

	return { source, destination };
}

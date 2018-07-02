import { Note, Notepad } from './index';
export declare type FlatNotepadOptions = {
    lastModified?: Date;
    notepadAssets?: string[];
    sections?: {
        [internalRef: string]: FlatSection;
    };
    notes?: {
        [internalRef: string]: Note;
    };
};
export declare type FlatSection = {
    title: string;
    internalRef: string;
    parentRef?: string;
};
export default class FlatNotepad {
    readonly title: string;
    readonly lastModified: string;
    readonly sections: {
        [internalRef: string]: FlatSection;
    };
    readonly notes: {
        [internalRef: string]: Note;
    };
    readonly notepadAssets: string[];
    constructor(title: string, opts?: FlatNotepadOptions);
    addSection(section: FlatSection): FlatNotepad;
    addNote(note: Note): FlatNotepad;
    addAsset(uuid: string): FlatNotepad;
    modified(lastModified?: Date): FlatNotepad;
    search(query: string): Note[];
    toNotepad(): Notepad;
    clone(opts?: Partial<FlatNotepadOptions>, title?: string): FlatNotepad;
}

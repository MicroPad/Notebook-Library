import { Parent } from './interfaces';
import { Note } from './index';
import { NPXObject } from './NPXObject';
export default class Section extends NPXObject implements Parent {
    readonly title: string;
    readonly sections: Section[];
    readonly notes: Note[];
    constructor(title: string, sections?: Section[], notes?: Note[], internalRef?: string);
    addSection(section: Section): Section;
    addNote(note: Note): Section;
    toXmlObject(): any;
    clone(opts?: Partial<Section>): Section;
}

import { Parent } from './interfaces';
import { Asset, Note } from './index';
import { NPXObject } from './NPXObject';
import { MarkdownNote } from './Note';
export default class Section extends NPXObject implements Parent {
    readonly title: string;
    readonly sections: Section[];
    readonly notes: Note[];
    constructor(title: string, sections?: Section[], notes?: Note[], internalRef?: string);
    addSection(section: Section): Section;
    addNote(note: Note): Section;
    search(query: string): Note[];
    toXmlObject(): any;
    toMarkdown(assets: Asset[]): Promise<MarkdownNote[]>;
    clone(opts?: Partial<Section>): Section;
}

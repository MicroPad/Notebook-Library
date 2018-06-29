import { Asset, Parent, Section } from './';
export declare type NotepadOptions = {
    lastModified?: Date;
    sections?: Section[];
    notepadAssets?: string[];
    assets?: Asset[];
};
export default class Notepad implements Parent {
    readonly title: string;
    readonly lastModified: string;
    private readonly sections;
    private readonly notepadAssets;
    private readonly assets;
    constructor(title: string, opts?: NotepadOptions);
    addSection(section: Section): Notepad;
    toJson(): string;
    toXml(): string;
    private clone;
}

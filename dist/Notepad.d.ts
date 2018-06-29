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
    readonly sections: Section[];
    readonly notepadAssets: string[];
    readonly assets: Asset[];
    constructor(title: string, opts?: NotepadOptions);
    addSection(section: Section): Notepad;
    toJson(): string;
    toXmlObject(): Promise<object>;
    toXml(): string;
    private clone;
}
import { NPXObject } from './NPXObject';
export declare type NoteElement = {
    type: 'markdown' | 'image' | 'drawing' | 'file' | 'recording';
    content: string;
    args: ElementArgs;
};
export declare type ElementArgs = {
    id: string;
    x: string;
    y: string;
    width?: string;
    height?: string;
    fontSize?: string;
    filename?: string;
    ext?: string;
};
export declare type Source = {
    id: number;
    item: string;
    content: string;
};
export default class Note extends NPXObject {
    readonly title: string;
    readonly time: Date;
    readonly elements: NoteElement[];
    readonly bibliography: Source[];
    readonly addons: string[];
    constructor(title: string, time?: Date, elements?: NoteElement[], bibliography?: Source[], addons?: string[], internalRef?: string);
    addElement(element: NoteElement): Note;
    toXmlObject(): any;
    clone(opts?: Partial<Note>): Note;
}

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
    readonly time: number;
    readonly elements: NoteElement[];
    readonly bibliography: Source[];
    constructor(title: string, time?: number, elements?: NoteElement[], bibliography?: Source[], internalRef?: string);
    addElement(element: NoteElement): Note;
    addSource(source: Source): Note;
    search(query: string): Note[];
    toXmlObject(): any;
    clone(opts?: Partial<Note>): Note;
}

import { Parent } from './interfaces';
import { Note } from './index';
import { NPXObject } from './NPXObject';
export default class Section extends NPXObject implements Parent {
    readonly title: string;
    readonly sections: Section[];
    readonly notes: Note[];
    parent: Parent | undefined;
    constructor(title: string, sections?: Section[], notes?: Note[]);
    toXmlObject(): Promise<object>;
}

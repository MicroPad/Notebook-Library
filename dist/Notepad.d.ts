import { Section } from './Section';
export declare class Notepad {
    readonly title: string;
    readonly lastModified: string;
    readonly sections: Section[];
    constructor(title: string, lastModified?: Date);
}

import { Parent } from './interfaces';
export default class Section implements Parent {
    readonly title: string;
    parent: Parent | undefined;
    constructor(title: string);
    toXmlObject(): Promise<object>;
}

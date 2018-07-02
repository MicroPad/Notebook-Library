import { Parent } from './interfaces';
import { Note } from './index';
export declare abstract class NPXObject {
    parent: Parent | string | undefined;
    readonly title: string;
    readonly internalRef: string;
    protected constructor(title: string, internalRef?: string);
    abstract search(query: string): Note[];
    abstract toXmlObject(): any;
    protected generateGuid(): string;
    protected clean(str: string): string;
}

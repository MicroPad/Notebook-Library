import { Parent } from './interfaces';
export declare abstract class NPXObject {
    parent: Parent | string | undefined;
    readonly title: string;
    readonly internalRef: string;
    protected constructor(title: string, internalRef?: string);
    abstract toXmlObject(): any;
    protected generateGuid(): string;
    protected clean(str: string): string;
}

export declare abstract class NPXObject {
    readonly title: string;
    readonly internalRef: string;
    protected constructor(title: string);
    protected generateGuid(): string;
}

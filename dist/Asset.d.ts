export default class Asset {
    data: Blob;
    readonly uuid: string;
    constructor(data: Blob, uuid?: string);
    toString(): Promise<string>;
    toXmlObject(): Promise<any>;
    private generateGuid;
}

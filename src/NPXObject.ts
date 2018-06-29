import { Parent } from './interfaces';

export abstract class NPXObject {
	public parent: Parent | string | undefined;
	public readonly title: string;
	public readonly internalRef: string;

	protected constructor(
		title: string,
		internalRef?: string
	) {
		this.title = this.clean(title);
		this.internalRef = internalRef || this.generateGuid();
	}

	public abstract toXmlObject(): any;

	protected generateGuid(): string {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	protected clean(str: string) {
		return str.replace(/<[^>]*>/, "");
	}
}

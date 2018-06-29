import { Parent } from './interfaces';

export default class Section implements Parent {
	public parent: Parent | undefined;

	constructor(
		public readonly title: string
	) {}

	public async toXmlObject(): Promise<object> {
		return {};
	}
}
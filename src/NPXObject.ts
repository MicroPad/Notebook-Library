export abstract class NPXObject {
	public readonly internalRef: string;

	protected constructor(
		public readonly title: string
	) {
		this.internalRef = this.generateGuid();
	}

	protected generateGuid(): string {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}
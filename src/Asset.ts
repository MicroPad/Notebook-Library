import { FileReaderEventTarget } from "./interfaces";
import Note from './Note';

export default class Asset {
	public static getAssets(notes: Note[]): string[] {
		return Object.values(notes)
			.flatMap(n => n.elements)
			.map(es => es.args.ext)
			.filter((assetId): assetId is string => !!assetId);
	}

	public readonly uuid: string;

	constructor(
		public data: Blob,
		uuid?: string
	) {
		this.uuid = uuid || this.generateGuid();
	}

	/**
	 * @returns {Promise<string>} The Asset's content in Base64
	 */
	public toString(): Promise<string> {
		return new Promise<string>(resolve => {
			try {
				const reader = new FileReader();
				reader.onload = event => resolve((event.target as FileReaderEventTarget).result);
				reader.readAsDataURL(this.data);
			} catch (e) {
				resolve('');
			}
		});
	}

	/**
	 * @returns {Promise<any>} A version of the Asset that the XML generator can parse
	 */
	public async toXmlObject(): Promise<any> {
		const b64 = await this.toString();

		return {
			$: {
				uuid: this.uuid
			},
			_: b64
		};
	}

	private generateGuid(): string {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}

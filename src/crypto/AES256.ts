import { EncryptionMethodImpl } from './index';
import { NotepadShell } from '../interfaces';
import Notepad from '../Notepad';
import scrypt from 'scrypt-js';
import buffer from 'scrypt-js/thirdparty/buffer';
import * as AES from 'aes-js';
import { Translators } from '../Translators';
import stringify from 'json-stringify-safe';


export class AES256 implements EncryptionMethodImpl {
	async decrypt(notepad: NotepadShell, passkey: string): Promise<Notepad> {
		const cipherText = notepad.sections as string;
		const key = await this.keyGenerator(passkey);
		const controller = new AES.ModeOfOperation.ctr(key);

		const plainText = AES.utils.utf8.fromBytes(controller.decrypt(AES.utils.hex.toBytes(cipherText)));
		notepad = { ...notepad, sections: JSON.parse(plainText) };

		return Translators.Json.toNotepadFromNotepad(notepad);
	}

	async encrypt(notepad: Notepad, passkey: string): Promise<NotepadShell> {
		const plainText = stringify(notepad.sections);
		const key = await this.keyGenerator(passkey);
		const controller = new AES.ModeOfOperation.ctr(key);

		const cipherText = AES.utils.hex.fromBytes(controller.encrypt(AES.utils.utf8.toBytes(plainText)));
		return { ...notepad, sections: cipherText };
	}

	private keyGenerator(passkey: string): Promise<ReadonlyArray<number>> {
		return new Promise<ReadonlyArray<number>>((resolve, reject) => {
			passkey = passkey.normalize('NFKC');
			const passkeyBuff = new buffer.SlowBuffer(passkey);

			scrypt(passkeyBuff, new buffer.SlowBuffer(''), 1024, 8, 1, 32, (err, progress, key) => {
				if (!!err) reject(err);
				if (!!key) resolve(key);
			});
		});
	}
}
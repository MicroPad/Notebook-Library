import { EncryptionMethodImpl } from './index';
import { NotepadShell } from '../interfaces';
import Notepad from '../Notepad';
import { scrypt } from 'crypto';
import * as AES from 'aes-js';
import { Translators } from '../Translators';


export class AES256 implements EncryptionMethodImpl {
	async decrypt(notepad: NotepadShell, passkey: string): Promise<Notepad> {
		const cipherText = notepad.sections as string;
		const key = await this.keyGenerator(passkey);
		const controller = new AES.ModeOfOperation.cbc(key);

		const plainText = AES.utils.utf8.fromBytes(controller.decrypt(AES.utils.hex.toBytes(cipherText)));
		notepad = { ...notepad, sections: JSON.parse(plainText) };

		return Translators.Json.toNotepadFromNotepad(notepad);
	}

	async encrypt(notepad: Notepad, passkey: string): Promise<NotepadShell> {
		const plainText = notepad.sections;
		const key = await this.keyGenerator(passkey);
		const controller = new AES.ModeOfOperation.cbc(key);

		const cipherText = AES.utils.hex.fromBytes(controller.encrypt(AES.utils.utf8.toBytes(plainText)));
		return { ...notepad, sections: cipherText };
	}

	private keyGenerator(passkey: string): Promise<Uint8Array> {
		return new Promise<Uint8Array>((resolve, reject) => {
			passkey = passkey.normalize('NFKC');
			scrypt(passkey, '', 256, (err, key) => {
				if (!!err) reject(err);
				if (!!key) resolve(key);
			});
		});
	}
}
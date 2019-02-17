import { AES256 } from './AES256';
import { EncryptionMethodImpl } from './crypto';
import { NotepadShell } from './interfaces';
import Notepad from './Notepad';
import { Translators } from './Translators';
import stringify from 'json-stringify-safe';
import * as AES from 'aes-js';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

export class AES256GZ extends AES256 implements EncryptionMethodImpl {
	async decrypt(notepad: NotepadShell, passkey: string): Promise<Notepad> {
		const cipherText = notepad.sections as string;
		const key = await this.keyGenerator(passkey);
		const controller = new AES.ModeOfOperation.ctr(key);

		const plainTextGz = AES.utils.utf8.fromBytes(controller.decrypt(AES.utils.hex.toBytes(cipherText)));
		const plainText = decompressFromUTF16(plainTextGz);

		notepad = { ...notepad, sections: JSON.parse(plainText) };

		return Translators.Json.toNotepadFromNotepad(notepad);
	}

	async encrypt(notepad: Notepad, passkey: string): Promise<NotepadShell> {
		const plainText = stringify(notepad.sections);
		const plainTextGz = compressToUTF16(plainText);

		const key = await this.keyGenerator(passkey);
		const controller = new AES.ModeOfOperation.ctr(key);

		const cipherText = AES.utils.hex.fromBytes(controller.encrypt(AES.utils.utf8.toBytes(plainTextGz)));
		return { ...notepad, sections: cipherText };
	}
}

import { NotepadShell } from './interfaces';
import Notepad from './Notepad';
import { AES256 } from './AES256';
import { AES256GZ } from './AES256GZ';

export type EncryptionMethod = 'AES-256' | 'AES-256-GZ';

export async function decrypt(notepad: NotepadShell, passkey: string): Promise<Notepad> {
	return getMethod(notepad).decrypt(notepad, passkey);
}

export async function encrypt(notepad: Notepad, passkey: string): Promise<NotepadShell> {
	return getMethod(notepad).encrypt(notepad, passkey);
}

function getMethod(notepad: NotepadShell): EncryptionMethodImpl {
	if (!notepad.crypto) throw new Error(`This notepad isn't encrypted.`);

	const method = methods[notepad.crypto];
	if (!method) throw new Error(`No such method: '${notepad.crypto}' exists.`);

	return method;
}

const methods: { [K in EncryptionMethod]: EncryptionMethodImpl } = {
	'AES-256': new AES256(),
	'AES-256-GZ': new AES256GZ()
};

export interface EncryptionMethodImpl {
	encrypt(notepad: Notepad, passkey: string): Promise<NotepadShell>;
	decrypt(notepad: NotepadShell, passkey: string): Promise<Notepad>;
}

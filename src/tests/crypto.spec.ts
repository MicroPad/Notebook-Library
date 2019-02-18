import { decrypt, encrypt, EncryptionMethod } from '../crypto';
import Notepad, { NotepadOptions } from '../Notepad';
import { TestUtils } from './TestUtils';
import { Section } from '../index';

describe('Crypto', () => {
	(<EncryptionMethod[]> [
		'AES-256',
		'AES-256-GZ'
	]).forEach(type => {
		let notepad: Notepad;
		const passkey = 'this is a bad password';

		beforeEach(async () => {
			notepad = new Notepad('test', getOptions());
			notepad = notepad.clone({
				sections: [
					notepad.sections[0].addNote(TestUtils.makeNote('test note'))
				],
				crypto: type
			});
			notepad.sections[0].parent = notepad;
		});

		it(`should encrypt with ${type} and decrypt correctly`, async () => {
			// Arrange
			// Act
			const encrypted = await encrypt(notepad, passkey);
			const decrypted = await decrypt(encrypted, passkey);

			// Assert
			expect(decrypted).toEqual(notepad);
		});

		// it(`should decrypt with ${type}`, async () => {
		// 	// Arrange
		// 	const cipherTexts = {
		// 		'AES-256': 'a4bc7633fe1c3ab0af9b3735656ec452c359d65cc7f372812d49e375e1fd7583bd181b70701bffa44fd747b1b5097f4a41958c54330aa9ca0f186cc626afd8dd352a95f8f1e4945d51ca79447334ea132f482cf3da8ae1e10851bac53bb3842e99ad5039455b6536ba53be619a6cf5ba73681a39da6041682318eef298df5ec824a2be858a6c96d2109e7e7344a19f4e0e0ba37b49f71a25b0fe9b3e588565099d8e400f4d737a822368f3c652d9e67484fb68',
		// 		'AES-256-GZ': '1e6af7a427d92a352b20d2d1e2bb08be34d90d8e4d3dbc6a968d08987608a0087cd3aa99b6d9713ecc178c77258beeb2a0295fddddd0694cf4a6ce60ae4f1c58e5bf4e050a217f91c517b187ec86e395f9bec72957743627add2372aee307bcb186b97bd9ed3b9be4ed16cf853ed033c998396cd59bcde9585c9294f6d709d58a549731575ab0c72804d93c6f6542ea0af8e7f931274d6f8eb3a3ce2e128c48c4765cfeaa0f3816db2903d05f02a59897765b2c45d25d3122cfeb5f3ddc6d6139858ef9bc7'
		// 	};
		//
		// 	const encryptedNotepad = { ...notepad, sections: cipherTexts[type] };
		//
		// 	// Act
		// 	const res = await decrypt(encryptedNotepad, passkey);
		//
		// 	// Assert
		// 	expect(res).toMatchSnapshot();
		// });
	});
});

function getOptions(): NotepadOptions {
	const testSection = new Section('test section');
	(<any> testSection).internalRef = 'abc';

	return {
		lastModified: new Date(1),
		sections: [testSection],

		assets: [],
		notepadAssets: ['test']
	};
}

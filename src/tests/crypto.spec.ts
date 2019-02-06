import { decrypt, encrypt } from '../crypto';
import Notepad, { NotepadOptions } from '../Notepad';
import { NotepadShell } from '../interfaces';
import { TestUtils } from './TestUtils';
import { Section } from '../index';

describe('Crypto', () => {
	let notepad: Notepad;
	let encryptedNotepad: NotepadShell;
	const passkey = 'this is a bad password';

	beforeEach(async () => {
		notepad = new Notepad('test', getOptions());
		notepad = notepad.clone({
			sections: [
				notepad.sections[0].addNote(TestUtils.makeNote('test note'))
			],
			crypto: 'AES-256'
		});

		encryptedNotepad = { ...notepad, sections: 'a4bc7633fe1c3ab0af9b3735656ec452c359d65cc7f372812d49e375e1fd7583bd181b70701bffa44fd747b1b5097f4a41958c54330aa9ca0f186cc626afd8dd352a95f8f1e4945d51ca79447334ea132f482cf3da8ae1e10851bac53bb3842e99ad5039455b6536ba53be619a6cf5ba73681a39da6041682318eef298df5ec824a2be858a6c96d2109e7e7344a19f4e0e0ba37b49f71a25b0fe9b3e588565099d8e400f4d737a822368f3c652d9e67484fb68' };
	});

	describe('encrypt', () => {
		it('AES256', async () => {
			// Arrange
			// Act
			const res = await encrypt(notepad, passkey);

			// Assert
			expect(res).toMatchSnapshot();
		});
	});

	describe('decrypt', () => {
		it('AES256', async () => {
			// Arrange
			// Act
			const res = await decrypt(encryptedNotepad, passkey);

			// Assert
			expect(res).toMatchSnapshot();
		});
	});
});

function getOptions(): NotepadOptions {
	const testSection = new Section('test section');
	(<any> testSection).internalRef = 'abc';

	return {
		lastModified: new Date(1),
		sections: [testSection],

		assets: [TestUtils.makeAsset()],
		notepadAssets: ['test']
	};
}

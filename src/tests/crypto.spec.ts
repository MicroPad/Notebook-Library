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

		encryptedNotepad = { ...notepad, sections: '7eb35fbc575bb93b53ba118ad3378f0167aa0c9c3391fa134e7f174f5049d1f566689747f3523914435a6d71cf049ae8154979940fc15783ba8c4d1d15bd87eb720af9f9aaf294c46c40931c1a4d4166974e8d7ee7dea7aea372f0b4f175362b507a323750de5794331e22c09a2dc4dacbac7705872123708323975301a4b1e583e737211188ee822ef7b2a6d3d759db48b226f93a02f536d2db7d33af3f38af70fcfb2d8e522116dc2f2bfa49eec6fe2b5a7d' };
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

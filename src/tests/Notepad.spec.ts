import { Asset, Notepad, Section } from '../';
import { NotepadOptions } from '../Notepad';
import { TestUtils } from './TestUtils';

describe('Notepad', () => {
	let options = getOptions();

	beforeEach(() => {
		options = getOptions();
	});

	describe('constructor', () => {
		it('should construct with just a title', () => {
			// Arrange
			const title = 'test';

			// Act
			const n = new Notepad(title);

			// Assert
			expect(n).toBeInstanceOf(Notepad);
			expect(n.title).toEqual(title);
		});

		Object.entries(options).forEach(option =>
			it(`should construct with ${option[0]}`, () => {
				// Arrange
				const title = 'test';

				// Act
				const n = new Notepad(title, {
					[option[0]]: option[1]
				});

				// Assert
				expect(n).toBeInstanceOf(Notepad);
				expect(n.title).toEqual(title);
				expect(n[option[0]]).toMatchSnapshot();
			})
		);
	});

	describe('addSection', () => {
		let notepad: Notepad;
		let section: Section;

		beforeEach(() => {
			notepad = new Notepad('test');
			section = new Section('test');
		});

		it('should add a new section', () => {
			//Arrange
			// Act
			const res = notepad.addSection(section);

			// Assert
			expect(res.sections[0]).toEqual(section);
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = notepad.addSection(section);

			// Assert
			expect(res).not.toBe(notepad);
		});
	});

	describe('toJson', () => {
		it('should generate a JSON object of the notepad', () => {
			// Arrange
			const title = 'test';

			// Act
			const n = new Notepad(title, options);

			// Assert
			expect(n.toJson()).toMatchSnapshot();
		});
	});

	describe('toXml', () => {
		it(`should generate the notepad's NPX file`, async () => {
			// Arrange
			let n = new Notepad('test', options);
			n = n.clone({
				sections: [
					n.sections[0].addNote(TestUtils.makeNote('test note'))
				]
			});

			// Act
			const res = await n.toXml();

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
		// Ignore the error here, Jest will manage this
		assets: [new Asset(new Blob(['test'], { type: 'audio/ogg' }), 'abc')],
		notepadAssets: ['test']
	};
}

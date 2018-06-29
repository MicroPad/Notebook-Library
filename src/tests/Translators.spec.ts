import { Notepad, Section, Translators } from '../index';

describe('Translators', () => {
	describe('Json', () => {
		describe('toNotepad', () => {
			it('should return a notepad object from JSON', () => {
				// Arrange
				let expected: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test']
				});
				expected = expected.addSection(new Section('test'));

				const json = expected.toJson();

				// Act
				const res = Translators.Json.toNotepad(json);

				// Assert
				expect(res).toEqual(expected);
			});
		});
	});
});
import { Notepad, Translators } from '../index';
import { TestUtils } from './TestUtils';

describe('Translators', () => {
	describe('Json', () => {
		describe('toNotepad', () => {
			it('should return a notepad object from JSON', () => {
				// Arrange
				let expected: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test']
				});

				let section = TestUtils.makeSection('test');
				section = section.addSection(TestUtils.makeSection('sub'));
				section = section.addNote(TestUtils.makeNote('hello'));
				expected = expected.addSection(section);

				const json = expected.toJson();

				// Act
				const res = Translators.Json.toNotepad(json);

				// Assert
				expect(res).toEqual(expected);
			});
		});
	});
});
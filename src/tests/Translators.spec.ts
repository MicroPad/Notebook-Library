import { Notepad, Translators } from '../index';
import { TestUtils } from './TestUtils';
import * as fs from 'fs';
import * as path from 'path';

describe('Translators', () => {
	describe('Json', () => {
		describe('toNotepad', () => {
			it('should return a Notepad object from JSON', () => {
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

		describe('toFlatNotepad', () => {
			it('should return a FlatNotepad object from JSON', () => {
				// Arrange
				let testNotepad: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test']
				});

				let section = TestUtils.makeSection('test');
				section = section.addSection(TestUtils.makeSection('sub'));
				section = section.addNote(TestUtils.makeNote('hello'));
				testNotepad = testNotepad.addSection(section);

				const expected = testNotepad.flatten();
				const json = testNotepad.toJson();

				// Act
				const res = Translators.Json.toFlatNotepad(json);

				// Assert
				expect(res).toEqual(expected);
			});
		});
	});

	describe('Xml', () => {
		describe('toNotepadFromNpx', () => {
			const helpNpx = fs.readFileSync(path.join(__dirname, 'Help.npx')).toString();
			const brokenNpx = fs.readFileSync(path.join(__dirname, 'Broken.npx')).toString();

			it('should be identical to the source data', async () => {
				// Arrange
				// Act
				const parsed = await Translators.Xml.toNotepadFromNpx(helpNpx);
				const res = await parsed.toXml();

				// Assert
				expect('﻿' + res).toEqual(helpNpx);
			});

			it('should still parse correctly even with invalid assets', async () => {
				// Arrange
				console.warn = jest.fn(() => { return; });

				// Act
				const parsed = await Translators.Xml.toNotepadFromNpx(brokenNpx);

				// Assert
				expect(parsed.notepadAssets).toHaveLength(0);
			});
		});
	});
});
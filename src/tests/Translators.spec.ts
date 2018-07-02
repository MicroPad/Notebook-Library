import { Notepad, Translators } from '../index';
import { TestUtils } from './TestUtils';
import * as fs from 'fs';
import * as path from 'path';
import Asset from '../Asset';

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
				const res = Translators.Json.toNotepadFromNotepad(json);

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
				const res = Translators.Json.toFlatNotepadFromNotepad(json);

				// Assert
				expect(res).toEqual(expected);
			});
		});

		describe('toMarkdownFromJupyter', () => {
			const notebook = fs.readFileSync(path.join(__dirname, '__data__', 'notebook.ipynb')).toString();

			it('should convert to the correct markdown', () => {
				// Arrange
				// Act
				const res = Translators.Json.toMarkdownFromJupyter(notebook);

				// Assert
				expect(res).toMatchSnapshot();
			});
		});
	});

	describe('Xml', () => {
		describe('toNotepadFromNpx', () => {
			const helpNpx = fs.readFileSync(path.join(__dirname, '__data__', 'Help.npx')).toString();
			const brokenNpx = fs.readFileSync(path.join(__dirname, '__data__', 'Broken.npx')).toString();

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

		describe('toNotepadFromEnex', () => {
			const sampleEnex = fs.readFileSync(path.join(__dirname, '__data__', 'sample-enex.enex')).toString();

			it('should convert the notepad correctly', async () => {
				// Arrange
				(Asset as any).prototype.generateGuid = jest.fn(() => 'abc');

				// Act
				const res = await Translators.Xml.toNotepadFromEnex(sampleEnex);

				// Assert
				expect(await (res.clone({ lastModified: new Date(1) })).toXml()).toMatchSnapshot();
			})
		});
	});
});
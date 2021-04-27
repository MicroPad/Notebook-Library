import { Notepad, Translators } from '../index';
import { TestUtils } from './TestUtils';
import * as fs from 'fs';
import * as path from 'path';
import Asset from '../Asset';
import MarkdownImport = Translators.Markdown.MarkdownImport;

describe('Translators', () => {
	describe('Json', () => {
		describe('toNotepad', () => {
			it('should return a Notepad object from JSON', async () => {
				// Arrange
				let expected: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test']
				});

				let section = TestUtils.makeSection('test');
				section = section.addSection(TestUtils.makeSection('sub'));
				section = section.addNote(TestUtils.makeNote('hello'));
				expected = expected.addSection(section);

				const json = await expected.toJson();

				// Act
				const res = await Translators.Json.toNotepadFromNotepad(json);

				// Assert
				expect(res).toEqual(expected);
			});

			it('should return a Notepad object from a plain object', async () => {
				// Arrange
				let expected: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test'],
					crypto: 'AES-256'
				});

				let section = TestUtils.makeSection('test');
				section = section.addSection(TestUtils.makeSection('sub'));
				section = section.addNote(TestUtils.makeNote('hello'));
				expected = expected.addSection(section);

				const obj = { ...expected };

				// Act
				const res = await Translators.Json.toNotepadFromNotepad(obj);

				// Assert
				expect(res).toEqual(expected);
			});
		});

		describe('toFlatNotepad', () => {
			it('should return a FlatNotepad object from JSON', async () => {
				// Arrange
				let testNotepad: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test']
				});

				let section = TestUtils.makeSection('test', [], [], '1');
				section = section.addSection(TestUtils.makeSection('sub', [], [], '2'));
				section = section.addNote(TestUtils.makeNote('hello', new Date(1), '3'));
				testNotepad = testNotepad.addSection(section);

				const expected = testNotepad.flatten();
				const json = await testNotepad.toJson();

				// Act
				const res = await Translators.Json.toFlatNotepadFromNotepad(json);

				// Assert
				expect(res).toEqual(expected);
				expect(res.toNotepad()).toEqual(testNotepad);
			});

			it('should return a FlatNotepad object from a plain object', async () => {
				// Arrange
				let testNotepad: Notepad = new Notepad('test', {
					lastModified: new Date(1),
					notepadAssets: ['test']
				});

				let section = TestUtils.makeSection('test', [], [], '1');
				section = section.addSection(TestUtils.makeSection('sub', [], [], '2'));
				section = section.addNote(TestUtils.makeNote('hello', new Date(1), '3'));
				testNotepad = testNotepad.addSection(section);

				const expected = testNotepad.flatten();
				const obj = { ...testNotepad };

				// Act
				const res = await Translators.Json.toFlatNotepadFromNotepad(obj);

				// Assert
				expect(res).toEqual(expected);
				expect(res.toNotepad()).toEqual(testNotepad);
			});

			it('should have identical results to going via a Notepad object', async () => {
				// Arrange
				const npx = fs.readFileSync(path.join(__dirname, '__data__', 'Broken.npx')).toString();
				console.warn = jest.fn(() => { return; });

				// Act
				const notepad = await Translators.Xml.toNotepadFromNpx(npx);
				const flat = notepad.flatten();
				const flatViaJson = await Translators.Json.toFlatNotepadFromNotepad(await notepad.toJson());

				// Assert
				expect(flat.toNotepad()).toEqual(notepad);
				expect(flatViaJson.toNotepad()).toEqual(notepad);
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
			const exampleNpx = fs.readFileSync(path.join(__dirname, '__data__', 'Example Notepad.npx')).toString();

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

			it('should convert inline assets (v1) to use the v2 asset system', async () => {
				// Arrange
				// Act
				const parsed = await Translators.Xml.toNotepadFromNpx(exampleNpx);

				// Assert
				expect(parsed.notepadAssets).toHaveLength(3);
			});

			it('should never allow for element content to be undefined', async () => {
				// Arrange
				const emptyContent = fs.readFileSync(path.join(__dirname, '__data__', 'EmptyContent.npx')).toString();

				// Act
				const notepad = await Translators.Xml.toNotepadFromNpx(emptyContent);

				// Assert
				expect(notepad.sections[0].notes[0].elements[0].content).toEqual('');
			});
		});

		describe('toNotepadFromEnex', () => {
			const sampleEnex = fs.readFileSync(path.join(__dirname, '__data__', 'sample-enex.enex')).toString();

			it('should convert the notepad correctly', async () => {
				// Arrange
				let guidCounter = 0;
				(Asset as any).prototype.generateGuid = jest.fn(() => 'abc' + ++guidCounter);

				// Act
				const res = await Translators.Xml.toNotepadFromEnex(sampleEnex);

				// Assert
				expect(await (res.clone({ lastModified: new Date(1) })).toXml()).toMatchSnapshot();
			})
		});
	});

	describe('Markdown', () => {
		it('should convert the notepad correctly', async () => {
			// Arrange
			const md: MarkdownImport[] = [
				{
					title: 'Test Import',
					content: '# This is some md\n\n**yeet**'
				},
				{
					title: 'Test Duplicate',
					content: 'yeet'
				},
				{
					title: 'Test Duplicate',
					content: 'yeet'
				}
			];

			// Act
			const res = Translators.Markdown.toNotepadFromMarkdown(md);
			res.sections[0].notes.forEach(note => (<any>note).time = 1);

			let t = await res.clone({ lastModified: new Date(1) }, 'Import Test').toXml();

			// Assert
			expect(await res.clone({ lastModified: new Date(1) }, 'Import Test').toXml()).toMatchSnapshot();
		});
	});
});

import { Note, Section } from '../index';
import { TestUtils } from './TestUtils';

describe('Section', () => {
	it('should construct', () => {
		// Arrange
		const title = 'test';

		// Act
		const res = TestUtils.makeSection(title);

		// Assert
		expect(res).toBeInstanceOf(Section);
		expect(res.title).toEqual(title);
	});

	describe('addSection', () => {
		let parent: Section;
		let child: Section;

		beforeEach(() => {
			parent = TestUtils.makeSection('test parent');
			child = TestUtils.makeSection('test child');
		});

		it('should add a new section', () => {
			//Arrange
			// Act
			const res = parent.addSection(child);

			// Assert
			expect(res.sections[0]).toEqual(child.clone({ parent: res }));
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = parent.addSection(child);

			// Assert
			expect(res).not.toBe(parent);
		});
	});

	describe('addNote', () => {
		let parent: Section;
		let child: Note;

		beforeEach(() => {
			parent = TestUtils.makeSection('test parent');
			child = TestUtils.makeNote('test child');
		});

		it('should add a new note', () => {
			//Arrange
			// Act
			const res = parent.addNote(child);

			// Assert
			expect(res.notes[0]).toEqual(child.clone({ parent: res }));
		});

		it('should create a new object', () => {
			//Arrange
			// Act
			const res = parent.addNote(child);

			// Assert
			expect(res).not.toBe(parent);
		});
	});

	describe('search', () => {
		it('should call search on all notes', () => {
			// Arrange
			let section = TestUtils.makeSection('test');
			section = section.addNote(TestUtils.makeNote('hi'));

			let subSection = TestUtils.makeSection('sub');
			subSection = subSection.addNote(TestUtils.makeNote('hello'));
			section = section.addSection(subSection);

			Note.prototype.search = jest.fn(() => [TestUtils.makeNote('hi')]);

			// Act
			section.search('h');

			// Assert
			expect(Note.prototype.search).toHaveBeenCalledWith('h');
			expect(Note.prototype.search).toHaveBeenCalledTimes(2);
		});
	});


	it('should generate XML Object with required data', () => {
		// Arrange
		let section = TestUtils.makeSection('test parent');
		let child = TestUtils.makeSection('test child');
		child = child.addNote(TestUtils.makeNote('test note'));

		section = section.addSection(child);

		// Act
		const res = section.toXmlObject();

		// Assert
		expect(res).toMatchSnapshot();
	});
});

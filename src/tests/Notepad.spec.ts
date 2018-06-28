import { Notepad } from '../Notepad';

describe('Notepad', () => {
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

		it('should construct with a provided date', () => {
			// Arrange
			const title = 'test';
			const date = new Date(1);

			// Act
			const n = new Notepad(title, date);

			// Assert
			expect(n).toBeInstanceOf(Notepad);
			expect(n.title).toEqual(title);
			expect(n.lastModified).toMatchSnapshot();
		});
	});

	describe('toJson', () => {
		it('should generate a JSON object of the notepad', () => {
			// Arrange
			const title = 'test';
			const date = new Date(1);

			// Act
			const n = new Notepad(title, date);

			// Assert
			expect(n.toJson()).toMatchSnapshot();
		});
	});
});

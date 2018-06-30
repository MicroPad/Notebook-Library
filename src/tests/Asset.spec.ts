import { TestUtils } from './TestUtils';
import { Asset } from '../index';

describe('Asset', () => {
	it('should construct', () => {
		// Arrange
		// Act
		const res = TestUtils.makeAsset();

		// Assert
		expect(res).toBeInstanceOf(Asset);
	});
});

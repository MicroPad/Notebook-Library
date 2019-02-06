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

	describe('toString', () => {
		it('should generate base64 from the asset', async () => {
			// Arrange
			const asset = TestUtils.makeAsset();

			// Act
			const res = await asset.toString();

			// Assert
			expect(res).toMatchSnapshot();
		});

		it('should return an empty string on invalid data', async () => {
			// Arrange
			const asset = new Asset(null as any, 'abc');

			// Act
			const res = await asset.toString();

			// Assert
			expect(res).toEqual('');
		});
	});

	it('should generate XML Object with required data', async () => {
		// Arrange
		const asset = TestUtils.makeAsset();

		// Act
		const res = await asset.toXmlObject();

		// Assert
		expect(res).toMatchSnapshot();
	});
});

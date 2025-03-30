const { convertFile } = require('../src/index');

describe('Markdown to PNG Converter', () => {
	test('should convert markdown to png', async () => {
		const inputPath = './examples/test.md';
		const outputPath = './examples/test.png';

		await expect(convertFile(inputPath, outputPath)).resolves.toBe(outputPath);
	}, 30000); // 增加超时时间到 30 秒
});
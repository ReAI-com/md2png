import { convert, convertFile } from '../src/index';
import { promises as fs } from 'fs';
import path from 'path';

describe('Markdown to PNG Converter', () => {
	const testDir = path.join(__dirname, '../examples');
	const testFile = path.join(testDir, 'test.md');
	const outputFile = path.join(testDir, 'test.png');

	beforeAll(async () => {
		// 确保测试目录存在
		await fs.mkdir(testDir, { recursive: true });
	});

	afterAll(async () => {
		// 清理测试文件
		try {
			await fs.unlink(outputFile);
		} catch (error) {
			// 忽略文件不存在的错误
		}
	});

	test('should convert markdown string to PNG buffer', async () => {
		const markdown = '# Hello World\n\nThis is a test.';
		const result = await convert(markdown, {
			width: 800,
			quality: 90
		});

		expect(result).toBeInstanceOf(Buffer);
		expect(result.length).toBeGreaterThan(0);
	});

	test('should convert markdown file to PNG file', async () => {
		// 创建测试用的 Markdown 文件
		await fs.writeFile(testFile, '# Hello World\n\nThis is a test file.');

		const result = await convertFile(testFile, outputFile, {
			width: 800,
			quality: 90
		});

		expect(result).toBe(outputFile);

		// 验证输出文件存在
		const stats = await fs.stat(outputFile);
		expect(stats.isFile()).toBe(true);
		expect(stats.size).toBeGreaterThan(0);
	});
});
import { parse } from './services/markdown-parser';
import { readFile, writeFile } from './utils/file-utils';
import { RendererFactory } from './renderers/renderer.factory';
import { RendererOptions } from './renderers/renderer.interface';

export interface ConvertOptions extends RendererOptions {
	// 保持原有接口兼容性
}

/**
 * 将 Markdown 字符串转换为 PNG
 * @param markdown - 要转换的 Markdown 内容
 * @param options - 转换选项
 * @returns Promise<string|Buffer> - PNG 作为 base64 字符串或 buffer
 */
export async function convert(markdown: string, options: ConvertOptions = {}): Promise<string | Buffer> {
	try {
		// 解析 Markdown 为 HTML
		const html = parse(markdown, options);

		// 创建合适的渲染器
		const renderer = RendererFactory.createRenderer(options);

		// 渲染 HTML 为 PNG
		const result = await renderer.render(html, options);

		return result;
	} catch (error) {
		console.error('转换 Markdown 为 PNG 时出错:', error);
		throw error;
	}
}

/**
 * 将 Markdown 文件转换为 PNG 文件
 * @param inputPath - Markdown 文件路径
 * @param outputPath - 保存 PNG 文件的路径
 * @param options - 转换选项
 * @returns Promise<string> - 生成的 PNG 文件路径
 */
export async function convertFile(inputPath: string, outputPath: string, options: ConvertOptions = {}): Promise<string> {
	try {
		// 读取 Markdown 文件
		const markdown = await readFile(inputPath);

		// 转换为 PNG
		const result = await convert(markdown, {
			...options,
			outputFormat: 'buffer'
		});

		// 写入 PNG 文件
		await writeFile(outputPath, result as Buffer);

		return outputPath;
	} catch (error) {
		console.error(`转换文件 ${inputPath} 为 PNG 时出错:`, error);
		throw error;
	}
}

/**
 * 检查浏览器依赖
 * 如果系统中没有可用的浏览器，将显示安装指南
 */
export { isBrowserAvailable, getBrowserInstallationGuide } from './utils/browser-utils';
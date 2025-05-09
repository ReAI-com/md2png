import nodeHtmlToImage from 'node-html-to-image';
import { isBrowserAvailable, getBrowserInstallationGuide } from '../utils/browser-utils';

export interface RenderOptions {
	width?: number;
	quality?: number;
	transparent?: boolean;
	outputFormat?: 'buffer' | 'base64';
	cssStyles?: string;
	checkBrowser?: boolean;
}

/**
 * 渲染 HTML 到 PNG
 * @param html - 要渲染的 HTML 内容
 * @param options - 渲染选项
 * @returns Promise<Buffer|string> - PNG 作为 buffer 或 base64 字符串
 */
export async function render(html: string, options: RenderOptions = {}): Promise<Buffer | string> {
	try {
		// 检查浏览器依赖
		if (options.checkBrowser !== false) {
			if (!isBrowserAvailable()) {
				const errorMessage = '未检测到可用的浏览器，Markdown 转 PNG 功能需要浏览器支持。\n' +
				                    getBrowserInstallationGuide();
				throw new Error(errorMessage);
			}
		}

		// 默认选项
		const defaultOptions = {
			outputFormat: 'buffer' as const, // 'buffer' 或 'base64'
			width: options.width || 800,
			quality: options.quality || 90,
			transparent: options.transparent || false,
			puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox']
		};

		// 合并选项
		const renderOptions = { ...defaultOptions, ...options };

		// 创建完整的 HTML 文档
		const fullHtml = `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="UTF-8">
					<style>
						body {
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
							line-height: 1.6;
							color: #333;
							max-width: 100%;
							padding: 20px;
							margin: 0 auto;
							background-color: ${renderOptions.transparent ? 'transparent' : 'white'};
						}
						${options.cssStyles || ''}
					</style>
				</head>
				<body>
					${html}
				</body>
			</html>
		`;

		// 使用 node-html-to-image 渲染
		const image = await nodeHtmlToImage({
			html: fullHtml,
			quality: renderOptions.quality,
			type: 'png',
			transparent: renderOptions.transparent,
			width: renderOptions.width,
			puppeteerArgs: {
				args: renderOptions.puppeteerArgs
			}
		});

		// 根据输出格式返回结果
		if (renderOptions.outputFormat === 'base64') {
			return image.toString('base64');
		} else {
			return image;
		}
	} catch (error) {
		console.error('渲染 HTML 到 PNG 时出错:', error);
		throw error;
	}
}
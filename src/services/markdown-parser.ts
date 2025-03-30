import MarkdownIt from 'markdown-it';

export interface ParseOptions {
	allowHtml?: boolean;
	breaks?: boolean;
	linkify?: boolean;
	typographer?: boolean;
	cssStyles?: string;
	markdownItOptions?: Record<string, any>;
}

/**
 * 解析 Markdown 为 HTML
 * @param markdown - Markdown 内容
 * @param options - 解析选项
 * @returns string - HTML 内容
 */
export function parse(markdown: string, options: ParseOptions = {}): string {
	try {
		// 初始化 markdown-it
		const md = new MarkdownIt({
			html: options.allowHtml || false,
			xhtmlOut: true,
			breaks: options.breaks || false,
			linkify: options.linkify || true,
			typographer: options.typographer || true,
			...options.markdownItOptions
		});

		// 解析 markdown 为 HTML
		const html = md.render(markdown);

		// 包装 HTML 和样式
		return wrapWithStyles(html, options.cssStyles);
	} catch (error) {
		console.error('解析 Markdown 时出错:', error);
		throw error;
	}
}

/**
 * 包装 HTML 内容和样式
 * @param html - HTML 内容
 * @param customStyles - 自定义 CSS 样式
 * @returns string - 带样式的 HTML
 */
function wrapWithStyles(html: string, customStyles: string = ''): string {
	// 默认样式
	const defaultStyles = `
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
			line-height: 1.6;
			color: #333;
			max-width: 100%;
			padding: 20px;
			margin: 0 auto;
			background-color: white;
		}
		h1, h2, h3, h4, h5, h6 {
			margin-top: 24px;
			margin-bottom: 16px;
			font-weight: 600;
			line-height: 1.25;
		}
		h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
		h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
		h3 { font-size: 1.25em; }
		h4 { font-size: 1em; }
		h5 { font-size: 0.875em; }
		h6 { font-size: 0.85em; color: #6a737d; }

		a { color: #0366d6; text-decoration: none; }
		a:hover { text-decoration: underline; }

		pre {
			background-color: #f6f8fa;
			border-radius: 3px;
			padding: 16px;
			overflow: auto;
		}

		code {
			font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
			background-color: rgba(27, 31, 35, 0.05);
			border-radius: 3px;
			padding: 0.2em 0.4em;
			font-size: 85%;
		}

		pre code {
			background-color: transparent;
			padding: 0;
		}

		blockquote {
			margin: 0;
			padding: 0 1em;
			color: #6a737d;
			border-left: 0.25em solid #dfe2e5;
		}

		table {
			border-collapse: collapse;
			width: 100%;
			margin: 16px 0;
		}

		table th, table td {
			padding: 6px 13px;
			border: 1px solid #dfe2e5;
		}

		table th {
			background-color: #f6f8fa;
			font-weight: 600;
		}

		table tr:nth-child(2n) {
			background-color: #f6f8fa;
		}

		img {
			max-width: 100%;
			box-sizing: border-box;
		}

		ul, ol {
			padding-left: 2em;
		}

		li + li {
			margin-top: 0.25em;
		}

		hr {
			height: 0.25em;
			padding: 0;
			margin: 24px 0;
			background-color: #e1e4e8;
			border: 0;
		}
	`;

	// 合并样式
	const styles = customStyles ? `${defaultStyles}\n${customStyles}` : defaultStyles;

	// 返回带样式的 HTML
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>${styles}</style>
			</head>
			<body>
				${html}
			</body>
		</html>
	`;
}
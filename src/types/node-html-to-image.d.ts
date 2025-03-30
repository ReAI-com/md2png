declare module 'node-html-to-image' {
	export interface Options {
		html: string;
		quality?: number;
		type?: 'png' | 'jpeg';
		transparent?: boolean;
		width?: number;
		height?: number;
		puppeteerArgs?: string[];
	}

	export default function nodeHtmlToImage(options: Options): Promise<Buffer>;
}
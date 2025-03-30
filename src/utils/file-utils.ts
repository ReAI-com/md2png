import { promises as fs } from 'fs';

/**
 * 读取文件内容
 * @param filePath - 文件路径
 * @returns Promise<string> - 文件内容
 */
export async function readFile(filePath: string): Promise<string> {
	try {
		const content = await fs.readFile(filePath, 'utf8');
		return content;
	} catch (error) {
		console.error(`读取文件 ${filePath} 时出错:`, error);
		throw error;
	}
}

/**
 * 写入文件内容
 * @param filePath - 文件路径
 * @param content - 文件内容
 * @returns Promise<void>
 */
export async function writeFile(filePath: string, content: Buffer | string): Promise<void> {
	try {
		await fs.writeFile(filePath, content);
	} catch (error) {
		console.error(`写入文件 ${filePath} 时出错:`, error);
		throw error;
	}
}
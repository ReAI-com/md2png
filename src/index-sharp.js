/**
 * Markdown to PNG 转换器 (轻量级版本)
 * 使用 Sharp 和 html-to-image 实现，无需浏览器依赖
 */

const markdownParser = require('./services/markdown-parser');
const sharpRenderer = require('./services/sharp-renderer');
const { readFile, writeFile } = require('./utils/file-utils');

/**
 * 将 Markdown 字符串转换为 PNG
 * @param {string} markdown - 要转换的 Markdown 内容
 * @param {Object} options - 转换选项
 * @returns {Promise<string|Buffer>} - PNG 作为 base64 字符串或 buffer
 */
async function convert(markdown, options = {}) {
  try {
    // 解析 Markdown 为 HTML
    const html = markdownParser.parse(markdown, options);
    
    // 使用 Sharp 渲染 HTML 为 PNG
    const result = await sharpRenderer.render(html, options);
    
    return result;
  } catch (error) {
    console.error('转换 Markdown 为 PNG 时出错:', error);
    throw error;
  }
}

/**
 * 将 Markdown 文件转换为 PNG 文件
 * @param {string} inputPath - Markdown 文件路径
 * @param {string} outputPath - 保存 PNG 文件的路径
 * @param {Object} options - 转换选项
 * @returns {Promise<string>} - 生成的 PNG 文件路径
 */
async function convertFile(inputPath, outputPath, options = {}) {
  try {
    // 读取 Markdown 文件
    const markdown = await readFile(inputPath);
    
    // 转换为 PNG
    const result = await convert(markdown, { 
      ...options, 
      outputFormat: 'buffer' 
    });
    
    // 写入 PNG 文件
    await writeFile(outputPath, result);
    
    return outputPath;
  } catch (error) {
    console.error(`转换文件 ${inputPath} 为 PNG 时出错:`, error);
    throw error;
  }
}

module.exports = {
  convert,
  convertFile
};

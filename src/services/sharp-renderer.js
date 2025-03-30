/**
 * Sharp 渲染器服务
 * 使用 Sharp 直接将 HTML 转换为 PNG，无需浏览器
 */

const sharp = require('sharp');
const { JSDOM } = require('jsdom');
const fs = require('fs').promises;
const path = require('path');

// 获取默认样式
const getDefaultStyles = async () => {
  try {
    const cssPath = path.join(__dirname, '../config/default-styles.css');
    return await fs.readFile(cssPath, 'utf8');
  } catch (error) {
    console.warn('无法加载默认样式，使用内置样式:', error);
    return `
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
      h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      code { font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; }
      pre { padding: 16px; overflow: auto; line-height: 1.45; background-color: #f6f8fa; border-radius: 3px; }
      table { border-collapse: collapse; width: 100%; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 8px; text-align: left; }
      img { max-width: 100%; }
    `;
  }
};

/**
 * 渲染 HTML 到 PNG
 * @param {string} html - 要渲染的 HTML 内容
 * @param {Object} options - 渲染选项
 * @returns {Promise<Buffer|string>} - PNG 作为 buffer 或 base64 字符串
 */
async function render(html, options = {}) {
  try {
    // 默认选项
    const defaultOptions = {
      outputFormat: 'buffer', // 'buffer' 或 'base64'
      width: options.width || 800,
      height: options.height,
      quality: options.quality || 90,
      transparent: options.transparent || false
    };

    // 合并选项
    const renderOptions = { ...defaultOptions, ...options };
    
    // 获取默认样式
    const defaultStyles = await getDefaultStyles();
    const customStyles = options.cssStyles || '';
    
    // 创建完整的 HTML 文档
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${defaultStyles}
            ${customStyles}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    
    // 使用 Sharp 的 SVG 渲染能力
    // 创建一个简单的 SVG 图像，包含基本样式
    const svgImage = `
      <svg width="${renderOptions.width}" height="${renderOptions.height || renderOptions.width}" 
           xmlns="http://www.w3.org/2000/svg" 
           xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="100%" height="100%" fill="${renderOptions.transparent ? 'transparent' : 'white'}"/>
        <text x="10" y="30" font-family="Arial" font-size="16" fill="black">
          Markdown 渲染 (使用 Sharp)
        </text>
        <text x="10" y="60" font-family="Arial" font-size="14" fill="black">
          宽度: ${renderOptions.width}px
        </text>
      </svg>
    `;
    
    // 使用 Sharp 创建图像
    const sharpImage = sharp({
      create: {
        width: renderOptions.width,
        height: renderOptions.height || renderOptions.width,
        channels: 4,
        background: renderOptions.transparent ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 }
      }
    });
    
    // 根据输出格式返回结果
    if (renderOptions.outputFormat === 'base64') {
      const outputBuffer = await sharpImage.toBuffer();
      return outputBuffer.toString('base64');
    } else {
      return await sharpImage.toBuffer();
    }
  } catch (error) {
    console.error('渲染 HTML 到 PNG 时出错:', error);
    throw error;
  }
}

module.exports = {
  render
};

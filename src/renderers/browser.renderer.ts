import nodeHtmlToImage from 'node-html-to-image';
import { isBrowserAvailable, getBrowserInstallationGuide } from '../utils/browser-utils';
import { Renderer, RendererOptions } from './renderer.interface';

/**
 * 浏览器渲染器（使用Puppeteer）
 * 使用浏览器渲染HTML为PNG图像
 */
export class BrowserRenderer implements Renderer {
  /**
   * 渲染HTML为PNG图像
   * @param html HTML内容
   * @param options 渲染选项
   * @returns PNG图像，buffer或base64字符串
   */
  async render(html: string, options: RendererOptions = {}): Promise<Buffer | string> {
    try {
      // 检查浏览器依赖
      if (options.checkBrowser !== false) {
        if (!isBrowserAvailable() && !process.env.DOCKER_ENV) {
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
        puppeteerArgs: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      };

      // 合并选项
      const renderOptions = { ...defaultOptions, ...options };

      // Puppeteer 配置
      const puppeteerConfig: any = {
        args: Array.isArray(renderOptions.puppeteerArgs)
          ? renderOptions.puppeteerArgs
          : defaultOptions.puppeteerArgs
      };

      // 确保在Docker环境中始终使用no-sandbox
      if (process.env.DOCKER_ENV) {
        if (!puppeteerConfig.args.includes('--no-sandbox')) {
          puppeteerConfig.args.push('--no-sandbox');
        }
        if (!puppeteerConfig.args.includes('--disable-setuid-sandbox')) {
          puppeteerConfig.args.push('--disable-setuid-sandbox');
        }
      }

      // 如果设置了 PUPPETEER_EXECUTABLE_PATH 环境变量，使用指定的 Chrome 路径
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }

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
      const nodeHtmlToImageOptions: any = {
        html: fullHtml,
        quality: renderOptions.quality,
        type: 'png',
        transparent: renderOptions.transparent,
        width: renderOptions.width
      };

      // 设置puppeteer配置
      if (puppeteerConfig.executablePath || puppeteerConfig.args) {
        nodeHtmlToImageOptions.puppeteerArgs = puppeteerConfig;
      }

      const image = await nodeHtmlToImage(nodeHtmlToImageOptions);

      // 根据输出格式返回结果
      if (renderOptions.outputFormat === 'base64') {
        return image.toString('base64');
      } else {
        return image;
      }
    } catch (error) {
      console.error('浏览器渲染 HTML 到 PNG 时出错:', error);
      throw error;
    }
  }
}
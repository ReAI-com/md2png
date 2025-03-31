import { Renderer, RendererOptions } from './renderer.interface';
import { createCanvas } from 'canvas';
import { JSDOM } from 'jsdom';

/**
 * 轻量级渲染器
 * 使用canvas库直接渲染HTML为PNG，不依赖浏览器
 */
export class LightweightRenderer implements Renderer {
  /**
   * 渲染HTML为PNG图像
   * @param html HTML内容
   * @param options 渲染选项
   * @returns PNG图像，buffer或base64字符串
   */
  async render(html: string, options: RendererOptions = {}): Promise<Buffer | string> {
    try {
      // 默认选项
      const width = options.width || 800;
      const height = Math.floor(width * 1.4); // 初始高度估计，后面会自动调整
      const quality = options.quality || 90;
      const transparent = options.transparent || false;

      // 创建完整的HTML文档
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
                padding: 20px;
                margin: 0 auto;
                background-color: ${transparent ? 'transparent' : 'white'};
              }
              ${options.cssStyles || ''}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      // 使用jsdom创建虚拟DOM
      const dom = new JSDOM(fullHtml);
      const document = dom.window.document;

      // 解析DOM内容并估计需要的高度
      const contentHeight = this.estimateContentHeight(document.body, width);

      // 创建canvas
      const canvas = createCanvas(width, contentHeight);
      const ctx = canvas.getContext('2d');

      // 设置背景
      if (!transparent) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, contentHeight);
      }

      // 渲染内容到canvas
      await this.renderHtmlToCanvas(document.body, ctx as unknown as CanvasRenderingContext2D, 20, 20, width);

      // 根据输出格式返回结果
      if (options.outputFormat === 'base64') {
        // 使用 canvas.toDataURL 的可接受格式
        const dataUrl = canvas.toDataURL();
        return dataUrl.split(',')[1];
      } else {
        return canvas.toBuffer('image/png');
      }
    } catch (error) {
      console.error('轻量级渲染 HTML 到 PNG 时出错:', error);

      // 如果轻量级渲染出错，建议使用浏览器渲染器
      if (error instanceof Error) {
        error.message += '\n提示：可以通过设置 rendererType: "browser" 使用浏览器渲染器获得更好的兼容性。';
      }

      throw error;
    }
  }

  /**
   * 估计内容高度
   * @param element DOM元素
   * @param width 宽度
   * @returns 估计的内容高度
   */
  private estimateContentHeight(element: Element, width: number): number {
    // 基本估计逻辑，实际应用中可能需要更复杂的计算
    const textLength = element.textContent?.length || 0;
    const images = element.getElementsByTagName('img').length;
    const tables = element.getElementsByTagName('table').length;
    const codeBlocks = element.getElementsByTagName('pre').length;

    // 基本文本每70个字符换行，每行约24px高
    const textHeight = Math.ceil(textLength / 70) * 24;

    // 图片估计高度
    const imageHeight = images * 200;

    // 表格估计高度
    const tableHeight = tables * 150;

    // 代码块估计高度
    const codeHeight = codeBlocks * 120;

    // 添加页面边距和元素间隔
    return textHeight + imageHeight + tableHeight + codeHeight + 100;
  }

  /**
   * 渲染HTML到Canvas
   * @param element DOM元素
   * @param ctx Canvas上下文
   * @param x X坐标
   * @param y Y坐标
   * @param maxWidth 最大宽度
   * @returns 最终Y坐标
   */
  private async renderHtmlToCanvas(
    element: Element,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    maxWidth: number
  ): Promise<number> {
    try {
      const tagName = element.tagName.toLowerCase();
      let currentY = y;

      // 根据不同元素类型设置不同样式
      switch (tagName) {
        case 'h1':
          ctx.font = 'bold 32px Arial';
          ctx.fillStyle = '#000';
          break;
        case 'h2':
          ctx.font = 'bold 28px Arial';
          ctx.fillStyle = '#222';
          break;
        case 'h3':
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#222';
          break;
        case 'h4':
        case 'h5':
        case 'h6':
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#333';
          break;
        case 'p':
          ctx.font = '16px Arial';
          ctx.fillStyle = '#333';
          break;
        case 'pre':
          ctx.font = '14px Courier';
          ctx.fillStyle = '#333';
          // 绘制代码块背景
          ctx.fillStyle = '#f6f8fa';
          ctx.fillRect(x, currentY, maxWidth - 40,
            ((element.textContent?.length || 0) / 50) * 18 + 20);
          ctx.fillStyle = '#333';
          break;
        case 'ul':
        case 'ol':
          currentY += 10; // 列表前的额外空间
          break;
        case 'li':
          ctx.font = '16px Arial';
          ctx.fillStyle = '#333';
          // 绘制列表项标记
          ctx.fillText('• ', x - 20, currentY + 16);
          break;
        case 'blockquote':
          // 绘制引用块左边框
          ctx.fillStyle = '#dfe2e5';
          ctx.fillRect(x - 10, currentY, 4,
            ((element.textContent?.length || 0) / 50) * 16 + 16);
          ctx.fillStyle = '#6a737d';
          ctx.font = '16px Arial';
          break;
        default:
          ctx.font = '16px Arial';
          ctx.fillStyle = '#333';
      }

      // 如果是文本节点，直接渲染文本
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent || '';

        // 文本换行处理
        const words = text.split(' ');
        let line = '';

        for (const word of words) {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth - 40 && line) {
            ctx.fillText(line, x, currentY + 16);
            line = word + ' ';
            currentY += 24;
          } else {
            line = testLine;
          }
        }

        if (line) {
          ctx.fillText(line, x, currentY + 16);
          currentY += 24;
        }

        // 根据标签类型添加额外间距
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'blockquote'].includes(tagName)) {
          currentY += 12;
        }
      } else {
        // 递归处理子元素
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];

          if (child.nodeType === 1) { // 元素节点
            currentY = await this.renderHtmlToCanvas(child as Element, ctx, x, currentY, maxWidth);
          } else if (child.nodeType === 3) { // 文本节点
            const text = child.textContent || '';
            if (text.trim()) {
              const words = text.split(' ');
              let line = '';

              for (const word of words) {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth - 40 && line) {
                  ctx.fillText(line, x, currentY + 16);
                  line = word + ' ';
                  currentY += 24;
                } else {
                  line = testLine;
                }
              }

              if (line) {
                ctx.fillText(line, x, currentY + 16);
                currentY += 24;
              }
            }
          }
        }
      }

      return currentY;
    } catch (error) {
      console.error('渲染HTML元素到Canvas时出错:', error);
      return y + 30; // 在出错的情况下也前进一些距离
    }
  }
}
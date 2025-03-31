/**
 * 渲染器选项接口
 */
export interface RendererOptions {
  width?: number;
  quality?: number;
  transparent?: boolean;
  outputFormat?: 'buffer' | 'base64';
  cssStyles?: string;
  checkBrowser?: boolean;
  rendererType?: 'browser' | 'lightweight';
  puppeteerArgs?: string[];
}

/**
 * 渲染器接口
 */
export interface Renderer {
  /**
   * 渲染HTML为图像
   * @param html HTML内容
   * @param options 渲染选项
   * @returns 渲染结果，buffer或base64字符串
   */
  render(html: string, options: RendererOptions): Promise<Buffer | string>;
}
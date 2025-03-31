import { Renderer, RendererOptions } from './renderer.interface';
import { BrowserRenderer } from './browser.renderer';

/**
 * 渲染器工厂
 */
export class RendererFactory {
  /**
   * 创建渲染器实例
   * @param options 渲染选项
   * @returns 渲染器实例
   */
  static createRenderer(options: RendererOptions = {}): Renderer {
    return new BrowserRenderer();
  }
}
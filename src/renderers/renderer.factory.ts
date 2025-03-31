import { Renderer, RendererOptions } from './renderer.interface';
import { BrowserRenderer } from './browser.renderer';
// 暂时注释掉轻量级渲染器
// import { LightweightRenderer } from './lightweight.renderer';

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
    // 默认使用浏览器渲染器保持向下兼容
    const rendererType = options.rendererType || 'browser';

    // 暂时禁用轻量级渲染器选项
    if (rendererType === 'lightweight') {
      console.warn('轻量级渲染器已暂时禁用，将使用浏览器渲染器替代。');
    }

    // 始终返回浏览器渲染器
    return new BrowserRenderer();

    /*
    switch (rendererType) {
      case 'lightweight':
        return new LightweightRenderer();
      case 'browser':
      default:
        return new BrowserRenderer();
    }
    */
  }
}
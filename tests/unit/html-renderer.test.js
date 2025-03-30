/**
 * Unit tests for html-renderer.js
 */

const htmlRenderer = require('../../src/services/html-renderer');

// Mock node-html-to-image
jest.mock('node-html-to-image', () => {
  return jest.fn().mockImplementation((options) => {
    // Return a buffer for testing
    return Promise.resolve(Buffer.from('mock-image-data'));
  });
});

describe('HTML Renderer', () => {
  test('should render HTML to buffer by default', async () => {
    const html = '<h1>Test</h1>';
    const result = await htmlRenderer.render(html);
    
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe('mock-image-data');
  });
  
  test('should render HTML to base64 when specified', async () => {
    const html = '<h1>Test</h1>';
    const result = await htmlRenderer.render(html, { outputFormat: 'base64' });
    
    expect(typeof result).toBe('string');
    // 结果应该是 'mock-image-data' 的 base64 编码
    expect(result).toBe('bW9jay1pbWFnZS1kYXRh');
  });
  
  test('should pass width option to renderer', async () => {
    const html = '<h1>Test</h1>';
    const options = { width: 1200 };
    
    await htmlRenderer.render(html, options);
    
    const nodeHtmlToImage = require('node-html-to-image');
    expect(nodeHtmlToImage).toHaveBeenCalledWith(
      expect.objectContaining({
        puppeteerArgs: expect.objectContaining({
          defaultViewport: expect.objectContaining({
            width: 1200
          })
        })
      })
    );
  });
  
  test('should pass quality option to renderer', async () => {
    const html = '<h1>Test</h1>';
    const options = { quality: 95 };
    
    await htmlRenderer.render(html, options);
    
    const nodeHtmlToImage = require('node-html-to-image');
    expect(nodeHtmlToImage).toHaveBeenCalledWith(
      expect.objectContaining({
        quality: 95
      })
    );
  });
  
  test('should handle transparent background option', async () => {
    const html = '<h1>Test</h1>';
    const options = { transparent: true };
    
    await htmlRenderer.render(html, options);
    
    const nodeHtmlToImage = require('node-html-to-image');
    expect(nodeHtmlToImage).toHaveBeenCalledWith(
      expect.objectContaining({
        transparent: true
      })
    );
  });
});

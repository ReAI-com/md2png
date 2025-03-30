/**
 * Sharp 渲染器单元测试
 */

const sharpRenderer = require('../../src/services/sharp-renderer');

// 模拟 Sharp
jest.mock('sharp', () => {
  const mockSharp = jest.fn().mockImplementation(() => {
    return {
      composite: jest.fn().mockReturnThis(),
      png: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-image-data'))
    };
  });
  
  return mockSharp;
});

// 模拟 JSDOM
jest.mock('jsdom', () => {
  return {
    JSDOM: jest.fn().mockImplementation(() => {
      return {
        window: {
          document: {
            body: {
              textContent: '模拟文本内容'
            }
          }
        }
      };
    })
  };
});

describe('Sharp 渲染器', () => {
  test('默认应将 HTML 渲染为 buffer', async () => {
    const html = '<h1>测试</h1>';
    const result = await sharpRenderer.render(html);
    
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe('mock-image-data');
  });
  
  test('指定时应将 HTML 渲染为 base64', async () => {
    const html = '<h1>测试</h1>';
    const result = await sharpRenderer.render(html, { outputFormat: 'base64' });
    
    expect(typeof result).toBe('string');
    expect(result).toBe('bW9jay1pbWFnZS1kYXRh');
  });
  
  test('应将宽度选项传递给渲染器', async () => {
    const html = '<h1>测试</h1>';
    const options = { width: 1200 };
    
    await sharpRenderer.render(html, options);
    
    const sharp = require('sharp');
    expect(sharp).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          width: 1200
        })
      })
    );
  });
  
  test('应将高度选项传递给渲染器', async () => {
    const html = '<h1>测试</h1>';
    const options = { height: 800 };
    
    await sharpRenderer.render(html, options);
    
    const sharp = require('sharp');
    expect(sharp).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          height: 800
        })
      })
    );
  });
  
  test('应处理透明背景选项', async () => {
    const html = '<h1>测试</h1>';
    const options = { transparent: true };
    
    await sharpRenderer.render(html, options);
    
    const sharp = require('sharp');
    expect(sharp).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          background: expect.objectContaining({
            alpha: 0
          })
        })
      })
    );
  });
});

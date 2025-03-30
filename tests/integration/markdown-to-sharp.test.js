/**
 * 轻量级 Markdown 转 PNG 转换器集成测试
 */

const path = require('path');
const fs = require('fs').promises;
const markdownToPng = require('../../src/index');

// 创建临时目录用于测试文件
const TEST_DIR = path.join(__dirname, '../temp');

// 用于测试的示例 Markdown，包含各种元素
const TEST_MARKDOWN = `
# Markdown to PNG 测试

这是对 **markdown-to-png** 转换器的测试。

## 要测试的功能

1. 标题（如上所示）
2. **粗体** 和 *斜体* 文本
3. 列表（有序和无序）
   * 像这个
   * 还有这个
4. 代码块

\`\`\`javascript
const test = "这是一个代码块";
console.log(test);
\`\`\`

## 表格测试

| 标题 1 | 标题 2 | 标题 3 |
|----------|----------|----------|
| 单元格 1   | 单元格 2   | 单元格 3   |
| 单元格 4   | 单元格 5   | 单元格 6   |

## 图像测试

![测试图像](https://via.placeholder.com/150)
`;

describe('轻量级 Markdown 转 PNG 集成测试', () => {
  beforeAll(async () => {
    // 创建测试目录
    try {
      await fs.mkdir(TEST_DIR, { recursive: true });
    } catch (error) {
      console.error('创建测试目录时出错:', error);
    }
  });

  afterAll(async () => {
    // 清理测试文件
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch (error) {
      console.error('清理测试目录时出错:', error);
    }
  });

  test('应将 Markdown 字符串转换为 PNG buffer（使用轻量级渲染器）', async () => {
    // 此测试验证核心功能
    const result = await markdownToPng.convert(TEST_MARKDOWN, {
      outputFormat: 'buffer',
      usePuppeteer: false // 使用轻量级渲染器
    });

    // 验证结果是一个 buffer
    expect(Buffer.isBuffer(result)).toBe(true);
    
    // 验证 buffer 包含 PNG 数据（PNG 签名）
    expect(result.slice(0, 8).toString('hex')).toMatch(/89504e47/i);
  }, 30000); // 增加超时时间用于图像渲染

  test('应将 Markdown 字符串转换为 base64 PNG（使用轻量级渲染器）', async () => {
    // 此测试验证 base64 输出格式
    const result = await markdownToPng.convert(TEST_MARKDOWN, {
      outputFormat: 'base64',
      usePuppeteer: false // 使用轻量级渲染器
    });

    // 验证结果是一个字符串
    expect(typeof result).toBe('string');
    
    // 验证它是一个有效的 base64 字符串
    expect(() => Buffer.from(result, 'base64')).not.toThrow();
  }, 30000); // 增加超时时间用于图像渲染

  test('应将 Markdown 文件转换为 PNG 文件（使用轻量级渲染器）', async () => {
    // 创建测试 Markdown 文件
    const markdownPath = path.join(TEST_DIR, 'test-sharp.md');
    const pngPath = path.join(TEST_DIR, 'test-sharp.png');
    
    await fs.writeFile(markdownPath, TEST_MARKDOWN);
    
    // 转换文件
    await markdownToPng.convertFile(markdownPath, pngPath, {
      usePuppeteer: false // 使用轻量级渲染器
    });
    
    // 验证 PNG 文件存在
    const fileExists = await fs.access(pngPath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
    
    // 验证文件内容
    const fileContent = await fs.readFile(pngPath);
    expect(Buffer.isBuffer(fileContent)).toBe(true);
    expect(fileContent.slice(0, 8).toString('hex')).toMatch(/89504e47/i);
  }, 30000); // 增加超时时间用于图像渲染

  test('应处理自定义宽度和质量选项（使用轻量级渲染器）', async () => {
    // 此测试验证自定义选项
    const result = await markdownToPng.convert(TEST_MARKDOWN, {
      outputFormat: 'buffer',
      width: 1200,
      quality: 95,
      usePuppeteer: false // 使用轻量级渲染器
    });

    // 验证结果是一个 buffer
    expect(Buffer.isBuffer(result)).toBe(true);
    
    // 我们无法在测试中轻松验证宽度/质量，
    // 但我们可以验证它不会抛出错误
  }, 30000); // 增加超时时间用于图像渲染
});

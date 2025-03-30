/**
 * Integration tests for markdown-to-png converter
 */

const path = require('path');
const fs = require('fs').promises;
const markdownToPng = require('../../src/index');

// Create temp directory for test files
const TEST_DIR = path.join(__dirname, '../temp');

// Sample markdown with various elements to test
const TEST_MARKDOWN = `
# Markdown to PNG Test

This is a test of the **markdown-to-png** converter.

## Features to test

1. Headers (like above)
2. **Bold** and *italic* text
3. Lists (numbered and bulleted)
   * Like this one
   * And this one
4. Code blocks

\`\`\`javascript
const test = "This is a code block";
console.log(test);
\`\`\`

## Table Test

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Image Test

![Test Image](https://via.placeholder.com/150)
`;

describe('Markdown to PNG Integration', () => {
  beforeAll(async () => {
    // Create test directory
    try {
      await fs.mkdir(TEST_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating test directory:', error);
    }
  });

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up test directory:', error);
    }
  });

  test('should convert markdown string to PNG buffer (using Puppeteer)', async () => {
    // This test verifies the core functionality with Puppeteer renderer
    const result = await markdownToPng.convert(TEST_MARKDOWN, {
      outputFormat: 'buffer',
      usePuppeteer: true // 使用 Puppeteer 渲染器
    });

    // Verify result is a buffer
    expect(Buffer.isBuffer(result)).toBe(true);
    
    // Verify buffer contains PNG data (PNG signature)
    expect(result.slice(0, 8).toString('hex')).toMatch(/89504e47/i);
  }, 30000); // Increase timeout for image rendering

  test('should convert markdown string to base64 PNG (using Puppeteer)', async () => {
    // This test verifies base64 output format with Puppeteer renderer
    const result = await markdownToPng.convert(TEST_MARKDOWN, {
      outputFormat: 'base64',
      usePuppeteer: true // 使用 Puppeteer 渲染器
    });

    // Verify result is a string
    expect(typeof result).toBe('string');
    
    // Verify it's a valid base64 string
    expect(() => Buffer.from(result, 'base64')).not.toThrow();
  }, 30000); // Increase timeout for image rendering

  test('should convert markdown file to PNG file (using Puppeteer)', async () => {
    // Create test markdown file
    const markdownPath = path.join(TEST_DIR, 'test.md');
    const pngPath = path.join(TEST_DIR, 'test.png');
    
    await fs.writeFile(markdownPath, TEST_MARKDOWN);
    
    // Convert file
    await markdownToPng.convertFile(markdownPath, pngPath, {
      usePuppeteer: true // 使用 Puppeteer 渲染器
    });
    
    // Verify PNG file exists
    const fileExists = await fs.access(pngPath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
    
    // Verify file content
    const fileContent = await fs.readFile(pngPath);
    expect(Buffer.isBuffer(fileContent)).toBe(true);
    expect(fileContent.slice(0, 8).toString('hex')).toMatch(/89504e47/i);
  }, 30000); // Increase timeout for image rendering

  test('should handle custom width and quality options (using Puppeteer)', async () => {
    // This test verifies customization options with Puppeteer renderer
    const result = await markdownToPng.convert(TEST_MARKDOWN, {
      outputFormat: 'buffer',
      width: 1200,
      quality: 95,
      usePuppeteer: true // 使用 Puppeteer 渲染器
    });

    // Verify result is a buffer
    expect(Buffer.isBuffer(result)).toBe(true);
    
    // We can't easily verify width/quality in the test,
    // but we can verify it doesn't throw errors
  }, 30000); // Increase timeout for image rendering
});

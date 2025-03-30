# md2png-node

一个将 Markdown 转换为 PNG 图像的 Node.js 库，支持自定义样式和高质量渲染。

[English](#md2png-node) | 中文文档

## 功能特点

- ✅ 支持所有标准 Markdown 语法（标题、列表、代码块等）
- ✅ 支持自定义 CSS 样式
- ✅ 支持透明背景
- ✅ 支持自定义图片质量
- ✅ 支持输出为 Buffer 或 Base64
- ✅ 使用 Puppeteer 实现高质量渲染
- ✅ 完整的 TypeScript 支持

## 安装

```bash
npm install md2png-node
# 或者
yarn add md2png-node
# 或者
pnpm add md2png-node
```

## 使用方法

### 转换 Markdown 字符串

```typescript
import { convert } from 'md2png-node';

const markdown = '# Hello World';
const options = {
  width: 800,
  quality: 90,
  transparent: false,
  cssStyles: `
    body { background-color: #f0f0f0; }
  `
};

// 转换为 Buffer
const buffer = await convert(markdown, { outputFormat: 'buffer' });

// 转换为 Base64
const base64 = await convert(markdown, { outputFormat: 'base64' });
```

### 转换 Markdown 文件

```typescript
import { convertFile } from 'md2png-node';

const options = {
  width: 800,
  quality: 90,
  transparent: false
};

// 转换文件
await convertFile('input.md', 'output.png', options);
```

## API 参考

### `convert(markdown, options)`

将 Markdown 字符串转换为 PNG 图像。

**参数：**
- `markdown` (string): 要转换的 Markdown 内容
- `options` (object, 可选): 转换选项
  - `width` (number): 输出图片宽度，默认 800
  - `quality` (number): 图片质量（1-100），默认 90
  - `transparent` (boolean): 是否使用透明背景，默认 false
  - `outputFormat` ('buffer' | 'base64'): 输出格式，默认 'buffer'
  - `cssStyles` (string): 自定义 CSS 样式

**返回值：**
- Promise<Buffer | string>: 根据 outputFormat 返回 Buffer 或 base64 字符串

### `convertFile(inputPath, outputPath, options)`

将 Markdown 文件转换为 PNG 图像文件。

**参数：**
- `inputPath` (string): Markdown 文件路径
- `outputPath` (string): 输出 PNG 文件路径
- `options` (object, 可选): 与 convert() 相同的选项

**返回值：**
- Promise<string>: 输出文件路径

## 示例

### 转换 Markdown 文件

```typescript
import { convertFile } from 'md2png-node';

async function convertFile() {
  try {
    await convertFile('example.md', 'example.png');
    console.log('转换成功！');
  } catch (error) {
    console.error('转换失败:', error);
  }
}

convertFile();
```

### 转换为 Base64

```typescript
import { convert } from 'md2png-node';

async function convertToBase64() {
  const markdown = `
# Hello World

这是一个 **Markdown** 示例，包含：
- 列表
- *格式化*
- 更多内容！

| 列1 | 列2 |
|-----|-----|
| 数据1 | 数据2 |
  `;

  try {
    const base64Image = await convert(markdown, {
      outputFormat: 'base64',
      width: 600
    });

    console.log('Base64 图片:', base64Image.substring(0, 100) + '...');

    // 在 HTML 中使用
    // const imgTag = `<img src="data:image/png;base64,${base64Image}" alt="Markdown Image">`;
  } catch (error) {
    console.error('转换失败:', error);
  }
}

convertToBase64();
```

## 工作原理

转换器使用以下技术：

1. **Markdown 解析**：使用 [markdown-it](https://github.com/markdown-it/markdown-it) 将 Markdown 解析为 HTML
2. **HTML 渲染**：使用 [node-html-to-image](https://github.com/frinyvonnick/node-html-to-image) 和 [Puppeteer](https://github.com/puppeteer/puppeteer) 将 HTML 渲染为 PNG

## 性能考虑

- 对于大文件，建议：
  - 调整图片质量（较低质量 = 更快渲染）
  - 使用较小的宽度
  - 为频繁渲染的内容实现缓存

## 开发

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建
pnpm build
```

## 许可证

MIT

---

# Markdown to PNG Converter

A Node.js solution to convert Markdown files to PNG images with support for all standard Markdown syntax, embedded images, and tables.

English | [中文文档](#markdown-to-png-转换器)

## Features

- ✅ Supports all standard Markdown syntax (headers, lists, code blocks, etc.)
- ✅ Handles embedded images in Markdown
- ✅ Properly renders Markdown tables
- ✅ Optimized for performance and image quality
- ✅ Supports base64 output format
- ✅ Customizable styling and rendering options
- ✅ Lightweight rendering option (no browser dependency)
- ✅ Server-friendly implementation

## Installation

```bash
npm install markdown-to-png
# 或者
yarn add markdown-to-png
# 或者
pnpm add markdown-to-png
```

## Usage

### Basic Usage

```javascript
const markdownToPng = require('markdown-to-png');

// Convert markdown string to PNG buffer
const markdown = '# Hello World\n\nThis is a test.';
const pngBuffer = await markdownToPng.convert(markdown);

// Convert markdown file to PNG file
await markdownToPng.convertFile('input.md', 'output.png');
```

### Advanced Options

```javascript
const markdownToPng = require('markdown-to-png');

// Convert with custom options
const result = await markdownToPng.convert(markdown, {
  outputFormat: 'base64',  // 'buffer', 'base64'
  width: 800,              // Width of the output image
  height: null,            // Height (null for auto)
  quality: 90,             // Image quality (1-100)
  transparent: false,      // Transparent background
  cssStyles: customCss,    // Custom CSS styles
  usePuppeteer: false,     // Use lightweight renderer (default: false)
  markdownItOptions: {     // Options for markdown-it
    html: false,
    breaks: true,
    linkify: true,
    typographer: true
  }
});
```

## API Reference

### `convert(markdown, options)`

Converts a markdown string to a PNG image.

**Parameters:**

- `markdown` (string): The markdown content to convert
- `options` (object, optional): Conversion options
  - `outputFormat` (string): Output format - 'buffer' (default) or 'base64'
  - `width` (number): Width of the output image (default: 800)
  - `height` (number): Height of the output image (null for auto)
  - `quality` (number): Image quality from 1-100 (default: 90)
  - `transparent` (boolean): Whether to use transparent background (default: false)
  - `cssStyles` (string): Custom CSS styles to apply
  - `usePuppeteer` (boolean): Whether to use Puppeteer for rendering (default: false)
  - `markdownItOptions` (object): Options to pass to markdown-it

**Returns:**

- Promise that resolves to a Buffer (default) or base64 string depending on the outputFormat option

### `convertFile(inputPath, outputPath, options)`

Converts a markdown file to a PNG image file.

**Parameters:**

- `inputPath` (string): Path to the markdown file
- `outputPath` (string): Path where the PNG file will be saved
- `options` (object, optional): Same options as `convert()`

**Returns:**

- Promise that resolves to the output file path

## Examples

### Converting a Markdown File

```javascript
const markdownToPng = require('markdown-to-png');

async function convertFile() {
  try {
    await markdownToPng.convertFile('example.md', 'example.png');
    console.log('Conversion successful!');
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

convertFile();
```

### Converting to Base64

```javascript
const markdownToPng = require('markdown-to-png');

async function convertToBase64() {
  const markdown = `
# Hello World

This is a **markdown** example with:
- Lists
- *Formatting*
- And more!

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
  `;

  try {
    const base64Image = await markdownToPng.convert(markdown, {
      outputFormat: 'base64',
      width: 600
    });

    console.log('Base64 image:', base64Image.substring(0, 100) + '...');

    // Use in HTML
    // const imgTag = `<img src="data:image/png;base64,${base64Image}" alt="Markdown Image">`;
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

convertToBase64();
```

## How It Works

The converter works in two main steps:

1. **Markdown to HTML**: Uses [markdown-it](https://github.com/markdown-it/markdown-it) to parse Markdown into HTML with proper styling
2. **HTML to PNG**: Offers two rendering options:
   - **Lightweight Renderer** (Default): Uses [Sharp](https://sharp.pixelplumbing.com/) and [html-to-image](https://github.com/bubkoo/html-to-image) with [jsdom](https://github.com/jsdom/jsdom) for server-friendly rendering without browser dependencies
   - **Puppeteer Renderer**: Uses [node-html-to-image](https://github.com/frinyvonnick/node-html-to-image) (which uses Puppeteer) for browser-based rendering

## Rendering Options

### Lightweight Renderer (Default)

The lightweight renderer is optimized for server environments and offers several advantages:

- **No Browser Dependency**: Doesn't require Chrome or other browser installations
- **Faster Startup**: Eliminates browser initialization time
- **Lower Memory Usage**: Significantly reduces memory footprint
- **Server-Friendly**: Works well in containerized and serverless environments

```javascript
// Use the lightweight renderer (default)
const result = await markdownToPng.convert(markdown, {
  usePuppeteer: false // This is the default
});
```

### Puppeteer Renderer

The Puppeteer renderer uses a headless browser for rendering, which may be preferred in some cases:

- **Pixel-Perfect Rendering**: Uses Chrome's rendering engine
- **Advanced CSS Support**: Better for complex CSS layouts
- **Web Fonts**: Better support for custom web fonts

```javascript
// Use the Puppeteer renderer
const result = await markdownToPng.convert(markdown, {
  usePuppeteer: true
});
```

## Performance Considerations

- For better performance with large files, consider:
  - Using the lightweight renderer (`usePuppeteer: false`)
  - Adjusting image quality (lower quality = faster rendering)
  - Using a smaller width
  - Implementing caching for frequently rendered content

## License

MIT

---

# Markdown to PNG 转换器

一个将 Markdown 文件转换为 PNG 图像的 Node.js 解决方案，支持所有标准 Markdown 语法、嵌入式图像和表格。

[English](#markdown-to-png-converter) | 中文文档

## 功能特点

- ✅ 支持所有标准 Markdown 语法（标题、列表、代码块等）
- ✅ 处理 Markdown 中的嵌入式图像
- ✅ 正确渲染 Markdown 表格
- ✅ 针对性能和图像质量进行优化
- ✅ 支持 base64 输出格式
- ✅ 可自定义样式和渲染选项
- ✅ 轻量级渲染选项（无浏览器依赖）
- ✅ 服务器友好实现

## 安装

```bash
npm install markdown-to-png
# 或者
yarn add markdown-to-png
# 或者
pnpm add markdown-to-png
```

## 使用方法

### 转换 Markdown 字符串

```typescript
import { convert } from 'markdown-to-png';

const markdown = '# Hello World';
const options = {
  width: 800,
  quality: 90,
  transparent: false,
  cssStyles: `
    body { background-color: #f0f0f0; }
  `
};

// 转换为 Buffer
const buffer = await convert(markdown, { outputFormat: 'buffer' });

// 转换为 Base64
const base64 = await convert(markdown, { outputFormat: 'base64' });
```

### 转换 Markdown 文件

```typescript
import { convertFile } from 'markdown-to-png';

const options = {
  width: 800,
  quality: 90,
  transparent: false
};

// 转换文件
await convertFile('input.md', 'output.png', options);
```

## 选项说明

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 800 | 输出图片的宽度 |
| quality | number | 90 | 输出图片的质量（1-100） |
| transparent | boolean | false | 是否使用透明背景 |
| outputFormat | 'buffer' \| 'base64' | 'buffer' | 输出格式 |
| cssStyles | string | - | 自定义 CSS 样式 |

## 开发

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建
pnpm build
```

## 许可证

MIT

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
```

## 使用方法

### 基本用法

```javascript
const markdownToPng = require('markdown-to-png');

// 将 Markdown 字符串转换为 PNG buffer
const markdown = '# 你好世界\n\n这是一个测试。';
const pngBuffer = await markdownToPng.convert(markdown);

// 将 Markdown 文件转换为 PNG 文件
await markdownToPng.convertFile('input.md', 'output.png');
```

### 高级选项

```javascript
const markdownToPng = require('markdown-to-png');

// 使用自定义选项进行转换
const result = await markdownToPng.convert(markdown, {
  outputFormat: 'base64',  // 'buffer', 'base64'
  width: 800,              // 输出图像的宽度
  height: null,            // 高度（null 为自动）
  quality: 90,             // 图像质量（1-100）
  transparent: false,      // 透明背景
  cssStyles: customCss,    // 自定义 CSS 样式
  usePuppeteer: false,     // 使用轻量级渲染器（默认：false）
  markdownItOptions: {     // markdown-it 的选项
    html: false,
    breaks: true,
    linkify: true,
    typographer: true
  }
});
```

## 渲染选项

### 轻量级渲染器（默认）

轻量级渲染器针对服务器环境进行了优化，提供了多项优势：

- **无浏览器依赖**：不需要安装 Chrome 或其他浏览器
- **更快的启动时间**：消除了浏览器初始化时间
- **更低的内存使用**：显著减少内存占用
- **服务器友好**：在容器化和无服务器环境中表现良好

```javascript
// 使用轻量级渲染器（默认）
const result = await markdownToPng.convert(markdown, {
  usePuppeteer: false // 这是默认设置
});
```

### Puppeteer 渲染器

Puppeteer 渲染器使用无头浏览器进行渲染，在某些情况下可能更受欢迎：

- **像素完美渲染**：使用 Chrome 的渲染引擎
- **高级 CSS 支持**：更适合复杂的 CSS 布局
- **Web 字体**：更好地支持自定义 Web 字体

```javascript
// 使用 Puppeteer 渲染器
const result = await markdownToPng.convert(markdown, {
  usePuppeteer: true
});
```

## 性能考虑

- 对于大文件，考虑以下优化方法：
  - 使用轻量级渲染器（`usePuppeteer: false`）
  - 调整图像质量（较低质量 = 更快渲染）
  - 使用较小的宽度
  - 为频繁渲染的内容实现缓存

## 工作原理

转换器分两个主要步骤工作：

1. **Markdown 到 HTML**：使用 [markdown-it](https://github.com/markdown-it/markdown-it) 将 Markdown 解析为具有适当样式的 HTML
2. **HTML 到 PNG**：提供两种渲染选项：
   - **轻量级渲染器**（默认）：使用 [Sharp](https://sharp.pixelplumbing.com/) 和 [html-to-image](https://github.com/bubkoo/html-to-image) 与 [jsdom](https://github.com/jsdom/jsdom) 进行服务器友好的渲染，无需浏览器依赖
   - **Puppeteer 渲染器**：使用 [node-html-to-image](https://github.com/frinyvonnick/node-html-to-image)（使用 Puppeteer）进行基于浏览器的渲染

## 许可证

MIT

# md2png-node

一个将 Markdown 转换为 PNG 图像的 Node.js 库，支持自定义样式和高质量渲染。

[English](#md2png-node-english) | 中文文档

## 功能特点

- ✅ 支持所有标准 Markdown 语法（标题、列表、代码块等）
- ✅ 支持自定义 CSS 样式
- ✅ 支持透明背景
- ✅ 支持自定义图片质量
- ✅ 支持输出为 Buffer 或 Base64
- ✅ 使用 Puppeteer 实现高质量渲染
- ✅ 完整的 TypeScript 支持
- ✅ 兼容 Docker 容器环境

## 安装

```bash
# NPM
npm install md2png-node

# Yarn
yarn add md2png-node

# PNPM
pnpm add md2png-node
```

### 系统要求

本工具需要一个浏览器环境进行渲染，支持以下浏览器：
- Google Chrome
- Microsoft Edge
- Firefox

> **注意**：如需在 Docker 或服务器环境中使用，请参考 [Docker 使用指南](./DOCKER.md)。

## 基本使用

```typescript
import { convert, convertFile } from 'md2png-node';

// 转换 Markdown 字符串为 PNG Buffer
const markdown = '# Hello World\n\n这是一个示例';
const buffer = await convert(markdown);

// 转换 Markdown 文件为 PNG 文件
await convertFile('input.md', 'output.png');
```

## 高级选项

```typescript
// 转换为 Base64 并应用自定义样式
const base64 = await convert(markdown, {
  outputFormat: 'base64',
  width: 800,
  quality: 90,
  transparent: false,
  cssStyles: `
    body {
      background-color: #f8f9fa;
      font-family: 'Arial', sans-serif;
    }
    h1 { color: #0366d6; }
  `
});
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
  - `checkBrowser` (boolean): 是否检查浏览器依赖，默认 true
  - `puppeteerArgs` (string[]): Puppeteer 启动参数，适用于 Docker 环境

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

## 中国用户安装指南

如果您在中国区域安装时遇到网络问题，可以使用以下方法：

```bash
# 使用淘宝NPM镜像安装
npm install md2png-node --registry=https://registry.npmmirror.com

# 或使用内置脚本安装
npm install -g md2png-node --registry=https://registry.npmmirror.com
md2png-setup-cn
```

更多中国区域安装方法请参考文档底部。

## Docker 环境使用

在 Docker 容器中使用 md2png-node 时，需要特别注意浏览器环境配置。

**快速开始**:

```bash
# 使用 Alpine 环境（轻量级，推荐）
docker build -f Dockerfile.alpine -t md2png .
docker run --user node -v $(pwd)/examples:/app/examples md2png-alpine
```

详细配置请参考 [Docker 使用指南](./DOCKER.md) 和 [Docker 快速入门](./DOCKER-QUICKSTART.md)。

## 许可证

MIT

---

<a id="md2png-node-english"></a>
# md2png-node (English)

A Node.js library to convert Markdown to PNG images with custom styles and high-quality rendering.

English | [中文文档](#md2png-node)

## Features

- ✅ Support for all standard Markdown syntax
- ✅ Custom CSS styling
- ✅ Transparent background support
- ✅ Customizable image quality
- ✅ Output as Buffer or Base64
- ✅ High-quality rendering with Puppeteer
- ✅ Full TypeScript support
- ✅ Docker container compatibility

## Installation

```bash
npm install md2png-node
```

### System Requirements

This tool requires a browser for rendering. Supported browsers:
- Google Chrome
- Microsoft Edge
- Firefox

> **Note**: For Docker or server environments, see [Docker Guide](./DOCKER.md).

## Basic Usage

```typescript
import { convert, convertFile } from 'md2png-node';

// Convert Markdown string to PNG Buffer
const markdown = '# Hello World\n\nThis is an example';
const buffer = await convert(markdown);

// Convert Markdown file to PNG file
await convertFile('input.md', 'output.png');
```

## Advanced Options

```typescript
// Convert to Base64 with custom styles
const base64 = await convert(markdown, {
  outputFormat: 'base64',
  width: 800,
  quality: 90,
  transparent: false,
  cssStyles: `
    body {
      background-color: #f8f9fa;
      font-family: 'Arial', sans-serif;
    }
    h1 { color: #0366d6; }
  `
});
```

## License

MIT

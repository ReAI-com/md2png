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
- ✅ 兼容 Docker 容器环境

## 安装

```bash
npm install md2png-node
# 或者
yarn add md2png-node
# 或者
pnpm add md2png-node
```

### 中国用户安装指南

如果您在中国区域安装时遇到网络问题，可以使用以下方法：

1. **使用淘宝NPM镜像安装**：

```bash
# 使用npmmirror镜像安装
npm install md2png-node --registry=https://registry.npmmirror.com
# 或者
yarn add md2png-node --registry=https://registry.npmmirror.com
# 或者
pnpm add md2png-node --registry=https://registry.npmmirror.com
```

2. **使用项目提供的便捷镜像切换命令**：

```bash
# 切换到中国镜像
npm run use:cn
# 然后正常安装
npm install md2png-node

# 查看当前使用的镜像
npm run registry:current

# 切换回官方镜像
npm run use:npm
```

3. **配置项目的.npmrc文件**：

创建或编辑项目根目录下的`.npmrc`文件：
```
# 使用中国镜像
registry=https://registry.npmmirror.com/
```

4. **使用npmmirror-config-china工具全局配置镜像**：

这个工具会自动配置npm以使用中国区镜像，包括各种二进制依赖：

```bash
# 全局安装并配置
npm install -g npmmirror-config-china --registry=https://registry.npmmirror.com

# 项目中本地配置
npm install npmmirror-config-china --save-dev --registry=https://registry.npmmirror.com
npx npmmirror-config-china
```

5. **使用NRM管理多个镜像源**：

```bash
# 安装NRM
npm install -g nrm --registry=https://registry.npmmirror.com

# 查看可用的镜像源
nrm ls

# 切换到淘宝镜像
nrm use taobao

# 切换回npm官方镜像
nrm use npm
```

6. **如果仍然遇到依赖下载问题**：

对于puppeteer等大型二进制依赖，可以设置环境变量：

```bash
# Linux/Mac
export PUPPETEER_DOWNLOAD_HOST=https://npmmirror.com/mirrors/

# Windows
set PUPPETEER_DOWNLOAD_HOST=https://npmmirror.com/mirrors/
```

7. **使用项目内置的中国区安装脚本**:

我们提供了一个专门为中国用户准备的安装脚本，可以一键配置所有镜像：

```bash
# 方法1: 全局安装后使用命令
npm install -g md2png-node --registry=https://registry.npmmirror.com
md2png-setup-cn

# 方法2: 直接运行项目中的脚本
node ./node_modules/md2png-node/install-cn.js
```

### 系统要求

本工具提供两种渲染模式：

1. **浏览器渲染模式**（默认）：依赖于浏览器进行高质量渲染，支持完整的Markdown语法和样式。需要安装以下浏览器之一：
   - Google Chrome
   - Microsoft Edge
   - Firefox

> **重要提示**：轻量级渲染模式（无浏览器依赖）已在当前版本中暂时禁用，将在后续版本中重新加入。目前仅支持使用浏览器渲染模式。

### 轻量级渲染模式

> **注意**: 轻量级渲染模式已在当前版本中暂时禁用，将在后续版本中重新加入。以下是该功能的预览介绍。

<!--
- **优点**：
  - 无浏览器依赖，纯Node.js实现
  - 资源消耗小，部署简单
  - 适合服务器和容器环境

- **缺点**：
  - 渲染质量略逊于浏览器模式
  - 复杂布局可能有差异
  - 部分高级CSS特性支持有限

- **适用场景**：
  - 服务器和容器环境
  - 简单Markdown内容渲染
  - 需要最小化依赖

使用方法：

```typescript
// 轻量级模式
const options = {
  rendererType: 'lightweight',
  width: 800
};

// 浏览器模式(默认)
const options = {
  rendererType: 'browser',
  width: 800
};

const buffer = await convert(markdown, options);
```
-->

### Docker 环境使用指南

当在 Docker 容器中运行时，可能会遇到 canvas 模块相关的错误（例如 `Error: Cannot find module '../build/Release/canvas.node'`）。这是因为 canvas 需要特定的系统依赖库才能正常工作。请按照以下步骤解决：

#### 最小化安装（推荐）

从版本1.1.0开始，我们实现了依赖优化，使您可以选择不安装可选依赖来避免 canvas 相关错误：

1. **仅使用浏览器渲染模式**：
   默认情况下，如果您只使用浏览器渲染模式（`rendererType: 'browser'`或不指定渲染器），则无需安装 canvas 依赖。

   ```javascript
   // 使用浏览器渲染模式，不需要canvas依赖
   const options = {
     rendererType: 'browser',  // 这是默认值，可以省略
     width: 800
   };

   const buffer = await convert(markdown, options);
   ```

2. **安装时跳过可选依赖**：
   ```bash
   # 安装时跳过可选依赖
   npm install md2png-node --no-optional

   # 或使用yarn
   yarn add md2png-node --ignore-optional

   # 或使用pnpm
   pnpm add md2png-node --no-optional
   ```

3. **Docker镜像最小化示例**：
   ```dockerfile
   FROM node:18-slim

   # 仅安装浏览器依赖
   RUN apt-get update && apt-get install -y \
       chromium \
       fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
       --no-install-recommends \
       && rm -rf /var/lib/apt/lists/*

   # 设置Puppeteer配置
   ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
   ENV PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"

   WORKDIR /app
   COPY package*.json ./

   # 使用--no-optional参数安装依赖，跳过canvas
   RUN npm install --no-optional

   COPY . .

   CMD ["node", "your-script.js"]
   ```

> **注意**：轻量级渲染器（`rendererType: 'lightweight'`）已在当前版本中暂时禁用。如果在代码中指定了`rendererType: 'lightweight'`，系统会自动使用浏览器渲染器替代，并输出警告信息。

<!--
> **注意**：如果您使用轻量级渲染器（`rendererType: 'lightweight'`），则仍需安装 canvas 及其系统依赖。在这种情况下，请参考下面的完整安装说明。
-->

#### 1. 在 Dockerfile 中安装必要的系统依赖

**Ubuntu/Debian 系统：**
```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*
```

**Alpine 系统：**
```dockerfile
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    pixman-dev
```

**CentOS/RHEL 系统：**
```dockerfile
RUN yum install -y \
    gcc-c++ \
    cairo-devel \
    pango-devel \
    libjpeg-turbo-devel \
    giflib-devel \
    && yum clean all
```

#### 2. 完整的 Dockerfile 示例

下面是一个完整的 Dockerfile 示例，包含了浏览器依赖：

```dockerfile
FROM node:18-slim

# 安装浏览器依赖
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 设置 Puppeteer 无沙箱模式
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"

WORKDIR /app
COPY package*.json ./

# 安装依赖
RUN npm install

COPY . .

CMD ["node", "your-script.js"]
```

#### 3. 使用轻量级渲染模式

如果不想安装浏览器依赖，可以在代码中使用轻量级渲染模式：

```javascript
const options = {
  rendererType: 'lightweight',
  width: 800
};

const buffer = await convert(markdown, options);
```

#### 4. 故障排除

如果在安装依赖后仍然遇到 canvas 相关错误，可以尝试：

1. **重新安装 canvas**：
   ```bash
   npm uninstall canvas
   npm install canvas --build-from-source
   ```

2. **指定 canvas 版本**：
   ```bash
   npm install canvas@2.11.0
   ```

3. **使用中国镜像安装 canvas**：
   ```bash
   npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas/
   ```

4. **检查 Node.js 版本**：确保 Node.js 版本与 canvas 兼容（推荐 Node.js 18+）

#### 5. 针对轻量级模式的 Dockerfile 示例

如果只使用轻量级渲染模式，可以使用更简单的 Dockerfile：

```dockerfile
FROM node:18-slim

# 仅安装 canvas 依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 确保在代码中使用轻量级渲染模式
# 例如: rendererType: 'lightweight'

CMD ["node", "your-script.js"]
```

在 Docker 容器中运行时，可能需要为 Puppeteer 设置无沙箱模式。以下是两种方式：

1. **设置环境变量：**
   ```
   PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"
   ```

2. **通过代码设置：**
   ```javascript
   const options = {
     // ... 其他选项
     puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox']
   };
   ```

Dockerfile 示例：
```dockerfile
FROM node:18-slim

# 安装 Puppeteer 依赖
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends

# 设置 Puppeteer 无沙箱模式
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 你的应用启动命令
CMD ["node", "your-script.js"]
```

## 使用方法

### 转换 Markdown 字符串

```typescript
import { convert, isBrowserAvailable, getBrowserInstallationGuide } from 'md2png-node';

// 使用默认浏览器渲染模式
const markdown = '# Hello World';
const options = {
  width: 800,
  quality: 90,
  transparent: false,
  cssStyles: `
    body { background-color: #f0f0f0; }
  `,
  checkBrowser: true // 是否检查浏览器依赖，默认为 true
};

// 转换为 Buffer
const buffer = await convert(markdown, { outputFormat: 'buffer' });

// 转换为 Base64
const base64 = await convert(markdown, { outputFormat: 'base64' });

// 使用轻量级渲染模式（无浏览器依赖）
const lightweightOptions = {
  rendererType: 'lightweight',
  width: 800,
  quality: 90,
  transparent: false
};

const lightweightBuffer = await convert(markdown, lightweightOptions);
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
  - `checkBrowser` (boolean): 是否检查浏览器依赖，默认 true
  - `rendererType` ('browser' | 'lightweight'): 渲染器类型，默认 'browser'
    - 'browser': 使用浏览器渲染（高质量，需要浏览器依赖）
    - 'lightweight': 使用轻量级渲染（无浏览器依赖，兼容性较低）
  - `puppeteerArgs` (string[]): Puppeteer 启动参数，适用于 Docker 等特殊环境，例如 ['--no-sandbox', '--disable-setuid-sandbox']

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

### `isBrowserAvailable()`

检查系统上是否有可用的浏览器。

**返回值：**
- boolean: 表示是否有可用的浏览器

### `getBrowserInstallationGuide()`

获取浏览器安装指南。

**返回值：**
- string: 安装指南文本

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

### System Requirements

This tool relies on a browser for rendering Markdown to PNG. Your system needs to have one of the following browsers installed:

- Google Chrome
- Microsoft Edge
- Firefox

If you're using this in a headless server environment, you need to ensure that one of these browsers is installed.

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
  - `checkBrowser` (boolean): Whether to check browser dependency, default true
  - `rendererType` ('browser' | 'lightweight'): 渲染器类型，默认 'browser'
    - 'browser': 使用浏览器渲染（高质量，需要浏览器依赖）
    - 'lightweight': 使用轻量级渲染（无浏览器依赖，兼容性较低）
  - `puppeteerArgs` (string[]): Puppeteer 启动参数，适用于 Docker 等特殊环境，例如 ['--no-sandbox', '--disable-setuid-sandbox']

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

### `isBrowserAvailable()`

Checks if there is a browser available on the system.

**Returns:**

- boolean: Indicates whether a browser is available

### `getBrowserInstallationGuide()`

Gets the browser installation guide.

**Returns:**

- string: Installation guide text

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

### 系统要求

本工具依赖于浏览器进行Markdown到PNG的渲染。您的系统需要安装以下浏览器之一：

- Google Chrome
- Microsoft Edge
- Firefox

如果您在无头服务器环境中使用，需要确保安装了上述浏览器之一。

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

## 常见问题

### 为什么会出现"未检测到可用的浏览器"错误？

`md2png-node` 使用 Puppeteer 和浏览器将 Markdown 渲染为 PNG 图像。您需要在系统上安装 Chrome、Edge 或 Firefox 浏览器之一。

各平台安装浏览器的方法：

**Windows:**
- 从官方网站下载并安装 [Chrome](https://www.google.com/chrome/)、[Edge](https://www.microsoft.com/edge) 或 [Firefox](https://www.mozilla.org/firefox/)

**macOS:**
- 从官方网站下载并安装 [Chrome](https://www.google.com/chrome/)、[Edge](https://www.microsoft.com/edge) 或 [Firefox](https://www.mozilla.org/firefox/)
- 或使用 Homebrew: `brew install --cask google-chrome`

**Linux:**
- Debian/Ubuntu: `sudo apt install chromium-browser`
- Fedora: `sudo dnf install chromium`
- Arch Linux: `sudo pacman -S chromium`

## 渲染模式对比

本工具提供两种渲染模式，可以根据不同场景选择合适的模式：

### 浏览器渲染模式（默认）

- **优点**：
  - 高质量渲染，支持完整的CSS样式
  - 完美支持所有Markdown语法和特性
  - 复杂表格和嵌套元素渲染效果好
  - 支持自定义CSS样式

- **缺点**：
  - 需要安装浏览器
  - 资源消耗较大
  - 在无头服务器环境部署复杂

- **适用场景**：
  - 需要高质量渲染效果
  - 本地开发环境
  - 有较高的渲染质量要求

### 轻量级渲染模式

> **注意**: 轻量级渲染模式已在当前版本中暂时禁用，将在后续版本中重新加入。以下是该功能的预览介绍。

<!--
- **优点**：
  - 无浏览器依赖，纯Node.js实现
  - 资源消耗小，部署简单
  - 适合服务器和容器环境

- **缺点**：
  - 渲染质量略逊于浏览器模式
  - 复杂布局可能有差异
  - 部分高级CSS特性支持有限

- **适用场景**：
  - 服务器和容器环境
  - 简单Markdown内容渲染
  - 需要最小化依赖

使用方法：

```typescript
// 轻量级模式
const options = {
  rendererType: 'lightweight',
  width: 800
};

// 浏览器模式(默认)
const options = {
  rendererType: 'browser',
  width: 800
};

const buffer = await convert(markdown, options);
```
-->

使用方法：

```typescript
// 轻量级模式
const options = {
  rendererType: 'lightweight',
  width: 800
};

// 浏览器模式(默认)
const options = {
  rendererType: 'browser',
  width: 800
};

const buffer = await convert(markdown, options);
```

# Markdown to PNG Converter

A Node.js solution to convert Markdown files to PNG images with support for all standard Markdown syntax, embedded images, and tables.

## Features

- ✅ Supports all standard Markdown syntax (headers, lists, code blocks, etc.)
- ✅ Handles embedded images in Markdown
- ✅ Properly renders Markdown tables
- ✅ Optimized for performance and image quality
- ✅ Supports base64 output format
- ✅ Customizable styling and rendering options

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
  outputFormat: 'base64', // 'buffer', 'base64'
  width: 800,             // Width of the output image
  height: null,           // Height (null for auto)
  quality: 90,            // Image quality (1-100)
  transparent: false,     // Transparent background
  cssStyles: customCss,   // Custom CSS styles
  markdownItOptions: {    // Options for markdown-it
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
2. **HTML to PNG**: Uses [node-html-to-image](https://github.com/frinyvonnick/node-html-to-image) (which uses Puppeteer) to render the HTML into a high-quality PNG image

## Performance Considerations

- For better performance with large files, consider:
  - Adjusting image quality (lower quality = faster rendering)
  - Using a smaller width
  - Implementing caching for frequently rendered content

## License

MIT

/**
 * Example usage of markdown-to-png converter
 */

const path = require('path');
const fs = require('fs').promises;
const markdownToPng = require('../src/index');

// Example markdown content with various elements
const markdownContent = `
# Markdown to PNG Converter

This is an example of converting **Markdown** to *PNG* images.

## Features

- Supports all standard Markdown syntax
- Handles embedded images
- Renders tables properly
- Optimized for performance and image quality

## Code Example

\`\`\`javascript
const markdownToPng = require('markdown-to-png');
const result = await markdownToPng.convert('# Hello World');
console.log(result);
\`\`\`

## Table Example

| Feature | Support |
|---------|---------|
| Headers | ✅ |
| Lists | ✅ |
| Code blocks | ✅ |
| Tables | ✅ |
| Images | ✅ |

## Image Example

![Example Image](https://via.placeholder.com/300x200)
`;

// Example usage
async function runExample() {
  try {
    console.log('Converting markdown to PNG...');
    
    // Create example directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Example 1: Convert markdown string to PNG file
    const outputPath = path.join(outputDir, 'example.png');
    await markdownToPng.convert(markdownContent, {
      outputFormat: 'buffer',
      width: 800
    }).then(buffer => fs.writeFile(outputPath, buffer));
    console.log(`PNG file saved to: ${outputPath}`);
    
    // Example 2: Convert markdown string to base64
    const base64Result = await markdownToPng.convert(markdownContent, {
      outputFormat: 'base64',
      width: 800
    });
    console.log('Base64 PNG generated (first 100 chars):');
    console.log(base64Result.substring(0, 100) + '...');
    
    // Save example markdown to file for reference
    const markdownPath = path.join(outputDir, 'example.md');
    await fs.writeFile(markdownPath, markdownContent);
    console.log(`Markdown file saved to: ${markdownPath}`);
    
    console.log('Examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run the example
runExample();

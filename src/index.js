/**
 * Markdown to PNG Converter
 * A Node.js solution to convert Markdown files to PNG images
 */

const markdownParser = require('./services/markdown-parser');
const htmlRenderer = require('./services/html-renderer');
const { readFile, writeFile } = require('./utils/file-utils');

/**
 * Convert markdown string to PNG
 * @param {string} markdown - Markdown content to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<string|Buffer>} - PNG as base64 string, buffer, or file path
 */
async function convert(markdown, options = {}) {
  try {
    // Parse markdown to HTML
    const html = markdownParser.parse(markdown, options);
    
    // Render HTML to PNG
    const result = await htmlRenderer.render(html, options);
    
    return result;
  } catch (error) {
    console.error('Error converting markdown to PNG:', error);
    throw error;
  }
}

/**
 * Convert markdown file to PNG
 * @param {string} inputPath - Path to markdown file
 * @param {string} outputPath - Path to save PNG file
 * @param {Object} options - Conversion options
 * @returns {Promise<string>} - Path to the generated PNG file
 */
async function convertFile(inputPath, outputPath, options = {}) {
  try {
    // Read markdown file
    const markdown = await readFile(inputPath);
    
    // Convert to PNG
    const result = await convert(markdown, { 
      ...options, 
      outputFormat: 'buffer' 
    });
    
    // Write PNG file
    await writeFile(outputPath, result);
    
    return outputPath;
  } catch (error) {
    console.error(`Error converting file ${inputPath} to PNG:`, error);
    throw error;
  }
}

module.exports = {
  convert,
  convertFile
};

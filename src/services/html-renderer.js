/**
 * HTML Renderer Service
 * Converts HTML to PNG using node-html-to-image
 */

const nodeHtmlToImage = require('node-html-to-image');

/**
 * Render HTML to PNG
 * @param {string} html - HTML content to render
 * @param {Object} options - Rendering options
 * @returns {Promise<string|Buffer>} - PNG as base64 string, buffer, or file path
 */
async function render(html, options = {}) {
  try {
    // Default options
    const defaultOptions = {
      outputFormat: 'buffer', // 'buffer', 'base64', or 'file'
      width: options.width || 800,
      height: options.height,
      quality: options.quality || 90,
      transparent: options.transparent || false,
      waitUntil: options.waitUntil || 'networkidle0'
    };

    // Merge options
    const renderOptions = { ...defaultOptions, ...options };

    // Configure node-html-to-image options
    const htmlToImageOptions = {
      html,
      type: 'png',
      puppeteerArgs: {
        defaultViewport: {
          width: renderOptions.width,
          height: renderOptions.height
        },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      quality: renderOptions.quality,
      transparent: renderOptions.transparent,
      waitUntil: renderOptions.waitUntil
    };

    // Render HTML to image
    const output = await nodeHtmlToImage(htmlToImageOptions);

    // Return output based on format
    switch (renderOptions.outputFormat) {
      case 'base64':
        return output.toString('base64');
      case 'buffer':
        return output;
      default:
        return output;
    }
  } catch (error) {
    console.error('Error rendering HTML to PNG:', error);
    throw error;
  }
}

module.exports = {
  render
};

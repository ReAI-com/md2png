/**
 * Markdown Parser Service
 * Converts markdown to HTML using markdown-it
 */

const MarkdownIt = require('markdown-it');

/**
 * 解析 Markdown 为 HTML
 * markdown-it 已内置表格支持，无需额外插件
 * @param {string} markdown - Markdown content to parse
 * @param {Object} options - Parsing options
 * @returns {string} - HTML content
 */
function parse(markdown, options = {}) {
  try {
    // Initialize markdown-it with options
    const md = new MarkdownIt({
      html: options.allowHtml || false,
      xhtmlOut: true,
      breaks: options.breaks || false,
      linkify: options.linkify || true,
      typographer: options.typographer || true,
      ...options.markdownItOptions
    });

    // 表格支持已内置在 markdown-it 中，无需额外插件
    
    // Parse markdown to HTML
    const html = md.render(markdown);

    // Wrap HTML with custom styles if provided
    return wrapWithStyles(html, options.cssStyles);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    throw error;
  }
}

/**
 * Wrap HTML content with styles
 * @param {string} html - HTML content
 * @param {string} customStyles - Custom CSS styles
 * @returns {string} - HTML with styles
 */
function wrapWithStyles(html, customStyles = '') {
  // Default styles for rendering
  const defaultStyles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      padding: 20px;
      margin: 0 auto;
      background-color: white;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1em; }
    h5 { font-size: 0.875em; }
    h6 { font-size: 0.85em; color: #6a737d; }
    
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
    }
    
    code {
      font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
      padding: 0.2em 0.4em;
      font-size: 85%;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
    }
    
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    
    table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    
    img {
      max-width: 100%;
      box-sizing: border-box;
    }
    
    ul, ol {
      padding-left: 2em;
    }
    
    li + li {
      margin-top: 0.25em;
    }
    
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
  `;

  // Combine styles
  const styles = customStyles ? `${defaultStyles}\n${customStyles}` : defaultStyles;

  // Return HTML with styles
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${styles}</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
}

module.exports = {
  parse
};

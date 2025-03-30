/**
 * Unit tests for markdown-parser.js
 */

const markdownParser = require('../../src/services/markdown-parser');

describe('Markdown Parser', () => {
  test('should parse basic markdown to HTML', () => {
    const markdown = '# Hello World';
    const html = markdownParser.parse(markdown);
    
    expect(html).toContain('<h1>Hello World</h1>');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<style>');
  });
  
  test('should parse markdown with formatting', () => {
    const markdown = '**Bold** and *Italic* text';
    const html = markdownParser.parse(markdown);
    
    expect(html).toContain('<strong>Bold</strong>');
    expect(html).toContain('<em>Italic</em>');
  });
  
  test('should parse markdown lists', () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const html = markdownParser.parse(markdown);
    
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
    expect(html).toContain('<li>Item 3</li>');
    expect(html).toContain('</ul>');
  });
  
  test('should parse markdown code blocks', () => {
    const markdown = '```javascript\nconst x = 1;\nconsole.log(x);\n```';
    const html = markdownParser.parse(markdown);
    
    expect(html).toContain('<pre>');
    expect(html).toContain('<code class="language-javascript">');
    expect(html).toContain('const x = 1;');
  });
  
  test('should parse markdown tables', () => {
    const markdown = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
    const html = markdownParser.parse(markdown);
    
    expect(html).toContain('<table>');
    expect(html).toContain('<th>Header 1</th>');
    expect(html).toContain('<th>Header 2</th>');
    expect(html).toContain('<td>Cell 1</td>');
    expect(html).toContain('<td>Cell 2</td>');
    expect(html).toContain('</table>');
  });
  
  test('should parse markdown with images', () => {
    const markdown = '![Alt text](https://example.com/image.png)';
    const html = markdownParser.parse(markdown);
    
    expect(html).toContain('<img src="https://example.com/image.png" alt="Alt text"');
  });
  
  test('should apply custom CSS styles', () => {
    const markdown = '# Hello World';
    const customStyles = 'body { background-color: #f0f0f0; }';
    const html = markdownParser.parse(markdown, { cssStyles: customStyles });
    
    expect(html).toContain('background-color: #f0f0f0;');
  });
});

/**
 * md2png-node 示例
 * 展示浏览器渲染模式和轻量级渲染模式的对比
 */

const fs = require('fs').promises;
const path = require('path');
const { convert, isBrowserAvailable } = require('../dist/index');

// Markdown示例内容
const markdown = `
# md2png-node 渲染模式对比

## 浏览器渲染 vs. 轻量级渲染

这个示例展示了两种渲染模式的对比：

1. **浏览器渲染模式**：使用Puppeteer和真实浏览器渲染
2. **轻量级渲染模式**：使用Canvas和JSDOM直接渲染

### 表格示例

| 特性 | 浏览器渲染 | 轻量级渲染 |
|------|------------|------------|
| 渲染质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 依赖要求 | 需要浏览器 | 无浏览器依赖 |
| 资源消耗 | 较高 | 较低 |
| CSS支持 | 完整支持 | 基本支持 |

### 代码块示例

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> 注意：实际渲染效果可能有所不同
`;

// 输出目录
const outputDir = path.join(__dirname, 'output');

/**
 * 使用不同渲染器渲染Markdown
 */
async function renderWithBothModes() {
  try {
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });

    console.log('开始渲染对比...');

    // 1. 使用浏览器渲染模式（如果可用）
    if (isBrowserAvailable()) {
      console.log('使用浏览器渲染模式...');
      const browserResult = await convert(markdown, {
        rendererType: 'browser',
        width: 800,
        quality: 90
      });

      await fs.writeFile(
        path.join(outputDir, 'browser-render.png'),
        browserResult
      );
      console.log('✅ 浏览器渲染完成: output/browser-render.png');
    } else {
      console.log('❌ 未检测到浏览器，跳过浏览器渲染模式');
    }

    // 2. 使用轻量级渲染模式
    console.log('使用轻量级渲染模式...');
    const lightweightResult = await convert(markdown, {
      rendererType: 'lightweight',
      width: 800,
      quality: 90
    });

    await fs.writeFile(
      path.join(outputDir, 'lightweight-render.png'),
      lightweightResult
    );
    console.log('✅ 轻量级渲染完成: output/lightweight-render.png');

    console.log('\n渲染对比完成！请查看 examples/output 目录下的PNG文件。');
  } catch (error) {
    console.error('渲染过程中出错:', error);
  }
}

// 执行渲染
renderWithBothModes();
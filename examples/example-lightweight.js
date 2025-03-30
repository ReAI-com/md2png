/**
 * 轻量级 Markdown 转 PNG 转换器示例
 * 使用 Sharp 和 html-to-image 实现，无需浏览器依赖
 */

const path = require('path');
const fs = require('fs').promises;
const markdownToPng = require('../src/index');

// 示例 Markdown 内容，包含各种元素
const markdownContent = `
# Markdown to PNG 轻量级转换器

这是一个将 **Markdown** 转换为 *PNG* 图像的示例，使用轻量级渲染器。

## 功能

- 支持所有标准 Markdown 语法
- 处理嵌入式图像
- 正确渲染表格
- 针对性能和图像质量进行优化
- 无需浏览器依赖

## 代码示例

\`\`\`javascript
const markdownToPng = require('markdown-to-png');
const result = await markdownToPng.convert('# Hello World');
console.log(result);
\`\`\`

## 表格示例

| 功能 | 支持 |
|---------|---------|
| 标题 | ✅ |
| 列表 | ✅ |
| 代码块 | ✅ |
| 表格 | ✅ |
| 图像 | ✅ |

## 图像示例

![示例图像](https://via.placeholder.com/300x200)
`;

// 示例用法
async function runExample() {
  try {
    console.log('使用轻量级渲染器将 Markdown 转换为 PNG...');
    
    // 创建示例目录（如果不存在）
    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    // 示例 1：将 Markdown 字符串转换为 PNG 文件（使用轻量级渲染器）
    const outputPath = path.join(outputDir, 'example-lightweight.png');
    await markdownToPng.convert(markdownContent, {
      outputFormat: 'buffer',
      width: 800,
      usePuppeteer: false // 使用轻量级渲染器
    }).then(buffer => fs.writeFile(outputPath, buffer));
    console.log(`PNG 文件已保存到: ${outputPath}`);
    
    // 示例 2：将 Markdown 字符串转换为 base64（使用轻量级渲染器）
    const base64Result = await markdownToPng.convert(markdownContent, {
      outputFormat: 'base64',
      width: 800,
      usePuppeteer: false // 使用轻量级渲染器
    });
    console.log('已生成 Base64 PNG (前 100 个字符):');
    console.log(base64Result.substring(0, 100) + '...');
    
    // 示例 3：将 Markdown 文件转换为 PNG 文件（使用轻量级渲染器）
    const markdownPath = path.join(outputDir, 'example-lightweight.md');
    const pngFilePath = path.join(outputDir, 'example-lightweight-file.png');
    
    // 保存示例 Markdown 到文件
    await fs.writeFile(markdownPath, markdownContent);
    console.log(`Markdown 文件已保存到: ${markdownPath}`);
    
    // 转换文件
    await markdownToPng.convertFile(markdownPath, pngFilePath, {
      usePuppeteer: false // 使用轻量级渲染器
    });
    console.log(`PNG 文件已保存到: ${pngFilePath}`);
    
    console.log('示例成功完成！');
  } catch (error) {
    console.error('运行示例时出错:', error);
  }
}

// 运行示例
runExample();

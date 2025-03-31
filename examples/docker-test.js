const { convert, convertFile, isBrowserAvailable } = require('../dist/index');
const fs = require('fs');
const path = require('path');

// 测试环境
console.log('=============== 系统信息 ===============');
console.log('Node.js 版本:', process.version);
console.log('操作系统:', process.platform);
console.log('Docker 环境:', process.env.DOCKER_ENV ? '是' : '否');
console.log('Puppeteer 路径:', process.env.PUPPETEER_EXECUTABLE_PATH || '未设置');
console.log('Puppeteer 参数:', process.env.PUPPETEER_ARGS || '未设置');
console.log('浏览器可用性:', isBrowserAvailable() ? '可用' : '不可用');
console.log('=======================================\n');

// 处理Puppeteer参数
const puppeteerArgs = process.env.PUPPETEER_ARGS
  ? process.env.PUPPETEER_ARGS.split(',')
  : ['--no-sandbox', '--disable-setuid-sandbox'];

// 测试文件路径
const testMdPath = path.join(__dirname, 'test.md');
const testPngPath = path.join(__dirname, 'output/docker-test.png');

// 确保输出目录存在
const outputDir = path.dirname(testPngPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 直接的Markdown字符串转换测试
async function testDirectConversion() {
  console.log('=============== Markdown字符串转PNG测试 ===============');
  try {
    const markdown = `# 这是一个测试标题

这是一段普通文本内容，用于测试Markdown转PNG功能。

## 子标题

- 列表项1
- 列表项2
- 列表项3

### 代码块

\`\`\`javascript
console.log('Hello, Docker World!');
\`\`\`

> 这是一段引用文本
`;

    console.log('开始直接转换...');

    // 执行转换
    const result = await convert(markdown, {
      checkBrowser: false,
      puppeteerArgs: puppeteerArgs,
      cssStyles: `
        body {
          font-family: 'Noto Sans CJK SC', 'WenQuanYi Zen Hei', sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          background-color: #f8f9fa;
        }
        h1 {
          color: #333;
          border-bottom: 1px solid #eaecef;
          padding-bottom: 0.3em;
        }
      `
    });

    // 保存结果
    const outputPath = path.join(outputDir, 'direct-convert-test.png');
    fs.writeFileSync(outputPath, result);

    console.log(`✅ 直接转换成功，结果保存为: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('❌ 直接转换失败:', error.message);
    return false;
  } finally {
    console.log('=======================================\n');
  }
}

// 文件转换测试
async function testFileConversion() {
  console.log('=============== Markdown文件转PNG测试 ===============');
  try {
    console.log('开始文件转换...');
    // 执行转换
    await convertFile(testMdPath, testPngPath, {
      checkBrowser: false,
      puppeteerArgs: puppeteerArgs,
      cssStyles: `
        body {
          font-family: 'Noto Sans CJK SC', 'WenQuanYi Zen Hei', sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          background-color: #f8f9fa;
        }
        h1 {
          color: #333;
          border-bottom: 1px solid #eaecef;
          padding-bottom: 0.3em;
        }
      `
    });

    console.log(`✅ 文件转换成功，结果保存为: ${testPngPath}`);
    return true;
  } catch (error) {
    console.error('❌ 文件转换失败:', error.message);
    return false;
  } finally {
    console.log('=======================================\n');
  }
}

// 运行测试
async function runTests() {
  try {
    const directTestResult = await testDirectConversion();
    const fileTestResult = await testFileConversion();

    // 总结
    console.log('=============== 测试结果 ===============');
    console.log('浏览器检测:', isBrowserAvailable() ? '✅ 通过' : '❌ 失败');
    console.log('直接转换测试:', directTestResult ? '✅ 通过' : '❌ 失败');
    console.log('文件转换测试:', fileTestResult ? '✅ 通过' : '❌ 失败');
    console.log('=======================================');

    if (!isBrowserAvailable() || !directTestResult || !fileTestResult) {
      console.log('\n测试未全部通过，请检查错误信息。');
      process.exit(1);
    }
  } catch (error) {
    console.error('运行测试时出错:', error);
    process.exit(1);
  }
}

runTests();
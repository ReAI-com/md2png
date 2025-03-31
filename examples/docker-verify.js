const { isBrowserAvailable } = require('../dist/index');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 打印系统信息
console.log('=============== 系统信息 ===============');
console.log('Node.js 版本:', process.version);
console.log('操作系统:', process.platform);
console.log('Docker 环境:', process.env.DOCKER_ENV || '未设置');
console.log('Puppeteer 路径:', process.env.PUPPETEER_EXECUTABLE_PATH || '未设置');
console.log('=======================================\n');

// 检查浏览器可用性
console.log('=============== 浏览器检测 ===============');
const browserAvailable = isBrowserAvailable();
console.log('浏览器检测结果:', browserAvailable ? '✅ 可用' : '❌ 不可用');

if (!browserAvailable) {
  console.error('浏览器检测失败，尝试手动检查浏览器路径...');

  // 检查常见的浏览器路径
  const commonPaths = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ];

  for (const path of commonPaths) {
    try {
      if (fs.existsSync(path)) {
        console.log(`✅ 找到浏览器路径: ${path}`);
      }
    } catch (err) {
      console.error(`检查路径 ${path} 时出错:`, err.message);
    }
  }
}
console.log('=======================================\n');

// 创建测试目录
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 运行完整的Puppeteer测试
async function runPuppeteerTest() {
  console.log('=============== Puppeteer 测试 ===============');
  console.log('启动浏览器...');

  const puppeteerArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ];

  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: puppeteerArgs,
      headless: 'new'
    });

    console.log('✅ 浏览器启动成功');
    console.log('浏览器版本:', await browser.version());

    console.log('打开页面...');
    const page = await browser.newPage();
    await page.setContent('<html><body><h1>测试成功</h1><p>如果你看到这个截图，说明Puppeteer工作正常</p></body></html>');

    console.log('截图页面...');
    const screenshotPath = path.join(outputDir, 'puppeteer-test.png');
    await page.screenshot({ path: screenshotPath });

    console.log(`✅ 截图成功保存至: ${screenshotPath}`);
    await browser.close();
    console.log('浏览器已关闭');
    return true;
  } catch (error) {
    console.error('❌ Puppeteer 测试失败:', error.message);
    return false;
  } finally {
    console.log('=======================================\n');
  }
}

// 运行测试
async function runTests() {
  try {
    // 运行Puppeteer测试
    const puppeteerTestPassed = await runPuppeteerTest();

    // 总结
    console.log('=============== 测试结果 ===============');
    console.log('浏览器检测:', browserAvailable ? '✅ 通过' : '❌ 失败');
    console.log('Puppeteer测试:', puppeteerTestPassed ? '✅ 通过' : '❌ 失败');
    console.log('=======================================');

    if (!browserAvailable || !puppeteerTestPassed) {
      console.log('\n需要解决的问题:');
      if (!browserAvailable) {
        console.log('1. 浏览器检测失败 - 请确保浏览器已正确安装并可以通过环境变量访问');
      }
      if (!puppeteerTestPassed) {
        console.log('2. Puppeteer测试失败 - 请检查错误信息并确保环境配置正确');
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('运行测试时出错:', error);
    process.exit(1);
  }
}

runTests();
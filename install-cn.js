#!/usr/bin/env node

/**
 * 中国区自动配置镜像脚本
 * 用于解决中国区安装依赖时的网络问题
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始配置中国区镜像...');

// 配置 npm 临时使用淘宝镜像
process.env.npm_config_registry = 'https://registry.npmmirror.com';

// 配置二进制依赖镜像
process.env.PUPPETEER_DOWNLOAD_HOST = 'https://npmmirror.com/mirrors/';
process.env.ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/';
process.env.SASS_BINARY_SITE = 'https://npmmirror.com/mirrors/node-sass/';
process.env.CHROMEDRIVER_CDNURL = 'https://npmmirror.com/mirrors/chromedriver/';

try {
  // 创建 .npmrc 文件
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const npmrcContent = `registry=https://registry.npmmirror.com/
puppeteer:registry=https://registry.npmmirror.com/
canvas:registry=https://registry.npmmirror.com/
node-sass:registry=https://registry.npmmirror.com/
electron:registry=https://registry.npmmirror.com/
chromedriver:registry=https://registry.npmmirror.com/

# 二进制文件镜像
PUPPETEER_DOWNLOAD_HOST=https://npmmirror.com/mirrors/
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
SASS_BINARY_SITE=https://npmmirror.com/mirrors/node-sass/
CHROMEDRIVER_CDNURL=https://npmmirror.com/mirrors/chromedriver/
`;

  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('已创建 .npmrc 文件');

  // 安装依赖
  console.log('开始安装依赖...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n安装完成！');
  console.log('现在可以正常使用 md2png-node 了！');
} catch (error) {
  console.error('安装过程中出现错误:', error.message);
  process.exit(1);
}
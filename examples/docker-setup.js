#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('===============================================');
console.log('MD2PNG - Docker 环境配置助手');
console.log('===============================================');
console.log('此脚本将帮助您配置Docker环境以运行Markdown转PNG功能。');
console.log('');

// 检测Docker是否安装
function checkDocker() {
  try {
    const output = execSync('docker --version', { encoding: 'utf8' });
    console.log('✅ 检测到Docker:', output.trim());
    return true;
  } catch (error) {
    console.error('❌ Docker未安装或不可用。请先安装Docker。');
    console.error('   https://docs.docker.com/get-docker/');
    return false;
  }
}

// 检测Docker Compose是否安装
function checkDockerCompose() {
  try {
    const output = execSync('docker compose version || docker-compose --version', { encoding: 'utf8' });
    console.log('✅ 检测到Docker Compose:', output.trim().split('\n')[0]);
    return true;
  } catch (error) {
    console.error('❌ Docker Compose未安装或不可用。建议安装Docker Compose。');
    console.error('   https://docs.docker.com/compose/install/');
    return false;
  }
}

// 生成Docker环境文件
function generateDockerComposeFile(options) {
  const { useAlpine, buildSource } = options;

  const baseImage = useAlpine ? 'node:18-alpine' : 'node:18-slim';
  const browserPackage = useAlpine ? 'chromium' : 'google-chrome-stable';
  const browserPath = useAlpine ? '/usr/bin/chromium-browser' : '/usr/bin/google-chrome-stable';

  const installCmd = useAlpine
    ? `RUN apk add --no-cache \\\n    chromium \\\n    nss \\\n    freetype \\\n    harfbuzz \\\n    ca-certificates \\\n    ttf-freefont \\\n    font-noto-cjk`
    : `RUN apt-get update && apt-get install -y \\\n    wget \\\n    gnupg \\\n    ca-certificates \\\n    fonts-liberation \\\n    libasound2 \\\n    libatk-bridge2.0-0 \\\n    libatk1.0-0 \\\n    libcups2 \\\n    libdbus-1-3 \\\n    libgbm1 \\\n    libgtk-3-0 \\\n    libnspr4 \\\n    libnss3 \\\n    fonts-noto-cjk \\\n    && apt-get clean \\\n    && rm -rf /var/lib/apt/lists/* \\\n    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \\\n    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \\\n    && apt-get update \\\n    && apt-get install -y google-chrome-stable \\\n    && apt-get clean \\\n    && rm -rf /var/lib/apt/lists/*`;

  const dockerfile = `FROM ${baseImage}

WORKDIR /app

# 安装浏览器及依赖
${installCmd}

# 设置Puppeteer环境变量
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \\
    PUPPETEER_EXECUTABLE_PATH=${browserPath} \\
    DOCKER_ENV=true

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install --production --ignore-scripts

# 复制源代码
${buildSource ? 'COPY . .\n\n# 构建项目\nRUN npm run build' : 'COPY dist/ ./dist/\nCOPY examples/ ./examples/'}

# 设置权限
RUN chmod 777 ${browserPath} && \\
    mkdir -p /app/examples/output && \\
    chown -R node:node /app/examples/output

# 切换到非root用户
USER node

# 设置默认命令
CMD ["node", "examples/docker-test.js"]
`;

  const dockerComposeFile = `services:
  md2png:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./examples:/app/examples
    environment:
      - DOCKER_ENV=true
      - PUPPETEER_EXECUTABLE_PATH=${browserPath}
      - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage
    user: node
`;

  try {
    fs.writeFileSync('Dockerfile', dockerfile);
    console.log('✅ 已生成 Dockerfile');

    fs.writeFileSync('docker-compose.yaml', dockerComposeFile);
    console.log('✅ 已生成 docker-compose.yaml');

    return true;
  } catch (error) {
    console.error('❌ 生成Docker配置文件失败:', error.message);
    return false;
  }
}

// 主流程
async function main() {
  const dockerInstalled = checkDocker();
  const dockerComposeInstalled = checkDockerCompose();

  if (!dockerInstalled) {
    console.log('\n请安装Docker后再运行此脚本。');
    rl.close();
    return;
  }

  console.log('\n选择Docker配置选项:');

  const useAlpine = await new Promise(resolve => {
    rl.question('使用Alpine镜像(轻量级)还是Debian镜像(完整功能)? [alpine/debian] (默认: alpine): ', (answer) => {
      const normalizedAnswer = answer.trim().toLowerCase();
      return resolve(normalizedAnswer !== 'debian');
    });
  });

  const buildSource = await new Promise(resolve => {
    rl.question('在Docker中构建源代码还是使用预构建的文件? [build/prebuild] (默认: prebuild): ', (answer) => {
      const normalizedAnswer = answer.trim().toLowerCase();
      return resolve(normalizedAnswer === 'build');
    });
  });

  console.log('\n即将使用以下配置:');
  console.log(`- 基础镜像: ${useAlpine ? 'Alpine (轻量级)' : 'Debian (完整功能)'}`);
  console.log(`- 构建方式: ${buildSource ? '在Docker中构建源代码' : '使用预构建的文件'}`);

  const confirm = await new Promise(resolve => {
    rl.question('\n确认创建这些文件? [y/n] (默认: y): ', (answer) => {
      const normalizedAnswer = answer.trim().toLowerCase();
      return resolve(normalizedAnswer !== 'n');
    });
  });

  if (confirm) {
    generateDockerComposeFile({ useAlpine, buildSource });

    console.log('\n配置完成! 您可以通过以下命令运行:');
    console.log('$ docker compose build');
    console.log('$ docker compose up');

    if (!dockerComposeInstalled) {
      console.log('\n注意: 未检测到Docker Compose，您也可以使用以下命令:');
      console.log('$ docker build -t md2png .');
      console.log('$ docker run -v ./examples:/app/examples md2png');
    }
  } else {
    console.log('\n已取消配置。');
  }

  rl.close();
}

main();
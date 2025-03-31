# MD2PNG Docker 快速入门指南

本指南提供最简单直接的Docker配置方法，让您或AI助手能快速在Docker环境中设置并使用md2png工具。

## 核心要点

1. **以非root用户运行（必须）**
2. **设置正确的环境变量**
3. **安装必要的浏览器和依赖**

## 最简单的使用方法

### 方法一：使用预构建的Dockerfile（推荐）

```bash
# 克隆仓库
git clone https://github.com/your-username/md2png.git
cd md2png

# 构建Alpine版本（轻量级，推荐）
docker build -f Dockerfile.alpine -t md2png-alpine .

# 使用非root用户运行
docker run --user node -v $(pwd)/examples:/app/examples md2png-alpine node examples/docker-test.js
```

### 方法二：集成到已有项目

将以下Dockerfile内容添加到您的项目中：

```dockerfile
# 使用Alpine基础镜像（轻量级）
FROM node:18-alpine

# 安装必要的浏览器和依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk

# 设置关键环境变量
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    DOCKER_ENV=true

# 安装md2png
RUN npm install md2png-node --production

# 添加您的代码和资源
COPY . .

# 设置权限并切换用户
RUN mkdir -p /app/output && \
    chmod 777 /usr/bin/chromium-browser && \
    chown -R node:node /app/output

# 切换到非root用户（必须）
USER node

# 您的启动命令
CMD ["node", "your-script.js"]
```

## 使用代码示例

在您的Node.js代码中这样使用:

```javascript
const { convert } = require('md2png-node');

async function convertMarkdown() {
  const markdown = `# Hello Docker World

This is a test with:
- List items
- And **formatting**`;

  const options = {
    // 在Docker中，这些参数是必须的
    puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    // 关闭浏览器检测（我们已在环境变量中设置）
    checkBrowser: false
  };

  try {
    const result = await convert(markdown, options);
    // 处理结果...
    console.log('转换成功!');
  } catch (error) {
    console.error('转换失败:', error);
  }
}

convertMarkdown();
```

## 故障排除清单

如果遇到问题，请检查:

1. **确认以非root用户运行**:
   ```bash
   docker run --user node ...
   ```

2. **验证浏览器可用**:
   ```bash
   docker exec -it <container_id> /bin/sh
   $ /usr/bin/chromium-browser --headless --version
   ```

3. **检查环境变量**:
   ```
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   DOCKER_ENV=true
   ```

4. **确保传递了正确的puppeteerArgs**:
   ```javascript
   puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
   ```

5. **如转换中文内容，确认已安装字体**:
   ```
   font-noto-cjk (Alpine) 或 fonts-noto-cjk (Debian)
   ```

更详细的信息请参考完整的[DOCKER.md](./DOCKER.md)文档。
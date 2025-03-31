# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 设置npm registry
RUN npm config set registry https://registry.npmjs.org/

# 安装TypeScript
RUN npm install -g typescript

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制源代码和 TypeScript 配置
COPY tsconfig.json .
COPY src ./src

# 运行编译
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 安装 Chromium 浏览器及其依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    # 添加中文字体支持
    font-noto-cjk \
    # 添加emoji字体支持
    font-noto-emoji

# 设置Puppeteer使用已安装的Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    DOCKER_ENV=true

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 设置npm registry
RUN npm config set registry https://registry.npmjs.org/

# 跳过prepare脚本，只安装生产依赖
RUN npm install --only=production --ignore-scripts

# 从构建阶段复制编译后的文件
COPY --from=builder /app/dist ./dist
COPY examples ./examples

# 设置默认命令
CMD ["node", "examples/docker-test.js"]
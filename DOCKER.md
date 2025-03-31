# MD2PNG Docker 使用指南

本文档提供在 Docker 环境中使用 MD2PNG 的完整指南，适用于不同操作系统和环境。

## 目录

- [为什么使用 Docker](#为什么使用-docker)
- [前提条件](#前提条件)
- [快速开始](#快速开始)
- [环境选择](#环境选择)
  - [Alpine 环境 (推荐)](#alpine-环境-推荐)
  - [Debian/Ubuntu 环境](#debianubuntu-环境)
- [排障指南](#排障指南)
- [自定义配置](#自定义配置)
- [常见问题](#常见问题)

## 为什么使用 Docker

使用 Docker 运行 MD2PNG 有以下优势：

- **一致的环境**：无需担心不同系统间的依赖差异
- **隔离的运行环境**：不会影响宿主系统
- **简化的依赖管理**：无需手动安装浏览器和其他依赖
- **容易部署**：可以在任何支持 Docker 的环境中运行

## 前提条件

- [Docker](https://docs.docker.com/get-docker/) 已安装
- [Docker Compose](https://docs.docker.com/compose/install/) (可选，但推荐)

## 快速开始

我们提供了一个自动配置脚本，帮助您快速设置 Docker 环境：

```bash
# 先构建项目
npm run build

# 运行 Docker 配置助手
node examples/docker-setup.js

# 按照提示进行选择
```

脚本会自动创建适合您需求的 `Dockerfile` 和 `docker-compose.yaml` 文件。

如果您不想使用交互式脚本，可以直接使用我们提供的预置配置：

```bash
# 使用 Alpine 环境
docker build -f Dockerfile.alpine -t md2png .
docker run -v ./examples:/app/examples md2png

# 或者使用 Docker Compose
docker compose -f docker-compose.yaml up alpine
```

## 环境选择

### Alpine 环境 (推荐)

Alpine 环境基于 Alpine Linux，特点是轻量级、占用资源少。适合大多数常规使用场景。

```dockerfile
FROM node:18-alpine

# ... (详见 Dockerfile.alpine)
```

### Debian/Ubuntu 环境

Debian 环境基于 Debian Linux，提供更完整的依赖支持，适合需要更高兼容性的场景。

```dockerfile
FROM node:18-slim

# ... (详见 Dockerfile.debian)
```

## 排障指南

如果您在 Docker 环境中遇到问题，请尝试以下步骤：

### 以非 root 用户运行

Chromium/Chrome 默认不允许以 root 用户运行。有两种解决方案：

1. **推荐方式：以非 root 用户运行容器**（推荐且更安全）：

```bash
# 使用 node 用户运行容器
docker run --user node -v ./examples:/app/examples md2png

# 或者在 docker-compose.yml 中设置
services:
  md2png:
    # ... 其他配置
    user: node
```

2. **使用 --no-sandbox 参数**（不推荐，但有时必要）：

```bash
# 在环境变量中设置
environment:
  - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox
```

### 浏览器无法启动

1. 确保设置了正确的环境变量：

```yaml
environment:
  - PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser  # Alpine
  # 或
  - PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable  # Debian/Ubuntu
  - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage
```

2. 验证浏览器是否已正确安装：

```bash
# 进入容器
docker exec -it <container_id> /bin/sh

# 检查浏览器可执行文件是否存在
ls -la /usr/bin/chromium-browser  # Alpine
# 或
ls -la /usr/bin/google-chrome-stable  # Debian/Ubuntu

# 尝试启动浏览器
/usr/bin/chromium-browser --version --headless  # Alpine
# 或
/usr/bin/google-chrome-stable --version --headless  # Debian/Ubuntu
```

### 内存或资源问题

Docker 容器默认可能限制资源使用。如果遇到内存不足等问题，可以增加容器资源限制：

```yaml
services:
  md2png:
    # ... 其他配置
    deploy:
      resources:
        limits:
          memory: 2GB
```

### 中文字体问题

确保已安装对应的字体包：

- Alpine: `font-noto-cjk`
- Debian/Ubuntu: `fonts-noto-cjk`

## 自定义配置

### 自定义浏览器参数

您可以通过环境变量配置 Puppeteer 的启动参数：

```yaml
environment:
  - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-gpu,--window-size=1920,1080
```

### 使用自定义字体

如果需要特定字体，可以在 Dockerfile 中添加：

```dockerfile
# Alpine
RUN apk add --no-cache font-noto-cjk ttf-dejavu ttf-liberation

# Debian/Ubuntu
RUN apt-get update && apt-get install -y fonts-noto-cjk fonts-liberation
```

## 常见问题

### Q: 为什么需要 `--no-sandbox` 参数？

A: 在 Docker 容器中，Chrome 默认的沙盒模式可能无法正常工作，需要禁用沙盒以确保浏览器能正常启动。这在容器环境中是常见和安全的做法。

### Q: 如何在 CI/CD 环境中使用？

A: 在 CI/CD 环境中使用时，建议：
1. 使用 Alpine 版本减少构建时间
2. 预先构建应用，避免在容器中编译
3. 设置适当的资源限制

示例 CI 配置 (GitHub Actions):

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and test with Docker
        run: |
          docker build -f Dockerfile.alpine -t md2png .
          docker run md2png node examples/docker-verify.js
```
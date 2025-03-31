# 变更日志 (CHANGELOG)

所有重要的版本变更将记录在此文件中。

## [1.1.3] - 2025-04-01

### 新增
- 优化Emoji表情符号支持，特别是在Docker环境中
- 添加`font-noto-emoji`和`fonts-noto-color-emoji`字体安装到Docker配置
- 新增EMOJI.md文档，提供Emoji支持的详细说明

### 改进
- 字体堆栈优化，优先使用Apple系统字体，提升渲染质量
- HTML模板中添加@font-face声明，更好地支持Apple Color Emoji字体
- 优化浏览器渲染器中的字体配置，提升跨平台兼容性

### 文档
- 更新README.md，添加Emoji支持信息
- 更新DOCKER.md和DOCKER-QUICKSTART.md，添加字体安装指南

## [1.1.2] - 2024-03-30

### 新增
- 支持Docker环境变量自动配置
- 增加浏览器检测功能

### 改进
- 优化Docker容器中的性能
- 改进错误处理机制

### 修复
- 修复中文字体渲染问题

## [1.1.0] - 2024-03-25

### 新增
- 首次添加Docker支持
- 添加中文文档支持

### 改进
- 全面支持TypeScript
- 优化渲染性能

## [1.0.0] - 2024-03-15

### 首次发布
- 支持将Markdown转换为PNG图像
- 支持自定义CSS样式
- 支持透明背景
- 支持自定义图片质量
- 支持输出为Buffer或Base64
# Emoji 支持指南

md2png-node 现在支持在转换过程中正确渲染 emoji 表情符号，包括在 Docker 环境中。本文档提供了设置和使用 emoji 的详细指南。

## 默认支持

从最新版本开始，md2png-node 默认配置已优化以支持常见 emoji，使用以下字体堆栈：
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
           'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans',
           sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
           'Segoe UI Symbol', 'Noto Color Emoji';
```

## Docker 环境配置

在 Docker 环境中要正确显示 emoji，需要安装适当的字体包：

### Alpine 容器
```dockerfile
RUN apk add --no-cache \
    # 其他依赖
    font-noto-emoji
```

### Debian/Ubuntu 容器
```dockerfile
RUN apt-get update && apt-get install -y \
    # 其他依赖
    fonts-noto-color-emoji
```

所有提供的 Dockerfile （`Dockerfile.alpine` 和 `Dockerfile.debian`）已更新以包含这些字体包。

## 自定义 emoji 样式

如果需要自定义 emoji 的显示方式，可以在转换选项中提供自定义 CSS：

```javascript
await convert(markdown, {
  cssStyles: `
    /* 定制 emoji 大小 */
    .emoji {
      font-size: 1.2em;
    }

    /* 为特定元素中的 emoji 设置样式 */
    h1 .emoji {
      color: #ff5722;
    }
  `
});
```

## 常见问题

### Q: 转换后的 PNG 中 emoji 显示为方框或问号

**可能的原因**：
1. Docker 容器中缺少合适的 emoji 字体
2. 使用了不支持彩色 emoji 的字体

**解决方案**：
- 确保安装了 `font-noto-emoji`（Alpine）或 `fonts-noto-color-emoji`（Debian/Ubuntu）
- 在自定义 CSS 中使用 `'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'` 字体

### Q: 国旗表情不正确显示

**解决方案**：
- 某些国旗 emoji 需要特定的 Unicode 支持
- 尝试使用最新版本的 Noto Color Emoji 字体

## 测试 emoji 支持

您可以使用提供的测试工具检查 emoji 支持：

```bash
# 测试当前环境中的 emoji 支持
node examples/emoji-test.js

# 在 Docker 中测试
docker build -f Dockerfile.alpine -t md2png-emoji-test .
docker run --user node -v $(pwd)/examples:/app/examples md2png-emoji-test node examples/emoji-test.js
```

## 字体资源

- [Noto Emoji](https://github.com/googlefonts/noto-emoji) - Google 的开源 emoji 字体
- [Noto Fonts](https://www.google.com/get/noto/) - 支持多种语言的字体家族
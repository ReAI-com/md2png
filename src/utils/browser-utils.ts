import { execSync } from 'child_process';
import * as os from 'os';

/**
 * 检查系统上是否有可用的浏览器
 * @returns {boolean} 是否有可用的浏览器
 */
export function isBrowserAvailable(): boolean {
  try {
    const platform = os.platform();

    // 根据不同操作系统执行不同的检查命令
    if (platform === 'darwin') {
      // macOS
      try {
        execSync('ls /Applications/Google\\ Chrome.app || ls /Applications/Microsoft\\ Edge.app || ls /Applications/Firefox.app', { stdio: 'pipe' });
        return true;
      } catch (e) {
        return false;
      }
    } else if (platform === 'win32') {
      // Windows
      try {
        execSync('where chrome || where msedge || where firefox', { stdio: 'pipe' });
        return true;
      } catch (e) {
        return false;
      }
    } else if (platform === 'linux') {
      // Linux
      try {
        execSync('which google-chrome || which chromium-browser || which firefox', { stdio: 'pipe' });
        return true;
      } catch (e) {
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error('检查浏览器可用性时出错:', error);
    return false;
  }
}

/**
 * 获取浏览器安装指导
 * @returns {string} 安装指导文本
 */
export function getBrowserInstallationGuide(): string {
  const platform = os.platform();

  if (platform === 'darwin') {
    return '请安装 Google Chrome、Microsoft Edge 或 Firefox 浏览器。您可以从以下网址下载：\n' +
           '- Chrome: https://www.google.com/chrome/\n' +
           '- Edge: https://www.microsoft.com/edge\n' +
           '- Firefox: https://www.mozilla.org/firefox/';
  } else if (platform === 'win32') {
    return '请安装 Google Chrome、Microsoft Edge 或 Firefox 浏览器。您可以从以下网址下载：\n' +
           '- Chrome: https://www.google.com/chrome/\n' +
           '- Edge: https://www.microsoft.com/edge\n' +
           '- Firefox: https://www.mozilla.org/firefox/';
  } else if (platform === 'linux') {
    return '请使用您的包管理器安装 Chrome、Chromium 或 Firefox 浏览器，例如：\n' +
           '- Debian/Ubuntu: sudo apt install chromium-browser\n' +
           '- Fedora: sudo dnf install chromium\n' +
           '- Arch Linux: sudo pacman -S chromium';
  }

  return '请安装 Google Chrome、Chromium 或 Firefox 浏览器以使用此工具。';
}
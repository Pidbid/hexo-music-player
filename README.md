# Hexo Music Player

[![npm version](https://img.shields.io/npm/v/hexo-music-player.svg?style=flat-square)](https://www.npmjs.com/package/hexo-music-player)
[![license](https://img.shields.io/npm/l/hexo-music-player.svg?style=flat-square)](LICENSE)

一款为 [Hexo](https://hexo.io/) 博客设计的优雅、轻量级的音乐播放器插件。支持从音乐平台ID智能解析，也支持使用直接的URL，只需一行简单的标签，即可在您的文章中嵌入一个漂亮的响应式播放器。

An elegant and lightweight music player plugin for the Hexo blog framework. Intelligently parses music IDs from platforms like NetEase, supports direct URLs, and embeds a beautiful, responsive player in your posts with a simple tag.

---

### ✨ 效果截图 (Screenshot)

![Hexo Music Player 效果演示](https://raw.githubusercontent.com/Pidbid/hexo-music-player/main/imgs/demo.png "播放器效果图")

### 🚀 特性 (Features)

* **两种模式**: 支持 `平台:ID` 智能解析和 `URL` 直接嵌入两种方式。
* **平台支持**: 已支持网易云音乐，并计划支持更多平台。
* **极简设计**: 苹果风格的现代化简约界面，完美融入您的博客。
* **响应式**: 在桌面和移动设备上均有良好显示效果。
* **轻量级**: 无需引入庞大的第三方库，只包含核心功能的 JS 和 CSS。
* **开箱即用**: 安装即用，无需繁琐配置。

### 📦 安装 (Installation)

通过 npm/pnpm 安装，一行命令即可：

```bash
npm install hexo-music-player --save  
or
pnpm add hexo-music-player --save  
```

### 🎶 使用方法 (Usage)

本插件提供两种灵活的使用方式：

#### 方式一：通过平台ID (推荐)

这是最简单的方式。只需提供平台名称和歌曲ID，插件会自动为您获取歌曲信息。

**语法:**
```
{% music "平台名称:歌曲ID" %}
```

**支持平台:**

| 平台 | 前缀 (`platform`) | 状态 |
| :--- | :--- | :--- |
| 网易云音乐 | `netease` | ✅ 已支持 |
| QQ音乐 | `qq` | 🚧 计划中 |
| 酷狗音乐 | `kugou` | 🚧 计划中 |
| *更多...* | *...* | 🚧 计划中 |

**示例:**
```
{% music "netease:1889043559" %}
```

#### 方式二：通过直接URL

如果您有音乐文件的直接链接，可以使用此方式。**注意：使用此方式时，歌曲链接、名称和艺术家是必需参数。**

**语法:**
```
{% music "歌曲链接" "歌曲名称" "艺术家" "封面链接" %}
```

**示例:**
```
# 提供所有参数
{% music "音乐播放连接，以 http / https 开头" "My Awesome Song" "The Cool Band" "音乐 cover 图片地址" %}
```

### 🤝 贡献 (Contributing)

欢迎各种形式的贡献！如果您有任何bug反馈或功能建议（例如支持新平台），请随时提交 [Issues](https://github.com/Pidbid/hexo-music-player/issues)。

### 📄 许可证 (License)

本项目基于 Apache 许可证。详情请见 [LICENSE](LICENSE) 文件。

© 2025 Pidbid
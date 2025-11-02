# ElectronEgg - 跨平台桌面应用开发框架

[![GitHub stars](https://img.shields.io/github/stars/dromara/electron-egg.svg?style=social&label=Stars)](https://github.com/dromara/electron-egg)
[![Gitee stars](https://gitee.com/dromara/electron-egg/badge/star.svg?theme=gvp)](https://gitee.com/dromara/electron-egg/stargazers)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://gitee.com/dromara/electron-egg/blob/master/LICENSE)
[![Version](https://img.shields.io/badge/version-4.1.0-brightgreen.svg)](package.json)

<div align="center">
  <img src="./public/images/example/logo.png" width="150" height="150" alt="ElectronEgg Logo" />
  <h1>ElectronEgg</h1>
  <p>一个简单易用、跨平台、企业级的桌面软件开发框架</p>
</div>

## 📖 项目简介

ElectronEgg 是基于 Electron 和 Vue 3 构建的现代化桌面应用开发框架。它提供了完整的开发工具链和最佳实践，帮助开发者快速构建高质量的跨平台桌面应用程序。

## ✨ 核心特性

- **🚀 跨平台支持** - 一套代码可打包为 Windows、macOS、Linux 版本，支持国产操作系统（UOS、Deepin、麒麟等）
- **🎯 现代化技术栈** - 基于 Electron 31.x + Vue 3 + Vite 构建，提供优秀的开发体验
- **📦 开箱即用** - 内置完整的项目结构、构建配置和开发工具
- **🔧 模块化架构** - 支持单业务进程/模块化/多任务（进程、线程、渲染进程）架构
- **🛡️ 安全保障** - 支持字节码加密、压缩和混淆加密，保护代码安全
- **📊 企业级功能** - 集成数据库、插件系统、自动更新、打包工具等企业级功能

## 🏗️ 技术架构

```
electron-egg/
├── electron/          # Electron 主进程代码
│   ├── main.js       # 应用入口
│   ├── config/       # 配置文件
│   ├── controller/    # 控制器
│   ├── service/      # 服务层
│   └── preload/      # 预加载脚本
├── frontend/         # 前端代码（Vue 3）
│   ├── src/         # 源码目录
│   ├── package.json  # 前端依赖
│   └── vite.config.js # Vite 配置
├── public/          # 静态资源
└── package.json     # 项目配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
# 安装项目依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 开发模式

```bash
# 启动完整开发环境（前端 + Electron）
npm run dev

# 仅启动前端开发服务器
npm run dev-frontend

# 仅启动 Electron 开发模式
npm run dev-electron
```

### 构建项目

```bash
# 构建完整项目
npm run build

# 仅构建前端
npm run build-frontend

# 仅构建 Electron
npm run build-electron

# 平台特定构建
npm run build-w    # Windows
npm run build-m    # macOS
npm run build-l    # Linux
```

## 📚 核心功能

### 前端技术栈
- **框架**: Vue 3 + Vue Router
- **UI 组件**: Arco Design Vue
- **构建工具**: Vite
- **样式**: Less

### Electron 功能
- **主进程管理**: 基于 ee-core 框架
- **进程通信**: 完善的 IPC 通信机制
- **生命周期**: 完整的应用生命周期管理
- **插件系统**: 可扩展的插件架构

### 数据库支持
- **SQLite**: 集成 better-sqlite3
- **数据管理**: 内置数据库操作工具

### 多媒体处理
- **视频处理**: 集成 fluent-ffmpeg
- **音频处理**: 支持音视频时长获取

## 🎯 应用场景

ElectronEgg 已成功应用于多个行业领域：

- **📊 企业管理软件** - ERP、CRM、OA 系统
- **🏥 医疗健康** - 医疗管理、健康监测
- **🎓 教育培训** - 在线教育、学习工具
- **💼 政务办公** - 政府信息化系统
- **🎮 娱乐游戏** - H5 游戏、娱乐应用
- **📈 金融交易** - 股票交易、金融工具

## 🔧 开发指南

### 项目结构说明

- `electron/main.js` - Electron 应用入口
- `electron/config/` - 配置文件目录
- `electron/controller/` - 业务控制器
- `electron/service/` - 服务层逻辑
- `frontend/src/` - Vue 前端源码
- `public/electron/` - Electron 静态资源

### 添加新功能

1. **添加前端页面**: 在 `frontend/src/` 目录下创建 Vue 组件
2. **添加后端接口**: 在 `electron/controller/` 创建控制器
3. **配置路由**: 更新前端路由配置
4. **进程通信**: 使用 IPC 进行前后端通信

### 自定义配置

修改 `electron/config/` 目录下的配置文件来自定义应用行为。

## 🤝 社区支持

- **官方文档**: [https://www.kaka996.com/](https://www.kaka996.com/)
- **GitHub**: [https://github.com/dromara/electron-egg](https://github.com/dromara/electron-egg)
- **Gitee**: [https://gitee.com/dromara/electron-egg](https://gitee.com/dromara/electron-egg)

## 📄 许可证

本项目基于 Apache 2.0 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为 ElectronEgg 项目做出贡献的开发者！

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐️ 支持一下！</p>
</div>
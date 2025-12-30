# 抖音直播间助手

一个基于 Electron 和 Vue3 开发的抖音直播间助手应用，主要用于活跃直播间气氛。

## 功能特性

- **滚动展示功能**：支持垂直和水平方向的滚动展示
- **多种模式**：
  - 文字滚动模式
  - 下单提示模式
  - 抢购提示模式
- **灵活配置**：可自定义滚动方向、速度、延迟时间等参数
- **多行显示**：支持设置滚动行数（1行、2行、3行）
- **概率控制**：支持按概率随机显示不同内容
- **悬浮窗体**：支持透明背景的悬浮窗体

## 技术栈

- **前端框架**: Vue 3
- **UI 组件库**: Arco Design
- **滑动组件**: Swiper
- **桌面框架**: Electron 31
- **后端框架**: Electron Egg
- **数据库**: better-sqlite3
- **构建工具**: Vite, electron-builder

## 安装与运行

### 环境要求

- Node.js 16+
- npm 或 yarn

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 单独启动前端开发服务器
npm run dev-frontend

# 单独启动 Electron 开发服务器
npm run dev-electron
```

### 构建应用

```bash
# 构建完整应用
npm run build

# 构建前端部分
npm run build-frontend

# 构建 Electron 部分
npm run build-electron

# 构建不同平台的应用
npm run build-w    # Windows 64位
npm run build-m    # macOS Intel
npm run build-m-arm64  # macOS ARM64
npm run build-l    # Linux
```

## 主要功能模块

### 抖音直播间功能

- **滚动方向设置**：支持垂直（向上）和水平（向左）滚动
- **滚动行数设置**：可选择 1 行、2 行或 3 行同时显示
- **滚动速度设置**：可自定义滚动动画速度
- **停顿时间设置**：可自定义每次滚动之间的停顿时长
- **滚动模式**：
  - 文字模式：滚动显示指定文字内容
  - 下单模式：模拟用户下单提示
  - 抢购模式：显示抢购相关信息

### 窗口管理

- 创建和关闭窗口
- 悬浮窗体功能
- 窗口间通信

### 数据存储

- 使用 SQLite 数据库存储配置信息
- 支持配置的保存和加载

## 项目结构

```
.
├── cmd/                    # 构建配置文件
├── electron/              # Electron 主进程代码
│   ├── controller/        # 控制器
│   ├── preload/           # 预加载脚本
│   ├── service/           # 服务层
│   │   └── database/      # 数据库操作
│   └── main.js            # 主进程入口
├── frontend/              # 前端代码
│   ├── src/
│   │   ├── api/           # API 接口定义
│   │   ├── components/    # 组件
│   │   ├── views/         # 页面视图
│   │   │   └── douyin/    # 抖音相关页面
│   │   └── router/        # 路由配置
├── public/                # 公共资源
└── package.json
```

## 使用说明

1. 启动应用后，在主界面配置滚动参数
2. 保存配置后点击"打开窗口"按钮
3. 悬浮窗体会按照配置的参数进行滚动展示

## 配置选项

- 滚动方向：向上/向左
- 滚动行数：1行/2行/3行
- 滚动速度：秒/次
- 停顿时间：秒
- 滚动模式：文字/下单/抢购

## 许可证

Apache License
# AI 海龟汤调查局

## 项目简介
这是一个基于 AI 的海龟汤推理网页游戏。玩家先进入欢迎页，再确认昵称与排行榜门禁，随后在大厅按关卡顺序解锁故事，通过“是 / 否 / 与此无关”的问答方式推理真相。

## 项目结构
```txt
ai-haigui-game/
├─ api/                 # Vercel Serverless API 入口
│  └─ index.js
├─ server/              # 本地开发后端（备用）
│  ├─ index.js
│  ├─ stories.js
│  └─ players.js
├─ src/                 # 前端源码
│  ├─ components/
│  ├─ pages/
│  ├─ data/
│  └─ lib/
├─ public/              # 静态资源（favicon、bgm 等）
├─ vercel.json          # Vercel 路由重写配置
├─ .env                 # 本地环境变量（不要提交）
├─ .env.example         # 环境变量模板
└─ package.json
```

## 本地运行方法
1. 安装依赖：
```bash
npm install
```

2. 启动开发服务：
```bash
npm run dev
```

3. 打开终端输出的 `Local` 地址（例如 `http://localhost:5173`）。

> 如果端口被占用，Vite 会自动切换到下一个可用端口。

## Vercel 部署说明
1. 确保根目录存在 `vercel.json`，并将 `/api/*` 重写到 `/api/index.js`。
2. 将项目连接到 Vercel（Import Git Repository）。
3. 在 Vercel 项目设置中配置环境变量（见下文）。
4. 部署后重点检查：
   - `/api/health`
   - `/api/leaderboard`
   - `/api/player/progress`
   - `/api/judge`

## 环境变量说明
参考 `.env.example`：

```env
VITE_DEEP_SEEK_API_KEY=
VITE_API_PORT=3002
PORT=3002
```

- `VITE_DEEP_SEEK_API_KEY`：DeepSeek API Key（生产环境请在 Vercel 中配置）
- `VITE_API_PORT`：本地前端代理使用的后端端口
- `PORT`：本地后端端口

> 注意：`.env` 已加入 `.gitignore`，不要提交到仓库。

## 当前已完成
- 欢迎页（含过渡动画）
- 门禁页（昵称确认 + 排行榜）
- 游戏大厅（关卡列表、难度页签、顺序解锁）
- 对战页聊天 UI（头像、毛玻璃、动效、打字机效果）
- 结果页与通关记录
- 本地进度存储（localStorage）
- 排行榜接口与持久化（`server/players.json`）
- Vercel API 结构（`api/index.js` + `vercel.json`）

## 当前待补
- 完整 60 关高质量故事替换（当前仅部分为重点优化内容）
- 静态资源补齐（`public/favicon.ico`、`public/audio/bgm.mp3`）
- 多人模式真实联机（当前是原型 UI）
- 错误提示与重试机制进一步优化

## 注意事项
- 新增故事时务必前后端双同步：
  - 前端：`src/data/stories.ts`
  - 后端：`server/stories.js`
- 两边必须核对：
  - `id` 一致
  - `surface` 一致
  - `bottom` 一致
- 不要在前端直接暴露 API Key，统一由后端调用大模型。

## 技术栈
- 前端：React + TypeScript + Vite
- 样式：Tailwind CSS
- 后端：Node.js + Express
- AI：DeepSeek Chat API
- 部署：Vercel

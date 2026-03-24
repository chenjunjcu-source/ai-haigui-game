# AI 海龟汤调查局 — 部署与维护说明

本文档面向项目维护者与运维人员，说明从本地开发到 Vercel 线上部署的完整流程、配置含义、常见问题与安全约束。请与根目录 `README.md`、`TODO.md` 一并保留与更新。

---

## 1. 项目简介

**AI 海龟汤调查局**是一款基于浏览器的海龟汤（情境猜谜）推理游戏。玩家在无剧透前提下，通过与 AI 法官进行「是 / 否 / 与此无关」式问答推进推理；故事与难度分级在档案墙中顺序解锁，并支持本地进度与排行榜同步、从榜单恢复指定侦探进度等能力。

**技术要点：**

- 前端：React 18 + TypeScript + Vite + React Router + Tailwind CSS v4
- 后端（本地或 Vercel Serverless）：Node.js + Express（`api/index.js` 为线上入口）
- 大模型：DeepSeek Chat API（经后端代理，密钥不暴露给浏览器）

---

## 2. GitHub 仓库信息

> 以下为模板说明；请将尖括号内容替换为实际仓库信息。

| 项 | 说明 |
|----|------|
| 建议仓库名 | `ai-haigui-game`（与 `package.json` 中 `name` 一致即可） |
| 远程地址 | `https://github.com/chenjunjcu-source/ai-haigui-game` |
| 默认分支 | 一般为 `main` |
| 协作约定 | 功能分支开发，合并前执行 `npm run build` 与必要的接口自测 |

若尚未托管至 GitHub，请在平台创建空仓库后执行：

```bash
git remote add origin https://github.com/chenjunjcu-source/ai-haigui-game
git branch -M main
git push -u origin main
```

---

## 3. Vercel 线上部署信息

### 3.1 接入方式

1. 登录 [Vercel](https://vercel.com)，选择 **Add New Project → Import** 对应 Git 仓库。  
2. **Framework Preset**：选择 **Vite**（或保持默认由 Vercel 自动识别）。  
3. **Build Command**：`npm run build`  
4. **Output Directory**：`dist`  
5. **Install Command**：`npm install`（默认即可）

### 3.2 生产环境变量

在 Vercel 项目 **Settings → Environment Variables** 中为 **Production**（及需要的 Preview）至少配置：

| 变量名 | 说明 |
|--------|------|
| `VITE_DEEP_SEEK_API_KEY` | DeepSeek API 密钥；服务端 `api/index.js` / `server/index.js` 通过 `process.env.VITE_DEEP_SEEK_API_KEY` 读取，**勿**在前端硬编码 |

本地开发可复制 `.env.example` 为 `.env` 填写（`.env` 已列入 `.gitignore`，不得提交）。

### 3.3 部署后验证清单

在浏览器或命令行中确认（将 `https://你的域名` 替换为实际地址）：

- 站点首页可打开（欢迎页路由 `/`）
- 前端深链刷新可用（例如 `/game/1`、`/hall`、`/leaderboard`，不应再出现静态 404）
- `GET /api/health`（若已实现）或 `GET /api/leaderboard`、`POST /api/judge`（需合法体）行为符合预期

### 3.4 Serverless 与数据持久化说明

当前排行榜等数据若依赖服务器本地文件（如 `server/players.json`），在 **Vercel Serverless** 环境下文件系统为**临时**存储，**不适合**作为长期唯一数据源。若需线上长期稳定排行榜，后续应迁移至数据库或托管存储；本地自托管 Node 进程时使用 `server/index.js` 则更利于单文件持久化。

---

## 4. 当前项目结构

```txt
ai-haigui-game/
├── api/
│   └── index.js              # Vercel Serverless API：Express 实例 export default，无 listen
├── server/
│   ├── index.js              # 本地开发用 Express 服务（含 listen）
│   ├── stories.js            # 后端故事数据（须与前端 stories 对齐）
│   ├── players.js            # 玩家进度与排行榜逻辑
│   └── players.json          # 本地运行时玩家数据（勿提交真实用户数据时可 gitignore 按需调整）
├── src/
│   ├── components/           # UI 组件（ChatBox、Leaderboard、StoryCard 等）
│   ├── pages/                # 页面：Welcome、Gate、HallEntry、Home、Game、Result、LeaderboardPage 等
│   ├── data/
│   │   └── stories.ts        # 前端故事主数据
│   ├── lib/                  # api、player、progress、stories 等工具
│   ├── App.tsx               # 路由定义
│   ├── main.tsx
│   └── index.css
├── public/                   # favicon、audio/bgm 等静态资源
├── vercel.json               # Vercel 路由重写
├── vite.config.ts            # Vite；开发时可将 /api 代理至本地后端端口
├── package.json
├── .env.example              # 环境变量模板
├── README.md                 # 项目简说明
├── TODO.md                   # 待办清单
└── DEPLOY.md                 # 本文件
```

> 若仓库中存在历史遗留的重复文件（例如 `server/api/index.js`），应以根目录 **`api/index.js`** 与 **`server/index.js`** 的约定为准，避免重复维护两套 API 入口。

---

## 5. 本地开发说明

### 5.1 环境要求

- Node.js（建议 LTS 版本）
- npm（或兼容包管理器）

### 5.2 安装与启动

```bash
npm install
npm run dev
```

默认 `npm run dev` 会并行启动 **Vite** 与 **`npm run server`**（本地 Express）。浏览器地址以终端输出为准（常见为 `http://localhost:5173`）。

### 5.3 环境变量

复制模板并编辑：

```bash
cp .env.example .env
```

按 `.env.example` 填写；本地若端口冲突，可调整 `PORT` / `VITE_API_PORT`，并保证 `vite.config.ts` 中 `/api` 代理目标与后端监听端口一致。

### 5.4 单独构建预览

```bash
npm run build
npm run preview
```

### 5.5 类型检查

```bash
npm run typecheck
```

---

## 6. Vercel 配置说明

### 6.1 与仓库的关联

- 连接 Git 后，**Push 到配置的分支**将触发自动构建与部署（可在 Vercel 中设置生产分支与 Preview 分支策略）。

### 6.2 构建产物

- Vite 输出目录为 **`dist`**，作为静态资源由 CDN 分发。

### 6.3 API 运行方式

- 请求路径 **`/api/*`** 由 Vercel 路由至 **`api/index.js`** 导出的 Express 应用，与前端同域部署时可避免跨域配置问题（仍以实际 CORS 策略为准）。

### 6.4 环境变量作用域

- **Production**：正式线上环境，务必配置有效的 `VITE_DEEP_SEEK_API_KEY`。
- **Preview**：拉取请求预览环境，可按需配置独立 Key 或受限配额。

---

## 7. vercel.json 说明

当前根目录 `vercel.json` 示例结构如下（具体以仓库内文件为准）：

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**含义说明：**

1. **第一条**：将以 `/api/` 开头的请求转发到 Serverless 函数 `api/index.js`，保证 `/api/judge`、`/api/leaderboard` 等接口在线上可访问。  
2. **第二条**：将其余路径统一回退到站点根路径 `/`，由 Vite 打包的 `index.html` 承载 **SPA**；React Router 再在客户端解析 `/hall`、`/game/:id` 等，从而**修复刷新深链 404** 问题。

**注意：** 重写规则的顺序有意义，应 **优先匹配 `/api`**，再匹配通用前端回退，避免 API 被错误导向静态页。

---

## 8. 常用 Git 操作

```bash
# 查看状态
git status

# 拉取远端更新
git pull origin main

# 暂存与提交
git add .
git commit -m "feat: 简要说明本次修改"

# 推送到远端
git push origin main

# 新建功能分支
git checkout -b feature/your-feature

# 查看提交历史（精简）
git log --oneline -10
```

**建议：** 提交前执行 `npm run build`，避免将构建失败引入主分支；含密钥的文件禁止加入版本库。

---

## 9. 常见问题排查

| 现象 | 可能原因 | 处理方向 |
|------|----------|----------|
| 线上刷新 `/game/1` 等 404 | SPA 未回退到 `index.html` | 检查 `vercel.json` 是否包含非 `/api` 的兜底 rewrite |
| `/api/leaderboard` 502 或 404 | API 未部署或 rewrite 错误 | 确认 `api/index.js` 存在且第一条 rewrite 指向正确 |
| 聊天/法官无响应 | DeepSeek 密钥缺失或失效 | 检查 Vercel 环境变量 `VITE_DEEP_SEEK_API_KEY`；查看函数日志 |
| 本地 `EADDRINUSE` | 端口被占用 | 更换 `PORT` / `VITE_API_PORT` 或结束占用进程 |
| 本地 `/api` 调不通 | 代理未指向后端 | 检查 `vite.config.ts` 的 `server.proxy` 目标端口与 `server/index.js` 监听一致 |
| 排行榜线上始终为空或重置 | Serverless 文件非持久 | 预期行为；长期需数据库或外部存储 |
| 新增故事后前后端判定不一致 | 仅改了一侧数据 | 同时更新 `src/data/stories.ts` 与 `server/stories.js`，核对 `id` / `surface` / `bottom` |

---

## 10. 安全说明

1. **API 密钥**：仅保存在服务端环境变量（Vercel Project Env、本地 `.env`），**禁止**写入前端源码或提交到 Git。  
2. **`.env`**：已应列入 `.gitignore`；若历史误提交密钥，需**轮换密钥**并从仓库历史中清理敏感内容（必要时使用专业工具或服务支持）。  
3. **依赖安全**：定期执行 `npm audit`，关注高危漏洞并按团队流程升级依赖。  
4. **接口暴露**：`/api/judge` 等接口在生产环境应配合速率限制、鉴权或成本监控（按产品阶段逐步加强）。  
5. **用户数据**：排行榜与进度若含昵称等标识，在隐私政策与存储方案上需符合实际运营地区法规要求。

---

## 11. 当前已完成成果（摘要）

- 欢迎页、门禁（昵称）、游戏大厅（难度分栏、顺序解锁、结案标记）
- 对战页聊天体验（头像、毛玻璃、动效、思考态、打字机效果等）
- 结果页与本地进度（localStorage）
- DeepSeek 经后端代理的法官逻辑；前后端问答与胜利台词规范化
- 排行榜 API、玩家进度同步、独立排行榜页与从榜单恢复侦探进度
- Vercel 适配：`api/index.js` + `vercel.json`（含 API 与 SPA 刷新兜底）
- 大厅顶部显式导航（返回排行榜 `/leaderboard`、返回欢迎页 `/` 等），减少对浏览器后退的依赖

*详细功能列表以 `README.md` 及实际代码为准。*

---

## 12. 后续待办建议

参考 `TODO.md`，常见方向包括：

- 静态资源与体验的持续打磨（品牌图标、背景音乐策略等）
- 多人模式从原型 UI 迈向真实联机
- 线上排行榜持久化（数据库 / KV）
- 错误边界、重试与监控告警
- 故事库质量与数量的一致性校验工具或 CI 检查

---

## 13. 推荐维护流程

1. **拉取最新主分支**，从功能分支开发。  
2. 修改接口或故事数据时，**同步更新文档**（本文件、`README.md` 或 `TODO.md` 中相关条目）。  
3. **本地**：`npm run dev` 全链路自测；**提交前**：`npm run build`。  
4. **合并至主分支** 后观察 Vercel 构建日志与线上冒烟测试（首页、深链刷新、关键 API）。  
5. **发布说明**：在团队约定处记录版本号、环境变量变更与回滚方式。  
6. **密钥与配置变更**：仅在 Vercel 控制台与密钥保管流程中操作，并在内部记录变更时间与责任人。

---

## 14. 一句话说明

**本项目是「前端 Vite SPA + 后端 Express（Vercel 上由 `api/index.js` 承载）」的一体化部署形态：在 Vercel 配置好 `VITE_DEEP_SEEK_API_KEY` 与 `vercel.json` 后，即可同时获得可刷新的前端路由与可用的 `/api` 推理服务。**

---

*文档版本：与仓库当前结构同步撰写；若目录或部署方式变更，请更新对应章节并注明日期。*

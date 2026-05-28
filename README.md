# RepoForge

**把多个 GitHub 开源项目，组合成一个完整产品。**

[![Deploy](https://img.shields.io/badge/Live-https%3A%2F%2Fdssxhydwp.shop-amber)](https://dssxhydwp.shop)
[![Stack](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20React%2019%20%7C%20DeepSeek-black)](https://github.com/AndyDu0921/repoforge)

---

## 它能做什么

你找了几个不错的开源仓库，想把它们拼在一起做成一个产品——但不确定哪些功能会冲突、许可证是否兼容、还缺什么模块。

RepoForge 做三件事：

1. **分析**你导入的 GitHub 仓库的结构、依赖、许可证
2. **找出**功能缺口，并在 GitHub 上实时搜索补充方案
3. **输出**一份可直接用于 Claude Code / Cursor 的开发文档

整个过程 4 步，1 分钟内出结果。

---

## 演示

线上地址：**[https://dssxhydwp.shop](https://dssxhydwp.shop)**

### 工作流程

```
① 导入仓库 ──→ ② 设置偏好 ──→ ③ AI 分析(流式) ──→ ④ 查看方案
  粘贴 GitHub      选择受众/商业      实时读取仓库       架构+缺口+许可证
  URL 即可         模式/技术栈        生成评估方案        导出CLAUDE.md
```

### Step 4 输出内容

| 面板 | 内容 |
|------|------|
| **技术架构** | 每个仓库被分配什么角色，模块之间怎么协作 |
| **能力检查** | 缺什么功能，GitHub 上匹配到的真实项目推荐 |
| **许可证** | 开源协议冲突检测 + 规避建议 |
| **开发文档** | 可直接复制给 Claude Code / Cursor 的完整开发指南 |
| **方案评级** | S/A/B/C 综合评分 + 风险警告 + 优点总结 |

---

## 技术栈

| 层 | 技术 |
|----|------|
| **前端** | Next.js 15 (App Router) + React 19 + Tailwind CSS 4 |
| **动画** | Motion (Framer Motion) |
| **图标** | Lucide React |
| **AI 引擎** | DeepSeek Chat API (`deepseek-chat`) |
| **数据源** | GitHub REST API + GitHub Search API |
| **流式传输** | Server-Sent Events (SSE) |
| **部署** | Cloudflare Pages + GitHub Actions CI/CD |
| **运行时** | Edge Runtime (Cloudflare Workers) |

---

## 项目结构

```
repoforge/
├── app/
│   ├── api/
│   │   └── repo-analyze/
│   │       ├── route.ts              # 标准 API 端点
│   │       └── stream/
│   │           └── route.ts          # SSE 流式端点
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                       # 主页面容器
├── components/
│   ├── blueprint/
│   │   ├── architecture-panel.tsx     # 技术架构面板
│   │   ├── claude-prompt-panel.tsx    # 开发文档面板
│   │   ├── gaps-panel.tsx             # 能力缺口面板
│   │   ├── harmony-panel.tsx          # 许可证检查面板
│   │   └── v2-backlog-panel.tsx       # 未来计划面板
│   ├── steps/
│   │   ├── step1-materials.tsx        # 步骤1：导入仓库
│   │   ├── step2-alignment.tsx        # 步骤2：设置偏好
│   │   ├── step3-smelting.tsx         # 步骤3：AI 分析
│   │   └── step4-blueprint.tsx        # 步骤4：查看方案
│   └── ui/
│       ├── header.tsx
│       ├── settings-panel.tsx
│       └── stepper.tsx
├── hooks/
│   ├── use-mobile.ts
│   └── use-repo-forge-state.tsx       # 全局状态管理
├── lib/
│   ├── deepseek.ts                    # DeepSeek API 封装
│   ├── download-report.ts             # 方案导出
│   ├── gap-search.ts                  # GitHub Search 封装
│   ├── github.ts                      # GitHub API 封装
│   ├── state-persistence.ts           # localStorage 持久化
│   └── utils.ts
├── .github/workflows/deploy.yml       # CI/CD
├── wrangler.toml                      # Cloudflare 配置
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 快速开始

### 1. 克隆 & 安装

```bash
git clone https://github.com/AndyDu0921/repoforge.git
cd repoforge
npm install
```

### 2. 配置环境变量

创建 `.env.local`：

```bash
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
# GitHub Token 可选，在应用的设置面板中填写即可
```

### 3. 启动

```bash
npm run dev
# 打开 http://localhost:3000
```

---

## 配置项

| 环境变量 | 必填 | 说明 |
|----------|------|------|
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API Key，从 [platform.deepseek.com](https://platform.deepseek.com) 获取 |
| `GITHUB_TOKEN` | 否 | GitHub Personal Access Token，提升 API 限流上限（无需任何权限） |

GitHub Token 也可以在应用界面的「设置 Token」中直接填写（保存在浏览器 localStorage 中）。

---

## 部署

本项目部署在 Cloudflare Pages 上，每次 push 到 `main` 分支自动触发部署。

### 自部署

1. Fork 本仓库
2. 在 Cloudflare Pages 中连接你的 Fork
3. 设置环境变量 `DEEPSEEK_API_KEY`
4. 构建命令：`npx @cloudflare/next-on-pages`
5. 输出目录：`.vercel/output/static`

---

## 许可证

MIT © 2026 AndyDu0921

---

## 致谢

- [DeepSeek](https://deepseek.com) — AI 语义分析引擎
- [Vercel AI SDK](https://github.com/vercel/ai) — 默认示例仓库
- [shadcn/ui](https://github.com/shadcn-ui/ui) — 默认示例仓库
- [Cloudflare](https://cloudflare.com) — 托管 & 部署

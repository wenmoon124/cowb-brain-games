# BrainVerse — Brain Operating System

> 科学驱动的脑力训练平台。通过 6 款认知游戏、5 大维度训练、脑力年龄评估与脑健康科普文章,帮助你量化并提升认知能力。

**线上地址**：[cowb.cc](https://cowb.cc)

---

## 项目亮点

- **6 款脑力游戏**：Visual Search、Digit Span、Reaction Training、Stroop Challenge、Spatial Memory、Breathing Flow
- **5 大认知维度**：Memory · Attention · Reaction · Executive · Relaxation
- **Brain Engine**：基于 Luria (1973) 与 Salthouse (2009) 研究的脑力年龄计算引擎
- **Growth Engine**：成就系统、连续打卡、脑力宠物、挑战系统
- **三语支持**：English · 简体中文 · 日本語(路由级 i18n)
- **脑健康科普文章**：覆盖脑力年龄、记忆、注意、专注、放松五大主题
- **SEO 全套**：动态 sitemap、hreflang、OpenGraph、Twitter Card、JSON-LD
- **Cloudflare Pages**：全球边缘网络静态部署

---

## 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | Next.js 14 (App Router, Static Export) |
| 语言 | TypeScript 5 (Strict Mode) |
| 样式 | TailwindCSS 3.4 + 自研 Design Token 体系 |
| UI | Radix UI · Lucide Icons |
| 校验 | Zod |
| 部署 | Cloudflare Pages (静态导出) |
| 广告 | Google AdSense |

---

## 项目结构

```
brainverse/
├── apps/
│   └── web/                  # Next.js 前端 (静态导出)
│       ├── app/              # App Router 页面
│       ├── src/              # 组件、i18n、工具
│       ├── public/           # 静态资源 (_redirects/_headers/ads.txt)
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── .npmrc
├── LICENSE
└── README.md
```

---

## 快速开始

### 环境要求

- **Node.js** `>= 20`
- **pnpm** `>= 9`

### 安装与运行

```bash
pnpm install
pnpm dev
```

### 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动前端开发服务器 |
| `pnpm build` | 构建生产版本 (静态导出到 apps/web/out) |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm format` | Prettier 格式化 |
| `pnpm deploy:web` | 构建并部署到 Cloudflare Pages |

---

## 部署 (Cloudflare Pages)

### 自动部署 (推荐)

本项目已关联 Cloudflare Pages Git 集成,push 到 `main` 分支即自动触发部署。

- **构建命令**：`pnpm install --frozen-lockfile && pnpm build`
- **构建输出目录**：`apps/web/out`
- **Node 版本**：20

### 手动部署

```bash
pnpm build
wrangler pages deploy apps/web/out --project-name cowb-brain-games --branch main
```

---

## 国际化 (i18n)

支持三种语言,路由级切换:

| 语言 | 路径前缀 | HTML lang |
|---|---|---|
| English | `/en` | `en` |
| 简体中文 | `/zh` | `zh-CN` |
| 日本語 | `/ja` | `ja` |

翻译文件位于 `apps/web/src/i18n/`。

---

## SEO

- 动态 `sitemap.xml` (含 hreflang 交替链接)
- 动态 `robots.txt`
- 完整 OpenGraph / Twitter Card 元数据
- JSON-LD 结构化数据
- `ads.txt` (Google AdSense)
- `_headers` (CSP / 安全头)
- `_redirects` (Cloudflare Pages 路由重定向)

---

## 许可证 (禁止商用)

本项目采用**双协议**授权,**明确禁止任何形式的商业使用**。

| 范围 | 协议 | 说明 |
|---|---|---|
| 源代码 | [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) | 禁止商用,允许个人/学术/研究使用与改编 |
| 内容(文章、设计、翻译) | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) | 禁止商用,署名 + 相同协议分享 |

完整协议文本见 [`LICENSE`](LICENSE)。

**商业授权请联系**：wenmoon124@gmail.com

---

## 联系方式

- **作者**：wenmoon124
- **邮箱**：wenmoon124@gmail.com
- **GitHub**：[@wenmoon124](https://github.com/wenmoon124)

---

© 2026 wenmoon124. 本项目禁止商业使用。

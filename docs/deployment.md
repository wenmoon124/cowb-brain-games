# Cloudflare 部署指南

本文档详细说明 BrainVerse 项目（cowb.cc）在 Cloudflare 免费计划上的部署架构、环境变量配置、域名管理、前后端部署流程、数据库迁移流程以及预发布验证清单。

> **核心约束**：仅使用 Cloudflare 免费计划服务，不使用任何付费服务。所有架构决策受此约束影响。

---

## 1. 部署架构概述

BrainVerse 采用全 Cloudflare 原生架构，前端、API、数据库、缓存、存储均运行在 Cloudflare 边缘网络，实现全球低延迟与零运维成本。

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge Network                   │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Pages      │    │   Workers    │    │  Analytics   │  │
│  │  (Frontend)  │───▶│   (API)      │───▶│  (Metrics)   │  │
│  │  Next.js 14  │    │  Hono + TS   │    │              │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│         │                     │                              │
│         │                     ├──────┬──────┬──────┐        │
│         │                     ▼      ▼      ▼      ▼        │
│         │              ┌─────┐ ┌────┐ ┌────┐ ┌─────────┐    │
│         │              │ D1  │ │ KV │ │ R2 │ │Turnstile│    │
│         │              │ DB  │ │    │ │    │ │         │    │
│         │              └─────┘ └────┘ └────┘ └─────────┘    │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐                                          │
│  │   CDN        │                                          │
│  │  (Static)    │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐    ┌──────────────────┐
│   cowb.cc        │    │ preview.cowb.cc  │
│   (Production)   │    │   (Preview)      │
└──────────────────┘    └──────────────────┘
```

### 1.2 服务映射

| Cloudflare 服务 | 用途 | BrainVerse 使用方式 |
|---|---|---|
| **Pages** | 前端静态托管 + SSR | 部署 `apps/web` Next.js 构建产物 |
| **Workers** | API 后端 | 部署 `workers/api` Hono 应用 |
| **D1** | 关系型数据库 | 用户、分数、成就、文章、配置等结构化数据 |
| **KV** | 键值缓存 | Session、排行榜、Feature Flags、热点数据缓存 |
| **R2** | 对象存储 | 用户头像、分享图片、文章封面图 |
| **Analytics** | 流量与事件分析 | 页面访问、用户行为事件追踪 |
| **Turnstile** | 人机验证 | 注册、登录接口的反机器人验证 |

### 1.3 免费计划配额

部署与架构设计必须遵守以下配额限制，超出会导致服务降级：

| 服务 | 免费配额 | BrainVerse 应对策略 |
|---|---|---|
| **Pages** | 500 builds/月、无限静态请求 | 构建优化、增量部署、避免频繁构建 |
| **Workers** | 100,000 requests/天 | 前端 SPA 闭环 + 仅必要 POST 请求 |
| **D1** | 5M reads/天、100K writes/天、5GB 存储 | KV 缓存热点数据、内存缓存、避免轮询 |
| **KV** | 100K reads/天、1K writes/天、1GB 存储 | 批量写入、长 TTL、合理分区 |
| **R2** | 10GB 存储、1M Class A ops/月 | 按需上传、生命周期规则、CDN 缓存 |
| **Analytics** | 100K events/天 | 仅追踪核心事件，详见 Analytics 文档 |

> 详细配额管理策略参见 `context/02-architecture.md` 的"免费计划配额管理策略"章节。

---

## 2. 环境变量配置

环境变量分两类：
- **Workers 环境变量**：通过 `wrangler.toml` 的 `[vars]` 和 Cloudflare Dashboard Secrets 配置，注入到 Workers 运行时
- **Pages 环境变量**：通过 Cloudflare Dashboard 或 `wrangler pages` 命令配置，构建时与运行时均可访问

### 2.1 Workers API 环境变量

#### 2.1.1 非敏感变量（wrangler.toml [vars]）

```toml
# workers/api/wrangler.toml
[vars]
ENVIRONMENT = "production"
APP_URL = "https://cowb.cc"
TURNSTILE_SITE_KEY = "0x4AAAAAAA..."  # 公开 key，可暴露在前端
```

#### 2.1.2 敏感变量（Cloudflare Secrets）

以下变量必须通过 `wrangler secret put` 命令或 Dashboard 配置为加密 Secret，**不得**写入 `wrangler.toml`：

```bash
cd workers/api

# Cloudflare Turnstile 密钥
pnpm dlx wrangler secret put TURNSTILE_SECRET_KEY

# Session 签名密钥（至少 32 字符）
pnpm dlx wrangler secret put SESSION_SECRET

# 其他敏感配置
pnpm dlx wrangler secret put API_INTERNAL_TOKEN
```

#### 2.1.3 完整环境变量清单

| 变量名 | 类型 | 说明 | 示例值 |
|---|---|---|---|
| `ENVIRONMENT` | public | 运行环境标识 | `production` / `preview` |
| `APP_URL` | public | 前端应用 URL（用于 CORS、邮件链接） | `https://cowb.cc` |
| `TURNSTILE_SITE_KEY` | public | Turnstile 站点密钥（前端可见） | `0x4AAAAAAA...` |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile 服务端验证密钥 | `0x4AAAAAAA...` |
| `SESSION_SECRET` | secret | Session token 签名密钥 | 随机 32+ 字符字符串 |
| `API_INTERNAL_TOKEN` | secret | 内部服务调用 token（如 Cron 触发） | 随机字符串 |

### 2.2 D1 数据库绑定

```toml
# workers/api/wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "brainverse-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 通过 wrangler d1 create 获取
```

> `database_id` 是公开标识符，可写入 `wrangler.toml`。每个 Cloudflare 账户下 D1 数据库 ID 唯一。

### 2.3 KV Namespace 绑定

BrainVerse 使用两个 KV Namespace：

```toml
# workers/api/wrangler.toml

# Session 存储（短 TTL，频繁读写）
[[kv_namespaces]]
binding = "SESSIONS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # 通过 wrangler kv namespace create SESSIONS 获取

# 通用缓存（排行榜、Feature Flags、热点数据，长 TTL）
[[kv_namespaces]]
binding = "CACHE"
id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
```

创建 KV Namespace：

```bash
cd workers/api
pnpm dlx wrangler kv namespace create SESSIONS
pnpm dlx wrangler kv namespace create CACHE
# 将输出的 id 填入 wrangler.toml
```

### 2.4 R2 Bucket 绑定

```toml
# workers/api/wrangler.toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "brainverse-storage"
```

创建 R2 Bucket：

```bash
cd workers/api
pnpm dlx wrangler r2 bucket create brainverse-storage
```

### 2.5 前端环境变量（Pages）

前端通过 `next.config.js` 的 `env` 和运行时配置注入环境变量。以下变量在 Cloudflare Pages Dashboard 中配置：

| 变量名 | 说明 | 示例值 |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | 前端应用 URL | `https://cowb.cc` |
| `NEXT_PUBLIC_API_URL` | Workers API URL | `https://api.cowb.cc` 或同域 `/api` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile 站点密钥 | `0x4AAAAAAA...` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID（可选） | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_ENVIRONMENT` | 环境标识 | `production` / `preview` |

> **注意**：`NEXT_PUBLIC_*` 前缀变量会在构建时内联到客户端代码中，所有用户可见，**不要**用于敏感信息。

### 2.6 环境变量配置流程（生产环境）

```bash
# 1. 创建 D1 数据库（一次性）
cd workers/api
pnpm dlx wrangler d1 create brainverse-db
# 记录 database_id，填入 wrangler.toml

# 2. 创建 KV Namespace（一次性）
pnpm dlx wrangler kv namespace create SESSIONS
pnpm dlx wrangler kv namespace create CACHE
# 记录 id，填入 wrangler.toml

# 3. 创建 R2 Bucket（一次性）
pnpm dlx wrangler r2 bucket create brainverse-storage

# 4. 设置 Workers Secret
pnpm dlx wrangler secret put TURNSTILE_SECRET_KEY
pnpm dlx wrangler secret put SESSION_SECRET
pnpm dlx wrangler secret put API_INTERNAL_TOKEN

# 5. 在 Cloudflare Pages Dashboard 配置前端环境变量
# 路径：Pages 项目 → Settings → Environment variables
```

---

## 3. 域名配置

BrainVerse 使用两个域名：生产环境 `cowb.cc` 和预发布环境 `preview.cowb.cc`。

### 3.1 域名架构

| 域名 | 用途 | 部署目标 | 触发方式 |
|---|---|---|---|
| `cowb.cc` | 生产环境 | Pages + Workers | `main` 分支合并后手动 / 自动部署 |
| `preview.cowb.cc` | 预发布环境 | Pages + Workers | PR 创建后自动部署 |
| `api.cowb.cc`（可选） | API 子域 | Workers | 路由绑定（可选，也可用同域 `/api`） |

### 3.2 DNS 记录配置

所有 DNS 记录通过 Cloudflare DNS 管理（域名需托管在 Cloudflare）。

#### 3.2.1 主域名（cowb.cc）

| 类型 | 名称 | 内容 | 代理 | 说明 |
|---|---|---|---|---|
| A / AAAA | `@` | Pages 部署的 IP / CNAME | Proxied (橙色云) | Pages 自定义域名自动配置 |
| CNAME | `www` | `cowb.cc` | Proxied | www 重定向到主域 |

> **Pages 自定义域名**：在 Pages 项目设置中添加 `cowb.cc` 和 `www.cowb.cc`，Cloudflare 会自动创建 DNS 记录。

#### 3.2.2 预发布域名（preview.cowb.cc）

| 类型 | 名称 | 内容 | 代理 | 说明 |
|---|---|---|---|---|
| CNAME | `preview` | Pages 预发布部署 URL | Proxied | 预发布环境访问 |

> **Pages 预发布部署**：每次 PR 或推送非 main 分支时，Pages 自动生成预发布 URL。将 `preview.cowb.cc` 绑定为固定的预发布域名。

#### 3.2.3 API 路由（如使用子域）

若 API 通过 `api.cowb.cc` 子域提供：

| 类型 | 名称 | 内容 | 代理 | 说明 |
|---|---|---|---|---|
| AAAA | `api` | Workers 路由 IP | Proxied | Workers 自定义域名 |

Workers 路由配置（`wrangler.toml`）：

```toml
# workers/api/wrangler.toml
routes = [
  { pattern = "api.cowb.cc/*", custom_domain = true }
]
```

> **推荐方案**：使用同域路由（`cowb.cc/api/*`），通过 Pages 的 `_routes.json` 或 rewrites 将 `/api/*` 转发到 Workers，避免跨域问题。详见 3.4 节。

### 3.3 SSL/TLS 配置

在 Cloudflare Dashboard → SSL/TLS 中：

- **加密模式**：Full (strict) — 端到端加密，使用 Cloudflare Origin Certificate
- **始终使用 HTTPS**：启用 — HTTP 自动重定向到 HTTPS
- **最小 TLS 版本**：TLS 1.2
- **TLS 1.3**：启用

### 3.4 同域路由配置（推荐）

为避免跨域问题，BrainVerse 推荐使用同域路由：前端与 API 共享 `cowb.cc` 域名，通过路径区分。

#### Pages rewrites 配置

在 `apps/web/next.config.js` 中配置 rewrites，将 `/api/*` 请求转发到 Workers：

```javascript
// apps/web/next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://brainverse-api.<account>.workers.dev/:path*',
      },
    ]
  },
}
```

> **注意**：Pages 部署时，`destination` 中的 Workers URL 需替换为实际部署地址。生产环境可绑定 Workers 到 `api.cowb.cc` 或使用 Pages Functions 代理。

### 3.5 Pages `_routes.json`

如使用 Pages Functions 代理 API，在 `apps/web/public/_routes.json` 中配置：

```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": ["/_next/static/*", "/_next/image/*"]
}
```

---

## 4. 前端部署流程

前端（`apps/web`）部署到 Cloudflare Pages，支持 Git 集成部署和 CLI 手动部署两种方式。

### 4.1 构建配置

#### 4.1.1 构建命令

```bash
# 在 apps/web 目录下
pnpm install
pnpm build
```

Next.js 14 默认输出 `.next/` 目录。Cloudflare Pages 部署需使用 `@cloudflare/next-on-pages` 适配器或静态导出模式。

#### 4.1.2 输出目录

- **SSR 模式**（推荐）：使用 `@cloudflare/next-on-pages`，输出到 `.vercel/output/`，Pages 自动识别
- **静态导出模式**：在 `next.config.js` 中配置 `output: 'export'`，输出到 `out/` 目录

#### 4.1.3 Next.js 配置（Pages 适配）

```javascript
// apps/web/next.config.js
module.exports = {
  // Cloudflare Pages 部署优化
  experimental: {
    runtime: 'edge', // 使用 Edge Runtime
  },
  // 静态资源缓存
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}
```

### 4.2 方式一：Git 集成部署（推荐）

Git 集成部署实现自动化 CI/CD，每次推送自动构建部署。

#### 4.2.1 配置步骤

1. 在 Cloudflare Dashboard → Pages → Create a project → Connect to Git
2. 选择 BrainVerse GitHub 仓库
3. 配置构建：

| 配置项 | 值 |
|---|---|
| Framework preset | Next.js |
| Build command | `pnpm install && pnpm --filter @brainverse/web build` |
| Build output directory | `.next` 或 `out`（根据输出模式） |
| Root directory | `/` |
| Node.js version | 20 |

4. 配置环境变量（见 2.5 节）
5. 绑定自定义域名 `cowb.cc`（生产）和 `preview.cowb.cc`（预发布）

#### 4.2.2 部署触发规则

| 分支 / 事件 | 部署目标 | 域名 |
|---|---|---|
| `main` 分支推送 | 生产环境 | `cowb.cc` |
| 非 main 分支推送 / PR 创建 | 预发布环境 | `preview.cowb.cc` + 临时预览 URL |

#### 4.2.3 构建优化建议

- 使用 pnpm 缓存：在 Pages 构建命令前加 `pnpm config set store-dir .pnpm-store`
- 启用 Next.js 构建缓存：`.next/cache`
- 避免在预发布环境运行完整构建（可配置跳过预发布构建）

### 4.3 方式二：CLI 手动部署

适合调试或特定环境部署。

```bash
cd apps/web

# 1. 构建前端
pnpm build

# 2. 部署到 Pages
pnpm dlx wrangler pages deploy .next \
  --project-name brainverse-web \
  --branch main \
  --commit-dirty=true
```

#### CLI 部署参数

| 参数 | 说明 |
|---|---|
| `--project-name` | Pages 项目名称（首次需通过 Dashboard 创建） |
| `--branch` | 部署分支（`main` 为生产，其他为预发布） |
| `--commit-dirty` | 允许未提交的更改部署（调试用） |
| `--env` | 环境标识（如 `--env production`） |

### 4.4 一键部署命令

根 `package.json` 提供便捷命令：

```bash
# 部署前端到生产
pnpm deploy:web

# 等价于：
# cd apps/web && pnpm build && wrangler pages deploy .next --project-name brainverse-web --branch main
```

### 4.5 部署后验证

部署完成后，立即检查以下项：

1. 访问 `https://cowb.cc` — 首页正常加载
2. 访问 `https://cowb.cc/en` — 英文版正常
3. 访问 `https://cowb.cc/zh` — 中文版正常
4. 访问 `https://cowb.cc/ja` — 日文版正常
5. 检查 `https://cowb.cc/robots.txt` — 可访问
6. 检查 `https://cowb.cc/sitemap.xml` — 可访问
7. 测试 API 联通：`https://cowb.cc/api/health` — 返回 `{ "status": "ok" }`

---

## 5. API 部署流程

API（`workers/api`）部署到 Cloudflare Workers，使用 Wrangler CLI。

### 5.1 构建配置

Workers API 使用 TypeScript 编写，Wrangler 内置 esbuild 进行打包，无需额外构建步骤。

```toml
# workers/api/wrangler.toml
name = "brainverse-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]  # 如需 Node.js 兼容
```

### 5.2 部署命令

```bash
cd workers/api

# 1. 类型检查与测试（部署前必须通过）
pnpm typecheck
pnpm test

# 2. 部署到 Workers
pnpm dlx wrangler deploy
```

或使用根目录便捷命令：

```bash
pnpm deploy:api
```

### 5.3 部署流程

#### 5.3.1 预发布环境部署

```bash
cd workers/api

# 创建预发布环境配置（如使用 Workers Environments）
# wrangler.toml 中配置 [env.preview]
pnpm dlx wrangler deploy --env preview
```

`wrangler.toml` 环境配置示例：

```toml
# 生产环境（默认）
[vars]
ENVIRONMENT = "production"
APP_URL = "https://cowb.cc"

# 预发布环境
[env.preview]
name = "brainverse-api-preview"
[env.preview.vars]
ENVIRONMENT = "preview"
APP_URL = "https://preview.cowb.cc"

# 预发布环境绑定（可使用独立的 D1/KV/R2，也可共享）
[[env.preview.d1_databases]]
binding = "DB"
database_name = "brainverse-db-preview"
database_id = "preview-db-id-here"
```

#### 5.3.2 生产环境部署

```bash
cd workers/api

# 部署到生产（默认环境）
pnpm dlx wrangler deploy
```

> **重要**：生产部署前，确保所有数据库迁移已在远程应用（见第 6 节）。

### 5.4 部署后验证

```bash
# 1. 健康检查
curl https://api.cowb.cc/health
# 或同域：curl https://cowb.cc/api/health
# 应返回：{ "status": "ok", "timestamp": "..." }

# 2. API 信息
curl https://cowb.cc/api
# 应返回 API 版本、文档链接等

# 3. 检查 Workers 日志
pnpm dlx wrangler tail
# 实时查看生产环境日志，确认无错误
```

### 5.5 版本管理

Workers 部署支持版本回滚：

```bash
# 查看部署历史版本
pnpm dlx wrangler deployments list

# 回滚到上一版本
pnpm dlx wrangler deployments rollback
```

> **建议**：每次生产部署后，保留至少 30 分钟的 `wrangler tail` 监控，确认无异常流量或错误。

---

## 6. 数据库迁移流程

数据库迁移使用 Wrangler D1 migrations，迁移文件位于 `workers/api/migrations/` 目录。详细规范见 [database.md](./database.md)。

### 6.1 迁移文件结构

```
workers/api/migrations/
├── 0001_init.sql          # 初始化表结构
├── 0002_growth.sql        # Growth Engine 相关表
├── 0003_content.sql       # 内容引擎相关表
└── 0004_admin.sql         # Admin 相关表
```

### 6.2 应用迁移到本地（开发环境）

```bash
cd workers/api

# 应用所有未执行的迁移到本地 D1
pnpm dlx wrangler d1 migrations apply brainverse-db --local
```

### 6.3 应用迁移到远程（生产环境）

```bash
cd workers/api

# ⚠️ 谨慎操作：应用迁移到生产 D1
pnpm dlx wrangler d1 migrations apply brainverse-db --remote
```

> **生产迁移流程**：
> 1. 在本地环境充分测试迁移
> 2. 在预发布环境（`--remote --env preview`）应用并验证
> 3. 在生产环境应用
> 4. 立即部署对应代码版本

### 6.4 迁移应用顺序

D1 migrations 按 文件名字母序 依次应用，已应用的迁移不会重复执行。Wrangler 在 D1 中维护 `d1_migrations` 表记录执行历史。

### 6.5 查看迁移状态

```bash
cd workers/api

# 查看已应用的迁移列表
pnpm dlx wrangler d1 migrations list brainverse-db --remote
```

### 6.6 数据查询与导出

```bash
cd workers/api

# 执行单条 SQL 查询（远程）
pnpm dlx wrangler d1 execute brainverse-db --remote \
  --command "SELECT COUNT(*) FROM users"

# 执行 SQL 文件（远程）
pnpm dlx wrangler d1 execute brainverse-db --remote \
  --file ./scripts/seed-articles.sql

# 导出整个数据库（备份）
pnpm dlx wrangler d1 export brainverse-db --remote --output backup.sql
```

详细备份策略见 [database.md](./database.md) 的"备份策略"章节。

### 6.7 便捷命令

根 `package.json` 提供：

```bash
# 本地迁移
pnpm db:migrate
# 等价于：cd workers/api && wrangler d1 migrations apply brainverse-db --local

# 远程迁移（生产）
pnpm db:migrate:remote
# 等价于：cd workers/api && wrangler d1 migrations apply brainverse-db --remote
```

---

## 7. 预发布验证清单

每次部署到预发布环境（`preview.cowb.cc`）后，必须按以下清单逐项验证，全部通过后方可合并到 `main` 触发生产部署。

### 7.1 路由验证

- [ ] `/` 重定向到 `/en`
- [ ] `/en`、`/zh`、`/ja` 三种语言首页正常加载
- [ ] `/en/games`、`/zh/games`、`/ja/games` 游戏中心页正常
- [ ] `/en/dashboard`、`/zh/dashboard`、`/ja/dashboard` 仪表盘正常（需登录）
- [ ] `/en/articles/[category]/[slug]` 文章详情页正常
- [ ] `/en/games/[slug]` 游戏详情页正常
- [ ] `/en/brain-age` Brain Age 评估页正常
- [ ] 不存在的路径返回 404 页面（含本地化文案）
- [ ] 所有内部链接无 404 错误

### 7.2 SEO 验证

- [ ] 每个页面的 `<title>` 标签正确且本地化
- [ ] 每个页面的 `<meta name="description">` 正确且本地化
- [ ] 每个页面有 canonical URL 标签
- [ ] 每个页面有 OpenGraph 标签（og:title, og:description, og:image, og:url）
- [ ] 每个页面有 Twitter Card 标签
- [ ] 每个页面有 hreflang alternate 链接（en/zh/ja + x-default）
- [ ] `https://preview.cowb.cc/robots.txt` 可访问且内容正确
- [ ] `https://preview.cowb.cc/sitemap.xml` 可访问且包含所有页面
- [ ] `https://preview.cowb.cc/rss.xml` 可访问（文章订阅源）
- [ ] 文章页包含 JSON-LD 结构化数据（Article Schema + FAQ Schema）
- [ ] 面包屑页面包含 BreadcrumbList 结构化数据

详细 SEO 规范见 [seo.md](./seo.md)。

### 7.3 Analytics 验证

- [ ] Cloudflare Analytics 已启用并接收数据
- [ ] 页面访问事件正确上报
- [ ] 核心事件（如 `game_start`、`game_complete`、`signup`、`login`）正确上报
- [ ] 事件参数完整（如 `game_slug`、`score`、`locale`）

### 7.4 本地化验证

- [ ] 切换语言后，所有 UI 文本正确翻译
- [ ] 无硬编码文本（所有文案来自 i18n key）
- [ ] 日期、数字格式符合 locale（`Intl.DateTimeFormat`、`Intl.NumberFormat`）
- [ ] 文章内容三语版本齐全且可访问
- [ ] 语言切换器功能正常，切换后保持当前页面
- [ ] `<html lang>` 属性随 locale 正确变化

详细 i18n 规范见 [i18n.md](./i18n.md)。

### 7.5 性能验证

- [ ] Lighthouse Performance 评分 >= 90（移动端）
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] TTFB (Time to First Byte) < 800ms
- [ ] 首屏无渲染阻塞资源
- [ ] 图片使用 Next.js Image 组件，自动 WebP/AVIF 转换
- [ ] 静态资源启用缓存（Cache-Control headers 正确）
- [ ] API 响应时间 P95 < 300ms

### 7.6 可访问性验证

- [ ] Lighthouse Accessibility 评分 >= 95
- [ ] 所有交互元素可通过键盘访问（Tab/Shift+Tab/Enter/Space）
- [ ] 焦点可见（focus-visible 样式）
- [ ] 颜色对比度符合 WCAG AA 标准（文本 >= 4.5:1，大文本 >= 3:1）
- [ ] 图片有 alt 属性（装饰性图片用 `alt=""`）
- [ ] 表单字段有 label 关联
- [ ] ARIA 属性正确使用（aria-label、aria-describedby、role）
- [ ] 屏幕阅读器测试通过（NVDA / VoiceOver）

### 7.7 移动端验证

- [ ] iPhone SE（375px）布局正常
- [ ] iPhone 12 Pro（390px）布局正常
- [ ] iPad（768px）布局正常
- [ ] 触摸目标最小 44x44 px
- [ ] 无水平滚动
- [ ] 底部导航栏正常（BottomNav）
- [ ] 移动端菜单正常展开/收起
- [ ] 表单输入框点击后页面不意外缩放（font-size >= 16px）
- [ ] 安全区域（safe-area-inset）适配正常
- [ ] 横屏布局正常

### 7.8 桌面端验证

- [ ] Chrome（最新版）正常
- [ ] Firefox（最新版）正常
- [ ] Safari（最新版）正常
- [ ] Edge（最新版）正常
- [ ] 1280px 分辨率布局正常
- [ ] 1920px 宽屏布局正常
- [ ] 2560px 超宽屏布局正常（无过度拉伸）
- [ ] 深色模式切换正常
- [ ] 浏览器缩放 75%–125% 布局正常

### 7.9 API 与功能验证

- [ ] 用户注册流程正常（含 Turnstile 验证）
- [ ] 用户登录/登出流程正常
- [ ] 游戏完整流程：开始 → 进行 → 结束 → 提交分数 → 查看结果
- [ ] Brain Age 评估流程正常
- [ ] 仪表盘数据加载正常
- [ ] 成就解锁逻辑正常
- [ ] Streak 连续天数计算正确
- [ ] 文章列表与详情页正常加载
- [ ] 速率限制生效（高频请求返回 429）
- [ ] 错误页面（500、404、403、401）正常显示

### 7.10 安全验证

- [ ] HTTPS 强制启用（HTTP 自动重定向）
- [ ] 安全 headers 正确（CSP、X-Frame-Options、X-Content-Type-Options）
- [ ] 无敏感信息泄露（检查响应 headers、错误信息）
- [ ] Turnstile 在注册/登录接口生效
- [ ] 速率限制在敏感接口（登录、注册）生效
- [ ] Cookie 设置 HttpOnly、Secure、SameSite=Lax
- [ ] CORS 配置正确（仅允许 `cowb.cc` 和 `preview.cowb.cc`）

---

## 8. 部署自动化（GitHub Actions）

建议配置 GitHub Actions 实现自动化部署。以下为参考工作流：

### 8.1 预发布自动部署

```yaml
# .github/workflows/deploy-preview.yml
name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm --filter @brainverse/web build
      - name: Deploy to Pages (Preview)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: brainverse-web
          directory: apps/web/.next
          branch: ${{ github.head_ref }}
```

### 8.2 生产自动部署

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - name: Deploy Web to Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: brainverse-web
          directory: apps/web/.next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
      - name: Deploy API to Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: workers/api
          command: deploy
```

### 8.3 数据库备份定时任务

```yaml
# .github/workflows/backup-database.yml
name: Backup D1 Database

on:
  schedule:
    - cron: '0 2 * * *'  # 每天 UTC 02:00（北京时间 10:00）执行

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Export D1 Database
        working-directory: workers/api
        run: |
          pnpm dlx wrangler d1 export brainverse-db --remote --output backup.sql
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      - name: Upload backup to R2
        working-directory: workers/api
        run: |
          pnpm dlx wrangler r2 object put brainverse-storage/backups/$(date +%Y-%m-%d).sql --file backup.sql
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### 8.4 所需 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：

| Secret 名 | 说明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（需 Pages、Workers、D1、KV、R2 权限） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |

---

## 9. 回滚流程

### 9.1 前端回滚

```bash
# 通过 Pages Dashboard 选择历史部署版本
# Dashboard → Pages → brainverse-web → Deployments → 选择版本 → Rollback

# 或通过 CLI
cd apps/web
pnpm dlx wrangler pages deployment rollback --project-name brainverse-web
```

### 9.2 API 回滚

```bash
cd workers/api

# 查看部署历史
pnpm dlx wrangler deployments list

# 回滚到上一版本
pnpm dlx wrangler deployments rollback

# 或指定版本
pnpm dlx wrangler deployments rollback --version <version-id>
```

### 9.3 数据库回滚

D1 迁移无内置回滚。回滚步骤：

1. 创建反向迁移文件（如 `0005_revert_add_column.sql`），包含反向 SQL
2. 应用反向迁移到远程：`pnpm dlx wrangler d1 migrations apply brainverse-db --remote`
3. 部署对应版本的 API 代码

> **重要**：数据库回滚前，务必备份当前数据：`pnpm dlx wrangler d1 export brainverse-db --remote --output pre-rollback-backup.sql`

### 9.4 紧急回滚检查清单

- [ ] 确认回滚原因与影响范围
- [ ] 备份当前生产数据
- [ ] 回滚前端到上一稳定版本
- [ ] 回滚 API 到上一稳定版本
- [ ] 如需要，回滚数据库迁移
- [ ] 验证回滚后服务正常
- [ ] 通知团队与用户（如影响用户体验）
- [ ] 记录事故复盘文档

---

## 10. 相关文档

- [development.md](./development.md) — 开发环境搭建指南
- [database.md](./database.md) — D1 数据库使用指南（含备份策略）
- [testing.md](./testing.md) — 测试策略
- [seo.md](./seo.md) — SEO 架构
- [i18n.md](./i18n.md) — 国际化指南
- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 官方文档](https://developers.cloudflare.com/d1/)

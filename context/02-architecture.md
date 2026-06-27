# BrainVerse 架构文档

> 文档编号：context/02-architecture.md
> 对应任务：Task 1.5（系统架构说明）
> 域名：cowb.cc（生产）/ preview.cowb.cc（预览）
> 计划层级：Cloudflare Free Plan Only
> 最后更新：2026-06-25

本文档定义 BrainVerse 平台的技术架构，包括系统总览、Monorepo 结构、前端架构、后端架构、Cloudflare 服务映射、数据流说明与免费计划配额管理策略。所有架构决策必须遵循 `decisions/0001-initial-architecture.md` 中的 ADR-0001。

---

## Task 1.5.1 系统架构总览图

BrainVerse 采用 **前端（Next.js on Cloudflare Pages）↔ Workers API（Hono）↔ D1 / KV / R2** 的三层边缘架构。所有请求在 Cloudflare 全球边缘节点处理，无需传统中心化服务器。

### 架构分层

1. **客户端层（Browser）**：用户浏览器渲染 Next.js 输出的 HTML/CSS/JS，承担游戏逻辑本地结算、表单交互与 Turnstile 人机验证。
2. **边缘前端层（Cloudflare Pages）**：托管 Next.js 应用，提供 SSR（Server-Side Rendering）/ SSG（Static Site Generation），输出 SEO 友好的 HTML。
3. **边缘 API 层（Cloudflare Workers）**：基于 Hono 框架的 API 后端，处理认证、计分、Brain Age 计算、Growth 逻辑与内容查询。
4. **存储层**：
   - D1（SQLite）：持久化业务数据（用户、分数、成就、文章、配置）。
   - KV（Key-Value）：Session 缓存、排行榜缓存、Feature Flags 缓存。
   - R2（Object Storage）：用户头像、分享图片、文章封面等二进制资源。
5. **辅助服务层**：
   - Turnstile：注册/登录人机验证。
   - Analytics：页面访问与业务事件追踪。

### 系统架构图（ASCII）

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            用户浏览器 (Browser)                          │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌────────────┐  │
│   │ Next.js SSR │  │  游戏本地结算 │  │ Turnstile   │  │  Analytics │  │
│   │   HTML 渲染  │  │  (前端计算)   │  │  人机验证    │  │  事件上报   │  │
│   └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └─────┬──────┘  │
└──────────┼────────────────┼─────────────────┼───────────────┼──────────┘
           │ HTTPS          │ POST /api/*     │ siteverify    │ beacon
           ▼                ▼                 ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Cloudflare 全球边缘网络 (Edge)                       │
│                                                                         │
│  ┌───────────────────────────────┐    ┌───────────────────────────────┐│
│  │   Cloudflare Pages            │    │   Cloudflare Workers (Hono)   ││
│  │   (Next.js SSR / SSG)         │    │   API 后端                    ││
│  │                               │    │                               ││
│  │  • /[locale] 静态页面          │───▶│  • /api/auth                  ││
│  │  • SSR 动态页面               │    │  • /api/games                 ││
│  │  • SEO 元数据注入              │    │  • /api/scores                ││
│  │  • i18n 多语言                │    │  • /api/brain-age             ││
│  │                               │    │  • /api/growth                ││
│  │  Middleware: CSP/HSTS/Redirect│    │  • /api/content               ││
│  └───────────────────────────────┘    │  • /api/admin                 ││
│                                       │                               ││
│                                       │  Middleware Chain:            ││
│                                       │  CORS→RateLimit→Auth→Log→     ││
│                                       │  Handler→ErrorHandler         ││
│                                       └──────────┬────────────────────┘│
└─────────────────────────────────────────────────┼───────────────────────┘
                                                  │ Bindings
                          ┌───────────────────────┼───────────────────────┐
                          ▼                       ▼                       ▼
                ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
                │   D1 (SQLite)   │    │   KV (Cache)    │    │   R2 (Storage)  │
                │                 │    │                 │    │                 │
                │ • users         │    │ • SESSIONS      │    │ • avatars/      │
                │ • sessions      │    │   (TTL 7d)      │    │ • shares/       │
                │ • games         │    │ • leaderboard   │    │ • covers/       │
                │ • scores        │    │   (TTL 5m)      │    │                 │
                │ • brain_age_*   │    │ • config        │    │ 10GB Free       │
                │ • achievements  │    │   (TTL 1h)      │    │                 │
                │ • streaks       │    │ • feature_flags │    │                 │
                │ • brain_pets    │    │                 │    │                 │
                │ • challenges    │    │                 │    │                 │
                │ • articles      │    │                 │    │                 │
                │ • feature_flags │    │                 │    │                 │
                └─────────────────┘    └─────────────────┘    └─────────────────┘
                          │                       │
                          │                       │ siteverify
                          │                       ▼
                          │           ┌─────────────────────┐
                          │           │  Cloudflare         │
                          │           │  Turnstile          │
                          │           │  (CAPTCHA)          │
                          │           └─────────────────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │  Cloudflare         │
                │  Analytics          │
                │  (页面/事件追踪)     │
                └─────────────────────┘
```

### 架构原则

- **Edge-First（边缘优先）**：所有逻辑在离用户最近的边缘节点执行，降低延迟。
- **SSG 优先（Static-First）**：能静态化的页面一律 SSG，减少 Workers 调用次数以节省免费配额。
- **Read-Heavy 优化**：读多写少场景通过 KV 缓存吸收读请求，保护 D1 读配额。
- **闭环结算（Closed-Loop Scoring）**：游戏结算在前端本地完成，仅必要结果 POST 到 API，减少 Workers 调用。
- **类型安全（Type-Safe）**：前后端共享 `@brainverse/*` 包，避免类型漂移。

---

## Task 1.5.2 Monorepo 结构详细说明

BrainVerse 使用 **pnpm workspace** 管理 Monorepo，根目录下划分 `apps/`、`workers/`、`packages/` 三类工作区。

### 目录树

```
brainverse/
├── apps/
│   └── web/                      # Next.js 前端应用
├── workers/
│   └── api/                      # Cloudflare Workers API 后端
├── packages/
│   ├── shared/                   # 共享类型、常量、工具函数
│   ├── core/                     # 领域模型（User, Game, Score 等）
│   ├── brain-engine/             # 受保护的脑力计算公式
│   ├── game-engine/              # 游戏框架（BaseGame, ScoreEngine, AdaptiveDifficulty）
│   ├── growth-engine/            # 成就、连续签到、宠物、挑战逻辑
│   ├── content-engine/           # 文章 Schema、SEO、JSON-LD
│   └── ui/                       # 共享 React 组件
├── context/                      # 架构与产品上下文文档
├── decisions/                    # ADR（架构决策记录）
├── docs/                         # 开发/部署/数据库/测试/SEO/i18n 指南
├── BrainVerse-Design/            # 设计参考（HTML 原型，仅参考）
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
├── .gitignore
├── .eslintrc.cjs
└── .prettierrc
```

### 各目录用途与依赖关系

| 目录 | 用途 | 主要依赖 | 被谁依赖 |
|------|------|----------|----------|
| `apps/web` | Next.js 前端应用，承载所有页面、SSR/SSG、i18n、SEO | `next`, `react`, `@brainverse/*` 全部包 | 部署到 Pages |
| `workers/api` | Hono API 后端，处理认证、计分、Brain Age、Growth、内容 | `hono`, `@cloudflare/workers-types`, `@brainverse/shared`, `@brainverse/core`, `@brainverse/brain-engine`, `@brainverse/growth-engine`, `@brainverse/content-engine` | 部署到 Workers |
| `packages/shared` | 共享类型（Locale, GameDimension, ApiResponse 等）、常量（LOCALES, API_ROUTES）、工具函数（generateId, clamp 等） | 无 | 被所有其他包和应用依赖（最底层） |
| `packages/core` | 领域模型接口定义：User, Game, Score, Achievement, Streak, BrainPet, Challenge, Article | `@brainverse/shared` | 被 web、api、game-engine、growth-engine、content-engine 依赖 |
| `packages/brain-engine` | 受保护系统：Brain Age / Brain Score / Brain Mapping / Percentile / Identity / Growth 公式（仅定义接口与骨架，公式逻辑受保护） | `@brainverse/shared`, `@brainverse/core` | 被 web（前端计算）、api（服务端校验）依赖 |
| `packages/game-engine` | 游戏框架：BaseGame 抽象类、ScoreEngine、AdaptiveDifficulty、GameRegistry | `@brainverse/shared`, `@brainverse/core` | 被 web 依赖（游戏运行时） |
| `packages/growth-engine` | Growth 子系统：Achievements、Streaks、BrainPet、Challenges、Identity 逻辑骨架 | `@brainverse/shared`, `@brainverse/core` | 被 api 依赖（服务端判定） |
| `packages/content-engine` | 文章 Schema、SEO Metadata 生成器、JSON-LD 生成器、文章类别定义 | `@brainverse/shared`, `@brainverse/core` | 被 web（SSR 渲染）、api（内容查询）依赖 |
| `packages/ui` | 共享 React 组件：GameCard、StatCard、LifeBar、DimensionBadge | `react`, `@brainverse/shared` | 被 web 依赖 |

### 依赖关系图

```
                    packages/shared  (最底层，无依赖)
                          ▲
                ┌─────────┼─────────┐
                │         │         │
          packages/core   │         │
                ▲         │         │
       ┌────────┼─────┐   │         │
       │        │     │   │         │
  brain-engine  │  game-engine      │
       │        │     │             │
       │        │     │   growth-engine
       │        │     │     │
       │        │     │     │
       └────────┴──┬──┴─────┘
                   │
            content-engine ──┐
                   │         │
                   ▼         ▼
              apps/web    workers/api
              (Next.js)   (Hono)
                   ▲         ▲
                   │         │
              packages/ui   │
                   │         │
                   └─────────┘
```

### 包命名规范

- 所有包名以 `@brainverse/` 为 scope 前缀。
- 包名唯一，通过根 `tsconfig.json` 的 `paths` 别名解析（`@brainverse/shared` → `packages/shared/src`）。
- 每个包必须包含 `package.json`、`tsconfig.json`、`src/index.ts`（统一导出入口）。

---

## Task 1.5.3 前端架构说明

### 1. Next.js App Router 路由结构

前端采用 Next.js App Router，所有业务路由挂在 `[locale]` 动态段下，支持 `en` / `zh` / `ja` 三语。

```
apps/web/app/
├── layout.tsx                  # 根布局（html/body、字体、全局元数据）
├── globals.css                 # 全局样式 + Design Token CSS 变量
├── robots.ts                   # robots.txt 生成
├── sitemap.ts                  # sitemap.xml 生成
├── manifest.ts                 # PWA manifest
└── [locale]/
    ├── layout.tsx              # 多语言布局（Navbar + Footer + CookieConsent + Toast）
    ├── page.tsx                # 首页（Landing）
    ├── games/
    │   ├── page.tsx            # 游戏大厅（Game Hub）
    │   └── [slug]/
    │       ├── page.tsx        # 游戏详情/入口页
    │       └── result/
    │           └── page.tsx    # 游戏结果页
    ├── dashboard/
    │   └── page.tsx            # 用户仪表盘
    ├── brain-age/
    │   ├── page.tsx            # Brain Age 评估入口
    │   └── result/
    │       └── page.tsx        # Brain Age 结果页
    ├── articles/
    │   ├── page.tsx            # 文章列表（Content Hub）
    │   └── [slug]/
    │       └── page.tsx        # 文章详情页（SSG）
    ├── achievements/
    │   └── page.tsx            # 成就页
    ├── challenges/
    │   └── page.tsx            # 挑战页
    ├── profile/
    │   └── page.tsx            # 用户资料页
    ├── settings/
    │   └── page.tsx            # 设置页
    ├── auth/
    │   ├── login/
    │   │   └── page.tsx        # 登录页
    │   └── signup/
    │       └── page.tsx        # 注册页
    └── about/
        └── page.tsx            # 关于页
```

### 2. 页面层级与布局继承关系

布局采用三层继承：

```
app/layout.tsx（Root Layout）
  ├─ html lang="en"（默认，由 [locale] 覆盖）
  ├─ body + Inter 字体加载
  ├─ 全局 metadata（title template、OpenGraph、Twitter Card 默认值）
  └─ app/[locale]/layout.tsx（Locale Layout）
       ├─ 设置 html lang={locale}
       ├─ 验证 locale ∈ ['en','zh','ja']
       ├─ 生成 locale 特定 metadata + hreflang alternate
       ├─ <Navbar />（语言切换、登录按钮、移动端汉堡菜单）
       ├─ <main>{children}</main>
       ├─ <Footer />
       ├─ <CookieConsent />
       ├─ <BottomNav />（移动端底部导航）
       └─ <ToastContainer />
            └─ app/[locale]/<page>/layout.tsx（Page Layout，可选）
                 └─ 具体页面内容
```

- **Root Layout**：负责全局不可变结构（字体、主题、SEO 默认值），不感知 locale。
- **Locale Layout**：负责多语言相关的全局壳子（导航、页脚、Cookie 同意、Toast），所有业务页面共享。
- **Page Layout**：可选，仅特定子树需要时使用（如游戏区需要全屏布局）。

### 3. Server Component vs Client Component 划分原则

| 类型 | 使用场景 | 示例 |
|------|----------|------|
| **Server Component（默认）** | 数据获取、SEO 元数据注入、静态内容渲染、不需要交互的展示组件 | 文章详情页、游戏大厅列表、Dashboard 初始数据、SEO metadata 生成、JSON-LD 注入 |
| **Client Component（`'use client'`）** | 交互逻辑、状态管理、浏览器 API、游戏运行时、表单、动画 | 游戏画布、登录表单、语言切换器、Toast、Modal、排行榜实时刷新、Turnstile widget |

**划分原则**：
- 默认使用 Server Component，仅在必须时添加 `'use client'`。
- 把交互部分隔离为叶子 Client Component，保持页面层级为 Server Component 以利于 SEO。
- 游戏页面：外层 Server Component 负责 SEO 与游戏元数据，内层 Client Component 承载游戏引擎运行时。
- 数据获取尽量在 Server Component 完成（fetch + KV cache），避免 Client 端重复请求。

### 4. 数据获取策略

采用三层组合策略，兼顾 SEO、性能与配额：

| 场景 | 策略 | 说明 |
|------|------|------|
| **初始加载（首屏）** | Server Component fetch | 在服务端获取数据并渲染 HTML，利于 SEO 与首屏速度。静态内容（文章、游戏列表）走 SSG + ISR 缓存。 |
| **静态内容** | KV cache + SSG | 文章、游戏配置、SEO 元数据等低频变动内容缓存在 KV，SSG 构建时读取，避免每次请求打 D1。 |
| **客户端变更（Mutation）** | Client SWR + fetch | 登录、提交分数、解锁成就等写操作通过 fetch POST 触发，成功后用 SWR `mutate` 刷新相关查询缓存。 |
| **用户私有数据** | Server Component fetch（带 Session） | Dashboard、Profile 等需登录页面，在 Server Component 通过 cookie 读取 Session 后 fetch API。 |
| **排行榜实时数据** | SWR 轮询（长间隔） | 排行榜使用 SWR，刷新间隔 ≥ 60s，避免高频轮询消耗 Workers 配额。 |

**核心原则**：前端 SPA 闭环——游戏结算、分数计算、Brain Age 计算尽量在前端本地完成，仅必要结果 POST 到 API，减少 Workers 调用。

### 5. Shadcn UI 组件使用规范

- 以 Shadcn UI 为基础组件库（基于 Radix UI 原语），通过 `class-variance-authority` 定义变体。
- 组件代码位于 `apps/web/components/ui/`，按需引入（非 npm 依赖，源码拷贝式）。
- 基础组件清单：Button、Card、Input、Label、Badge、Progress、Avatar、Tabs、Toast、Dialog、Skeleton、Toggle。
- **扩展规范**：
  - 不直接修改 Shadcn 原语的可访问性行为（保持 ARIA 语义）。
  - 通过 `variants` 扩展业务变体（如 Badge 增加 `memory` / `attention` / `reaction` / `executive` / `relaxation` 五个维度色变体）。
  - 组件样式通过 `cn()` 工具函数合并 Tailwind class，支持 Design Token 覆盖。
  - 所有组件必须支持 `className` prop 透传，便于上层定制。

### 6. TailwindCSS 主题映射策略

将 `globals.css` 中的 CSS 变量（Design Token）映射到 `tailwind.config.ts`，实现「单一数据源 + 双层引用」：

- **第一层（`globals.css`）**：在 `:root` 与 `.dark` 中定义 CSS 变量（如 `--color-primary: #4A7CFF`），供运行时主题切换与深色模式使用。
- **第二层（`tailwind.config.ts`）**：将 CSS 变量值映射为 Tailwind 语义 token（如 `colors.primary.DEFAULT: '#4A7CFF'`），供组件 class 引用。

映射示例：

```ts
// tailwind.config.ts
colors: {
  primary: { DEFAULT: '#4A7CFF', hover: '#3A6CEE', light: '#4A7CFF20', bg: '#4A7CFF08' },
  secondary: { DEFAULT: '#50C8A8', hover: '#3FB898', light: '#50C8A820' },
  accent: { DEFAULT: '#FFB14A', hover: '#FFA030', light: '#FFB14A20' },
  dim: {
    memory: '#8B5CF6',
    attention: '#06B6D4',
    reaction: '#FFB14A',
    executive: '#10B981',
    relaxation: '#4A7CFF',
  },
  // ...
}
```

- `darkMode: ['class', '[data-theme="dark"]']` 支持 class 切换与 `prefers-color-scheme` 自动深色。
- 维度色（`dim.*`）严格与 `globals.css` 一致，用于游戏卡片、Badge、Progress 的维度视觉区分。
- 修改 Design Token 必须同时更新 `globals.css` 与 `tailwind.config.ts`，保持单一真相源。

---

## Task 1.5.4 后端架构说明

### 1. Hono 路由组织结构

Workers API 基于 Hono 框架，路由按业务域分组，统一挂载在 `/api` 前缀下。

```
workers/api/src/
├── index.ts                     # 应用入口，挂载中间件链与所有路由
├── routes/
│   ├── auth.ts                  # /api/auth/*
│   ├── games.ts                 # /api/games/*
│   ├── scores.ts                # /api/scores/*
│   ├── brain-age.ts             # /api/brain-age/*
│   ├── growth.ts                # /api/growth/*
│   ├── content.ts               # /api/content/*
│   └── admin.ts                 # /api/admin/*
├── middleware/
│   ├── auth.ts                  # requireAuth / requireAdmin / optionalAuth
│   ├── rate-limit.ts            # 基于 KV 的 IP 速率限制
│   ├── cors.ts                  # CORS 配置
│   └── logging.ts               # 请求日志
└── db/
    ├── database.ts              # D1 包装类
    ├── types.ts                 # 表结构 TS 接口
    └── repositories/            # Repository 模式（每表一个）
```

路由端点清单：

| 路由文件 | 挂载点 | 主要端点 |
|----------|--------|----------|
| `auth.ts` | `/api/auth` | `POST /signup`、`POST /login`、`POST /logout`、`GET /session` |
| `games.ts` | `/api/games` | `GET /`（游戏列表）、`GET /:slug`（游戏详情） |
| `scores.ts` | `/api/scores` | `POST /`（提交分数）、`GET /my`（我的历史）、`GET /leaderboard`（排行榜） |
| `brain-age.ts` | `/api/brain-age` | `POST /calculate`（计算并存储）、`GET /history`（历史结果） |
| `growth.ts` | `/api/growth` | `GET /achievements`、`GET /streak`、`GET /pet`、`GET /identity` |
| `content.ts` | `/api/content` | `GET /articles`、`GET /articles/:slug` |
| `admin.ts` | `/api/admin` | `GET /feature-flags`、`PUT /feature-flags`（需 admin 权限） |

### 2. 中间件链

请求处理遵循统一中间件链，顺序固定：

```
Request → CORS → Rate Limit → Auth → Request Log → Handler → Error Handler → Response
```

| 顺序 | 中间件 | 职责 | 失败行为 |
|------|--------|------|----------|
| 1 | **CORS** | 允许 `cowb.cc` 与 `preview.cowb.cc` 跨域，处理预检请求 | 非允许源返回 403 |
| 2 | **Rate Limit** | 基于 KV 的 IP 维度速率限制（默认 60 req/min） | 超限返回 429 |
| 3 | **Auth** | 从 cookie 读取 Session token，查 KV 验证，注入 `ctx.set('user', user)` | 无效 Session 返回 401（`requireAuth`）或继续（`optionalAuth`） |
| 4 | **Request Log** | 记录 method、path、status、duration、requestId | 不阻断请求 |
| 5 | **Handler** | 业务路由处理函数 | 抛出错误由 Error Handler 捕获 |
| 6 | **Error Handler** | 统一错误响应格式 `{ error: { code, message, requestId } }` | 返回 4xx/5xx |

- `GET /health` 与 `GET /api` 不经过 Auth 中间件（公开端点）。
- `requireAdmin` 在 `requireAuth` 基础上额外校验用户 `role === 'admin'`。
- 所有错误响应包含 `requestId`（由 Request ID 中间件生成），便于追踪。

### 3. D1 Repository 模式

采用 **Repository 模式**，每张表对应一个 Repository 类，封装 SQL 操作，对外暴露类型安全的方法。

```
workers/api/src/db/repositories/
├── user-repo.ts            # findById, findByEmail, create, update
├── session-repo.ts         # create, findByToken, delete, deleteExpired
├── game-repo.ts            # findAll, findBySlug
├── score-repo.ts           # create, findByUser, findLeaderboard
├── brain-age-repo.ts       # create, findByUser
├── achievement-repo.ts     # findByUser, create, findByUserAndId
├── streak-repo.ts          # findByUser, upsert
├── brain-pet-repo.ts       # findByUser, upsert
├── challenge-repo.ts       # create, findByCreator, findByTarget, updateStatus
├── article-repo.ts         # findAll, findBySlug, findByCategory
├── feature-flag-repo.ts    # findAll, findByKey, updateEnabled
└── index.ts                # 导出所有 Repository + createRepositories(db) 工厂
```

**规范**：
- Repository 不持有业务逻辑，仅负责数据持久化。
- 所有查询方法返回 `@brainverse/core` 定义的领域模型接口，而非裸 D1 行。
- 通过 `createRepositories(db)` 工厂函数在请求上下文中注入，避免重复实例化。
- 写操作使用参数化查询（`?` 占位），杜绝 SQL 注入。
- 复杂查询（如排行榜）优先走 KV 缓存，D1 仅作为持久化与缓存回源。

### 4. KV 缓存策略

KV 作为边缘缓存层，承担读请求削峰，保护 D1 与 Workers 配额。三类缓存：

| 缓存类型 | KV Namespace | Key 设计 | TTL | 失效策略 |
|----------|--------------|----------|-----|----------|
| **Session** | `SESSIONS` | `session:{token}` | 7 天 | 登出主动删除；过期自动失效 |
| **Leaderboard** | `CACHE` | `lb:{gameId}:{scope}` | 5 分钟 | TTL 过期自动刷新；新分数提交后异步更新 |
| **Config** | `CACHE` | `config:{key}` | 1 小时 | Admin 更新时主动删除 |
| **Feature Flags** | `CACHE` | `flags:all` | 1 小时 | Admin 更新时主动删除 |
| **Article** | `CACHE` | `article:{slug}:{locale}` | 1 小时 | 内容更新时主动删除 |

**策略要点**：
- **Session TTL 7 天**：用户登录后 7 天内免重新登录，平衡体验与安全。
- **Leaderboard TTL 5 分钟**：排行榜允许最多 5 分钟延迟，避免高频写 KV（KV 每日写配额仅 1K）。
- **Config TTL 1 小时**：游戏配置、维度配置等低频变动数据，长 TTL 减少 D1 读。
- **批量写入 + 长 TTL**：写入聚合后再 set，避免单次请求多次写 KV。
- **缓存击穿保护**：热门 key 并发回源时，仅放行首个请求回源，其余复用结果。

### 5. R2 存储策略

R2 存储二进制资源，按用途分桶前缀：

| 前缀 | 用途 | 上传方式 | 生命周期 |
|------|------|----------|----------|
| `avatars/{userId}/{hash}.webp` | 用户头像 | 登录后按需上传，支持 WebP/AVIF | 用户更新头像时删除旧文件 |
| `shares/{userId}/{resultId}.png` | 分享图片（成绩卡） | 用户主动点击分享时生成 | 90 天后自动删除 |
| `covers/{articleSlug}.webp` | 文章封面 | Admin/CMS 写入时上传 | 文章删除时同步删除 |

**策略要点**：
- **按需上传**：仅在用户主动操作（上传头像、点击分享）时写入 R2，避免无谓写操作。
- **格式优化**：图片统一转 WebP/AVIF，控制单文件体积。
- **生命周期规则**：分享图片设置 90 天过期，避免长期占用 10GB 免费配额。
- **直读直显**：R2 对象通过 Workers 代理或公开 URL 直接在 `<img>` 中显示，不经过 D1。
- **Class A 操作控制**：上传、删除属于 Class A 操作（每月 1M 免费），严格按需触发。

---

## Task 1.5.5 Cloudflare 服务映射

BrainVerse 使用 Cloudflare 免费计划提供的 7 项服务，每项服务职责单一、边界清晰。

| # | 服务 | 用途 | 承载内容 | 配额关注点 |
|---|------|------|----------|------------|
| 1 | **Pages** | 前端静态部署 + SSR | Next.js 应用（SSG 页面 + SSR 动态页面）、静态资源 | 500 builds/month |
| 2 | **Workers** | API 后端 | Hono 路由、中间件、业务逻辑、Brain Engine 校验 | 100K req/day |
| 3 | **D1** | 持久化数据库 | users、sessions、games、scores、brain_age_results、achievements、streaks、brain_pets、challenges、articles、article_translations、seo_metadata、feature_flags、admin_users | 5M read/day, 100K write/day |
| 4 | **KV** | 缓存 | SESSIONS namespace（Session）、CACHE namespace（排行榜、配置、Feature Flags、文章缓存） | 100K read/day, 1K write/day |
| 5 | **R2** | 对象存储 | 用户头像、分享图片、文章封面 | 10GB storage, 1M Class A ops/month |
| 6 | **Analytics** | 追踪 | 页面访问（pageview）、业务事件（16 个必需事件：游戏开始/完成、登录/注册、Brain Age 测试、成就解锁等） | 免费计划足够 |
| 7 | **Turnstile** | 人机验证 | 注册、登录场景的 CAPTCHA widget + siteverify | 免费计划足够 |

### 服务交互关系

- **Pages ↔ Workers**：Pages 中 Next.js 的 Server Component 通过 fetch 调用 Workers API（同域 `/api/*` 或跨域 `api.cowb.cc`）。
- **Workers ↔ D1**：通过 `env.DB` binding 执行 SQL，经 Repository 模式封装。
- **Workers ↔ KV**：通过 `env.SESSIONS` 与 `env.CACHE` binding 读写缓存。
- **Workers ↔ R2**：通过 `env.STORAGE` binding 读写对象。
- **Browser ↔ Turnstile**：前端嵌入 Turnstile widget，token 随表单提交到 Workers，Workers 调用 siteverify 校验。
- **Browser ↔ Analytics**：前端通过 `beacon` 上报页面与事件，Analytics 自动采集。
- **Pages → Analytics**：Pages Functions 自动注入 Web Analytics 信标。

### 免费计划服务白名单

仅使用上述 7 项免费服务。**禁止使用** Durable Objects（实时多人状态）、Queues（异步任务）、Vectorize（向量检索）、Workers AI（推理）、Hyperdrive（连接池）等付费或超配额服务。详见 `decisions/0001-initial-architecture.md` 的后果章节。

---

## Task 1.5.6 数据流说明

### 数据流 1：游戏数据流

用户玩一局游戏的完整数据流，体现「前端闭环结算 + 仅必要 POST」策略。

```
┌─────────────┐     1. 加载游戏配置        ┌─────────────────┐
│   Browser    │ ─────────────────────────▶ │  Pages (SSG)    │
│  (游戏运行时) │ ◀───────────────────────── │  游戏配置静态化  │
└──────┬───────┘     2. 返回游戏配置 HTML    └─────────────────┘
       │
       │ 3. 本地运行游戏引擎（game-engine）
       │    • BaseGame.start() → 多轮交互
       │    • ScoreEngine 实时计算分数/正确率/反应时
       │    • AdaptiveDifficulty 动态调整难度
       │    • 全程无网络请求（节省 Workers 配额）
       │
       │ 4. 游戏结束，前端本地结算
       │    • 生成 GameResult { score, accuracy, reactionMs, rounds }
       │
       ▼ 5. POST /api/scores
┌─────────────────┐     6. Auth + 校验      ┌─────────────────┐
│  Workers (Hono) │ ───────────────────────▶│   D1 (scores)   │
│  /api/scores    │ ◀───────────────────────│   写入分数记录   │
└────────┬────────┘     7. 写入成功          └─────────────────┘
         │
         │ 8. 异步更新排行榜缓存
         ▼
┌─────────────────┐
│   KV (CACHE)    │
│  leaderboard    │
│  TTL 5min       │
└─────────────────┘
```

**关键点**：
- 步骤 3-4 完全在前端本地完成，零网络请求，是节省 Workers 配额的核心。
- 仅步骤 5 触发一次 Workers 调用（POST /api/scores）。
- 步骤 8 排行榜更新可异步，允许最多 5 分钟延迟（KV TTL）。

### 数据流 2：认证数据流

用户注册/登录的完整流程，集成 Turnstile 人机验证。

```
┌─────────────┐  1. 渲染 Turnstile widget  ┌─────────────────┐
│   Browser    │ ◀─────────────────────────│  Pages (SSR)    │
│  (登录表单)   │                            └─────────────────┘
└──────┬───────┘
       │ 2. 用户提交表单（含 Turnstile token）
       ▼
┌─────────────────┐  3. siteverify 校验     ┌─────────────────┐
│                 │ ───────────────────────▶│  Turnstile      │
│  Workers (Hono) │ ◀───────────────────────│  siteverify API │
│  /api/auth/login│   4. 返回 { success }    └─────────────────┘
└────────┬────────┘
         │ 5. 校验通过，查询用户
         ▼
┌─────────────────┐  6. findByEmail         ┌─────────────────┐
│   D1 (users)    │ ◀───────────────────────│                 │
│   查询用户记录   │ ───────────────────────▶│  Workers        │
└─────────────────┘  7. 返回 user 行          │                 │
                                          └────────┬────────┘
                                                   │ 8. 密码校验通过
                                                   │    生成 Session token
                                                   ▼
                                          ┌─────────────────┐  9. 写入 Session
                                          │   KV (SESSIONS) │ ◀──────────
                                          │  session:{token}│
                                          │  TTL 7d         │
                                          └─────────────────┘
                                                   │
                                                   │ 10. 设置 HttpOnly Cookie
                                                   ▼
                                          ┌─────────────────┐
                                          │   Browser       │
                                          │  cookie: session│
                                          └─────────────────┘
```

**关键点**：
- Turnstile token 必须先经 siteverify 校验，失败直接 403。
- Session 写入 KV（非 D1），后续请求读 KV 验证，避免每请求打 D1。
- Cookie 设置 `HttpOnly` + `Secure` + `SameSite=Lax`，防 CSRF 与 XSS 窃取。
- Session TTL 7 天，过期自动失效，用户需重新登录。

### 数据流 3：Brain Age 数据流

Brain Age 评估的完整流程，体现「前端计算 + 服务端存储 + 常模对比」。

```
┌─────────────┐  1. 加载测试游戏集        ┌─────────────────┐
│   Browser    │ ◀─────────────────────────│  Pages (SSG)    │
│ (Brain Age   │                            └─────────────────┘
│  测试页)      │
└──────┬───────┘
       │ 2. 依次完成多款测试游戏
       │    （如 Visual Search + Digit Span + Reaction + Stroop + Spatial）
       │
       │ 3. 前端本地计算（brain-engine）
       │    • 收集各维度原始分
       │    • Brain Age Formula 计算（受保护系统）
       │    • 生成 dimensionScores { memory, attention, reaction, ... }
       │    • 得出 brainAge 数值
       │
       ▼ 4. POST /api/brain-age/calculate
┌─────────────────┐  5. 服务端二次校验       ┌─────────────────┐
│  Workers (Hono) │ ───────────────────────▶│   D1            │
│                 │  6. 存储 brain_age_results│ (brain_age_*)  │
└────────┬────────┘ ◀───────────────────────│  写入测试结果    │
         │                            └─────────────────┘
         │ 7. 读取常模数据对比
         ▼
┌─────────────────┐  8. 返回常模分布         ┌─────────────────┐
│   KV (CACHE)    │ ◀───────────────────────│  Workers        │
│  norm:by-age    │ ───────────────────────▶│  Percentile     │
│  TTL 1h         │                         │  计算           │
└─────────────────┘                         └────────┬────────┘
                                                     │ 9. 返回 {
                                                     │    brainAge,
                                                     │    percentile,
                                                     │    dimensionScores
                                                     │  }
                                                     ▼
                                            ┌─────────────────┐
                                            │   Browser       │
                                            │  渲染结果雷达图  │
                                            └─────────────────┘
```

**关键点**：
- Brain Age 公式为受保护系统（`@brainverse/brain-engine`），前端计算后服务端二次校验防篡改。
- 常模数据缓存在 KV（TTL 1h），避免每次测试都从 D1 聚合。
- 测试结果持久化到 D1，支持历史趋势查询。

### 数据流 4：内容数据流

文章内容从录入到 SSR 渲染的完整流程，强调 SEO 元数据注入。

```
┌─────────────────┐  1. Admin/CMS 写入文章   ┌─────────────────┐
│   Admin / CMS   │ ───────────────────────▶│  Workers        │
│  (录入文章)      │                         │  /api/admin/*   │
└─────────────────┘                         └────────┬────────┘
                                                     │ 2. 写入文章与翻译
                                                     ▼
                                            ┌─────────────────┐
                                            │   D1            │
                                            │  articles       │
                                            │  article_translations│
                                            │  seo_metadata   │
                                            └────────┬────────┘
                                                     │ 3. 失效缓存
                                                     ▼
                                            ┌─────────────────┐
                                            │   KV (CACHE)    │
                                            │  article:*      │
                                            │  (主动删除)      │
                                            └─────────────────┘
                                                     │
                                                     │ 4. 用户访问文章页
                                                     ▼
┌─────────────┐  5. GET /articles/:slug     ┌─────────────────┐
│   Browser    │ ──────────────────────────▶│  Pages (SSR/SSG)│
│              │ ◀──────────────────────────│                 │
└─────────────┘  6. 返回 HTML               └────────┬────────┘
   • SEO 元数据                                      │ 7. 读 KV 缓存
   • JSON-LD                                         ▼
   • 文章内容                               ┌─────────────────┐
                                            │   KV (CACHE)    │
                                            │  article:*      │
                                            │  (命中则直接返回)│
                                            └────────┬────────┘
                                                     │ 8. 未命中则查 D1
                                                     ▼
                                            ┌─────────────────┐
                                            │   D1            │
                                            │  articles +     │
                                            │  translations + │
                                            │  seo_metadata   │
                                            └────────┬────────┘
                                                     │ 9. SSR 渲染
                                                     │    • 注入 <meta>
                                                     │    • 注入 JSON-LD
                                                     │    • 内链关联游戏
                                                     ▼
                                            ┌─────────────────┐
                                            │   HTML 输出      │
                                            │  (SEO 友好)      │
                                            └─────────────────┘
```

**关键点**：
- 文章内容低频变动，优先 SSG + KV 缓存，几乎不消耗 D1 读配额。
- SEO 元数据（title、description、og:image、canonical、JSON-LD）在 SSR 阶段注入 `<head>`，保证爬虫可读。
- Admin 更新内容时主动失效 KV 缓存，确保用户看到最新内容。

---

## Task 1.5.7 免费计划配额管理策略

BrainVerse 仅使用 Cloudflare 免费计划。配额是核心约束，所有架构决策都围绕「在配额内提供服务」展开。以下为 5 项有配额限制的服务的管理策略。

### 1. Workers：100K req/day

**配额**：每日 10 万次请求。

**策略**：
- **前端 SPA 闭环**：游戏运行时、分数计算、Brain Age 计算全部在前端本地完成，不触发 Workers 调用。一局游戏从开始到结束，仅最终提交分数时触发 1 次 POST 请求。
- **仅必要 POST**：所有 GET 数据（游戏配置、文章内容、排行榜）走 Pages SSG/SSR + KV 缓存，不经过 Workers API。Workers 仅处理必须服务端逻辑的写操作（登录、提交分数、Brain Age 存储）。
- **静态内容外移**：文章、游戏配置、SEO 页面由 Pages 直接提供（SSG），不经过 Workers。
- **批量操作**：Admin 操作合并请求，避免单次管理动作触发多次 API 调用。
- **估算**：假设 DAU 1000，每人每日 1 局游戏（1 POST）+ 1 次登录（1 POST）= 2K req/day，远低于 100K 上限，留有 50 倍增长空间。

### 2. D1：5M read/day, 100K write/day

**配额**：每日 500 万次读、10 万次写。

**策略**：
- **KV 缓存吸收读**：所有热点读（排行榜、游戏配置、文章内容、常模数据）走 KV 缓存，D1 仅作为缓存回源。命中率目标 > 95%。
- **内存缓存（请求级）**：单次 Workers 请求内，对同一数据的多次查询复用结果（如多次读同一 user），避免重复打 D1。
- **避免轮询**：前端不使用短间隔轮询。排行榜使用 SWR，刷新间隔 ≥ 60s；Dashboard 数据初始加载后不再轮询，依赖用户主动刷新。
- **Session 走 KV**：Session 验证读 KV 而非 D1，避免每次请求都查 sessions 表。
- **写聚合**：分数提交、成就解锁等写操作在单次请求内完成，不拆分为多次 D1 写。
- **估算**：每日 10 万次写配额，按 1000 DAU × 2 写/人 = 2K write/day，余量充足。读通过 KV 缓存，D1 实际读 < 50K/day。

### 3. Pages：500 builds/month

**配额**：每月 500 次构建。

**策略**：
- **构建优化**：避免无谓触发构建。文章内容、游戏配置等动态数据不参与构建（走运行时 KV/D1），仅代码与静态资源变更触发构建。
- **增量部署**：利用 Pages 的增量构建缓存，减少重复构建时间（虽不直接减少次数，但提升吞吐）。
- **Preview 分支控制**：仅 `main` 与 `preview` 分支触发生产构建，功能分支使用本地开发模式，不触发 Preview 构建。
- **合并提交**：多个小改动合并为一次提交再推送，避免每次 commit 都触发构建。
- **估算**：假设每日 5 次生产构建（main 分支），30 天 = 150 builds/month，远低于 500 上限。Preview 构建按需，控制在 100 次/月内。

### 4. KV：100K read/day, 1K write/day

**配额**：每日 10 万次读、1000 次写（写配额最紧张）。

**策略**：
- **批量写入**：单次 Workers 请求内聚合多个 KV 写操作，使用 `Promise.all` 并发但控制总写次数。例如提交分数后只更新该游戏排行榜（1 次写），不连带更新其他缓存。
- **长 TTL**：所有 KV 缓存使用尽可能长的 TTL（Session 7d、Leaderboard 5m、Config 1h、Article 1h），减少因过期触发的回源与重写。
- **写合并**：排行榜缓存采用「写时聚合」——多个分数提交在 5 分钟窗口内只产生 1 次 KV 写（TTL 过期后下次读时重建）。
- **读为主**：KV 读配额 100K/day 充足，重点保护写配额。Session 验证、配置读取等高频读无压力。
- **估算**：每日 1K 写配额。Session 写（登录）按 1000 DAU 全员每日登录 1 次 = 1K 写，已接近上限。因此排行榜采用 TTL 过期自动重建（读时触发写），不主动写；Config/Article 缓存仅在变更时写（极少）。优先级：Session 写 > 配置写 > 排行榜写。

### 5. R2：10GB storage, 1M Class A ops/month

**配额**：10GB 存储空间，每月 100 万次 Class A 操作（写、列表等）。

**策略**：
- **按需上传**：仅在用户主动操作时上传（头像上传、点击分享生成图片），不做预生成或批量生成。
- **生命周期规则**：分享图片设置 90 天自动过期，避免长期堆积。头像在用户更新时删除旧文件。
- **格式压缩**：所有图片统一转 WebP/AVIF，单文件控制在 100KB 内。10GB 可存约 10 万张图片。
- **Class A 操作控制**：上传、删除、列表属于 Class A（每月 1M 免费）。读（Class B，10M/月免费）无压力。按需上传策略下，Class A 操作远低于 1M/月。
- **估算**：1000 DAU 中 10% 上传头像 = 100 次/月；20% 生成分享图 = 200 次/月；文章封面 100 篇 × 1 次 = 100 次。总计 < 500 Class A ops/月，远低于 1M。

### 配额监控

- 在 Workers 中间件记录每日请求计数，通过 Analytics 监控 Workers req/day 趋势。
- 关键 API（POST /api/scores、POST /api/auth/login）添加配额预警日志，接近 80% 阈值时告警。
- 定期（每周）检查 D1 与 KV 用量仪表盘，确保未接近上限。

---

## 附录：架构决策依据

本文档所有架构选择均基于 `decisions/0001-initial-architecture.md`（ADR-0001）记录的决策。任何架构变更必须先提交新的 ADR 并经 Lead Architect 批准，再更新本文档。

### 关键约束回顾

- **免费计划 Only**：不使用任何付费服务（Durable Objects、Queues、Vectorize、Workers AI 等）。
- **类型安全**：Strict TypeScript，`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes` 全开。
- **SEO 友好**：所有面向用户的页面必须 SSR/SSG，元数据完整，JSON-LD 注入。
- **多语言**：`/[locale]/` 路由，en/zh/ja 三语，翻译 key 结构一致。
- **代码复用**：`@brainverse/*` 共享包，前后端共享类型与逻辑。

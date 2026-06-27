# ADR-0001: Initial Architecture for BrainVerse

> 编号：ADR-0001
> 标题：BrainVerse 初始架构
> 日期：2026-06-25
> 状态：Accepted
> 决策者：Lead Architect
> 相关文档：`context/02-architecture.md`、`PROJECT.md`、`context/00-project.md`、`context/01-product.md`

---

## 1. ADR 标题与日期

**标题**：ADR-0001: Initial Architecture for BrainVerse（BrainVerse 初始架构）

**日期**：2026-06-25

**摘要**：本 ADR 记录 BrainVerse 平台（域名 cowb.cc）的初始技术架构决策，确定以 Cloudflare 免费计划为基础设施底座，采用 pnpm Monorepo + Next.js（App Router）+ Hono（Workers）+ D1 + KV + R2 的技术栈，配合 7 个共享包实现前后端代码复用。

---

## 2. 状态

**Accepted（已接受）**

- 该决策已于 2026-06-25 评审通过并采纳。
- 任何对该架构的根本性变更（如更换框架、引入付费服务、调整 Monorepo 划分）必须提交新的 ADR（如 ADR-0002、ADR-0003 等）并经 Lead Architect 批准。
- 本 ADR 是 `context/02-architecture.md` 的决策依据，架构文档中的所有技术选择必须与本 ADR 一致。

---

## 3. 背景

### 3.1 项目定位

BrainVerse 是一个 **浏览器端脑健康平台**（browser-based brain health platform），定位为「Brain Operating System」（大脑操作系统）。平台提供：

- 认知训练游戏（6 款 MVP 游戏，覆盖 memory / attention / reaction / executive / relaxation 五大认知维度）
- Brain Age 评估（基于多维度测试计算脑力年龄）
- Growth 系统（成就、连续签到、脑力宠物、挑战、身份等级）
- Content 系统（100 篇脑健康科普文章，5 个类别，SEO 驱动）
- 多语言支持（en / zh / ja）

### 3.2 核心需求驱动

平台面临以下硬性约束与目标，这些约束直接驱动了技术栈选择：

| 需求维度 | 具体要求 | 对架构的影响 |
|----------|----------|--------------|
| **全球快速交付** | 用户分布全球，首屏需在 1.5s 内呈现 | 必须边缘部署，传统中心化服务器不可行 |
| **零成本运营** | 仅使用免费计划，无预算采购付费服务 | 必须在 Cloudflare 免费配额内运行（Workers 100K req/day、D1 5M read/day 等） |
| **SEO 友好** | Content 系统依赖 SEO 获取自然流量，300+ SEO 页面 | 前端必须支持 SSR/SSG，元数据可注入，JSON-LD 结构化数据 |
| **类型安全** | 前后端共享类型，避免运行时类型错误 | 必须使用 Strict TypeScript，前后端共享类型定义 |
| **可扩展性** | MVP 验证后能快速扩展（更多游戏、更多语言、更多内容） | 架构需模块化，游戏框架可插拔，i18n 可扩展 |
| **代码复用** | 脑力计算公式、游戏框架、领域模型前后端共享 | 必须使用 Monorepo，共享包机制 |
| **浏览器原生** | 用户无需安装 App，浏览器即开即用 | 前端为主，游戏在浏览器本地运行 |
| **实时性弱** | MVP 不强依赖实时多人交互（挑战为异步） | 不需要 WebSocket / Durable Objects，降低复杂度 |

### 3.3 为何选择 Cloudflare

Cloudflare 提供全球边缘网络，且免费计划覆盖了 BrainVerse 所需的全部基础能力：

- **边缘计算**：Workers 在全球 300+ 城市节点运行，延迟低。
- **全栈免费**：Pages（前端）、Workers（API）、D1（数据库）、KV（缓存）、R2（存储）、Analytics（追踪）、Turnstile（CAPTCHA）均在免费计划内。
- **生态完整**：单一供应商提供前后端 + 数据库 + 缓存 + 存储 + 安全，避免多供应商集成的复杂度。
- **绑定原生**：D1/KV/R2 通过 Workers bindings 直接访问，无网络往返开销。

### 3.4 为何选择 Next.js

- **SSR/SSG 双支持**：App Router 同时支持服务端渲染与静态生成，满足 SEO 需求（文章页 SSG）与动态需求（Dashboard SSR）。
- **SEO 生态成熟**：metadata API、`robots.ts`、`sitemap.ts`、JSON-LD 注入开箱即用。
- **React 生态**：复用 React 组件库（Shadcn UI、Radix UI）与社区资源。
- **App Router**：嵌套路由、布局继承、Server Component 等特性契合多语言 `[locale]` 路由设计。

### 3.5 为何选择 Hono

- **Workers 原生**：Hono 专为 Cloudflare Workers 设计，轻量且高性能，无 Node.js 依赖。
- **中间件生态**：内置 CORS、Zod Validator、JWT 等中间件，契合中间件链需求。
- **类型安全**：路由参数与请求体类型推导，与 Strict TypeScript 配合良好。
- **极简**：无魔法，启动快，适合免费计划下控制 Worker 体积。

### 3.6 为何选择 D1

- **Serverless SQLite**：无需管理数据库实例，按用量计费（免费计划 5M read/day、100K write/day）。
- **Workers 原生绑定**：通过 `env.DB` 直接执行 SQL，无连接池开销。
- **SQL 熟悉度高**：团队熟悉 SQLite/SQL，降低学习成本。
- **事务支持**：支持 SQLite 事务，满足分数提交等原子操作需求。

### 3.7 为何选择 Monorepo

BrainVerse 前后端存在大量共享逻辑：

- **领域模型**：User、Game、Score、Achievement 等接口前后端共用。
- **脑力计算公式**：Brain Engine 前端计算后服务端校验，必须共享同一份公式实现。
- **常量与类型**：LOCALES、DIMENSIONS、API_ROUTES、ApiResponse 等前后端一致。
- **游戏框架**：BaseGame、ScoreEngine 前端运行，但定义需服务端可引用。

Monorepo（pnpm workspace）使这些共享代码以 `@brainverse/*` 包形式存在，单一真相源，避免复制粘贴导致的漂移。

---

## 4. 决策

### 4.1 总体架构决策

采用 **pnpm workspace Monorepo + Next.js（App Router）+ Hono（Cloudflare Workers）+ D1 + KV + R2** 的全 Cloudflare 免费计划架构。

```
Browser → Cloudflare Pages (Next.js SSR/SSG) → Cloudflare Workers (Hono API)
                                                      ↓
                                        D1 (database) / KV (cache) / R2 (storage)
                                                      ↑
                                   Turnstile (CAPTCHA) + Analytics (tracking)
```

### 4.2 Monorepo 结构决策

划分 3 类工作区、7 个共享包：

```
brainverse/
├── apps/web            # Next.js 前端应用（部署到 Pages）
├── workers/api         # Hono API 后端（部署到 Workers）
└── packages/
    ├── shared          # 共享类型、常量、工具函数（最底层，无依赖）
    ├── core            # 领域模型接口（User, Game, Score 等）
    ├── brain-engine    # 受保护的脑力计算公式（6 个公式）
    ├── game-engine     # 游戏框架（BaseGame, ScoreEngine, AdaptiveDifficulty）
    ├── growth-engine   # Growth 逻辑（成就、签到、宠物、挑战、身份）
    ├── content-engine  # 文章 Schema、SEO、JSON-LD
    └── ui              # 共享 React 组件
```

**包依赖方向**：`shared` → `core` → 各 engine → `apps/web` / `workers/api`；`ui` 仅被 `apps/web` 依赖。禁止循环依赖。

### 4.3 前端技术决策

- **框架**：Next.js 14+，App Router 模式。
- **路由**：所有业务路由挂在 `/[locale]/` 下，支持 en / zh / ja。
- **组件策略**：默认 Server Component，仅交互部分用 Client Component（`'use client'`）。
- **数据获取**：Server Component fetch（首屏）+ Client SWR（mutation）+ KV 缓存（静态内容）。
- **样式**：TailwindCSS + Shadcn UI（Radix 原语）。
- **Design Token**：`globals.css` CSS 变量 ↔ `tailwind.config.ts` 语义 token 双层映射。
- **i18n**：`next-intl` 或等价方案，翻译文件 `i18n/{en,zh,ja}.json`，key 结构三语一致。

### 4.4 后端技术决策

- **框架**：Hono，部署到 Cloudflare Workers。
- **路由分组**：`/api/auth`、`/api/games`、`/api/scores`、`/api/brain-age`、`/api/growth`、`/api/content`、`/api/admin`。
- **中间件链**：CORS → Rate Limit → Auth → Request Log → Handler → Error Handler（顺序固定）。
- **数据访问**：Repository 模式，每张表一个 Repository 类，通过 `createRepositories(db)` 工厂注入。
- **KV 缓存**：Session（TTL 7d）、Leaderboard（TTL 5m）、Config（TTL 1h）、Article（TTL 1h）。
- **R2 存储**：avatars / shares / covers 三个前缀，按需上传，分享图 90 天生命周期。

### 4.5 Cloudflare 服务使用决策

仅使用 7 项免费服务：

| 服务 | 用途 |
|------|------|
| Pages | 前端 SSG/SSR 部署 |
| Workers | API 后端 |
| D1 | 持久化数据库（14 张表） |
| KV | 缓存（Session、排行榜、配置、Feature Flags、文章） |
| R2 | 对象存储（头像、分享图、封面） |
| Analytics | 页面与事件追踪（16 个必需事件） |
| Turnstile | 注册/登录人机验证 |

**明确禁止**：Durable Objects、Queues、Vectorize、Workers AI、Hyperdrive 等付费或超配额服务。

### 4.6 类型安全决策

- 全局 Strict TypeScript：`strict: true`、`noUncheckedIndexedAccess: true`、`exactOptionalPropertyTypes: true`、`noImplicitOverride: true`、`noPropertyAccessFromIndexSignature: true`。
- 禁止 `any`（ESLint `no-explicit-any: error`）。
- 前后端通过 `@brainverse/*` 共享类型，单一真相源。

### 4.7 TailwindCSS Design Token 决策

- `globals.css` 中 `:root` 与 `.dark` 定义 CSS 变量。
- `tailwind.config.ts` 将 CSS 变量值映射为语义 token（colors / borderRadius / spacing / fontSize / boxShadow 等）。
- 5 个维度色（memory #8B5CF6、attention #06B6D4、reaction #FFB14A、executive #10B981、relaxation #4A7CFF）前后端一致。
- `darkMode: ['class', '[data-theme="dark"]']` 支持手动与自动深色模式。

---

## 5. 替代方案考虑

在确定当前架构前，评估了以下替代方案，均因不满足核心约束而被拒绝。

### 5.1 前端框架替代方案

| 替代方案 | 拒绝原因 |
|----------|----------|
| **Vue + Nuxt** | Vue 生态 SEO 方案成熟度不及 Next.js；App Router 的嵌套布局与 Server Component 更契合 `[locale]` 多语言路由；团队 React 熟悉度更高；Shadcn UI 等 React 组件库更丰富。 |
| **SvelteKit** | SvelteKit 的 SSR/SSG 支持良好，但生态规模小于 React/Next.js；Cloudflare Pages 对 SvelteKit 的适配虽有，但社区资源与 Next.js 相比偏少；团队 Svelte 经验不足。 |
| **Astro** | Astro 内容站点 SEO 极强，但交互式游戏运行时支持弱于 Next.js（岛屿架构对复杂游戏状态管理不友好）；BrainVerse 既有内容站需求也有重度交互（游戏）需求，Next.js 更全面。 |
| **纯 SPA（Vite + React）** | 纯 SPA 无法满足 SEO 需求（Content 系统依赖自然流量）；首屏白屏时间不利于用户体验与转化。 |

### 5.2 后端框架替代方案

| 替代方案 | 拒绝原因 |
|----------|----------|
| **Express / Fastify（Node.js）** | 需要传统服务器托管，无法部署到 Cloudflare Workers 边缘节点；不符合「全球边缘交付 + 免费计划」约束。 |
| **itty-router** | 同为 Workers 路由库，但中间件生态与类型推导不如 Hono 完善；Hono 的 Zod Validator、JWT 等开箱即用中间件更契合需求。 |
| **Next.js Route Handlers（直接用 Pages Functions）** | 将 API 与前端耦合在 Next.js 中，不利于独立扩展与部署；Workers + Hono 可独立于 Pages 部署与扩缩容，边界更清晰。 |

### 5.3 数据库替代方案

| 替代方案 | 拒绝原因 |
|----------|----------|
| **Supabase** | 免费计划有限（500MB 存储、50K MAU），且非 Cloudflare 生态，跨供应商集成增加延迟与复杂度；不满足「免费计划 Only + 单供应商」约束。 |
| **PlanetScale** | 已取消免费计划，需付费；不符合零成本约束。 |
| **Neon (Serverless Postgres)** | 免费计划存在但非 Cloudflare 原生绑定，跨网络访问增加延迟；Postgres 功能丰富但 BrainVerse 数据模型简单（SQLite 足够），无需 Postgres 高级特性。 |
| **Firebase Firestore** | 非 Cloudflare 生态；NoSQL 模型不利于复杂查询（如排行榜聚合）；免费计划配额限制（50K 读/天、20K 写/天）比 D1 更紧张。 |
| **Turso (libSQL)** | 与 D1 同为 SQLite 边缘数据库，但 D1 是 Cloudflare 原生绑定，无跨供应商网络开销；Turso 免费计划虽也友好，但多供应商集成复杂度更高。 |

### 5.4 部署平台替代方案

| 替代方案 | 拒绝原因 |
|----------|----------|
| **Vercel** | Vercel 免费计划对商用有限制（如带宽、Serverless Function 执行时长），且 Vercel 与 Cloudflare 是竞争关系；明确要求使用 Cloudflare 免费计划，Vercel 不在考虑范围。 |
| **Netlify** | 同 Vercel，非 Cloudflare 生态；免费计划构建配额与带宽限制更严。 |
| **AWS Amplify / Lambda** | 需付费且配置复杂，不符合零成本与极简运维约束。 |

### 5.5 Monorepo 工具替代方案

| 替代方案 | 拒绝原因 |
|----------|----------|
| **npm / yarn workspaces** | pnpm 在磁盘空间、安装速度、严格依赖（避免幽灵依赖）上优于 npm/yarn；pnpm workspace 配置简洁，适合中型 Monorepo。 |
| **Turborepo / Nx** | 当前规模（1 app + 1 worker + 7 packages）无需重型构建编排工具；pnpm + TypeScript Project References 足够。可在未来规模增长后再引入 Turborepo。 |
| **多仓库（Polyrepo）** | 前后端共享类型与公式，多仓库会导致复制粘贴与版本同步地狱；明确违反「代码复用」需求。 |

### 5.6 实时性方案替代方案（针对挑战系统）

| 替代方案 | 拒绝原因 |
|----------|----------|
| **Durable Objects + WebSocket（实时对战）** | Durable Objects 不在免费计划内；MVP 挑战系统为异步（用户发起挑战 → 对方完成后回传结果），无需实时双向通信。未来如需实时对战，需评估升级付费计划。 |
| **轮询 API** | 轮询消耗 Workers 与 D1 配额，违反配额管理策略；挑战结果采用「推式通知」（用户下次登录时拉取）而非轮询。 |

---

## 6. 后果

### 6.1 正面后果

| 维度 | 收益 |
|------|------|
| **全球边缘交付** | 所有请求在离用户最近的 Cloudflare 节点处理，首屏延迟低（< 1.5s 全球），无需自建 CDN。 |
| **零成本运营** | 7 项服务均在免费计划内，MVP 阶段零基础设施成本。配额估算显示 1000 DAU 下各项配额余量充足（Workers 余量 50 倍、D1 写余量 50 倍）。 |
| **类型安全** | Strict TypeScript + `@brainverse/*` 共享包，前后端类型单一真相源，编译期捕获类型错误，减少运行时故障。 |
| **代码复用** | Monorepo + 7 共享包，Brain Engine 公式、领域模型、游戏框架前后端共享，避免漂移。Brain Engine 受保护系统可集中管控。 |
| **SEO 友好** | Next.js SSR/SSG + metadata API + JSON-LD，Content 系统 300+ 页面可获自然流量，支持多语言 hreflang。 |
| **可扩展性** | 游戏框架（BaseGame + GameRegistry）支持插拔式新增游戏；i18n 翻译文件结构化，新增语言仅需加 JSON 文件；共享包独立演进。 |
| **单供应商一致性** | 前端、API、数据库、缓存、存储、安全均在 Cloudflare 内，bindings 原生访问，无跨供应商网络开销与集成复杂度。 |
| **运维极简** | Serverless 全栈，无服务器管理、无数据库运维、无扩缩容配置；Git push 即部署。 |
| **安全基线高** | Cloudflare 边缘 DDoS 防护、Turnstile CAPTCHA、CSP/HSTS 头、参数化查询，安全开箱即用。 |

### 6.2 负面后果与风险

| 维度 | 负面影响 / 风险 | 缓解措施 |
|------|-----------------|----------|
| **Workers 配额限制（100K req/day）** | 流量爆发式增长时可能触及请求上限，导致 API 不可用。 | 前端 SPA 闭环结算策略（仅必要 POST）；静态内容走 Pages SSG 不消耗 Workers；估算 1000 DAU 仅 2K req/day，余量 50 倍。达上限后需评估升级付费计划。 |
| **D1 配额限制（5M read/day, 100K write/day）** | 读配额通过 KV 缓存可缓解，但写配额在高频写场景（如批量分数提交）下有风险。 | KV 缓存吸收读（命中率 > 95%）；写操作聚合；Session 走 KV 不打 D1。监控 D1 用量，80% 阈值告警。 |
| **KV 写配额紧张（1K write/day）** | KV 写配额最紧张，Session 写（登录）在 1000 DAU 全员每日登录时即接近上限。 | 排行榜采用 TTL 过期自动重建（读时触发），不主动写；Config/Article 仅变更时写；优先级 Session > Config > Leaderboard。达上限后评估延长 Session TTL 或升级计划。 |
| **D1 相对较新** | Cloudflare D1 仍较新，可能存在未知 bug 或功能限制（如复杂事务、JSON 函数支持完整度）。 | 数据模型保持简单（避免依赖高级 SQLite 特性）；迁移文件充分测试；关注 Cloudflare 更新日志。 |
| **无 Durable Objects** | 免费计划不含 DO，限制实时多人功能（如实时对战、实时排行榜推送）。 | MVP 挑战系统设计为异步；排行榜用 SWR 长轮询（≥60s）替代实时推送；未来实时需求需升级付费计划或重新设计。 |
| **无 Queues** | 免费计划不含 Queues，异步任务（如批量邮件、后台数据聚合）需在请求同步完成或用 KV 模拟。 | 避免重异步任务；耗时操作拆分为同步步骤；分享图生成等用 R2 + 按需触发。 |
| **Pages 构建配额（500 builds/month）** | 高频部署可能触及构建上限。 | 仅 main/preview 分支触发构建；合并提交；功能分支用本地开发。估算 150 builds/month，余量充足。 |
| **R2 存储配额（10GB）** | 大量用户头像与分享图可能占满存储。 | 分享图 90 天生命周期自动删除；图片压缩为 WebP/AVIF；按需上传不预生成。 |
| **供应商锁定** | 深度依赖 Cloudflare 生态（D1/KV/R2 bindings、Pages Functions），迁移成本高。 | 业务逻辑与 Cloudflare 绑定隔离在 `workers/api` 与 `apps/web` 边界层；共享包（core/engine）保持平台无关，便于未来部分迁移。 |
| **Next.js on Pages 的限制** | Next.js 部分高级特性（如某些 ISR 行为、Middleware 复杂逻辑）在 Cloudflare Pages 上的兼容性需验证。 | 优先使用 SSG + 客户端 SWR 替代 ISR；验证关键路由在 Pages 的运行时行为；关注 `@cloudflare/next-on-pages` 适配进展。 |
| **多语言复杂度** | en/zh/ja 三语 + 翻译 key 三语一致维护成本高。 | 翻译文件结构化校验（key 结构一致性自动化检查）；新增 key 必须三语同步。 |
| **Brain Engine 受保护性** | Brain Age 等公式在前端计算（性能与离线考虑），存在被逆向或篡改风险。 | 服务端二次校验关键结果；公式实现集中在 `@brainverse/brain-engine` 受保护包，标注 `PROTECTED SYSTEM` 注释；修改需 explicit approval。 |

### 6.3 决策的不可逆性

本决策的不可逆程度中等：

- **可逆部分**：前端组件库（Shadcn 可替换）、i18n 方案、Tailwind 配置、Repository 实现细节等可逐步调整。
- **半可逆部分**：Monorepo 结构调整需迁移成本但可行；Cloudflare 服务间迁移（如 D1 → Turso）需重写数据访问层。
- **不可逆部分**：深度绑定 Cloudflare bindings 后，整体迁移到其他平台成本极高；建议通过共享包隔离业务逻辑降低耦合。

### 6.4 后续 ADR 触发条件

以下情况出现时，应提交新的 ADR 评估是否调整架构：

1. DAU 超过 1000 且配额使用率持续 > 70% → 评估升级 Cloudflare 付费计划。
2. 出现实时多人功能需求（如实时对战）→ 评估引入 Durable Objects 或升级计划。
3. D1 功能限制影响业务（如需全文检索）→ 评估引入外部搜索引擎或迁移数据库。
4. 团队规模增长导致 Monorepo 构建过慢 → 评估引入 Turborepo / Nx。
5. 需要服务端 AI 推理（如个性化推荐）→ 评估 Workers AI 或外部 API。

---

## 附录：决策摘要表

| 决策项 | 选择 | 主要理由 |
|--------|------|----------|
| 基础设施 | Cloudflare 免费计划 | 全球边缘 + 全栈免费 + 单供应商 |
| 前端框架 | Next.js（App Router） | SSR/SSG + SEO 生态 + React 组件库 |
| 后端框架 | Hono on Workers | 轻量 + Workers 原生 + 类型安全 |
| 数据库 | D1（SQLite） | Serverless + 原生绑定 + 熟悉度高 |
| 缓存 | KV | 边缘缓存 + 原生绑定 + 免费 |
| 对象存储 | R2 | 10GB 免费 + 无出口费 |
| CAPTCHA | Turnstile | 免费 + 无障碍 + 原生集成 |
| 追踪 | Analytics | 免费 + 自动采集 |
| Monorepo | pnpm workspace | 代码复用 + 严格依赖 + 速度快 |
| 类型系统 | Strict TypeScript | 类型安全 + 前后端共享 |
| 样式 | TailwindCSS + Shadcn UI | Design Token 映射 + 可访问性 |
| 共享包 | 7 个 `@brainverse/*` 包 | 领域模型/公式/框架复用 |
| 实时性 | 不使用（异步设计） | 免费计划无 DO + MVP 无实时需求 |

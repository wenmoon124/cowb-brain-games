# Checklist — BrainVerse 项目初始化与基础架构

## Phase A: 文档框架验证

### PROJECT.md

- [x] PROJECT.md 存在
- [x] 包含项目使命声明（Brain Operating System 定位）
- [x] 包含产品愿景（BrainVerse IS / IS NOT 清单）
- [x] 包含权威层级（Business > Product > Architecture > Tech > Design > Implementation）
- [x] 包含技术栈定义（Next.js / TypeScript / Tailwind / Shadcn / Workers / D1 / KV / R2）
- [x] 包含 Cloudflare 免费计划服务白名单（Pages / Workers / D1 / KV / R2 / Analytics / Turnstile / DNS / Cache）
- [x] 包含 Cloudflare 免费计划服务黑名单（Durable Objects / Queues / Vectorize / Workers AI / AI Gateway / Browser Rendering / Cloudflare Images）
- [x] 包含多语言策略（en / zh / ja 路由规则）
- [x] 包含 MVP 产品范围（11 个核心模块）
- [x] 包含 MVP 游戏清单（Visual Search / Digit Span / Reaction Training / Stroop Challenge / Spatial Memory / Breathing Flow）
- [x] 包含 Brain Engine 受保护系统清单（6 个公式）
- [x] 包含 Growth Engine 模块清单（10 个子系统）
- [x] 包含 Content Engine 规范（100 篇文章、5 类别）
- [x] 包含 SEO 规则（每页必需元数据清单）
- [x] 包含数据库规则（迁移制、类型安全）
- [x] 包含 Admin Panel 模块清单
- [x] 包含 Feature Flags 策略
- [x] 包含 Analytics 事件清单（16 个事件）
- [x] 包含错误处理策略
- [x] 包含备份策略

### AGENTS.md

- [x] AGENTS.md 存在
- [x] 包含 AI 代理角色定义
- [x] 包含文档加载顺序（PROJECT → AGENTS → Design → context → specs → docs → decisions）
- [x] 包含设计参考使用规则（设计仅为参考）
- [x] 包含代码质量要求（Strict TS / No any / No dup / Reusable / Accessible / Mobile First / SEO）
- [x] 包含开发工作流（12 步流程）
- [x] 包含 Review Checklist（11 项验证）
- [x] 包含 GitHub MCP 工作流
- [x] 包含 Cloudflare MCP 工作流
- [x] 包含输出格式规范
- [x] 包含上下文缺失处理规则（STOP → Request → Never guess）

### context/ 目录

- [x] context/00-project.md 存在
- [x] 包含项目背景与竞品分析
- [x] 包含项目目标（MVP + 长期）
- [x] 包含项目范围（In Scope / Out of Scope）
- [x] 包含利益相关者画像
- [x] 包含项目约束
- [x] 包含成功指标
- [x] context/01-product.md 存在
- [x] 包含产品愿景声明
- [x] 包含 11 个核心模块定义（各有目的、功能列表、用户故事）
- [x] 包含 6 款 MVP 游戏详细规格（认知目标、规则、难度、评分、数据点）
- [x] 包含 Brain Engine 6 个受保护系统说明
- [x] 包含 Growth Engine 10 个子系统说明
- [x] 包含 Content Engine 规格说明（100 篇文章分配、文章结构、Content ↔ Game Loop）
- [x] context/02-architecture.md 存在
- [x] 包含系统架构总览
- [x] 包含 Monorepo 结构说明
- [x] 包含前端架构说明（App Router、Server/Client Component、数据获取）
- [x] 包含后端架构说明（Hono 路由、中间件链、Repository 模式、KV/R2 策略）
- [x] 包含 Cloudflare 服务映射（7 个服务各自用途）
- [x] 包含数据流说明（4 条数据流：游戏、认证、Brain Age、内容）
- [x] 包含免费计划配额管理策略（5 个服务的配额与应对策略）

### decisions/ 和 docs/

- [x] decisions/0001-initial-architecture.md 存在
- [x] 包含 ADR 标题、日期、状态
- [x] 包含背景与决策说明
- [x] 包含替代方案考虑
- [x] 包含后果分析
- [x] docs/development.md 存在
- [x] docs/deployment.md 存在
- [x] docs/database.md 存在
- [x] docs/testing.md 存在
- [x] docs/seo.md 存在
- [x] docs/i18n.md 存在

## Phase B: Monorepo 基础结构验证

### 根 package.json

- [x] package.json name === "brainverse"
- [x] private === true
- [x] packageManager 配置为 pnpm
- [x] engines.node >= 20
- [x] engines.pnpm >= 9
- [x] scripts.dev 存在
- [x] scripts.build 存在
- [x] scripts.test 存在
- [x] scripts.typecheck 存在
- [x] scripts.lint 存在
- [x] scripts.format 存在
- [x] scripts.db:migrate 存在
- [x] scripts.deploy:web 存在
- [x] scripts.deploy:api 存在
- [x] devDependencies 包含 typescript
- [x] devDependencies 包含 eslint
- [x] devDependencies 包含 prettier

### pnpm-workspace.yaml

- [x] 文件存在
- [x] packages 包含 'apps/*'
- [x] packages 包含 'packages/*'
- [x] packages 包含 'workers/*'

### 根 tsconfig.json

- [x] compilerOptions.strict === true
- [x] compilerOptions.noUncheckedIndexedAccess === true
- [x] compilerOptions.exactOptionalPropertyTypes === true
- [x] compilerOptions.noImplicitOverride === true
- [x] compilerOptions.noPropertyAccessFromIndexSignature === true
- [x] paths 包含 @brainverse/shared
- [x] paths 包含 @brainverse/core
- [x] paths 包含 @brainverse/brain-engine
- [x] paths 包含 @brainverse/game-engine
- [x] paths 包含 @brainverse/growth-engine
- [x] paths 包含 @brainverse/content-engine
- [x] paths 包含 @brainverse/ui
- [x] references 指向各子项目

### .gitignore

- [x] 包含 node_modules
- [x] 包含 dist / build / .turbo
- [x] 包含 .env / .env.local / .env.production / .dev.vars
- [x] 包含 .wrangler / .mf
- [x] 包含 .next / out
- [x] 包含 .vscode/settings.json / .idea
- [x] 包含 .DS_Store / Thumbs.db
- [x] 包含 *.log / npm-debug.log

### .eslintrc.cjs

- [x] extends 包含 eslint:recommended
- [x] extends 包含 @typescript-eslint/recommended
- [x] extends 包含 next/core-web-vitals
- [x] extends 包含 prettier
- [x] rules.no-console === 'warn'
- [x] rules.no-explicit-any === 'error'
- [x] rules.@typescript-eslint/no-unused-vars === 'error'
- [x] ignorePatterns 包含 node_modules / dist / .next / .wrangler

### .prettierrc

- [x] semi === false
- [x] singleQuote === true
- [x] tabWidth === 2
- [x] trailingComma === 'es5'
- [x] printWidth === 100

## Phase C: Next.js 前端应用验证

### apps/web/package.json

- [x] dependencies 包含 next
- [x] dependencies 包含 react
- [x] dependencies 包含 react-dom
- [x] dependencies 包含 tailwindcss
- [x] dependencies 包含 postcss
- [x] dependencies 包含 autoprefixer
- [x] dependencies 包含 class-variance-authority
- [x] dependencies 包含 clsx
- [x] dependencies 包含 tailwind-merge
- [x] dependencies 包含 tailwindcss-animate
- [x] dependencies 包含 lucide-react
- [x] dependencies 包含 zod
- [x] devDependencies 包含 @types/react
- [x] devDependencies 包含 @types/react-dom
- [x] devDependencies 包含 @types/node
- [x] devDependencies 包含 eslint
- [x] devDependencies 包含 eslint-config-next
- [x] scripts.dev 存在
- [x] scripts.build 存在
- [x] scripts.start 存在
- [x] scripts.lint 存在
- [x] scripts.typecheck 存在

### apps/web/tsconfig.json

- [x] 继承根 tsconfig
- [x] jsx === 'preserve'
- [x] plugins 包含 { name: 'next' }
- [x] paths 包含 @/* → ./src/*
- [x] include 包含 next-env.d.ts
- [x] include 包含 **/*.ts
- [x] include 包含 **/*.tsx

### apps/web/tailwind.config.ts — Design Token 映射

- [x] darkMode 配置为 ['class', '[data-theme="dark"]']
- [x] content 路径包含 ./src/**/*.{ts,tsx}
- [x] content 路径包含 ./app/**/*.{ts,tsx}
- [x] colors.primary.DEFAULT === '#4A7CFF'
- [x] colors.primary.hover === '#3A6CEE'
- [x] colors.primary.light === '#4A7CFF20'
- [x] colors.primary.bg === '#4A7CFF08'
- [x] colors.secondary.DEFAULT === '#50C8A8'
- [x] colors.secondary.hover === '#3FB898'
- [x] colors.secondary.light === '#50C8A820'
- [x] colors.accent.DEFAULT === '#FFB14A'
- [x] colors.accent.hover === '#FFA030'
- [x] colors.accent.light === '#FFB14A20'
- [x] colors.background.DEFAULT === '#F7F9FC'
- [x] colors.background.secondary === '#EEF1F6'
- [x] colors.card === '#FFFFFF'
- [x] colors.text.primary === '#1A202C'
- [x] colors.text.secondary === '#64748B'
- [x] colors.text.muted === '#94A3B8'
- [x] colors.border.DEFAULT === '#E2E8F0'
- [x] colors.border.light === '#F1F5F9'
- [x] colors.success === '#50C8A8'
- [x] colors.warning === '#FFB14A'
- [x] colors.error === '#EF4444'
- [x] colors.info === '#4A7CFF'
- [x] colors.dim.memory === '#8B5CF6'
- [x] colors.dim.attention === '#06B6D4'
- [x] colors.dim.reaction === '#FFB14A'
- [x] colors.dim.executive === '#10B981'
- [x] colors.dim.relaxation === '#4A7CFF'
- [x] borderRadius.sm === '8px'
- [x] borderRadius.md === '12px'
- [x] borderRadius.lg === '16px'
- [x] borderRadius.xl === '24px'
- [x] borderRadius.full === '9999px'
- [x] spacing.xs === '4px'
- [x] spacing.sm === '8px'
- [x] spacing.md === '16px'
- [x] spacing.lg === '24px'
- [x] spacing.xl === '32px'
- [x] spacing['2xl'] === '48px'
- [x] spacing['3xl'] === '64px'
- [x] fontSize.xs === '12px'
- [x] fontSize.sm === '14px'
- [x] fontSize.md === '16px'
- [x] fontSize.lg === '18px'
- [x] fontSize.xl === '24px'
- [x] fontSize['2xl'] === '32px'
- [x] fontSize['3xl'] === '40px'
- [x] fontSize['4xl'] === '48px'
- [x] fontSize['5xl'] === '64px'
- [x] boxShadow 包含 sm / md / lg / xl
- [x] boxShadow 包含 glow-primary
- [x] boxShadow 包含 glow-secondary
- [x] boxShadow 包含 glow-accent
- [x] boxShadow 包含 glow-memory
- [x] boxShadow 包含 glow-attention
- [x] boxShadow 包含 glow-reaction
- [x] boxShadow 包含 glow-executive
- [x] boxShadow 包含 glow-relaxation
- [x] backgroundImage 包含 gradient-primary
- [x] backgroundImage 包含 gradient-secondary
- [x] backgroundImage 包含 gradient-accent
- [x] backgroundImage 包含 gradient-hero
- [x] transitionDuration.fast === '150ms'
- [x] transitionDuration.normal === '300ms'
- [x] transitionDuration.slow === '500ms'
- [x] keyframes 包含 fadeIn / slideUp / slideDown / scaleIn / pulse / shimmer / float / breathe / heartbeat / confetti / ripple / bounceIn / shake / glow / spin
- [x] animation 对应所有 keyframes
- [x] zIndex.base === 1
- [x] zIndex.dropdown === 100
- [x] zIndex.sticky === 200
- [x] zIndex.overlay === 300
- [x] zIndex.modal === 400
- [x] zIndex.toast === 500
- [x] backdropBlur.glass === '16px'
- [x] plugins 包含 tailwindcss-animate

### apps/web/postcss.config.js

- [x] plugins 包含 tailwindcss
- [x] plugins 包含 autoprefixer

### apps/web/next.config.js

- [x] reactStrictMode === true
- [x] i18n.locales 包含 'en'
- [x] i18n.locales 包含 'zh'
- [x] i18n.locales 包含 'ja'
- [x] i18n.defaultLocale === 'en'
- [x] images.formats 包含 'image/avif'
- [x] images.formats 包含 'image/webp'
- [x] experimental.serverActions === true
- [x] headers 包含 CSP 配置
- [x] headers 包含 X-Frame-Options
- [x] headers 包含 X-Content-Type-Options
- [x] redirects 包含 / → /en
- [x] poweredByHeader === false

### apps/web/app/globals.css

- [x] 包含 @tailwind base
- [x] 包含 @tailwind components
- [x] 包含 @tailwind utilities
- [x] :root 包含 --primary: #4A7CFF
- [x] :root 包含 --secondary: #50C8A8
- [x] :root 包含 --accent: #FFB14A
- [x] :root 包含所有 Design Token 变量
- [x] .dark 包含深色模式覆盖
- [x] 包含 @media (prefers-color-scheme: dark)
- [x] 包含全局滚动条样式
- [x] 包含 reduced-motion 媒体查询
- [x] 包含 safe-area-inset 支持

### apps/web/app/layout.tsx

- [x] 文件存在
- [x] 配置 html lang
- [x] 配置 metadata title template
- [x] 配置 metadata description
- [x] 配置 viewport
- [x] 配置 themeColor: '#4A7CFF'
- [x] 加载 Inter 字体
- [x] 配置 OpenGraph 默认元数据
- [x] 配置 Twitter Card 默认元数据

### apps/web/app/[locale]/layout.tsx

- [x] 文件存在
- [x] 接收 params.locale
- [x] 验证 locale ∈ ['en', 'zh', 'ja']
- [x] 设置 html lang 属性
- [x] 生成 locale 特定 metadata
- [x] 配置 hreflang alternate 链接
- [x] 渲染 Navbar
- [x] 渲染 children
- [x] 渲染 Footer
- [x] 渲染 CookieConsent
- [x] 渲染 Toast 容器

### apps/web/app/[locale]/page.tsx

- [x] 文件存在
- [x] 使用翻译函数
- [x] 渲染 Hero 区域
- [x] 渲染游戏入口卡片
- [x] 渲染 CTA 区域
- [x] 无硬编码文本

### 多语言翻译文件

- [x] apps/web/i18n/en.json 存在
- [x] en.json 包含 common 部分
- [x] en.json 包含 nav 部分
- [x] en.json 包含 landing 部分
- [x] en.json 包含 games 部分
- [x] en.json 包含 dashboard 部分
- [x] en.json 包含 auth 部分
- [x] en.json 包含 cookie 部分
- [x] en.json 包含 footer 部分
- [x] en.json 包含 errors 部分
- [x] en.json 包含 games_runtime 部分
- [x] apps/web/i18n/zh.json 存在
- [x] zh.json key 结构与 en.json 完全一致
- [x] apps/web/i18n/ja.json 存在
- [x] ja.json key 结构与 en.json 完全一致

### 基础组件

- [x] apps/web/lib/utils.ts 存在
- [x] utils.ts 导出 cn() 函数
- [x] utils.ts 导出 formatDate() 函数
- [x] utils.ts 导出 formatNumber() 函数
- [x] utils.ts 导出 getLocale() 函数
- [x] utils.ts 导出 validateLocale() 函数
- [x] apps/web/components/ui/button.tsx 存在
- [x] Button 支持 variants: primary, secondary, accent, ghost
- [x] Button 支持 sizes: sm, md, lg, xl, icon
- [x] apps/web/components/ui/card.tsx 存在
- [x] Card 导出 Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- [x] apps/web/components/ui/input.tsx 存在
- [x] apps/web/components/ui/label.tsx 存在
- [x] apps/web/components/ui/badge.tsx 存在
- [x] Badge 支持 variants: memory, attention, reaction, executive, relaxation, success, warning, error, info
- [x] apps/web/components/ui/progress.tsx 存在
- [x] Progress 支持维度色变体
- [x] apps/web/components/ui/avatar.tsx 存在
- [x] apps/web/components/ui/tabs.tsx 存在
- [x] apps/web/components/ui/toast.tsx 存在
- [x] Toast 导出 Toast, ToastContainer, useToast
- [x] apps/web/components/ui/modal.tsx 存在
- [x] apps/web/components/ui/skeleton.tsx 存在
- [x] apps/web/components/ui/toggle.tsx 存在

### 布局组件

- [x] apps/web/components/layout/navbar.tsx 存在
- [x] Navbar 包含 Logo
- [x] Navbar 包含导航链接
- [x] Navbar 包含语言切换
- [x] Navbar 包含登录按钮
- [x] Navbar 包含移动端汉堡菜单
- [x] apps/web/components/layout/footer.tsx 存在
- [x] Footer 包含版权信息
- [x] Footer 包含链接
- [x] apps/web/components/layout/bottom-nav.tsx 存在
- [x] BottomNav 包含 Home / Games / Dashboard / Profile
- [x] apps/web/components/layout/cookie-consent.tsx 存在
- [x] apps/web/components/layout/language-switcher.tsx 存在
- [x] LanguageSwitcher 支持 en / zh / ja 切换

## Phase D: Cloudflare Workers API 验证

### workers/api/package.json

- [x] dependencies 包含 hono
- [x] dependencies 包含 @hono/zod-validator
- [x] dependencies 包含 zod
- [x] dependencies 包含 @cloudflare/workers-types
- [x] dependencies 包含 wrangler
- [x] devDependencies 包含 vitest
- [x] devDependencies 包含 @cloudflare/vitest-pool-workers
- [x] scripts.dev 存在
- [x] scripts.deploy 存在
- [x] scripts.test 存在
- [x] scripts.typecheck 存在

### workers/api/tsconfig.json

- [x] types 包含 "@cloudflare/workers-types"
- [x] lib 包含 "ES2022"
- [x] module === "ESNext"
- [x] moduleResolution === "Bundler"
- [x] 继承根 tsconfig strict 设置

### workers/api/wrangler.toml

- [x] name === "brainverse-api"
- [x] main === "src/index.ts"
- [x] compatibility_date 已设置
- [x] [[d1_databases]] binding === "DB"
- [x] [[d1_databases]] database_name === "brainverse-db"
- [x] [[kv_namespaces]] binding === "SESSIONS"
- [x] [[kv_namespaces]] binding === "CACHE"
- [x] [[r2_buckets]] binding === "STORAGE"
- [x] [vars] 包含 environment
- [x] [vars] 包含 app_url
- [x] 不包含 durable_objects 配置
- [x] 不包含 queues 配置
- [x] 不包含 vectorize 配置

### workers/api/src/index.ts

- [x] 文件存在
- [x] 创建 Hono 应用实例
- [x] 配置 Bindings 类型（D1Database, KVNamespace, R2Bucket）
- [x] 添加 CORS 中间件
- [x] CORS 允许 cowb.cc
- [x] CORS 允许 preview.cowb.cc
- [x] 添加 Request ID 中间件
- [x] 添加 Request Logging 中间件
- [x] 添加 Error Handler 中间件
- [x] 添加 Not Found Handler
- [x] GET /health 路由存在
- [x] GET /api 路由存在

### workers/api/src/middleware/

- [x] middleware/auth.ts 存在
- [x] auth.ts 导出 getSession()
- [x] auth.ts 导出 requireAuth()
- [x] auth.ts 导出 requireAdmin()
- [x] auth.ts 导出 optionalAuth()
- [x] middleware/rate-limit.ts 存在
- [x] rate-limit.ts 实现 IP 维度限制
- [x] rate-limit.ts 超限返回 429

### workers/api/src/routes/

- [x] routes/auth.ts 存在
- [x] auth.ts 包含 POST /api/auth/signup
- [x] auth.ts 包含 POST /api/auth/login
- [x] auth.ts 包含 POST /api/auth/logout
- [x] auth.ts 包含 GET /api/auth/session
- [x] routes/scores.ts 存在
- [x] scores.ts 包含 POST /api/scores
- [x] scores.ts 包含 GET /api/scores/my
- [x] scores.ts 包含 GET /api/scores/leaderboard
- [x] routes/brain-age.ts 存在
- [x] brain-age.ts 包含 POST /api/brain-age/calculate
- [x] brain-age.ts 包含 GET /api/brain-age/history
- [x] routes/games.ts 存在
- [x] games.ts 包含 GET /api/games
- [x] games.ts 包含 GET /api/games/:slug
- [x] routes/growth.ts 存在
- [x] growth.ts 包含 GET /api/growth/achievements
- [x] growth.ts 包含 GET /api/growth/streak
- [x] growth.ts 包含 GET /api/growth/pet
- [x] routes/challenges.ts 存在
- [x] challenges.ts 包含 POST /api/challenges
- [x] challenges.ts 包含 GET /api/challenges
- [x] challenges.ts 包含 POST /api/challenges/:id/accept
- [x] routes/content.ts 存在
- [x] content.ts 包含 GET /api/content/articles
- [x] content.ts 包含 GET /api/content/articles/:slug
- [x] routes/admin.ts 存在
- [x] admin.ts 包含 GET /api/admin/feature-flags
- [x] admin.ts 包含 PUT /api/admin/feature-flags
- [x] 所有路由在 index.ts 中挂载

## Phase E: 共享包验证

### packages/shared/

- [x] package.json name === "@brainverse/shared"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/types.ts 导出 Locale 类型
- [x] src/types.ts 导出 GameDimension 类型
- [x] src/types.ts 导出 Difficulty 类型
- [x] src/types.ts 导出 ApiResponse 类型
- [x] src/types.ts 导出 PaginatedResponse 类型
- [x] src/types.ts 导出 ErrorResponse 类型
- [x] src/constants.ts 导出 LOCALES
- [x] src/constants.ts 导出 DIMENSIONS
- [x] src/constants.ts 导出 DIFFICULTIES
- [x] src/constants.ts 导出 API_ROUTES
- [x] src/constants.ts 导出 STORAGE_KEYS
- [x] src/constants.ts 导出 COOKIE_KEYS
- [x] src/utils.ts 导出 generateId
- [x] src/utils.ts 导出 hashPassword
- [x] src/utils.ts 导出 verifyPassword
- [x] src/utils.ts 导出 formatTime
- [x] src/utils.ts 导出 clamp
- [x] src/utils.ts 导出 randomChoice
- [x] src/utils.ts 导出 shuffle

### packages/core/

- [x] package.json name === "@brainverse/core"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/models/user.ts 导出 User 接口
- [x] src/models/user.ts 导出 UserPreferences 接口
- [x] src/models/game.ts 导出 Game 接口
- [x] src/models/game.ts 导出 GameResult 接口
- [x] src/models/game.ts 导出 GameConfig 接口
- [x] src/models/score.ts 导出 Score 接口
- [x] src/models/score.ts 导出 ScoreInput 接口
- [x] src/models/achievement.ts 导出 Achievement 接口
- [x] src/models/achievement.ts 导出 AchievementDefinition 接口
- [x] src/models/streak.ts 导出 Streak 接口
- [x] src/models/brain-pet.ts 导出 BrainPet 接口
- [x] src/models/brain-pet.ts 导出 PetStage 枚举
- [x] src/models/challenge.ts 导出 Challenge 接口
- [x] src/models/challenge.ts 导出 ChallengeStatus 枚举
- [x] src/models/article.ts 导出 Article 接口
- [x] src/models/article.ts 导出 ArticleTranslation 接口

### packages/brain-engine/

- [x] package.json name === "@brainverse/brain-engine"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/brain-age.ts 存在且含 PROTECTED SYSTEM 注释
- [x] src/brain-score.ts 存在且含 PROTECTED SYSTEM 注释
- [x] src/brain-mapping.ts 存在且含 PROTECTED SYSTEM 注释
- [x] src/percentile.ts 存在且含 PROTECTED SYSTEM 注释
- [x] src/identity.ts 存在且含 PROTECTED SYSTEM 注释
- [x] src/growth.ts 存在且含 PROTECTED SYSTEM 注释

### packages/game-engine/

- [x] package.json name === "@brainverse/game-engine"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/base-game.ts 导出 BaseGame 抽象类
- [x] BaseGame 包含 start 方法
- [x] BaseGame 包含 pause 方法
- [x] BaseGame 包含 resume 方法
- [x] BaseGame 包含 finish 方法
- [x] BaseGame 包含 getResults 方法
- [x] src/score-engine.ts 导出 ScoreEngine
- [x] src/adaptive-difficulty.ts 导出 AdaptiveDifficulty
- [x] src/game-registry.ts 导出游戏注册表
- [x] src/types.ts 导出 GameSession 接口
- [x] src/types.ts 导出 GameRound 接口
- [x] src/types.ts 导出 GameStats 接口

### packages/growth-engine/

- [x] package.json name === "@brainverse/growth-engine"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/achievements.ts 存在
- [x] src/streaks.ts 存在
- [x] src/brain-pet.ts 存在
- [x] src/challenges.ts 存在
- [x] src/identity.ts 存在

### packages/content-engine/

- [x] package.json name === "@brainverse/content-engine"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/article-schema.ts 存在
- [x] src/seo-metadata.ts 存在
- [x] src/json-ld.ts 存在
- [x] src/categories.ts 存在

### packages/ui/

- [x] package.json name === "@brainverse/ui"
- [x] tsconfig.json 存在
- [x] src/index.ts 存在
- [x] src/game-card.tsx 存在
- [x] src/stat-card.tsx 存在
- [x] src/life-bar.tsx 存在
- [x] src/dimension-badge.tsx 存在

## Phase F: 数据库迁移验证

### 0001_init.sql

- [x] users 表存在
- [x] users.id 为 TEXT PRIMARY KEY
- [x] users.email 为 TEXT NOT NULL UNIQUE
- [x] users.password_hash 为 TEXT NOT NULL
- [x] users.nickname 为 TEXT NOT NULL
- [x] users.locale 为 TEXT NOT NULL DEFAULT 'en'
- [x] users.role 为 TEXT NOT NULL DEFAULT 'user'
- [x] users.created_at 为 TEXT NOT NULL
- [x] users.updated_at 为 TEXT NOT NULL
- [x] idx_users_email 索引存在
- [x] sessions 表存在
- [x] sessions.id 为 TEXT PRIMARY KEY
- [x] sessions.user_id 为 TEXT NOT NULL
- [x] sessions.token 为 TEXT NOT NULL UNIQUE
- [x] sessions.expires_at 为 TEXT NOT NULL
- [x] idx_sessions_token 索引存在
- [x] idx_sessions_user 索引存在
- [x] games 表存在
- [x] games.slug 为 TEXT NOT NULL UNIQUE
- [x] games.dimension 为 TEXT NOT NULL
- [x] games.name_key 为 TEXT NOT NULL
- [x] games.description_key 为 TEXT NOT NULL
- [x] games.is_active 为 INTEGER NOT NULL DEFAULT 1
- [x] idx_games_slug 索引存在
- [x] scores 表存在
- [x] scores.user_id 为 TEXT NOT NULL
- [x] scores.game_id 为 TEXT NOT NULL
- [x] scores.score 为 INTEGER NOT NULL
- [x] scores.difficulty 为 TEXT NOT NULL DEFAULT 'medium'
- [x] scores.correct_count 为 INTEGER NOT NULL DEFAULT 0
- [x] scores.wrong_count 为 INTEGER NOT NULL DEFAULT 0
- [x] scores.avg_reaction_ms 为 INTEGER
- [x] scores.rounds_played 为 INTEGER NOT NULL DEFAULT 1
- [x] scores.played_at 为 TEXT NOT NULL
- [x] idx_scores_user 索引存在
- [x] idx_scores_game 索引存在
- [x] idx_scores_played 索引存在
- [x] brain_age_results 表存在
- [x] brain_age_results.brain_age 为 INTEGER NOT NULL
- [x] brain_age_results.dimension_scores 为 TEXT NOT NULL
- [x] idx_brain_age_user 索引存在

### 0002_growth.sql

- [x] achievements 表存在
- [x] achievements.user_id 为 TEXT NOT NULL
- [x] achievements.achievement_id 为 TEXT NOT NULL
- [x] idx_achievements_user 索引存在
- [x] idx_achievements_unique 唯一索引存在
- [x] streaks 表存在
- [x] streaks.user_id 为 TEXT NOT NULL UNIQUE
- [x] streaks.current_streak 为 INTEGER NOT NULL DEFAULT 0
- [x] streaks.longest_streak 为 INTEGER NOT NULL DEFAULT 0
- [x] streaks.last_active_date 为 TEXT
- [x] brain_pets 表存在
- [x] brain_pets.user_id 为 TEXT NOT NULL UNIQUE
- [x] brain_pets.pet_type 为 TEXT NOT NULL
- [x] brain_pets.stage 为 TEXT NOT NULL DEFAULT 'egg'
- [x] brain_pets.xp 为 INTEGER NOT NULL DEFAULT 0
- [x] brain_pets.level 为 INTEGER NOT NULL DEFAULT 1
- [x] challenges 表存在
- [x] challenges.creator_id 为 TEXT NOT NULL
- [x] challenges.target_id 为 TEXT
- [x] challenges.game_id 为 TEXT NOT NULL
- [x] challenges.status 为 TEXT NOT NULL DEFAULT 'pending'
- [x] idx_challenges_creator 索引存在
- [x] idx_challenges_target 索引存在

### 0003_content.sql

- [x] articles 表存在
- [x] articles.slug 为 TEXT NOT NULL UNIQUE
- [x] articles.category 为 TEXT NOT NULL
- [x] articles.published 为 INTEGER NOT NULL DEFAULT 0
- [x] idx_articles_slug 索引存在
- [x] idx_articles_category 索引存在
- [x] article_translations 表存在
- [x] article_translations.article_id 为 TEXT NOT NULL
- [x] article_translations.locale 为 TEXT NOT NULL
- [x] article_translations.title 为 TEXT NOT NULL
- [x] article_translations.content 为 TEXT NOT NULL
- [x] idx_article_trans_article 索引存在
- [x] idx_article_trans_locale 唯一索引存在
- [x] seo_metadata 表存在
- [x] seo_metadata.entity_type 为 TEXT NOT NULL
- [x] seo_metadata.entity_id 为 TEXT NOT NULL
- [x] seo_metadata.locale 为 TEXT NOT NULL
- [x] seo_metadata.json_ld 为 TEXT
- [x] idx_seo_entity 索引存在

### 0004_admin.sql

- [x] feature_flags 表存在
- [x] feature_flags.key 为 TEXT NOT NULL UNIQUE
- [x] feature_flags.enabled 为 INTEGER NOT NULL DEFAULT 0
- [x] admin_users 表存在
- [x] admin_users.user_id 为 TEXT NOT NULL UNIQUE
- [x] admin_users.role 为 TEXT NOT NULL DEFAULT 'admin'
- [x] admin_users.permissions 为 TEXT NOT NULL DEFAULT '[]'

### 数据库类型与 Repository

- [x] workers/api/src/db/types.ts 存在
- [x] types.ts 导出 User 接口
- [x] types.ts 导出 Session 接口
- [x] types.ts 导出 Game 接口
- [x] types.ts 导出 Score 接口
- [x] types.ts 导出 BrainAgeResult 接口
- [x] types.ts 导出 Achievement 接口
- [x] types.ts 导出 Streak 接口
- [x] types.ts 导出 BrainPet 接口
- [x] types.ts 导出 Challenge 接口
- [x] types.ts 导出 Article 接口
- [x] types.ts 导出 ArticleTranslation 接口
- [x] types.ts 导出 SeoMetadata 接口
- [x] types.ts 导出 FeatureFlag 接口
- [x] types.ts 导出 AdminUser 接口
- [x] workers/api/src/db/database.ts 存在
- [x] database.ts 导出 D1 包装类
- [x] workers/api/src/db/repositories/user-repo.ts 存在
- [x] user-repo.ts 导出 findById / findByEmail / create / update
- [x] workers/api/src/db/repositories/session-repo.ts 存在
- [x] session-repo.ts 导出 create / findByToken / delete / deleteExpired
- [x] workers/api/src/db/repositories/score-repo.ts 存在
- [x] score-repo.ts 导出 create / findByUser / findLeaderboard
- [x] workers/api/src/db/repositories/game-repo.ts 存在
- [x] game-repo.ts 导出 findAll / findBySlug
- [x] workers/api/src/db/repositories/brain-age-repo.ts 存在
- [x] brain-age-repo.ts 导出 create / findByUser
- [x] workers/api/src/db/repositories/achievement-repo.ts 存在
- [x] achievement-repo.ts 导出 findByUser / create / findByUserAndId
- [x] workers/api/src/db/repositories/streak-repo.ts 存在
- [x] streak-repo.ts 导出 findByUser / upsert
- [x] workers/api/src/db/repositories/brain-pet-repo.ts 存在
- [x] brain-pet-repo.ts 导出 findByUser / upsert
- [x] workers/api/src/db/repositories/challenge-repo.ts 存在
- [x] challenge-repo.ts 导出 create / findByCreator / findByTarget / updateStatus
- [x] workers/api/src/db/repositories/article-repo.ts 存在
- [x] article-repo.ts 导出 findAll / findBySlug / findByCategory
- [x] workers/api/src/db/repositories/feature-flag-repo.ts 存在
- [x] feature-flag-repo.ts 导出 findAll / findByKey / updateEnabled
- [x] workers/api/src/db/repositories/index.ts 存在
- [x] index.ts 导出所有 Repository
- [x] index.ts 导出 createRepositories 工厂函数

## Phase H: 100 篇 SEO 文章内容验证

### 质量约束系统

- [x] packages/content-engine/src/quality-checker.ts 存在
- [x] 实现 AI 痕迹检测（禁用词列表：delve into, it's worth noting, in conclusion, unleash, harness, realm）
- [x] 实现段落长度变化检测（> 30%）
- [x] 实现段首句式重复检测
- [x] 实现跨文章查重检测（全局 < 15%，同类 < 20%）
- [x] 实现科学引用验证（每篇 ≥ 2 篇）
- [x] 实现原创性检查（≥ 1 个原创观点）
- [x] 实现实用性检查（≥ 3 条可操作建议）
- [x] 实现关联性检查（≥ 1 款关联游戏）
- [x] 实现结构完整性检查（8 个必需部分）
- [x] 实现多语言完整性检查（en/zh/ja 齐全）
- [x] workers/api/scripts/seed-articles.ts 存在
- [x] 脚本支持 article 表数据插入
- [x] 脚本支持 article_translations 表数据插入
- [x] 脚本支持 seo_metadata 表数据插入

### Batch 1: Brain Age 基础（#1-5）

- [x] 文章 #1 what-is-brain-age — EN 版本存在
- [x] 文章 #1 what-is-brain-age — ZH 版本存在
- [x] 文章 #1 what-is-brain-age — JA 版本存在
- [x] 文章 #1 — 引用 Luria 1973 + Salthouse 2009
- [x] 文章 #1 — JSON-LD 存在
- [x] 文章 #1 — 质量检查通过
- [x] 文章 #2 brain-age-vs-biological-age — 三语版本存在
- [x] 文章 #2 — 引用 Erdogan 2022
- [x] 文章 #2 — 质量检查通过
- [x] 文章 #3 how-to-test-brain-age — 三语版本存在
- [x] 文章 #3 — 引用 Wechsler 1955 + Foley 2019
- [x] 文章 #3 — 质量检查通过
- [x] 文章 #4 brain-age-myths-debunked — 三语版本存在
- [x] 文章 #4 — 引用 Beyerstein 1999
- [x] 文章 #4 — 质量检查通过
- [x] 文章 #5 factors-affecting-brain-age — 三语版本存在
- [x] 文章 #5 — 引用 Livingston 2020
- [x] 文章 #5 — 质量检查通过

### Batch 2: Memory 基础（#21-25）

- [x] 文章 #21 types-of-memory-explained — 三语版本存在，引用 Baddeley 1992 + Tulving 1972，关联 Digit Span
- [x] 文章 #22 how-working-memory-works — 三语版本存在，引用 Baddeley 2000，关联 Digit Span
- [x] 文章 #23 memory-consolidation-sleep — 三语版本存在，引用 Stickgold 2005 + Rasch 2013，关联 Spatial Memory
- [x] 文章 #24 forgetting-curve-ebbinghaus — 三语版本存在，引用 Ebbinghaus 1885 + Cepeda 2008，关联 Digit Span
- [x] 文章 #25 spatial-memory-navigation — 三语版本存在，引用 O'Keefe 1978 + Moser 2014，关联 Spatial Memory
- [x] Batch 2 所有文章质量检查通过

### Batch 3: Attention 基础（#41-45）

- [x] 文章 #41 types-of-attention — 三语版本存在，引用 Posner 1980 + Petersen 2012，关联 Visual Search
- [x] 文章 #42 selective-attention-mechanism — 三语版本存在，引用 Treisman 1980 + Broadbent 1958，关联 Visual Search
- [x] 文章 #43 sustained-attention-vigilance — 三语版本存在，引用 Parasuraman 1998，关联 Visual Search
- [x] 文章 #44 attention-deficit-myths — 三语版本存在，引用 Barkley 2014，关联 Visual Search
- [x] 文章 #45 multitasking-brain-cost — 三语版本存在，引用 Meyer 1997 + Rubinstein 2001，关联 Stroop Challenge
- [x] Batch 3 所有文章质量检查通过

### Batch 4: Focus 基础（#61-65）

- [x] 文章 #61 focus-vs-attention-difference — 三语版本存在，引用 Chun 2011，关联 Visual Search
- [x] 文章 #62 deep-work-brain-science — 三语版本存在，引用 Newport 2016 + Csikszentmihalyi 1990，关联 All Games
- [x] 文章 #63 pomodoro-technique-science — 三语版本存在，引用 Kleitman 1969 + Ariga 2011，关联 Stroop Challenge
- [x] 文章 #64 focus-and-procrastination — 三语版本存在，引用 Steel 2007，关联 Stroop Challenge
- [x] 文章 #65 flow-triggers-and-blockers — 三语版本存在，引用 Nakamura 2002，关联 All Games
- [x] Batch 4 所有文章质量检查通过

### Batch 5: Relaxation 基础（#81-85）

- [x] 文章 #81 relaxation-response-science — 三语版本存在，引用 Benson 1975 + Porges 2011，关联 Breathing Flow
- [x] 文章 #82 breathing-techniques-comparison — 三语版本存在，引用 Brown 2013 + Russo 2017，关联 Breathing Flow
- [x] 文章 #83 vagus-nerve-stimulation — 三语版本存在，引用 Porges 2011 + Bonaz 2018，关联 Breathing Flow
- [x] 文章 #84 cortisol-and-relaxation — 三语版本存在，引用 Sapolsky 2004 + McEwen 1998，关联 Breathing Flow
- [x] 文章 #85 meditation-types-guide — 三语版本存在，引用 Goleman 2017 + Kabat-Zinn 1990，关联 Breathing Flow
- [x] Batch 5 所有文章质量检查通过

### Batch 6: Brain Age 进阶（#6-20）

- [x] 文章 #6 brain-age-and-sleep-quality — 三语版本存在，引用 Walker 2017 + Diekelmann 2010
- [x] 文章 #7 exercise-and-brain-age — 三语版本存在，引用 Erickson 2011 + Hillman 2008，关联 Reaction Training
- [x] 文章 #8 diet-and-cognitive-decline — 三语版本存在，引用 Morris 2015
- [x] 文章 #9 brain-age-and-stress — 三语版本存在，引用 Lupien 2009，关联 Breathing Flow
- [x] 文章 #10 social-engagement-brain-health — 三语版本存在，引用 Krueger 2009
- [x] 文章 #11 brain-age-numbers-by-decade — 三语版本存在，引用 Salthouse 2004
- [x] 文章 #12 neuroplasticity-and-brain-age — 三语版本存在，引用 Pascual-Leone 2005 + Erickson 2011，关联 Spatial Memory
- [x] 文章 #13 brain-age-and-education — 三语版本存在，引用 Stern 2012 + Sharp 2018
- [x] 文章 #14 meditation-brain-age — 三语版本存在，引用 Lazar 2005 + Tang 2015，关联 Breathing Flow
- [x] 文章 #15 brain-age-and-hearing-loss — 三语版本存在，引用 Lin 2011
- [x] 文章 #16 brain-age-gender-differences — 三语版本存在，引用 Mosconi 2017
- [x] 文章 #17 brain-age-and-gut-microbiome — 三语版本存在，引用 Cryan 2019
- [x] 文章 #18 brain-age-tracking-frequency — 三语版本存在，引用 Hertzog 2018
- [x] 文章 #19 brain-age-and-chronic-disease — 三语版本存在，引用 Biessels 2014
- [x] 文章 #20 lowering-brain-age-naturally — 三语版本存在，引用 Ngandu 2015 FINGER Study，关联 All Games
- [x] Batch 6 所有文章质量检查通过

### Batch 7: Memory 进阶（#26-40）

- [x] 文章 #26 memory-and-emotion — 三语版本存在，引用 McGaugh 2004，关联 Spatial Memory
- [x] 文章 #27 chunking-memory-strategy — 三语版本存在，引用 Miller 1956 + Ericsson 1980，关联 Digit Span
- [x] 文章 #28 memory-palace-technique — 三语版本存在，引用 Maguire 2003，关联 Spatial Memory
- [x] 文章 #29 false-memories-formation — 三语版本存在，引用 Loftus 1996 + Schacter 1999，关联 Visual Search
- [x] 文章 #30 memory-and-aging-normal — 三语版本存在，引用 Grady 2013，关联 Brain Age Assessment
- [x] 文章 #31 improve-working-memory — 三语版本存在，引用 Klingberg 2010，关联 Digit Span
- [x] 文章 #32 memory-and-nutrition — 三语版本存在，引用 Gomez-Pinilla 2008
- [x] 文章 #33 prospective-memory — 三语版本存在，引用 McDaniel 2007，关联 Digit Span
- [x] 文章 #34 memory-reconsolidation — 三语版本存在，引用 Nader 2000 + Schiller 2010，关联 Spatial Memory
- [x] 文章 #35 visual-memory-vs-verbal — 三语版本存在，引用 Paivio 1971，关联 Visual Search
- [x] 文章 #36 memory-and-exercise-mechanism — 三语版本存在，引用 van Praag 2009，关联 Spatial Memory
- [x] 文章 #37 memory-supplements-evidence — 三语版本存在，引用 Dodge 2008 + Cochrane 2021
- [x] 文章 #38 childhood-memory-development — 三语版本存在，引用 Bauer 2007，关联 Digit Span
- [x] 文章 #39 memory-and-music — 三语版本存在，引用 Kraus 2009，关联 Spatial Memory
- [x] 文章 #40 memory-decline-prevention — 三语版本存在，引用 Valenzuela 2009，关联 All Memory Games
- [x] Batch 7 所有文章质量检查通过

### Batch 8: Attention 进阶（#46-60）

- [x] 文章 #46 stroop-effect-explained — 三语版本存在，引用 Stroop 1935 + MacLeod 1991，关联 Stroop Challenge
- [x] 文章 #47 attention-and-meditation — 三语版本存在，引用 Tang 2015 + Lutz 2008，关联 Breathing Flow
- [x] 文章 #48 visual-search-efficiency — 三语版本存在，引用 Wolfe 1994 + Treisman 1980，关联 Visual Search
- [x] 文章 #49 attention-blink-phenomenon — 三语版本存在，引用 Raymond 1992，关联 Visual Search
- [x] 文章 #50 distractibility-causes — 三语版本存在，引用 Leroy 2009 + Wilmer 2017，关联 Visual Search
- [x] 文章 #51 attention-training-games — 三语版本存在，引用 Shipstead 2012 + Simons 2016，关联 Visual Search
- [x] 文章 #52 adhd-and-attention-games — 三语版本存在，引用 Cortese 2020，关联 Visual Search
- [x] 文章 #53 attention-and-caffeine — 三语版本存在，引用 McLellan 2016 + Haskell 2005，关联 Reaction Training
- [x] 文章 #54 attention-in-digital-age — 三语版本存在，引用 Carr 2010 + Mark 2018，关联 Visual Search
- [x] 文章 #55 inattentional-blindness — 三语版本存在，引用 Simons 1999 + Mack 2003，关联 Visual Search
- [x] 文章 #56 attention-and-emotion — 三语版本存在，引用 Mathews 1994，关联 Stroop Challenge
- [x] 文章 #57 attention-development-children — 三语版本存在，引用 Posner 2007，关联 Visual Search
- [x] 文章 #58 attention-and-aging — 三语版本存在，引用 Hasher 1999 + Lustig 2003，关联 Visual Search
- [x] 文章 #59 flow-state-attention — 三语版本存在，引用 Csikszentmihalyi 1990 + Dietrich 2004，关联 All Games
- [x] 文章 #60 improving-focus-naturally — 三语版本存在，引用 Klingberg 2010，关联 Visual Search
- [x] Batch 8 所有文章质量检查通过

### Batch 9: Focus 进阶（#66-80）

- [x] 文章 #66 focus-and-dopamine — 三语版本存在，引用 Volkow 2009 + Westbrook 2019，关联 Reaction Training
- [x] 文章 #67 music-and-focus — 三语版本存在，引用 Rauscher 1993 + Angwin 2017，关联 All Games
- [x] 文章 #68 focus-environment-design — 三语版本存在，引用 Choi 2019 + Veitch 2008，关联 All Games
- [x] 文章 #69 digital-minimalism-focus — 三语版本存在，引用 Newport 2019 + Alter 2017，关联 All Games
- [x] 文章 #70 focus-and-breakfast — 三语版本存在，引用 Benton 2007 + Hoyland 2009，关联 Stroop Challenge
- [x] 文章 #71 focus-morning-vs-evening — 三语版本存在，引用 Schmidt 2007 + Roenneberg 2003，关联 All Games
- [x] 文章 #72 focus-and-anxiety — 三语版本存在，引用 Eysenck 2007 + Berggren 2013，关联 Stroop Challenge
- [x] 文章 #73 focus-and-temperature — 三语版本存在，引用 Lan 2011 + Wyon 2004，关联 Stroop Challenge
- [x] 文章 #74 focus-tracking-tools — 三语版本存在，引用 Mark 2008 + Dabbish 2011，关联 All Games
- [x] 文章 #75 focus-and-boredom — 三语版本存在，引用 Eastwood 2012，关联 All Games
- [x] 文章 #76 intermittent-focus-bursts — 三语版本存在，引用 Kaplan 1995 + Ariga 2011，关联 All Games
- [x] 文章 #77 focus-and-body-posture — 三语版本存在，引用 Nair 2015 + Cuddy 2018，关联 All Games
- [x] 文章 #78 focus-and-nature-walks — 三语版本存在，引用 Berman 2008 + Bratman 2015，关联 Breathing Flow
- [x] 文章 #79 focus-and-hydration — 三语版本存在，引用 Adan 2012 + Ganio 2011，关联 Stroop Challenge
- [x] 文章 #80 building-focus-habit — 三语版本存在，引用 Lally 2010 + Duhigg 2012，关联 All Games
- [x] Batch 9 所有文章质量检查通过

### Batch 10: Relaxation 进阶（#86-100）

- [x] 文章 #86 progressive-muscle-relaxation — 三语版本存在，引用 Jacobson 1938 + Bernstein 1973，关联 Breathing Flow
- [x] 文章 #87 guided-imagery-relaxation — 三语版本存在，引用 Cumming 2008 + Onieva-Padilla 2016，关联 Breathing Flow
- [x] 文章 #88 yoga-and-brain-relaxation — 三语版本存在，引用 Streeter 2012 + Pascoe 2017，关联 Breathing Flow
- [x] 文章 #89 stress-inoculation-training — 三语版本存在，引用 Meichenbaum 1985，关联 Breathing Flow
- [x] 文章 #90 relaxation-and-immunity — 三语版本存在，引用 Segerstrom 2004 + Glaser 2005，关联 Breathing Flow
- [x] 文章 #91 sleep-relaxation-protocol — 三语版本存在，引用 Walker 2017 + Bootzin 1972，关联 Breathing Flow
- [x] 文章 #92 nature-sounds-relaxation — 三语版本存在，引用 Alvarsson 2010 + Annerstedt 2013，关联 Breathing Flow
- [x] 文章 #93 biofeedback-relaxation-guide — 三语版本存在，引用 Lehrer 2000 + Wheat 2010，关联 Breathing Flow
- [x] 文章 #94 relaxation-and-creativity — 三语版本存在，引用 Kounios 2009 + Jung-Beeman 2004，关联 Breathing Flow
- [x] 文章 #95 workplace-micro-relaxation — 三语版本存在，引用 Kalia 2018 + Wolever 2012，关联 Breathing Flow
- [x] 文章 #96 relaxation-for-children — 三语版本存在，引用 Goldstein 2016 + Hagen 2014，关联 Breathing Flow
- [x] 文章 #97 yoga-nidra-deep-relaxation — 三语版本存在，引用 Saraswati 1998 + Eastman-Mueller 2013，关联 Breathing Flow
- [x] 文章 #98 relaxation-and-pain-management — 三语版本存在，引用 Hoffman 2011 + Morone 2011，关联 Breathing Flow
- [x] 文章 #99 seasonal-relaxation-strategies — 三语版本存在，引用 Rosenthal 1984 + Terman 2016，关联 Breathing Flow
- [x] 文章 #100 daily-relaxation-routine — 三语版本存在，引用 Kabat-Zinn 1990 + Benson 1975，关联 Breathing Flow
- [x] Batch 10 所有文章质量检查通过

## Phase I: 文章批量质量验证

### AI 痕迹全量检查

- [ ] 扫描 300 篇文本（100 × 3 语言）中 AI 禁用词
- [ ] 无文章包含 "delve into"
- [ ] 无文章包含 "it's worth noting"
- [ ] 无文章包含 "in conclusion"
- [ ] 无文章包含 "unleash"
- [ ] 无文章包含 "harness"
- [ ] 无文章包含 "realm"
- [ ] 每篇段落长度变化 > 30%
- [ ] 每篇段首句式无连续重复
- [ ] AI 痕迹检测报告生成且无不通过项

### 跨文章查重检查

- [ ] 100 篇文章两两相似度计算完成
- [ ] 全局核心观点重复率 < 15%
- [ ] 同类别内重复率 < 20%
- [ ] 无跨文章复制段落
- [ ] 重复率超标文章已标记并重写

### 科学引用验证

- [ ] 每篇文章至少 2 篇引用
- [ ] 引用格式规范（作者+年份+期刊/机构）
- [ ] 20% 引用文献经 Google Scholar / PubMed 查验真实
- [ ] 引用不足或格式错误文章已修正

### 实用性与关联性验证

- [ ] 每篇至少 3 条可操作建议（含时间/频率/方法）
- [ ] 每篇至少关联 1 款平台游戏
- [ ] 游戏关联段落自然非生硬
- [ ] 每篇内链至少 3 条且指向真实存在的文章

### 结构完整性验证

- [ ] 每篇包含 8 个必需部分（标题→元描述→引言→科学解释→实践建议→相关游戏→FAQ→内链）
- [ ] 每篇元描述 ≤ 150 字符
- [ ] 每篇引言 ≥ 150 字
- [ ] 每篇科学解释 ≥ 600 字
- [ ] 每篇实践建议 ≥ 300 字
- [ ] 每篇 FAQ ≥ 4 条问答
- [ ] 每篇 JSON-LD 结构化数据有效

### 多语言完整性验证

- [ ] 100 篇 × 3 语言 = 300 个翻译记录全部存在
- [ ] 三语版本 key 结构完全一致
- [ ] 10% 文章翻译质量抽查通过（非直译、本地化）
- [ ] SEO 元数据三语版本齐全

### 数据库完整性验证

- [ ] articles 表有 100 条记录
- [ ] article_translations 表有 300 条记录
- [ ] seo_metadata 表有 300 条记录
- [ ] 所有 article.slug 唯一
- [ ] 所有 article.category ∈ {brain-age, memory, attention, focus, relaxation}
- [ ] 每类别文章数 = 20

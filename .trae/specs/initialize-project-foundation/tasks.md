# Tasks — BrainVerse 项目初始化与基础架构

---

## Phase A: 项目审计与文档框架（可并行执行）✅

### Task 1: 创建项目核心文档

- [x] Task 1.1: 创建 `PROJECT.md`
  - [x] Task 1.1.1: 编写项目使命声明（Brain Operating System 定位）
  - [x] Task 1.1.2: 编写产品愿景（BrainVerse IS / IS NOT 清单）
  - [x] Task 1.1.3: 编写权威层级（Business > Product > Architecture > Tech > Design > Implementation）
  - [x] Task 1.1.4: 编写技术栈定义（Next.js / TypeScript / Tailwind / Shadcn / Workers / D1 / KV / R2）
  - [x] Task 1.1.5: 编写 Cloudflare 免费计划服务白名单与黑名单
  - [x] Task 1.1.6: 编写多语言策略（en/zh/ja 路由规则、翻译 key 规范）
  - [x] Task 1.1.7: 编写 MVP 产品范围（11 个核心模块清单）
  - [x] Task 1.1.8: 编写 MVP 游戏清单（6 款游戏及认知目标）
  - [x] Task 1.1.9: 编写 Brain Engine 受保护系统清单（6 个公式）
  - [x] Task 1.1.10: 编写 Growth Engine 模块清单（10 个子系统）
  - [x] Task 1.1.11: 编写 Content Engine 规范（100 篇文章、5 类别、文章结构）
  - [x] Task 1.1.12: 编写 SEO 规则（每页必需元数据清单）
  - [x] Task 1.1.13: 编写数据库规则（迁移制、类型安全、版本控制）
  - [x] Task 1.1.14: 编写 Admin Panel 模块清单
  - [x] Task 1.1.15: 编写 Feature Flags 策略
  - [x] Task 1.1.16: 编写 Analytics 事件清单（16 个必需事件）
  - [x] Task 1.1.17: 编写错误处理策略
  - [x] Task 1.1.18: 编写备份策略

- [x] Task 1.2: 创建 `AGENTS.md`
  - [x] Task 1.2.1: 编写 AI 代理角色定义（Lead Architect / Principal Engineer / 等 8 个角色）
  - [x] Task 1.2.2: 编写文档加载顺序（PROJECT.md → AGENTS.md → BrainVerse-Design/ → context/ → specs/ → docs/ → decisions/）
  - [x] Task 1.2.3: 编写设计参考使用规则（设计仅为参考，业务需求优先）
  - [x] Task 1.2.4: 编写代码质量要求（Strict TS、No any、No dup、Reusable、Accessible、Mobile First、SEO Friendly）
  - [x] Task 1.2.5: 编写开发工作流（12 步流程：Read Docs → Read Specs → Read Architecture → Read Design → Implement → Test → TypeCheck → Build → Review → Commit → Push → PR）
  - [x] Task 1.2.6: 编写 Review Checklist（11 项验证：Architecture / Business / Types / Testing / Performance / Accessibility / SEO / Localization / Security / Documentation / Deployment）
  - [x] Task 1.2.7: 编写 GitHub MCP 工作流（Branch → Implement → Test → Commit → Push → PR → Changelog → Docs）
  - [x] Task 1.2.8: 编写 Cloudflare MCP 工作流（Build → TypeCheck → Test → Preview → Validate → Production → Verify）
  - [x] Task 1.2.9: 编写输出格式规范（Summary / Files / DB Changes / API / Tests / Analytics / SEO / Deploy / Commit / Risks / Next）
  - [x] Task 1.2.10: 编写上下文缺失处理规则（STOP → Request → Never guess）

- [x] Task 1.3: 创建 `context/00-project.md`
  - [x] Task 1.3.1: 编写项目背景（为什么做 BrainVerse、市场分析、竞品参考）
  - [x] Task 1.3.2: 编写项目目标（MVP 验证目标、长期目标）
  - [x] Task 1.3.3: 编写项目范围（In Scope / Out of Scope 清单）
  - [x] Task 1.3.4: 编写利益相关者（用户画像、管理员画像）
  - [x] Task 1.3.5: 编写项目约束（Cloudflare 免费计划、3 种语言、6 款游戏 MVP）
  - [x] Task 1.3.6: 编写成功指标（DAU、留存率、游戏完成率、Brain Age 测试完成率）

- [x] Task 1.4: 创建 `context/01-product.md`
  - [x] Task 1.4.1: 编写产品愿景声明
  - [x] Task 1.4.2: 编写核心模块详细定义（11 个模块各含目的、功能列表、用户故事）
    - [x] Module 1: Landing Page（用户故事：首次访问者了解平台价值并注册）
    - [x] Module 2: Brain Age Assessment（用户故事：用户完成测试获得脑力年龄）
    - [x] Module 3: User Dashboard（用户故事：用户查看训练进度和趋势）
    - [x] Module 4: User Profile（用户故事：用户管理个人信息和偏好）
    - [x] Module 5: Content Hub（用户故事：用户阅读脑健康科普文章）
    - [x] Module 6: SEO System（技术需求：300+ SEO 页面架构）
    - [x] Module 7: Achievement System（用户故事：用户解锁成就获得满足感）
    - [x] Module 8: Streak System（用户故事：用户保持每日训练连续性）
    - [x] Module 9: Brain Pet System（用户故事：用户培养脑力宠物获得情感连接）
    - [x] Module 10: Share System（用户故事：用户分享成绩到社交媒体）
    - [x] Module 11: Challenge System（用户故事：用户挑战好友比拼脑力）
  - [x] Task 1.4.3: 编写 6 款 MVP 游戏详细规格
    - [x] Game 1: Visual Search — 认知目标、游戏规则、难度曲线、评分公式、数据采集点
    - [x] Game 2: Digit Span — 认知目标、游戏规则、难度曲线、评分公式、数据采集点
    - [x] Game 3: Reaction Training — 认知目标、游戏规则、难度曲线、评分公式、数据采集点
    - [x] Game 4: Stroop Challenge — 认知目标、游戏规则、难度曲线、评分公式、数据采集点
    - [x] Game 5: Spatial Memory — 认知目标、游戏规则、难度曲线、评分公式、数据采集点
    - [x] Game 6: Breathing Flow — 认知目标、游戏规则、难度曲线、评分公式、数据采集点
  - [x] Task 1.4.4: 编写 Brain Engine 受保护系统说明
    - [x] Brain Age Formula — 计算逻辑、输入输出、适用场景
    - [x] Brain Score Formula — 计算逻辑、输入输出、适用场景
    - [x] Brain Identity Formula — 计算逻辑、输入输出、适用场景
    - [x] Growth Formula — 计算逻辑、输入输出、适用场景
    - [x] Brain Mapping Formula — 计算逻辑、输入输出、适用场景
    - [x] Percentile Formula — 计算逻辑、输入输出、适用场景
  - [x] Task 1.4.5: 编写 Growth Engine 子系统说明
    - [x] Daily Challenge — 触发条件、奖励机制、过期逻辑
    - [x] Weekly Challenge — 触发条件、奖励机制、过期逻辑
    - [x] Achievements — 成就分类、解锁条件、展示方式
    - [x] Streak — 连续天数计算、断签规则、恢复机制
    - [x] Brain Pet — 宠物种类、进化阶段、成长驱动因素
    - [x] Identity — 身份等级、头衔系统、视觉表达
    - [x] Brain Level — 等级公式、经验值来源、升级效果
    - [x] Progress Dashboard — 数据维度、图表类型、时间范围
    - [x] Challenge Friends — 挑战创建、接受、完成、结果通知
    - [x] Share Results — 分享内容、平台适配、链接生成
  - [x] Task 1.4.6: 编写 Content Engine 规格说明
    - [x] 100 篇文章分配（Brain Age 20 / Memory 20 / Attention 20 / Focus 20 / Relaxation 20）
    - [x] 文章结构定义（Title / Meta Desc / Intro / Science / Advice / Related Games / FAQ / Internal Links / JSON-LD / SEO Metadata）
    - [x] Content ↔ Game Loop 流程图
    - [x] CMS 架构预留说明（不实现自动生成和发布）

- [x] Task 1.5: 创建 `context/02-architecture.md`
  - [x] Task 1.5.1: 编写系统架构总览图（前端 ↔ Workers API ↔ D1/KV/R2）
  - [x] Task 1.5.2: 编写 Monorepo 结构详细说明（每个目录用途、依赖关系）
  - [x] Task 1.5.3: 编写前端架构说明
    - [x] Next.js App Router 路由结构（/[locale]/... 嵌套路由）
    - [x] 页面层级与布局继承关系
    - [x] Server Component vs Client Component 划分原则
    - [x] 数据获取策略（Server Component fetch / Client SWR / KV 缓存）
    - [x] Shadcn UI 组件使用规范
    - [x] TailwindCSS 主题映射策略
  - [x] Task 1.5.4: 编写后端架构说明
    - [x] Hono 路由组织结构（/api/auth, /api/games, /api/scores, /api/brain-age, /api/growth, /api/content, /api/admin）
    - [x] 中间件链（CORS → Rate Limit → Auth → Request Log → Handler → Error Handler）
    - [x] D1 Repository 模式（每张表一个 Repository 类）
    - [x] KV 缓存策略（Session、Leaderboard、Config 缓存）
    - [x] R2 存储策略（用户头像、分享图片、文章封面）
  - [x] Task 1.5.5: 编写 Cloudflare 服务映射
    - [x] Pages → 前端静态部署 + SSR
    - [x] Workers → API 后端
    - [x] D1 → 用户、分数、成就、文章、配置
    - [x] KV → Session、排行榜缓存、Feature Flags 缓存
    - [x] R2 → 用户上传文件、生成图片
    - [x] Analytics → 页面与事件追踪
    - [x] Turnstile → 注册/登录人机验证
  - [x] Task 1.5.6: 编写数据流说明
    - [x] 游戏数据流（前端游戏 → 本地结算 → POST /api/scores → D1 写入 → KV 排行榜更新）
    - [x] 认证数据流（Turnstile 验证 → POST /api/auth → D1 查询 → KV Session 写入 → Cookie 返回）
    - [x] Brain Age 数据流（测试游戏 → 前端计算 → POST /api/brain-age → D1 存储 → KV 常模对比）
    - [x] 内容数据流（CMS 写入 → D1 存储 → SSR 渲染 → SEO 元数据注入）
  - [x] Task 1.5.7: 编写免费计划配额管理策略
    - [x] Workers: 100K req/day → 前端 SPA 闭环 + 仅必要 POST
    - [x] D1: 5M read/day, 100K write/day → KV 缓存 + 内存缓存 + 避免轮询
    - [x] Pages: 500 builds/month → 构建优化 + 增量部署
    - [x] KV: 100K read/day, 1K write/day → 批量写入 + 长 TTL
    - [x] R2: 10GB storage, 1M Class A ops/month → 按需上传 + 生命周期规则

- [x] Task 1.6: 创建 `decisions/0001-initial-architecture.md`
  - [x] Task 1.6.1: ADR 标题与日期
  - [x] Task 1.6.2: 状态（Accepted）
  - [x] Task 1.6.3: 背景（为何选择当前技术栈）
  - [x] Task 1.6.4: 决策（Monorepo + Next.js + Hono + D1）
  - [x] Task 1.6.5: 替代方案考虑（Vue/SvelteKit、Supabase、PlanetScale 等）
  - [x] Task 1.6.6: 后果（正面与负面影响）

- [x] Task 1.7: 创建 `docs/` 目录文档骨架
  - [x] Task 1.7.1: `docs/development.md` — 开发环境搭建、代码规范、Git 工作流
  - [x] Task 1.7.2: `docs/deployment.md` — Cloudflare 部署流程、环境变量、域名配置
  - [x] Task 1.7.3: `docs/database.md` — D1 使用指南、迁移流程、Repository 模式
  - [x] Task 1.7.4: `docs/testing.md` — 测试策略、Vitest 配置、覆盖率要求
  - [x] Task 1.7.5: `docs/seo.md` — SEO 架构、元数据规范、结构化数据
  - [x] Task 1.7.6: `docs/i18n.md` — 多语言架构、翻译文件组织、添加新语言流程

---

## Phase B: Monorepo 基础结构（依赖 Phase A 完成）✅

### Task 2: 根 Workspace 配置

- [x] Task 2.1: 创建根 `package.json`
  - [x] Task 2.1.1: 配置 name 为 "brainverse"
  - [x] Task 2.1.2: 配置 private: true
  - [x] Task 2.1.3: 配置 packageManager 为 pnpm@latest
  - [x] Task 2.1.4: 配置 engines（node >=20, pnpm >=9）
  - [x] Task 2.1.5: 配置 scripts（dev, build, test, typecheck, lint, format, db:migrate, db:generate, deploy:web, deploy:api）
  - [x] Task 2.1.6: 配置 devDependencies（typescript, eslint, prettier, concurrently）

- [x] Task 2.2: 创建 `pnpm-workspace.yaml`
  - [x] Task 2.2.1: 添加 packages: ['apps/*', 'packages/*', 'workers/*']

- [x] Task 2.3: 创建根 `tsconfig.json`
  - [x] Task 2.3.1: 配置 compilerOptions.strict: true
  - [x] Task 2.3.2: 配置 compilerOptions.noUncheckedIndexedAccess: true
  - [x] Task 2.3.3: 配置 compilerOptions.exactOptionalPropertyTypes: true
  - [x] Task 2.3.4: 配置 compilerOptions.noImplicitOverride: true
  - [x] Task 2.3.5: 配置 compilerOptions.noPropertyAccessFromIndexSignature: true
  - [x] Task 2.3.6: 配置 paths 别名（@brainverse/shared, @brainverse/core, @brainverse/brain-engine, @brainverse/game-engine, @brainverse/growth-engine, @brainverse/content-engine, @brainverse/ui）
  - [x] Task 2.3.7: 配置 references 指向各子项目

- [x] Task 2.4: 创建 `.gitignore`
  - [x] Task 2.4.1: Node.js 忽略（node_modules, dist, build, .turbo）
  - [x] Task 2.4.2: 环境变量忽略（.env, .env.local, .env.production, .dev.vars）
  - [x] Task 2.4.3: Cloudflare 忽略（.wrangler, .mf）
  - [x] Task 2.4.4: Next.js 忽略（.next, out）
  - [x] Task 2.4.5: IDE 忽略（.vscode/settings.json, .idea）
  - [x] Task 2.4.6: OS 忽略（.DS_Store, Thumbs.db）
  - [x] Task 2.4.7: 日志忽略（*.log, npm-debug.log）

- [x] Task 2.5: 创建 `.eslintrc.cjs`
  - [x] Task 2.5.1: 配置 extends（eslint:recommended, @typescript-eslint/recommended, next/core-web-vitals, prettier）
  - [x] Task 2.5.2: 配置 rules（no-console: warn, no-explicit-any: error, @typescript-eslint/no-unused-vars: error）
  - [x] Task 2.5.3: 配置 ignorePatterns（node_modules, dist, .next, .wrangler）

- [x] Task 2.6: 创建 `.prettierrc`
  - [x] Task 2.6.1: 配置 semi: false
  - [x] Task 2.6.2: 配置 singleQuote: true
  - [x] Task 2.6.3: 配置 tabWidth: 2
  - [x] Task 2.6.4: 配置 trailingComma: 'es5'
  - [x] Task 2.6.5: 配置 printWidth: 100

- [x] Task 2.7: 创建 `README.md`
  - [x] Task 2.7.1: 项目简介（BrainVerse — Brain Operating System）
  - [x] Task 2.7.2: 快速开始（pnpm install → pnpm dev）
  - [x] Task 2.7.3: 项目结构说明
  - [x] Task 2.7.4: 技术栈列表
  - [x] Task 2.7.5: 开发命令列表
  - [x] Task 2.7.6: 部署说明链接

---

## Phase C: Next.js 前端应用（依赖 Phase B 完成，可与 Phase D/E 并行）✅

### Task 3: 初始化 `apps/web` Next.js 应用

#### 3A: 包配置与 TypeScript

- [x] Task 3.1: 创建 `apps/web/package.json`
  - [x] Task 3.1.1: 添加 dependencies（next@14, react@18, react-dom@18）
  - [x] Task 3.1.2: 添加 dependencies（tailwindcss, postcss, autoprefixer）
  - [x] Task 3.1.3: 添加 dependencies（class-variance-authority, clsx, tailwind-merge, tailwindcss-animate）
  - [x] Task 3.1.4: 添加 dependencies（lucide-react, @radix-ui/react-* 核心组件）
  - [x] Task 3.1.5: 添加 dependencies（next-intl 或 next-i18n-router 用于 i18n）
  - [x] Task 3.1.6: 添加 dependencies（zod 用于表单验证）
  - [x] Task 3.1.7: 添加 devDependencies（@types/react, @types/react-dom, @types/node）
  - [x] Task 3.1.8: 添加 devDependencies（eslint, eslint-config-next, @typescript-eslint/eslint-plugin）
  - [x] Task 3.1.9: 配置 scripts（dev, build, start, lint, typecheck）

- [x] Task 3.2: 创建 `apps/web/tsconfig.json`
  - [x] Task 3.2.1: 继承根 tsconfig
  - [x] Task 3.2.2: 配置 jsx: preserve
  - [x] Task 3.2.3: 配置 plugins: [{ name: 'next' }]
  - [x] Task 3.2.4: 配置 paths（@/* → ./src/*, @/components/* → ./src/components/*）
  - [x] Task 3.2.5: 配置 include（next-env.d.ts, **/*.ts, **/*.tsx, .next/types/**/*.ts）

#### 3B: Tailwind 与 Design Token 映射

- [x] Task 3.3: 创建 `apps/web/tailwind.config.ts`
  - [x] Task 3.3.1: 配置 darkMode: ['class', '[data-theme="dark"]']
  - [x] Task 3.3.2: 配置 content 路径（./src/**/*.{ts,tsx}, ./app/**/*.{ts,tsx}）
  - [x] Task 3.3.3: 映射 colors.primary → { DEFAULT: '#4A7CFF', hover: '#3A6CEE', light: '#4A7CFF20', bg: '#4A7CFF08' }
  - [x] Task 3.3.4: 映射 colors.secondary → { DEFAULT: '#50C8A8', hover: '#3FB898', light: '#50C8A820' }
  - [x] Task 3.3.5: 映射 colors.accent → { DEFAULT: '#FFB14A', hover: '#FFA030', light: '#FFB14A20' }
  - [x] Task 3.3.6: 映射 colors.background → { DEFAULT: '#F7F9FC', secondary: '#EEF1F6' }
  - [x] Task 3.3.7: 映射 colors.card → '#FFFFFF'（dark: '#1E293B'）
  - [x] Task 3.3.8: 映射 colors.text → { primary: '#1A202C', secondary: '#64748B', muted: '#94A3B8' }
  - [x] Task 3.3.9: 映射 colors.border → { DEFAULT: '#E2E8F0', light: '#F1F5F9' }
  - [x] Task 3.3.10: 映射 colors.success → '#50C8A8'
  - [x] Task 3.3.11: 映射 colors.warning → '#FFB14A'
  - [x] Task 3.3.12: 映射 colors.error → '#EF4444'
  - [x] Task 3.3.13: 映射 colors.info → '#4A7CFF'
  - [x] Task 3.3.14: 映射维度色 dim.memory → '#8B5CF6'
  - [x] Task 3.3.15: 映射维度色 dim.attention → '#06B6D4'
  - [x] Task 3.3.16: 映射维度色 dim.reaction → '#FFB14A'
  - [x] Task 3.3.17: 映射维度色 dim.executive → '#10B981'
  - [x] Task 3.3.18: 映射维度色 dim.relaxation → '#4A7CFF'
  - [x] Task 3.3.19: 映射 borderRadius → { sm: '8px', md: '12px', lg: '16px', xl: '24px', full: '9999px' }
  - [x] Task 3.3.20: 映射 spacing → { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px' }
  - [x] Task 3.3.21: 映射 fontSize → { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '24px', '2xl': '32px', '3xl': '40px', '4xl': '48px', '5xl': '64px' }
  - [x] Task 3.3.22: 映射 boxShadow → { sm, md, lg, xl, glow-primary, glow-secondary, glow-accent, glow-memory, glow-attention, glow-reaction, glow-executive, glow-relaxation }
  - [x] Task 3.3.23: 配置 backgroundImage → { 'gradient-primary', 'gradient-secondary', 'gradient-accent', 'gradient-hero' }
  - [x] Task 3.3.24: 配置 transitionDuration → { fast: '150ms', normal: '300ms', slow: '500ms' }
  - [x] Task 3.3.25: 配置 keyframes → { fadeIn, slideUp, slideDown, scaleIn, pulse, shimmer, float, breathe, heartbeat, confetti, ripple, bounceIn, shake, glow, spin }
  - [x] Task 3.3.26: 配置 animation → { 'fade-in', 'slide-up', 'slide-down', 'scale-in', 'pulse', 'shimmer', 'float', 'breathe', 'heartbeat', 'confetti', 'bounce-in', 'shake', 'glow', 'spin' }
  - [x] Task 3.3.27: 配置 zIndex → { base: 1, dropdown: 100, sticky: 200, overlay: 300, modal: 400, toast: 500 }
  - [x] Task 3.3.28: 配置 backdropBlur → { glass: '16px' }
  - [x] Task 3.3.29: 配置 typography → { font-family: 'Inter' }
  - [x] Task 3.3.30: 添加 plugins → [tailwindcss-animate]

- [x] Task 3.4: 创建 `apps/web/postcss.config.js`
  - [x] Task 3.4.1: 配置 plugins: { tailwindcss: {}, autoprefixer: {} }

#### 3C: Next.js 配置

- [x] Task 3.5: 创建 `apps/web/next.config.js`
  - [x] Task 3.5.1: 配置 reactStrictMode: true
  - [x] Task 3.5.2: 配置 i18n（locales: ['en', 'zh', 'ja'], defaultLocale: 'en'）
  - [x] Task 3.5.3: 配置 images.formats: ['image/avif', 'image/webp']
  - [x] Task 3.5.4: 配置 experimental.serverActions: true
  - [x] Task 3.5.5: 配置 headers（CSP、X-Frame-Options、X-Content-Type-Options）
  - [x] Task 3.5.6: 配置 redirects（/ → /en, /games → /en/games）
  - [x] Task 3.5.7: 配置 poweredByHeader: false
  - [x] Task 3.5.8: 配置 compiler.removeConsole: { exclude: ['error'] }（生产环境）

#### 3D: App Router 目录结构与布局

- [x] Task 3.6: 创建 `apps/web/app/globals.css`
  - [x] Task 3.6.1: 导入 TailwindCSS 指令（@tailwind base/components/utilities）
  - [x] Task 3.6.2: 复制 global.css 中的 :root CSS 变量（所有 Design Token）
  - [x] Task 3.6.3: 复制 .dark 深色模式变量覆盖
  - [x] Task 3.6.4: 添加 @media (prefers-color-scheme: dark) 自动深色模式
  - [x] Task 3.6.5: 添加全局滚动条样式
  - [x] Task 3.6.6: 添加 reduced-motion 媒体查询
  - [x] Task 3.6.7: 添加 safe-area-inset 移动端安全区域

- [x] Task 3.7: 创建 `apps/web/app/layout.tsx`（根布局）
  - [x] Task 3.7.1: 配置 html lang="en"（动态由 [locale] 覆盖）
  - [x] Task 3.7.2: 配置 metadata（title template, description, keywords）
  - [x] Task 3.7.3: 配置 viewport（width=device-width, initialScale=1, viewportFit=cover）
  - [x] Task 3.7.4: 配置 themeColor: '#4A7CFF'
  - [x] Task 3.7.5: 加载 Inter 字体（next/font/google）
  - [x] Task 3.7.6: 配置 OpenGraph 默认元数据
  - [x] Task 3.7.7: 配置 Twitter Card 默认元数据
  - [x] Task 3.7.8: 配置 robots.txt 和 sitemap.xml 引用

- [x] Task 3.8: 创建 `apps/web/app/[locale]/layout.tsx`（多语言布局）
  - [x] Task 3.8.1: 接收 params.locale 参数
  - [x] Task 3.8.2: 验证 locale 是否在 ['en', 'zh', 'ja'] 中
  - [x] Task 3.8.3: 设置 html lang 属性
  - [x] Task 3.8.4: 生成 locale 特定的 metadata（title, description）
  - [x] Task 3.8.5: 配置 hreflang alternate 链接
  - [x] Task 3.8.6: 渲染 Navbar 组件
  - [x] Task 3.8.7: 渲染 children
  - [x] Task 3.8.8: 渲染 Footer 组件
  - [x] Task 3.8.9: 渲染 CookieConsent 组件
  - [x] Task 3.8.10: 渲染 Toast 容器

- [x] Task 3.9: 创建 `apps/web/app/[locale]/page.tsx`（首页占位）
  - [x] Task 3.9.1: 导入翻译函数
  - [x] Task 3.9.2: 渲染 Hero 区域占位
  - [x] Task 3.9.3: 渲染游戏入口卡片占位
  - [x] Task 3.9.4: 渲染 CTA 区域占位
  - [x] Task 3.9.5: 所有文本使用翻译 key

#### 3E: 多语言翻译骨架

- [x] Task 3.10: 创建 `apps/web/i18n/en.json`（英语翻译骨架）
  - [x] Task 3.10.1: 添加 common 部分（appName, tagline, buttons: start/continue/learnMore/signIn/signUp/logout）
  - [x] Task 3.10.2: 添加 nav 部分（home/games/dashboard/profile/achievements/about/contact）
  - [x] Task 3.10.3: 添加 landing 部分（hero.title, hero.subtitle, hero.cta, features.*）
  - [x] Task 3.10.4: 添加 games 部分（title, description, playNow, viewResults, dimensions.memory/attention/reaction/executive/relaxation）
  - [x] Task 3.10.5: 添加 dashboard 部分（welcome, brainAge, totalScore, streak, achievements, recentGames）
  - [x] Task 3.10.6: 添加 auth 部分（signIn, signUp, email, password, forgotPassword, turnstileVerifying）
  - [x] Task 3.10.7: 添加 cookie 部分（title, description, acceptAll, rejectOptional, savePreferences, strictlyNecessary, performanceAnalytics, targetingAds）
  - [x] Task 3.10.8: 添加 footer 部分（copyright, privacyPolicy, termsOfService, contactUs）
  - [x] Task 3.10.9: 添加 errors 部分（generic, network, notFound, unauthorized, validation.*）
  - [x] Task 3.10.10: 添加 games_runtime 部分（level, score, lives, correct, wrong, accuracy, reactionTime, start, pause, resume, finish, next, retry, results）

- [x] Task 3.11: 创建 `apps/web/i18n/zh.json`（中文翻译）
  - [x] Task 3.11.1: 对应 en.json 所有 key 的简体中文翻译
  - [x] Task 3.11.2: 确保 key 结构与 en.json 完全一致

- [x] Task 3.12: 创建 `apps/web/i18n/ja.json`（日语翻译）
  - [x] Task 3.12.1: 对应 en.json 所有 key 的日语翻译
  - [x] Task 3.12.2: 确保 key 结构与 en.json 完全一致

#### 3F: 基础组件与工具

- [x] Task 3.13: 创建 `apps/web/lib/utils.ts`
  - [x] Task 3.13.1: 实现 cn() 函数（clsx + tailwind-merge）
  - [x] Task 3.13.2: 实现 formatDate() 函数（Intl.DateTimeFormat）
  - [x] Task 3.13.3: 实现 formatNumber() 函数（Intl.NumberFormat）
  - [x] Task 3.13.4: 实现 getLocale() 函数（从 URL 参数提取 locale）
  - [x] Task 3.13.5: 实现 validateLocale() 函数（检查 locale 有效性）

- [x] Task 3.14: 创建 `apps/web/components/ui/` Shadcn 基础组件
  - [x] Task 3.14.1: 创建 Button 组件（variants: primary, secondary, accent, ghost; sizes: sm, md, lg, xl, icon）
  - [x] Task 3.14.2: 创建 Card 组件（Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter）
  - [x] Task 3.14.3: 创建 Input 组件
  - [x] Task 3.14.4: 创建 Label 组件
  - [x] Task 3.14.5: 创建 Badge 组件（variants: memory, attention, reaction, executive, relaxation, success, warning, error, info）
  - [x] Task 3.14.6: 创建 Progress 组件（支持维度色变体）
  - [x] Task 3.14.7: 创建 Avatar 组件
  - [x] Task 3.14.8: 创建 Tabs 组件
  - [x] Task 3.14.9: 创建 Toast 组件（Toast, ToastContainer, useToast hook）
  - [x] Task 3.14.10: 创建 Modal/Dialog 组件
  - [x] Task 3.14.11: 创建 Skeleton 组件
  - [x] Task 3.14.12: 创建 Toggle 组件（iOS 风格开关）

- [x] Task 3.15: 创建 `apps/web/components/layout/` 布局组件
  - [x] Task 3.15.1: 创建 Navbar 组件（Logo + 导航链接 + 语言切换 + 登录按钮 + 移动端汉堡菜单）
  - [x] Task 3.15.2: 创建 Footer 组件（版权 + 链接 + 社交媒体）
  - [x] Task 3.15.3: 创建 BottomNav 组件（移动端底部导航：Home / Games / Dashboard / Profile）
  - [x] Task 3.15.4: 创建 CookieConsent 组件（参考 BrainVerse-Design/components/cookie-banner.html）
  - [x] Task 3.15.5: 创建 LanguageSwitcher 组件（en/zh/ja 切换）

---

## Phase D: Cloudflare Workers API（依赖 Phase B 完成，可与 Phase C/E 并行）

### Task 4: 初始化 `workers/api` Cloudflare Workers

#### 4A: 包配置

- [x] Task 4.1: 创建 `workers/api/package.json`
  - [x] Task 4.1.1: 添加 dependencies（hono, @hono/zod-validator, zod）
  - [x] Task 4.1.2: 添加 dependencies（@cloudflare/workers-types, wrangler）
  - [x] Task 4.1.3: 添加 devDependencies（vitest, @cloudflare/vitest-pool-workers）
  - [x] Task 4.1.4: 配置 scripts（dev, deploy, test, typecheck）

- [x] Task 4.2: 创建 `workers/api/tsconfig.json`
  - [x] Task 4.2.1: 配置 types: ["@cloudflare/workers-types"]
  - [x] Task 4.2.2: 配置 lib: ["ES2022"]
  - [x] Task 4.2.3: 配置 module: "ESNext"
  - [x] Task 4.2.4: 配置 moduleResolution: "Bundler"
  - [x] Task 4.2.5: 继承根 tsconfig strict 设置

#### 4B: Wrangler 配置

- [x] Task 4.3: 创建 `workers/api/wrangler.toml`
  - [x] Task 4.3.1: 配置 name = "brainverse-api"
  - [x] Task 4.3.2: 配置 main = "src/index.ts"
  - [x] Task 4.3.3: 配置 compatibility_date = "2024-01-01"
  - [x] Task 4.3.4: 配置 [[d1_databases]] — binding = "DB", database_name = "brainverse-db"
  - [x] Task 4.3.5: 配置 [[kv_namespaces]] — binding = "SESSIONS"
  - [x] Task 4.3.6: 配置 [[kv_namespaces]] — binding = "CACHE"
  - [x] Task 4.3.7: 配置 [[r2_buckets]] — binding = "STORAGE"
  - [x] Task 4.3.8: 配置 [vars] — environment = "production", app_url = "https://cowb.cc"
  - [x] Task 4.3.9: 验证不使用 Durable Objects / Queues / Vectorize

#### 4C: 应用入口与中间件

- [x] Task 4.4: 创建 `workers/api/src/index.ts`
  - [x] Task 4.4.1: 创建 Hono 应用实例
  - [x] Task 4.4.2: 配置 Bindings 类型（D1Database, KVNamespace, R2Bucket, env vars）
  - [x] Task 4.4.3: 添加 CORS 中间件（允许 cowb.cc 和 preview.cowb.cc）
  - [x] Task 4.4.4: 添加 Request ID 中间件（生成唯一请求 ID）
  - [x] Task 4.4.5: 添加 Request Logging 中间件（method, path, status, duration）
  - [x] Task 4.4.6: 添加 Error Handler 中间件（统一错误响应格式）
  - [x] Task 4.4.7: 添加 Not Found Handler
  - [x] Task 4.4.8: 添加 GET /health 路由（返回 { status: "ok", timestamp })
  - [x] Task 4.9: 添加 GET /api 路由（API 信息）

- [x] Task 4.5: 创建 `workers/api/src/middleware/auth.ts`
  - [x] Task 4.5.1: 实现 getSession() 从 KV 读取 Session
  - [x] Task 4.5.2: 实现 requireAuth() 中间件（验证 Session 存在）
  - [x] Task 4.5.3: 实现 requireAdmin() 中间件（验证用户角色）
  - [x] Task 4.5.4: 实现 optionalAuth() 中间件（可选认证）

- [x] Task 4.6: 创建 `workers/api/src/middleware/rate-limit.ts`
  - [x] Task 4.6.1: 实现基于 KV 的简单速率限制（IP 维度，每分钟 60 次）
  - [x] Task 4.6.2: 实现超限响应 429

#### 4D: 路由骨架

- [x] Task 4.7: 创建路由文件骨架
  - [x] Task 4.7.1: `workers/api/src/routes/auth.ts` — POST /api/auth/signup, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/session
  - [x] Task 4.7.2: `workers/api/src/routes/scores.ts` — POST /api/scores, GET /api/scores/my, GET /api/scores/leaderboard
  - [x] Task 4.7.3: `workers/api/src/routes/brain-age.ts` — POST /api/brain-age/calculate, GET /api/brain-age/history
  - [x] Task 4.7.4: `workers/api/src/routes/games.ts` — GET /api/games, GET /api/games/:slug
  - [x] Task 4.7.5: `workers/api/src/routes/growth.ts` — GET /api/growth/achievements, GET /api/growth/streak, GET /api/growth/pet
  - [x] Task 4.7.6: `workers/api/src/routes/challenges.ts` — POST /api/challenges, GET /api/challenges, POST /api/challenges/:id/accept
  - [x] Task 4.7.7: `workers/api/src/routes/content.ts` — GET /api/content/articles, GET /api/content/articles/:slug
  - [x] Task 4.7.8: `workers/api/src/routes/admin.ts` — GET /api/admin/feature-flags, PUT /api/admin/feature-flags
  - [x] Task 4.7.9: 在 index.ts 中挂载所有路由

---

## Phase E: 共享包（依赖 Phase B 完成，可与 Phase C/D 并行）

### Task 5: 创建 `packages/` 共享包

- [x] Task 5.1: 创建 `packages/shared/`
  - [x] Task 5.1.1: 创建 package.json（name: @brainverse/shared）
  - [x] Task 5.1.2: 创建 tsconfig.json
  - [x] Task 5.1.3: 创建 src/index.ts（导出所有模块）
  - [x] Task 5.1.4: 创建 src/types.ts（共享类型：Locale, GameDimension, Difficulty, ApiResponse, PaginatedResponse, ErrorResponse）
  - [x] Task 5.1.5: 创建 src/constants.ts（LOCALES, DIMENSIONS, DIFFICULTIES, API_ROUTES, STORAGE_KEYS, COOKIE_KEYS）
  - [x] Task 5.1.6: 创建 src/utils.ts（generateId, hashPassword, verifyPassword, formatTime, clamp, randomChoice, shuffle）

- [x] Task 5.2: 创建 `packages/core/`
  - [x] Task 5.2.1: 创建 package.json（name: @brainverse/core）
  - [x] Task 5.2.2: 创建 tsconfig.json
  - [x] Task 5.2.3: 创建 src/index.ts
  - [x] Task 5.2.4: 创建 src/models/user.ts（User 接口、UserPreferences 接口）
  - [x] Task 5.2.5: 创建 src/models/game.ts（Game 接口、GameResult 接口、GameConfig 接口）
  - [x] Task 5.2.6: 创建 src/models/score.ts（Score 接口、ScoreInput 接口）
  - [x] Task 5.2.7: 创建 src/models/achievement.ts（Achievement 接口、AchievementDefinition 接口）
  - [x] Task 5.2.8: 创建 src/models/streak.ts（Streak 接口）
  - [x] Task 5.2.9: 创建 src/models/brain-pet.ts（BrainPet 接口、PetStage 枚举）
  - [x] Task 5.2.10: 创建 src/models/challenge.ts（Challenge 接口、ChallengeStatus 枚举）
  - [x] Task 5.2.11: 创建 src/models/article.ts（Article 接口、ArticleTranslation 接口）

- [x] Task 5.3: 创建 `packages/brain-engine/`
  - [x] Task 5.3.1: 创建 package.json（name: @brainverse/brain-engine）
  - [x] Task 5.3.2: 创建 tsconfig.json
  - [x] Task 5.3.3: 创建 src/index.ts
  - [x] Task 5.3.4: 创建 src/brain-age.ts（Brain Age 计算函数骨架 — 受保护系统，仅定义接口）
  - [x] Task 5.3.5: 创建 src/brain-score.ts（Brain Score 计算函数骨架）
  - [x] Task 5.3.6: 创建 src/brain-mapping.ts（Brain Mapping 维度映射骨架）
  - [x] Task 5.3.7: 创建 src/percentile.ts（百分位计算骨架）
  - [x] Task 5.3.8: 创建 src/identity.ts（Brain Identity 等级计算骨架）
  - [x] Task 5.3.9: 创建 src/growth.ts（Growth Formula 骨架）
  - [x] Task 5.3.10: 每个文件添加 "PROTECTED SYSTEM — Do not modify without explicit approval" 注释

- [x] Task 5.4: 创建 `packages/game-engine/`
  - [x] Task 5.4.1: 创建 package.json（name: @brainverse/game-engine）
  - [x] Task 5.4.2: 创建 tsconfig.json
  - [x] Task 5.4.3: 创建 src/index.ts
  - [x] Task 5.4.4: 创建 src/base-game.ts（BaseGame 抽象类：start, pause, resume, finish, getResults）
  - [x] Task 5.4.5: 创建 src/score-engine.ts（ScoreEngine：计算分数、正确率、反应时间）
  - [x] Task 5.4.6: 创建 src/adaptive-difficulty.ts（AdaptiveDifficulty：滑窗正确率、难度升降逻辑）
  - [x] Task 5.4.7: 创建 src/game-registry.ts（游戏注册表：slug → GameConfig 映射）
  - [x] Task 5.4.8: 创建 src/types.ts（GameSession, GameRound, GameStats 接口）

- [x] Task 5.5: 创建 `packages/growth-engine/`
  - [x] Task 5.5.1: 创建 package.json（name: @brainverse/growth-engine）
  - [x] Task 5.5.2: 创建 tsconfig.json
  - [x] Task 5.5.3: 创建 src/index.ts
  - [x] Task 5.5.4: 创建 src/achievements.ts（成就定义、解锁条件检查骨架）
  - [x] Task 5.5.5: 创建 src/streaks.ts（连续天数计算、断签判断骨架）
  - [x] Task 5.5.6: 创建 src/brain-pet.ts（宠物进化、成长计算骨架）
  - [x] Task 5.5.7: 创建 src/challenges.ts（挑战创建、完成判定骨架）
  - [x] Task 5.5.8: 创建 src/identity.ts（身份等级、头衔系统骨架）

- [x] Task 5.6: 创建 `packages/content-engine/`
  - [x] Task 5.6.1: 创建 package.json（name: @brainverse/content-engine）
  - [x] Task 5.6.2: 创建 tsconfig.json
  - [x] Task 5.6.3: 创建 src/index.ts
  - [x] Task 5.6.4: 创建 src/article-schema.ts（文章数据结构定义）
  - [x] Task 5.6.5: 创建 src/seo-metadata.ts（SEO 元数据生成器骨架）
  - [x] Task 5.6.6: 创建 src/json-ld.ts（JSON-LD 结构化数据生成器骨架）
  - [x] Task 5.6.7: 创建 src/categories.ts（5 个文章类别定义）

- [x] Task 5.7: 创建 `packages/ui/`
  - [x] Task 5.7.1: 创建 package.json（name: @brainverse/ui）
  - [x] Task 5.7.2: 创建 tsconfig.json
  - [x] Task 5.7.3: 创建 src/index.ts
  - [x] Task 5.7.4: 创建 src/game-card.tsx（游戏卡片组件，支持维度色变体）
  - [x] Task 5.7.5: 创建 src/stat-card.tsx（统计卡片组件）
  - [x] Task 5.7.6: 创建 src/life-bar.tsx（生命值/心形显示组件）
  - [x] Task 5.7.7: 创建 src/dimension-badge.tsx（认知维度徽章组件）

---

## Phase F: 数据库迁移（依赖 Phase D 完成）

### Task 6: D1 数据库迁移文件

- [x] Task 6.1: 创建 `workers/api/migrations/0001_init.sql`
  - [x] Task 6.1.1: 创建 users 表
    - 列：id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, nickname TEXT NOT NULL, locale TEXT NOT NULL DEFAULT 'en', role TEXT NOT NULL DEFAULT 'user', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    - 索引：idx_users_email ON users(email)
  - [x] Task 6.1.2: 创建 sessions 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL
    - 索引：idx_sessions_token ON sessions(token), idx_sessions_user ON sessions(user_id)
  - [x] Task 6.1.3: 创建 games 表
    - 列：id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, dimension TEXT NOT NULL, name_key TEXT NOT NULL, description_key TEXT NOT NULL, icon TEXT, is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
    - 索引：idx_games_slug ON games(slug)
  - [x] Task 6.1.4: 创建 scores 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL, game_id TEXT NOT NULL, score INTEGER NOT NULL, difficulty TEXT NOT NULL DEFAULT 'medium', correct_count INTEGER NOT NULL DEFAULT 0, wrong_count INTEGER NOT NULL DEFAULT 0, avg_reaction_ms INTEGER, rounds_played INTEGER NOT NULL DEFAULT 1, played_at TEXT NOT NULL
    - 索引：idx_scores_user ON scores(user_id), idx_scores_game ON scores(game_id), idx_scores_played ON scores(played_at DESC)
  - [x] Task 6.1.5: 创建 brain_age_results 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL, brain_age INTEGER NOT NULL, dimension_scores TEXT NOT NULL, test_date TEXT NOT NULL, created_at TEXT NOT NULL
    - 索引：idx_brain_age_user ON brain_age_results(user_id)

- [x] Task 6.2: 创建 `workers/api/migrations/0002_growth.sql`
  - [x] Task 6.2.1: 创建 achievements 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL, achievement_id TEXT NOT NULL, unlocked_at TEXT NOT NULL
    - 索引：idx_achievements_user ON achievements(user_id), idx_achievements_unique UNIQUE ON achievements(user_id, achievement_id)
  - [x] Task 6.2.2: 创建 streaks 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, current_streak INTEGER NOT NULL DEFAULT 0, longest_streak INTEGER NOT NULL DEFAULT 0, last_active_date TEXT, updated_at TEXT NOT NULL
  - [x] Task 6.2.3: 创建 brain_pets 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, pet_type TEXT NOT NULL, pet_name TEXT, stage TEXT NOT NULL DEFAULT 'egg', xp INTEGER NOT NULL DEFAULT 0, level INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  - [x] Task 6.2.4: 创建 challenges 表
    - 列：id TEXT PRIMARY KEY, creator_id TEXT NOT NULL, target_id TEXT, game_id TEXT NOT NULL, target_score INTEGER, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, completed_at TEXT, result TEXT
    - 索引：idx_challenges_creator ON challenges(creator_id), idx_challenges_target ON challenges(target_id, status)

- [x] Task 6.3: 创建 `workers/api/migrations/0003_content.sql`
  - [x] Task 6.3.1: 创建 articles 表
    - 列：id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, category TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 0, featured INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    - 索引：idx_articles_slug ON articles(slug), idx_articles_category ON articles(category)
  - [x] Task 6.3.2: 创建 article_translations 表
    - 列：id TEXT PRIMARY KEY, article_id TEXT NOT NULL, locale TEXT NOT NULL, title TEXT NOT NULL, meta_description TEXT, content TEXT NOT NULL, faq TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    - 索引：idx_article_trans_article ON article_translations(article_id), idx_article_trans_locale ON article_translations(article_id, locale) UNIQUE
  - [x] Task 6.3.3: 创建 seo_metadata 表
    - 列：id TEXT PRIMARY KEY, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, locale TEXT NOT NULL, title TEXT, description TEXT, og_image TEXT, canonical_url TEXT, json_ld TEXT, created_at TEXT NOT NULL
    - 索引：idx_seo_entity ON seo_metadata(entity_type, entity_id, locale)

- [x] Task 6.4: 创建 `workers/api/migrations/0004_admin.sql`
  - [x] Task 6.4.1: 创建 feature_flags 表
    - 列：id TEXT PRIMARY KEY, key TEXT NOT NULL UNIQUE, label TEXT NOT NULL, description TEXT, enabled INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  - [x] Task 6.4.2: 创建 admin_users 表
    - 列：id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, role TEXT NOT NULL DEFAULT 'admin', permissions TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL

- [x] Task 6.5: 创建数据库类型与 Repository 骨架
  - [x] Task 6.5.1: 创建 `workers/api/src/db/types.ts`（所有表的 TypeScript 接口：User, Session, Game, Score, BrainAgeResult, Achievement, Streak, BrainPet, Challenge, Article, ArticleTranslation, SeoMetadata, FeatureFlag, AdminUser）
  - [x] Task 6.5.2: 创建 `workers/api/src/db/database.ts`（D1Database 包装类，提供 query/execute 方法）
  - [x] Task 6.5.3: 创建 `workers/api/src/db/repositories/user-repo.ts`（findById, findByEmail, create, update）
  - [x] Task 6.5.4: 创建 `workers/api/src/db/repositories/session-repo.ts`（create, findByToken, delete, deleteExpired）
  - [x] Task 6.5.5: 创建 `workers/api/src/db/repositories/score-repo.ts`（create, findByUser, findLeaderboard）
  - [x] Task 6.5.6: 创建 `workers/api/src/db/repositories/game-repo.ts`（findAll, findBySlug）
  - [x] Task 6.5.7: 创建 `workers/api/src/db/repositories/brain-age-repo.ts`（create, findByUser）
  - [x] Task 6.5.8: 创建 `workers/api/src/db/repositories/achievement-repo.ts`（findByUser, create, findByUserAndId）
  - [x] Task 6.5.9: 创建 `workers/api/src/db/repositories/streak-repo.ts`（findByUser, upsert）
  - [x] Task 6.5.10: 创建 `workers/api/src/db/repositories/brain-pet-repo.ts`（findByUser, upsert）
  - [x] Task 6.5.11: 创建 `workers/api/src/db/repositories/challenge-repo.ts`（create, findByCreator, findByTarget, updateStatus）
  - [x] Task 6.5.12: 创建 `workers/api/src/db/repositories/article-repo.ts`（findAll, findBySlug, findByCategory）
  - [x] Task 6.5.13: 创建 `workers/api/src/db/repositories/feature-flag-repo.ts`（findAll, findByKey, updateEnabled）
  - [x] Task 6.5.14: 创建 `workers/api/src/db/repositories/index.ts`（导出所有 Repository + 工厂函数 createRepositories(db)）

---

## Phase G: 验证（依赖所有前置 Phase 完成）

### Task 7: 结构与配置验证

- [x] Task 7.1: Monorepo 结构验证
  - [x] Task 7.1.1: 验证 pnpm-workspace.yaml 包含 apps/* 和 packages/*
  - [x] Task 7.1.2: 验证所有 package.json 的 name 字段唯一且符合 @brainverse/* 规范
  - [x] Task 7.1.3: 验证根 tsconfig.json paths 别名覆盖所有 @brainverse/* 包
  - [x] Task 7.1.4: 验证 .gitignore 包含所有必要忽略项

- [x] Task 7.2: TypeScript 编译验证
  - [x] Task 7.2.1: 运行 `pnpm -r typecheck` 无错误
  - [x] Task 7.2.2: 验证无 `any` 类型使用
  - [x] Task 7.2.3: 验证 strict 模式下无隐式 any
  - [x] Task 7.2.4: 验证所有路径别名可正确解析

- [x] Task 7.3: Tailwind Design Token 映射验证
  - [x] Task 7.3.1: 验证 tailwind.config.ts 中 colors.primary.DEFAULT === '#4A7CFF'
  - [x] Task 7.3.2: 验证 tailwind.config.ts 中 colors.secondary.DEFAULT === '#50C8A8'
  - [x] Task 7.3.3: 验证 tailwind.config.ts 中 colors.accent.DEFAULT === '#FFB14A'
  - [x] Task 7.3.4: 验证 5 个维度色值与 global.css 一致
  - [x] Task 7.3.5: 验证 darkMode 配置支持 class 策略
  - [x] Task 7.3.6: 验证 borderRadius / spacing / fontSize / shadow 映射完整

- [x] Task 7.4: i18n 路由验证
  - [x] Task 7.4.1: 验证 next.config.js locales 包含 ['en', 'zh', 'ja']
  - [x] Task 7.4.2: 验证 defaultLocale === 'en'
  - [x] Task 7.4.3: 验证 [locale]/layout.tsx 正确验证 locale 参数
  - [x] Task 7.4.4: 验证 en.json / zh.json / ja.json key 结构完全一致
  - [x] Task 7.4.5: 验证首页 page.tsx 无硬编码文本

- [x] Task 7.5: D1 迁移 SQL 验证
  - [x] Task 7.5.1: 验证 0001_init.sql 包含 users 表且列定义完整
  - [x] Task 7.5.2: 验证 0001_init.sql 包含 sessions 表且列定义完整
  - [x] Task 7.5.3: 验证 0001_init.sql 包含 games 表且列定义完整
  - [x] Task 7.5.4: 验证 0001_init.sql 包含 scores 表且列定义完整
  - [x] Task 7.5.5: 验证 0001_init.sql 包含 brain_age_results 表
  - [x] Task 7.5.6: 验证 0002_growth.sql 包含 achievements / streaks / brain_pets / challenges 表
  - [x] Task 7.5.7: 验证 0003_content.sql 包含 articles / article_translations / seo_metadata 表
  - [x] Task 7.5.8: 验证 0004_admin.sql 包含 feature_flags / admin_users 表
  - [x] Task 7.5.9: 验证所有索引定义存在
  - [x] Task 7.5.10: 验证 SQL 语法可通过 sqlite3 解析器

- [x] Task 7.6: Workers API 验证
  - [x] Task 7.6.1: 验证 wrangler.toml 不包含 Durable Objects 配置
  - [x] Task 7.6.2: 验证 wrangler.toml 不包含 Queues 配置
  - [x] Task 7.6.3: 验证 wrangler.toml 不包含 Vectorize 配置
  - [x] Task 7.6.4: 验证 wrangler.toml 配置了 D1 / KV / R2 绑定
  - [x] Task 7.6.5: 验证 index.ts 包含 CORS 中间件
  - [x] Task 7.6.6: 验证 index.ts 包含 Error Handler
  - [x] Task 7.6.7: 验证 GET /health 路由存在
  - [x] Task 7.6.8: 验证所有路由文件已挂载到主应用

- [x] Task 7.7: 共享包验证
  - [x] Task 7.7.1: 验证每个包有 package.json 且 name 以 @brainverse/ 开头
  - [x] Task 7.7.2: 验证每个包有 src/index.ts 导出文件
  - [x] Task 7.7.3: 验证 packages/shared 导出 types / constants / utils
  - [x] Task 7.7.4: 验证 packages/core 导出所有领域模型接口
  - [x] Task 7.7.5: 验证 packages/brain-engine 所有文件含 PROTECTED SYSTEM 注释
  - [x] Task 7.7.6: 验证 packages/game-engine 导出 BaseGame / ScoreEngine / AdaptiveDifficulty

- [x] Task 7.8: 文档完整性验证
  - [x] Task 7.8.1: 验证 PROJECT.md 存在且包含使命、权威层级、技术栈
  - [x] Task 7.8.2: 验证 AGENTS.md 存在且包含文档加载顺序、开发工作流
  - [x] Task 7.8.3: 验证 context/00-project.md 存在
  - [x] Task 7.8.4: 验证 context/01-product.md 存在且包含 11 个模块定义
  - [x] Task 7.8.5: 验证 context/02-architecture.md 存在且包含 Cloudflare 服务映射
  - [x] Task 7.8.6: 验证 decisions/0001-initial-architecture.md 存在
  - [x] Task 7.8.7: 验证 docs/ 目录包含 6 个文档文件

---

## Phase H: 100 篇 SEO 文章内容生成（依赖 Phase F 数据库迁移完成）

### Task 8: 文章质量约束系统建立

- [x] Task 8.1: 创建文章质量检查工具
  - [x] Task 8.1.1: 创建 `packages/content-engine/src/quality-checker.ts`
  - [x] Task 8.1.2: 实现 AI 痕迹检测（检测 "delve into"、"it's worth noting"、"in conclusion"、"unleash"、"harness"、"realm" 等禁用词）
  - [x] Task 8.1.3: 实现段落长度变化检测（短句-中句-长句交替，变化 > 30%）
  - [x] Task 8.1.4: 实现段首句式重复检测（连续段落开头不重复）
  - [x] Task 8.1.5: 实现跨文章查重检测（核心观点重复率 < 15%，同类 < 20%）
  - [x] Task 8.1.6: 实现科学引用验证（每篇 ≥ 2 篇，格式：作者+年份+期刊）
  - [x] Task 8.1.7: 实现原创性检查（至少 1 个原创观点）
  - [x] Task 8.1.8: 实现实用性检查（至少 3 条可操作建议，含时间/频率/方法）
  - [x] Task 8.1.9: 实现关联性检查（至少关联 1 款平台游戏）
  - [x] Task 8.1.10: 实现结构完整性检查（标题→元描述→引言→科学解释→实践建议→相关游戏→FAQ→内链）
  - [x] Task 8.1.11: 实现多语言完整性检查（en/zh/ja 三语齐全，key 结构一致）

- [x] Task 8.2: 创建文章数据插入脚本
  - [x] Task 8.2.1: 创建 `workers/api/scripts/seed-articles.ts`
  - [x] Task 8.2.2: 实现 article 表数据插入（slug, category, published, featured, sort_order）
  - [x] Task 8.2.3: 实现 article_translations 表数据插入（article_id, locale, title, meta_description, content, faq）
  - [x] Task 8.2.4: 实现 seo_metadata 表数据插入（entity_type, entity_id, locale, title, description, json_ld, canonical_url）

### Task 9: Batch 1 — Brain Age 基础概念（5 篇，P0）

- [x] Task 9.1: 生成文章 #1 `what-is-brain-age`
  - [x] Task 9.1.1: 撰写英文版（标题、元描述 150 字内、引言 200 字、科学解释 800 字含 Luria 1973 + Salthouse 2009 引用、实践建议 400 字含 3 条可操作建议、相关游戏段落关联 Brain Age Assessment、FAQ 5 条问答、内链 3 条）
  - [x] Task 9.1.2: 撰写中文版（本地化翻译，非直译）
  - [x] Task 9.1.3: 撰写日语版（本地化翻译，非直译）
  - [x] Task 9.1.4: 生成 JSON-LD 结构化数据（Article Schema + FAQ Schema）
  - [x] Task 9.1.5: 运行质量检查工具验证通过

- [x] Task 9.2: 生成文章 #2 `brain-age-vs-biological-age`（同上 5 步流程，引用 Erdogan 2022）
- [x] Task 9.3: 生成文章 #3 `how-to-test-brain-age`（同上 5 步流程，引用 Wechsler 1955 + Foley 2019）
- [x] Task 9.4: 生成文章 #4 `brain-age-myths-debunked`（同上 5 步流程，引用 Beyerstein 1999）
- [x] Task 9.5: 生成文章 #5 `factors-affecting-brain-age`（同上 5 步流程，引用 Livingston 2020）

### Task 10: Batch 2 — Memory 基础概念（5 篇，P0）

- [x] Task 10.1: 生成文章 #21 `types-of-memory-explained`（5 步流程，引用 Baddeley 1992 + Tulving 1972，关联 Digit Span）
- [x] Task 10.2: 生成文章 #22 `how-working-memory-works`（5 步流程，引用 Baddeley 2000，关联 Digit Span）
- [x] Task 10.3: 生成文章 #23 `memory-consolidation-sleep`（5 步流程，引用 Stickgold 2005 + Rasch 2013，关联 Spatial Memory）
- [x] Task 10.4: 生成文章 #24 `forgetting-curve-ebbinghaus`（5 步流程，引用 Ebbinghaus 1885 + Cepeda 2008，关联 Digit Span）
- [x] Task 10.5: 生成文章 #25 `spatial-memory-navigation`（5 步流程，引用 O'Keefe 1978 + Moser 2014，关联 Spatial Memory）

### Task 11: Batch 3 — Attention 基础概念（5 篇，P0）

- [x] Task 11.1: 生成文章 #41 `types-of-attention`（5 步流程，引用 Posner 1980 + Petersen 2012，关联 Visual Search）
- [x] Task 11.2: 生成文章 #42 `selective-attention-mechanism`（5 步流程，引用 Treisman 1980 + Broadbent 1958，关联 Visual Search）
- [x] Task 11.3: 生成文章 #43 `sustained-attention-vigilance`（5 步流程，引用 Parasuraman 1998，关联 Visual Search）
- [x] Task 11.4: 生成文章 #44 `attention-deficit-myths`（5 步流程，引用 Barkley 2014，关联 Visual Search）
- [x] Task 11.5: 生成文章 #45 `multitasking-brain-cost`（5 步流程，引用 Meyer 1997 + Rubinstein 2001，关联 Stroop Challenge）

### Task 12: Batch 4 — Focus 基础概念（5 篇，P0）

- [x] Task 12.1: 生成文章 #61 `focus-vs-attention-difference`（5 步流程，引用 Chun 2011，关联 Visual Search）
- [x] Task 12.2: 生成文章 #62 `deep-work-brain-science`（5 步流程，引用 Newport 2016 + Csikszentmihalyi 1990，关联 All Games）
- [x] Task 12.3: 生成文章 #63 `pomodoro-technique-science`（5 步流程，引用 Kleitman 1969 + Ariga 2011，关联 Stroop Challenge）
- [x] Task 12.4: 生成文章 #64 `focus-and-procrastination`（5 步流程，引用 Steel 2007，关联 Stroop Challenge）
- [x] Task 12.5: 生成文章 #65 `flow-triggers-and-blockers`（5 步流程，引用 Nakamura 2002，关联 All Games）

### Task 13: Batch 5 — Relaxation 基础概念（5 篇，P0）

- [x] Task 13.1: 生成文章 #81 `relaxation-response-science`（5 步流程，引用 Benson 1975 + Porges 2011，关联 Breathing Flow）
- [x] Task 13.2: 生成文章 #82 `breathing-techniques-comparison`（5 步流程，引用 Brown 2013 + Russo 2017，关联 Breathing Flow）
- [x] Task 13.3: 生成文章 #83 `vagus-nerve-stimulation`（5 步流程，引用 Porges 2011 + Bonaz 2018，关联 Breathing Flow）
- [x] Task 13.4: 生成文章 #84 `cortisol-and-relaxation`（5 步流程，引用 Sapolsky 2004 + McEwen 1998，关联 Breathing Flow）
- [x] Task 13.5: 生成文章 #85 `meditation-types-guide`（5 步流程，引用 Goleman 2017 + Kabat-Zinn 1990，关联 Breathing Flow）

### Task 14: Batch 6 — Brain Age 进阶（15 篇，P1，依赖 Batch 1）

- [x] Task 14.1: 生成文章 #6 `brain-age-and-sleep-quality`（5 步流程，引用 Walker 2017 + Diekelmann 2010）
- [x] Task 14.2: 生成文章 #7 `exercise-and-brain-age`（5 步流程，引用 Erickson 2011 + Hillman 2008，关联 Reaction Training）
- [x] Task 14.3: 生成文章 #8 `diet-and-cognitive-decline`（5 步流程，引用 Morris 2015）
- [x] Task 14.4: 生成文章 #9 `brain-age-and-stress`（5 步流程，引用 Lupien 2009，关联 Breathing Flow）
- [x] Task 14.5: 生成文章 #10 `social-engagement-brain-health`（5 步流程，引用 Krueger 2009）
- [x] Task 14.6: 生成文章 #11 `brain-age-numbers-by-decade`（5 步流程，引用 Salthouse 2004）
- [x] Task 14.7: 生成文章 #12 `neuroplasticity-and-brain-age`（5 步流程，引用 Pascual-Leone 2005 + Erickson 2011，关联 Spatial Memory）
- [x] Task 14.8: 生成文章 #13 `brain-age-and-education`（5 步流程，引用 Stern 2012 + Sharp 2018）
- [x] Task 14.9: 生成文章 #14 `meditation-brain-age`（5 步流程，引用 Lazar 2005 + Tang 2015，关联 Breathing Flow）
- [x] Task 14.10: 生成文章 #15 `brain-age-and-hearing-loss`（5 步流程，引用 Lin 2011）
- [x] Task 14.11: 生成文章 #16 `brain-age-gender-differences`（5 步流程，引用 Mosconi 2017）
- [x] Task 14.12: 生成文章 #17 `brain-age-and-gut-microbiome`（5 步流程，引用 Cryan 2019）
- [x] Task 14.13: 生成文章 #18 `brain-age-tracking-frequency`（5 步流程，引用 Hertzog 2018）
- [x] Task 14.14: 生成文章 #19 `brain-age-and-chronic-disease`（5 步流程，引用 Biessels 2014）
- [x] Task 14.15: 生成文章 #20 `lowering-brain-age-naturally`（5 步流程，引用 Ngandu 2015 FINGER Study，关联 All Games）

### Task 15: Batch 7 — Memory 进阶（15 篇，P1，依赖 Batch 2）

- [x] Task 15.1: 生成文章 #26 `memory-and-emotion`（5 步流程，引用 McGaugh 2004，关联 Spatial Memory）
- [x] Task 15.2: 生成文章 #27 `chunking-memory-strategy`（5 步流程，引用 Miller 1956 + Ericsson 1980，关联 Digit Span）
- [x] Task 15.3: 生成文章 #28 `memory-palace-technique`（5 步流程，引用 Maguire 2003，关联 Spatial Memory）
- [x] Task 15.4: 生成文章 #29 `false-memories-formation`（5 步流程，引用 Loftus 1996 + Schacter 1999，关联 Visual Search）
- [x] Task 15.5: 生成文章 #30 `memory-and-aging-normal`（5 步流程，引用 Grady 2013，关联 Brain Age Assessment）
- [x] Task 15.6: 生成文章 #31 `improve-working-memory`（5 步流程，引用 Klingberg 2010，关联 Digit Span）
- [x] Task 15.7: 生成文章 #32 `memory-and-nutrition`（5 步流程，引用 Gomez-Pinilla 2008）
- [x] Task 15.8: 生成文章 #33 `prospective-memory`（5 步流程，引用 McDaniel 2007，关联 Digit Span）
- [x] Task 15.9: 生成文章 #34 `memory-reconsolidation`（5 步流程，引用 Nader 2000 + Schiller 2010，关联 Spatial Memory）
- [x] Task 15.10: 生成文章 #35 `visual-memory-vs-verbal`（5 步流程，引用 Paivio 1971，关联 Visual Search）
- [x] Task 15.11: 生成文章 #36 `memory-and-exercise-mechanism`（5 步流程，引用 van Praag 2009，关联 Spatial Memory）
- [x] Task 15.12: 生成文章 #37 `memory-supplements-evidence`（5 步流程，引用 Dodge 2008 + Cochrane 2021）
- [x] Task 15.13: 生成文章 #38 `childhood-memory-development`（5 步流程，引用 Bauer 2007，关联 Digit Span）
- [x] Task 15.14: 生成文章 #39 `memory-and-music`（5 步流程，引用 Kraus 2009，关联 Spatial Memory）
- [x] Task 15.15: 生成文章 #40 `memory-decline-prevention`（5 步流程，引用 Valenzuela 2009，关联 All Memory Games）

### Task 16: Batch 8 — Attention 进阶（15 篇，P1，依赖 Batch 3）

- [x] Task 16.1: 生成文章 #46 `stroop-effect-explained`（5 步流程，引用 Stroop 1935 + MacLeod 1991，关联 Stroop Challenge）
- [x] Task 16.2: 生成文章 #47 `attention-and-meditation`（5 步流程，引用 Tang 2015 + Lutz 2008，关联 Breathing Flow）
- [x] Task 16.3: 生成文章 #48 `visual-search-efficiency`（5 步流程，引用 Wolfe 1994 + Treisman 1980，关联 Visual Search）
- [x] Task 16.4: 生成文章 #49 `attention-blink-phenomenon`（5 步流程，引用 Raymond 1992，关联 Visual Search）
- [x] Task 16.5: 生成文章 #50 `distractibility-causes`（5 步流程，引用 Leroy 2009 + Wilmer 2017，关联 Visual Search）
- [x] Task 16.6: 生成文章 #51 `attention-training-games`（5 步流程，引用 Shipstead 2012 + Simons 2016，关联 Visual Search）
- [x] Task 16.7: 生成文章 #52 `adhd-and-attention-games`（5 步流程，引用 Cortese 2020，关联 Visual Search）
- [x] Task 16.8: 生成文章 #53 `attention-and-caffeine`（5 步流程，引用 McLellan 2016 + Haskell 2005，关联 Reaction Training）
- [x] Task 16.9: 生成文章 #54 `attention-in-digital-age`（5 步流程，引用 Carr 2010 + Mark 2018，关联 Visual Search）
- [x] Task 16.10: 生成文章 #55 `inattentional-blindness`（5 步流程，引用 Simons 1999 + Mack 2003，关联 Visual Search）
- [x] Task 16.11: 生成文章 #56 `attention-and-emotion`（5 步流程，引用 Mathews 1994，关联 Stroop Challenge）
- [x] Task 16.12: 生成文章 #57 `attention-development-children`（5 步流程，引用 Posner 2007，关联 Visual Search）
- [x] Task 16.13: 生成文章 #58 `attention-and-aging`（5 步流程，引用 Hasher 1999 + Lustig 2003，关联 Visual Search）
- [x] Task 16.14: 生成文章 #59 `flow-state-attention`（5 步流程，引用 Csikszentmihalyi 1990 + Dietrich 2004，关联 All Games）
- [x] Task 16.15: 生成文章 #60 `improving-focus-naturally`（5 步流程，引用 Klingberg 2010，关联 Visual Search）

### Task 17: Batch 9 — Focus 进阶（15 篇，P1，依赖 Batch 4）

- [x] Task 17.1: 生成文章 #66 `focus-and-dopamine`（5 步流程，引用 Volkow 2009 + Westbrook 2019，关联 Reaction Training）
- [x] Task 17.2: 生成文章 #67 `music-and-focus`（5 步流程，引用 Rauscher 1993 + Angwin 2017，关联 All Games）
- [x] Task 17.3: 生成文章 #68 `focus-environment-design`（5 步流程，引用 Choi 2019 + Veitch 2008，关联 All Games）
- [x] Task 17.4: 生成文章 #69 `digital-minimalism-focus`（5 步流程，引用 Newport 2019 + Alter 2017，关联 All Games）
- [x] Task 17.5: 生成文章 #70 `focus-and-breakfast`（5 步流程，引用 Benton 2007 + Hoyland 2009，关联 Stroop Challenge）
- [x] Task 17.6: 生成文章 #71 `focus-morning-vs-evening`（5 步流程，引用 Schmidt 2007 + Roenneberg 2003，关联 All Games）
- [x] Task 17.7: 生成文章 #72 `focus-and-anxiety`（5 步流程，引用 Eysenck 2007 + Berggren 2013，关联 Stroop Challenge）
- [x] Task 17.8: 生成文章 #73 `focus-and-temperature`（5 步流程，引用 Lan 2011 + Wyon 2004，关联 Stroop Challenge）
- [x] Task 17.9: 生成文章 #74 `focus-tracking-tools`（5 步流程，引用 Mark 2008 + Dabbish 2011，关联 All Games）
- [x] Task 17.10: 生成文章 #75 `focus-and-boredom`（5 步流程，引用 Eastwood 2012，关联 All Games）
- [x] Task 17.11: 生成文章 #76 `intermittent-focus-bursts`（5 步流程，引用 Kaplan 1995 + Ariga 2011，关联 All Games）
- [x] Task 17.12: 生成文章 #77 `focus-and-body-posture`（5 步流程，引用 Nair 2015 + Cuddy 2018，关联 All Games）
- [x] Task 17.13: 生成文章 #78 `focus-and-nature-walks`（5 步流程，引用 Berman 2008 + Bratman 2015，关联 Breathing Flow）
- [x] Task 17.14: 生成文章 #79 `focus-and-hydration`（5 步流程，引用 Adan 2012 + Ganio 2011，关联 Stroop Challenge）
- [x] Task 17.15: 生成文章 #80 `building-focus-habit`（5 步流程，引用 Lally 2010 + Duhigg 2012，关联 All Games）

### Task 18: Batch 10 — Relaxation 进阶（15 篇，P1，依赖 Batch 5）

- [x] Task 18.1: 生成文章 #86 `progressive-muscle-relaxation`（5 步流程，引用 Jacobson 1938 + Bernstein 1973，关联 Breathing Flow）
- [x] Task 18.2: 生成文章 #87 `guided-imagery-relaxation`（5 步流程，引用 Cumming 2008 + Onieva-Padilla 2016，关联 Breathing Flow）
- [x] Task 18.3: 生成文章 #88 `yoga-and-brain-relaxation`（5 步流程，引用 Streeter 2012 + Pascoe 2017，关联 Breathing Flow）
- [x] Task 18.4: 生成文章 #89 `stress-inoculation-training`（5 步流程，引用 Meichenbaum 1985，关联 Breathing Flow）
- [x] Task 18.5: 生成文章 #90 `relaxation-and-immunity`（5 步流程，引用 Segerstrom 2004 + Glaser 2005，关联 Breathing Flow）
- [x] Task 18.6: 生成文章 #91 `sleep-relaxation-protocol`（5 步流程，引用 Walker 2017 + Bootzin 1972，关联 Breathing Flow）
- [x] Task 18.7: 生成文章 #92 `nature-sounds-relaxation`（5 步流程，引用 Alvarsson 2010 + Annerstedt 2013，关联 Breathing Flow）
- [x] Task 18.8: 生成文章 #93 `biofeedback-relaxation-guide`（5 步流程，引用 Lehrer 2000 + Wheat 2010，关联 Breathing Flow）
- [x] Task 18.9: 生成文章 #94 `relaxation-and-creativity`（5 步流程，引用 Kounios 2009 + Jung-Beeman 2004，关联 Breathing Flow）
- [x] Task 18.10: 生成文章 #95 `workplace-micro-relaxation`（5 步流程，引用 Kalia 2018 + Wolever 2012，关联 Breathing Flow）
- [x] Task 18.11: 生成文章 #96 `relaxation-for-children`（5 步流程，引用 Goldstein 2016 + Hagen 2014，关联 Breathing Flow）
- [x] Task 18.12: 生成文章 #97 `yoga-nidra-deep-relaxation`（5 步流程，引用 Saraswati 1998 + Eastman-Mueller 2013，关联 Breathing Flow）
- [x] Task 18.13: 生成文章 #98 `relaxation-and-pain-management`（5 步流程，引用 Hoffman 2011 + Morone 2011，关联 Breathing Flow）
- [x] Task 18.14: 生成文章 #99 `seasonal-relaxation-strategies`（5 步流程，引用 Rosenthal 1984 + Terman 2016，关联 Breathing Flow）
- [x] Task 18.15: 生成文章 #100 `daily-relaxation-routine`（5 步流程，引用 Kabat-Zinn 1990 + Benson 1975，关联 Breathing Flow）

---

## Phase I: 文章质量验证（依赖 Phase H 全部完成）

### Task 19: 100 篇文章批量质量验证

- [ ] Task 19.1: AI 痕迹全量检查
  - [ ] Task 19.1.1: 扫描全部 100 篇 × 3 语言 = 300 篇文本中的 AI 禁用词
  - [ ] Task 19.1.2: 验证每篇段落长度变化 > 30%
  - [ ] Task 19.1.3: 验证每篇段首句式无连续重复
  - [ ] Task 19.1.4: 生成 AI 痕迹检测报告，标记不通过的文章

- [ ] Task 19.2: 跨文章查重检查
  - [ ] Task 19.2.1: 对 100 篇文章进行两两相似度计算
  - [ ] Task 19.2.2: 验证全局核心观点重复率 < 15%
  - [ ] Task 19.2.3: 验证同类别内重复率 < 20%
  - [ ] Task 19.2.4: 标记重复率超标的文章对，要求重写

- [ ] Task 19.3: 科学引用验证
  - [ ] Task 19.3.1: 验证每篇文章至少 2 篇引用
  - [ ] Task 19.3.2: 验证引用格式规范（作者+年份+期刊/机构）
  - [ ] Task 19.3.3: 抽查 20% 引用文献的真实性（通过 Google Scholar / PubMed 查验）
  - [ ] Task 19.3.4: 标记引用不足或格式错误的文章

- [ ] Task 19.4: 实用性与关联性验证
  - [ ] Task 19.4.1: 验证每篇至少 3 条可操作建议（含时间/频率/方法）
  - [ ] Task 19.4.2: 验证每篇至少关联 1 款平台游戏
  - [ ] Task 19.4.3: 验证游戏关联段落自然非生硬
  - [ ] Task 19.4.4: 验证内链至少 3 条且指向真实存在的文章

- [ ] Task 19.5: 结构完整性验证
  - [ ] Task 19.5.1: 验证每篇包含 8 个必需部分（标题→元描述→引言→科学解释→实践建议→相关游戏→FAQ→内链）
  - [ ] Task 19.5.2: 验证元描述 ≤ 150 字符
  - [ ] Task 19.5.3: 验证引言 ≥ 150 字
  - [ ] Task 19.5.4: 验证科学解释 ≥ 600 字
  - [ ] Task 19.5.5: 验证实践建议 ≥ 300 字
  - [ ] Task 19.5.6: 验证 FAQ ≥ 4 条问答
  - [ ] Task 19.5.7: 验证 JSON-LD 结构化数据有效

- [ ] Task 19.6: 多语言完整性验证
  - [ ] Task 19.6.1: 验证 100 篇 × 3 语言 = 300 个翻译记录全部存在
  - [ ] Task 19.6.2: 验证三语版本 key 结构完全一致
  - [ ] Task 19.6.3: 抽查 10% 文章的翻译质量（非直译、本地化）
  - [ ] Task 19.6.4: 验证 SEO 元数据三语版本齐全

- [ ] Task 19.7: 数据库完整性验证
  - [ ] Task 19.7.1: 验证 articles 表有 100 条记录
  - [ ] Task 19.7.2: 验证 article_translations 表有 300 条记录（100 × 3 语言）
  - [ ] Task 19.7.3: 验证 seo_metadata 表有 300 条记录
  - [ ] Task 19.7.4: 验证所有 article.slug 唯一
  - [ ] Task 19.7.5: 验证所有 article.category 值 ∈ {brain-age, memory, attention, focus, relaxation}
  - [ ] Task 19.7.6: 验证每类别文章数 = 20

# Task Dependencies

- Phase A（Task 1: 文档框架）→ 无依赖，可立即开始
- Phase B（Task 2: Monorepo 基础）→ 依赖 Phase A 完成
- Phase C（Task 3: Next.js 应用）→ 依赖 Phase B 完成
- Phase D（Task 4: Workers API）→ 依赖 Phase B 完成
- Phase E（Task 5: 共享包）→ 依赖 Phase B 完成
- Phase F（Task 6: 数据库迁移）→ 依赖 Phase D 完成
- Phase G（Task 7: 验证）→ 依赖 Phase C + D + E + F 全部完成
- Phase H（Task 8-18: 文章生成）→ 依赖 Phase F 完成；Batch 1-5 可并行；Batch 6-10 依赖对应基础 Batch
- Phase I（Task 19: 文章验证）→ 依赖 Phase H 全部完成
- Phase C / D / E 可在 Phase B 完成后并行执行

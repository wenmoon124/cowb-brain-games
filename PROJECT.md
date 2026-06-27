# BrainVerse 项目总览与业务规则

> 本文件是 BrainVerse (cowb.cc) 项目的最高权威文档，定义项目使命、产品愿景、技术栈约束、业务规则与实现规范。所有 AI 代理、工程师与利益相关者在做任何架构或实现决策前 MUST 首先阅读本文档。
>
> **文档版本**：1.0
> **最后更新**：Phase A — 项目初始化与基础架构
> **适用范围**：BrainVerse MVP 全部阶段（Phase 1–5）

---

## 目录

1. [项目使命声明](#1-项目使命声明)
2. [产品愿景](#2-产品愿景)
3. [权威层级](#3-权威层级)
4. [技术栈定义](#4-技术栈定义)
5. [Cloudflare 免费计划服务白名单](#5-cloudflare-免费计划服务白名单)
6. [Cloudflare 免费计划服务黑名单](#6-cloudflare-免费计划服务黑名单)
7. [多语言策略](#7-多语言策略)
8. [MVP 产品范围](#8-mvp-产品范围)
9. [MVP 游戏清单](#9-mvp-游戏清单)
10. [Brain Engine 受保护系统清单](#10-brain-engine-受保护系统清单)
11. [Growth Engine 模块清单](#11-growth-engine-模块清单)
12. [Content Engine 规范](#12-content-engine-规范)
13. [SEO 规则](#13-seo-规则)
14. [数据库规则](#14-数据库规则)
15. [Admin Panel 模块清单](#15-admin-panel-模块清单)
16. [Feature Flags 策略](#16-feature-flags-策略)
17. [Analytics 事件清单](#17-analytics-事件清单)
18. [错误处理策略](#18-错误处理策略)
19. [备份策略](#19-备份策略)

---

## 1. 项目使命声明

BrainVerse 定位为 **Brain Operating System（大脑操作系统）**——一个面向全球用户的浏览器端脑健康平台。它将认知训练、大脑放松、脑力年龄评估、身份成长与教育内容统一整合在 cowb.cc 单一域名下，为用户提供贯穿终身的、可量化、可追踪、可分享的脑健康体验。

BrainVerse 不是单一功能网站，而是一个由四大引擎协同驱动的完整系统：

| 引擎 | 职责 |
|---|---|
| **Brain Engine** | 评估与计算——脑力年龄、脑力得分、身份等级、成长曲线 |
| **Game Engine** | 训练与挑战——基于认知科学的 6 款 MVP 游戏 + 自适应难度 |
| **Growth Engine** | 激励与留存——成就、连续打卡、脑力宠物、挑战、分享 |
| **Content Engine** | 科普与 SEO——100 篇三语原创脑健康文章，构建知识闭环 |

**项目核心承诺**：

- **科学性**：所有游戏与公式均基于认知神经科学文献，引用真实可查的同行评审研究。
- **可访问性**：完全运行于浏览器，无需下载、无需安装，移动端与桌面端体验一致。
- **本地化**：从架构层面支持多语言，MVP 覆盖 English / 简体中文 / 日本語。
- **零成本基建**：100% 构建于 Cloudflare 免费计划之上，可长期可持续运营。
- **长期成长**：用户数据贯穿数月、数年，形成可量化的脑力成长曲线，而非一次性测试。

---

## 2. 产品愿景

### 2.1 BrainVerse IS（BrainVerse 是什么）

- ✅ **Brain Age（脑力年龄）**——基于多维度认知测试计算用户的脑力年龄，并提供历史追踪
- ✅ **Cognitive Training（认知训练）**——基于 5 大认知维度（Memory / Attention / Reaction / Executive / Relaxation）的科学训练游戏
- ✅ **Brain Relaxation（大脑放松）**——通过呼吸训练、冥想引导降低压力、平衡自主神经
- ✅ **Identity（身份成长）**——基于脑力数据的身份等级与头衔系统，让用户的脑力成长可视化
- ✅ **Progression（成长进阶）**——成就系统、Streak 连续打卡、Brain Pet 宠物陪伴、Brain Level 等级
- ✅ **Knowledge（知识科普）**——100 篇基于同行评审文献的脑健康文章，构建 Content ↔ Game 闭环
- ✅ **Social Competition（社交竞争）**——好友挑战、排行榜、成绩分享，激活社交传播
- ✅ **Long-Term Brain Growth（长期脑力成长）**——以月/年为单位的脑力趋势追踪，建立终身关系

### 2.2 BrainVerse IS NOT（BrainVerse 不是什么）

- ❌ **不是单纯的小游戏集合（Mini Games Collection）**——游戏只是手段，脑力成长才是目的
- ❌ **不是益智题网站（Puzzle Website）**——我们不做数独、拼图、 crossword 类纯娱乐内容
- ❌ **不是放松冥想网站（Relaxation Website）**——放松只是 5 大维度之一，不是全部
- ❌ **不是一次性脑力年龄计算器（Brain Age Calculator）**——评估是入口，长期训练与成长才是核心
- ❌ **不是付费 SaaS**——MVP 完全免费，基于 Cloudflare 免费计划长期运营
- ❌ **不是临床诊断工具**——所有数据仅供参考与娱乐，不构成医疗建议

### 2.3 产品愿景声明

> BrainVerse 致力于成为用户大脑的"操作系统"——让每个人都能像管理手机一样管理自己的脑力健康：评估（脑力年龄）、训练（认知游戏）、放松（呼吸冥想）、成长（身份与等级）、学习（科普文章）、连接（社交挑战），形成终身闭环。

---

## 3. 权威层级

当不同层级的文档或决策发生冲突时，按以下层级裁决（上层优先于下层）：

```
┌─────────────────────────────────────────────┐
│  1. Business Requirements (业务需求)          │  最高权威
│     - 本文件 PROJECT.md                       │
│     - 商业目标与用户价值                       │
├─────────────────────────────────────────────┤
│  2. Product Rules (产品规则)                  │
│     - context/01-product.md                   │
│     - 模块定义、用户故事、功能边界             │
├─────────────────────────────────────────────┤
│  3. Architecture (架构)                       │
│     - context/02-architecture.md              │
│     - decisions/ 下的 ADR                      │
│     - 系统结构与数据流                         │
├─────────────────────────────────────────────┤
│  4. Technical Specifications (技术规范)        │
│     - specs/ 下的功能 spec                     │
│     - API 契约、数据模型                       │
├─────────────────────────────────────────────┤
│  5. Design References (设计参考)              │
│     - BrainVerse-Design/ 下的 HTML 设计稿      │
│     - styles/global.css Design Token          │
├─────────────────────────────────────────────┤
│  6. Implementation (实现)                     │  最低权威
│     - 实际代码、组件、路由                     │
└─────────────────────────────────────────────┘
```

### 冲突处理规则

| 冲突场景 | 裁决方向 |
|---|---|
| 设计稿与业务需求冲突 | **业务需求胜出**，设计需调整 |
| 设计稿与架构约束冲突 | **架构胜出**，设计需调整 |
| 实现与 spec 不一致 | **Spec 胜出**，实现需重构 |
| Spec 与架构冲突 | **架构胜出**，spec 需修订 |
| 架构与业务需求冲突 | **业务需求胜出**，架构需重新设计 |

> ⚠️ 任何层级冲突时，AI 代理 MUST 在 PR 描述中明确记录冲突内容与裁决依据，不得擅自决定。

---

## 4. 技术栈定义

### 4.1 前端技术栈

| 技术 | 用途 | 版本约束 |
|---|---|---|
| **Next.js** | React 全栈框架（App Router） | 14+ |
| **TypeScript** | 类型系统（Strict Mode） | 5+ |
| **TailwindCSS** | 原子化 CSS（映射 Design Token） | 3+ |
| **Shadcn UI** | 可定制组件库（基于 Radix UI） | latest |

### 4.2 后端技术栈

| 技术 | 用途 | 备注 |
|---|---|---|
| **Cloudflare Workers** | Serverless API 后端 | 使用 Hono 路由框架 |
| **TypeScript** | 类型安全 | 与前端共享类型 |

### 4.3 Cloudflare 服务映射

| 服务 | 用途 | 免费计划配额 |
|---|---|---|
| **D1** | 主数据库（用户、分数、文章、配置） | 5M reads/day, 100K writes/day |
| **KV** | 缓存（Session、排行榜、Feature Flags） | 100K reads/day, 1K writes/day |
| **R2** | 对象存储（用户头像、分享图片、文章封面） | 10GB storage |
| **Cloudflare Web Analytics** | 页面与事件追踪 | 免费、隐私优先 |
| **Turnstile** | 人机验证（注册/登录） | 无限次 |
| **Pages** | 前端静态部署 + SSR | 500 builds/month |
| **DNS** | 域名解析 | 免费 |
| **Cache** | 边缘缓存 | 免费 |

### 4.4 域名规划

| 域名 | 用途 |
|---|---|
| **cowb.cc** | 生产环境（Production） |
| **preview.cowb.cc** | 预览环境（Preview / Staging） |

### 4.5 工具链与规范

| 工具 | 用途 |
|---|---|
| **pnpm** | Monorepo 包管理器（workspace 模式） |
| **Vitest** | 单元测试框架 |
| **ESLint** | 代码静态分析 |
| **Prettier** | 代码格式化 |
| **Wrangler** | Cloudflare Workers 本地开发与部署 CLI |

---

## 5. Cloudflare 免费计划服务白名单

以下服务为 BrainVerse **允许使用**的 Cloudflare 免费计划服务。任何架构决策 MUST 仅基于此列表。

| 服务 | 用途 | 免费配额 |
|---|---|---|
| ✅ **Pages** | 前端 Next.js 应用部署（SSR + 静态资源） | 500 builds/month, 无限请求 |
| ✅ **Workers** | API 后端（Hono 路由） | 100K requests/day |
| ✅ **D1** | 主关系型数据库（SQLite 兼容） | 5M reads/day, 100K writes/day, 5GB storage |
| ✅ **KV** | 键值缓存（Session / 排行榜 / 配置） | 100K reads/day, 1K writes/day, 1GB storage |
| ✅ **R2** | 对象存储（图片、文件） | 10GB storage, 1M Class A ops/month |
| ✅ **Web Analytics** | 隐私优先的网站分析 | 免费、无限次 |
| ✅ **Turnstile** | 人机验证（替代 reCAPTCHA） | 无限次 |
| ✅ **DNS** | 域名解析 | 免费 |
| ✅ **Cache** | 边缘缓存（减少 Workers 与 D1 负载） | 免费 |

### 配额管理原则

1. **前端优先**：能放在前端处理的逻辑不进 Workers（减少 request 消耗）
2. **缓存优先**：能从 KV 读取的数据不查 D1（减少 read 消耗）
3. **批量写入**：写入操作尽量合并，避免高频单条写入（保护 write 配额）
4. **长 TTL**：KV 缓存使用尽可能长的 TTL（默认 1 小时，配置类 24 小时）
5. **按需上传**：R2 仅在用户主动操作时上传，不自动生成衍生文件

---

## 6. Cloudflare 免费计划服务黑名单

以下服务为 BrainVerse **禁止使用**的 Cloudflare 付费服务。任何 PR 引入这些服务 MUST 被拒绝。

| 服务 | 禁用原因 | 替代方案 |
|---|---|---|
| ❌ **Durable Objects** | 付费服务（需 Workers Paid） | 使用 KV + D1 实现有状态协调 |
| ❌ **Queues** | 付费服务 | 使用 KV 列表 + Workers Cron 实现异步任务 |
| ❌ **Vectorize** | 付费服务 | 不做向量搜索；用 SQLite FTS5 或预计算标签 |
| ❌ **Workers AI** | 付费服务 | 不集成 LLM；所有内容人工/脚本生成 |
| ❌ **AI Gateway** | 付费服务 | 不使用 AI 网关 |
| ❌ **Browser Rendering** | 付费服务 | 不做服务端截图；用 OG Image API 或预生成 |
| ❌ **Cloudflare Images** | 付费服务 | 使用 R2 + 自定义图片处理 |
| ❌ **Stream** | 付费服务 | 不集成视频流；放松音频用 R2 + HTML5 audio |
| ❌ **Zero Trust** | 付费服务（团队规模） | Admin 使用自建 RBAC + Turnstile |

> ⚠️ 如未来业务需要付费服务，MUST 先在 `decisions/` 下创建 ADR 评估成本与必要性，并经 Lead Architect 批准后方可引入。

---

## 7. 多语言策略

### 7.1 MVP 支持语言

| 语言代码 | 语言 | 优先级 |
|---|---|---|
| `en` | English（英语） | P0 — 默认语言 |
| `zh` | 简体中文 | P0 |
| `ja` | 日本語（日语） | P0 |

### 7.2 路由规则

采用 Next.js App Router 的 `[locale]` 动态段实现多语言路由：

```
/en/              → 英语首页
/zh/              → 简体中文首页
/ja/              → 日语首页
/en/games         → 英语游戏中心
/zh/games         → 简体中文游戏中心
/en/articles/xxx  → 英语文章详情
/zh/articles/xxx  → 简体中文文章详情
```

- 访问根路径 `/` 时 MUST 重定向到 `/en/`（默认语言）
- 用户首次访问时根据 `Accept-Language` header 自动跳转对应语言（仅限 en/zh/ja，其他回退 en）
- 语言切换器 MUST 保留当前路径，仅替换 locale 段

### 7.3 翻译文件组织

```
apps/web/i18n/
├── en.json    # 英语（基准语言，所有 key 必须首先在此定义）
├── zh.json    # 简体中文（key 结构 MUST 与 en.json 完全一致）
└── ja.json    # 日语（key 结构 MUST 与 en.json 完全一致）
```

### 7.4 翻译规范

1. **无硬编码文本**：所有 UI 文本 MUST 通过翻译 key 引用，禁止在 JSX 中直接写字符串字面量
   - ❌ `<h1>Welcome to BrainVerse</h1>`
   - ✅ `<h1>{t('landing.hero.title')}</h1>`
2. **Key 命名约定**：使用点分层级，全小写驼峰，如 `games.memory.title`、`dashboard.streak.current`
3. **基准语言**：以 `en.json` 为基准，新增 key MUST 先在 `en.json` 中定义，再同步到 `zh.json` 与 `ja.json`
4. **本地化非直译**：翻译 MUST 本地化而非机器直译，特别是文化相关表达
5. **复数与性别**：使用 ICU MessageFormat 处理复数（如 `{count, plural, one {# game} other {# games}}`）
6. **数字与日期**：使用 `Intl.NumberFormat` 与 `Intl.DateTimeFormat` 按 locale 格式化

### 7.5 内容多语言

文章内容（articles）通过 `article_translations` 表实现多语言，每篇文章 MUST 有 3 条翻译记录（en/zh/ja），缺失任何一种语言的 PR MUST 被拒绝。

---

## 8. MVP 产品范围

BrainVerse MVP 包含 **11 个核心模块**，覆盖用户从首次访问到长期留存的完整旅程：

| # | 模块 | 目的 | 优先级 |
|---|---|---|---|
| 1 | **Landing Page** | 首次访问者了解平台价值，引导注册 | P0 |
| 2 | **Brain Age Assessment** | 用户完成多维度测试，获得脑力年龄 | P0 |
| 3 | **User Dashboard** | 用户查看训练进度、Brain Age 趋势、统计 | P0 |
| 4 | **User Profile** | 用户管理个人信息、偏好、语言设置 | P0 |
| 5 | **Content Hub** | 用户浏览 100 篇脑健康科普文章 | P0 |
| 6 | **SEO System** | 程序化 SEO，300+ 可索引页面 | P0 |
| 7 | **Achievement System** | 用户解锁成就，获得满足感与目标感 | P1 |
| 8 | **Streak System** | 用户保持每日训练连续性 | P1 |
| 9 | **Brain Pet System** | 用户培养脑力宠物，建立情感连接 | P1 |
| 10 | **Share System** | 用户分享成绩到社交媒体，激活传播 | P1 |
| 11 | **Challenge System** | 用户挑战好友比拼脑力，激活社交 | P1 |

### 模块详细定义

每个模块的完整定义（目的、功能列表、用户故事、验收标准）见 `context/01-product.md`。

### Out of Scope（MVP 不包含）

- ❌ 付费订阅系统
- ❌ 临床诊断功能
- ❌ 多人对战实时同步（仅异步挑战）
- ❌ 第三方集成（Apple Health / Google Fit）
- ❌ 原生 App（仅 Web）
- ❌ 视频内容
- ❌ 论坛 / UGC 社区

---

## 9. MVP 游戏清单

BrainVerse MVP 包含 **6 款游戏**，覆盖 5 大认知维度（Memory / Attention / Reaction / Executive / Relaxation）：

| # | 游戏名 | Slug | 认知维度 | 认知目标 |
|---|---|---|---|---|
| 1 | Visual Search | `visual-search` | Attention（注意力） | Visual Attention / Processing Speed（视觉注意与处理速度） |
| 2 | Digit Span | `digit-span` | Memory（记忆力） | Working Memory（工作记忆） |
| 3 | Reaction Training | `reaction-training` | Reaction（反应力） | Reaction Speed（反应速度） |
| 4 | Stroop Challenge | `stroop-challenge` | Executive（执行功能） | Executive Function / Cognitive Control（执行功能与认知控制） |
| 5 | Spatial Memory | `spatial-memory` | Memory（记忆力） | Spatial Memory（空间记忆） |
| 6 | Breathing Flow | `breathing-flow` | Relaxation（放松） | Relaxation / Autonomic Balance（放松与自主神经平衡） |

### 游戏维度色映射

| 维度 | 颜色 | Hex |
|---|---|---|
| Memory | 紫色 | `#8B5CF6` |
| Attention | 青色 | `#06B6D4` |
| Reaction | 琥珀 | `#FFB14A` |
| Executive | 绿色 | `#10B981` |
| Relaxation | 蓝色 | `#4A7CFF` |

### 游戏规格

每款游戏的完整规格（认知目标、游戏规则、难度曲线、评分公式、数据采集点）见 `context/01-product.md` 的 Game 1–6 部分。所有游戏的评分逻辑 MUST 通过 `@brainverse/game-engine` 的 `ScoreEngine` 统一处理，禁止在组件内自行计算。

### 自适应难度

所有游戏 MUST 实现 `AdaptiveDifficulty` 系统：基于最近 5 轮的滑窗正确率动态调整难度，正确率 > 80% 升级，< 50% 降级，保证用户始终处于"心流"区间。

---

## 10. Brain Engine 受保护系统清单

Brain Engine 包含 **6 个受保护公式**，是 BrainVerse 的核心 IP 与商业壁垒。这些公式的实现 MUST 通过 `@brainverse/brain-engine` 包统一管理，禁止在业务代码中复制逻辑。

| # | 公式名 | 用途 | 输入 | 输出 |
|---|---|---|---|---|
| 1 | **Brain Age Formula** | 计算用户的脑力年龄 | 多维度游戏成绩 + 用户年龄 | 脑力年龄（整数，范围 18–80） |
| 2 | **Brain Score Formula** | 计算单局游戏的脑力得分 | 游戏成绩 + 难度 + 维度权重 | 脑力得分（0–1000） |
| 3 | **Brain Identity Formula** | 计算用户的身份等级与头衔 | 总脑力得分 + 训练天数 + 成就数 | 身份等级 + 头衔 |
| 4 | **Growth Formula** | 计算用户的成长曲线斜率 | 历史脑力得分时间序列 | 周增长率 + 月增长率 |
| 5 | **Brain Mapping Formula** | 将多维度得分映射为脑力雷达图 | 5 维度得分 | 归一化雷达图数据 + 短板识别 |
| 6 | **Percentile Formula** | 计算用户在同龄人中的百分位 | 用户得分 + 同龄人得分分布 | 百分位（0–100） |

### 受保护规则

1. **PROTECTED SYSTEM 标记**：每个公式文件 MUST 在文件顶部添加 `// PROTECTED SYSTEM — Do not modify without explicit approval from Lead Architect` 注释
2. **单一实现源**：禁止在任何其他包/应用中复制公式逻辑；所有调用 MUST 通过 `@brainverse/brain-engine` 导出的函数
3. **修改审批**：任何对公式逻辑的修改 MUST 经过 Lead Architect 明确批准，并在 PR 描述中说明修改原因、影响范围、回归测试
4. **版本化**：公式版本号 MUST 记录在数据库（`brain_age_results.formula_version`），便于历史数据兼容
5. **测试覆盖**：每个公式 MUST 有完整的单元测试，覆盖边界值（最小、最大、空输入）与典型场景

---

## 11. Growth Engine 模块清单

Growth Engine 包含 **10 个子系统**，驱动用户长期留存与情感连接：

| # | 子系统 | 目的 | 核心机制 |
|---|---|---|---|
| 1 | **Daily Challenge** | 每日训练目标 | 每天生成 1 个挑战（如"完成 3 局 Memory 游戏"），24h 过期 |
| 2 | **Weekly Challenge** | 每周训练目标 | 每周一生成周挑战，7 天过期，奖励更丰厚 |
| 3 | **Achievements** | 成就解锁 | 多分类成就（训练类、社交类、成长类），解锁后展示徽章 |
| 4 | **Streak** | 连续打卡 | 连续训练天数计数，断签后保留"恢复卡"机制 |
| 5 | **Brain Pet** | 脑力宠物 | 用户培养虚拟宠物，宠物随训练 XP 进化（egg → baby → teen → adult） |
| 6 | **Identity** | 身份等级 | 基于总脑力得分的头衔系统（如"脑力新手"→"脑力大师"） |
| 7 | **Brain Level** | 脑力等级 | 经验值驱动的数字等级，每级解锁新功能/外观 |
| 8 | **Progress Dashboard** | 进度面板 | 可视化脑力趋势（周/月/年）、维度雷达图、成就墙 |
| 9 | **Challenge Friends** | 好友挑战 | 异步挑战：创建挑战 → 好友接受 → 各自完成 → 比较结果 |
| 10 | **Share Results** | 成绩分享 | 生成分享卡片（OG Image），支持 Twitter / Facebook / 微信 / 微博 / LINE |

### 子系统详细规格

每个子系统的完整规格（触发条件、奖励机制、过期逻辑、数据模型）见 `context/01-product.md` 的 Growth Engine 部分。

### 设计原则

- **正向激励**：所有反馈 MUST 正向（连续打卡奖励、成就庆祝），禁止惩罚性机制（如断签清零所有进度）
- **可量化**：所有成长数据 MUST 可量化展示，避免模糊概念
- **延迟满足**：高等级成就需要长期坚持，避免短期刷满
- **社交可见**：成长数据（等级、成就、宠物）MUST 可在 Profile 与分享卡片中展示

---

## 12. Content Engine 规范

### 12.1 内容规模

BrainVerse Content Engine 包含 **100 篇原创科普文章**，分布在 5 个类别：

| 类别 | Slug 前缀 | 文章数 | 关联维度 |
|---|---|---|---|
| Brain Age | `brain-age-*` / `what-is-brain-age` 等 | 20 | 综合（关联 Brain Age Assessment） |
| Memory | `memory-*` / `types-of-memory-*` 等 | 20 | Memory（关联 Digit Span / Spatial Memory） |
| Attention | `attention-*` / `selective-attention-*` 等 | 20 | Attention（关联 Visual Search / Stroop Challenge） |
| Focus | `focus-*` / `deep-work-*` 等 | 20 | Executive（关联 Stroop Challenge） |
| Relaxation | `relaxation-*` / `breathing-*` 等 | 20 | Relaxation（关联 Breathing Flow） |

**总计**：100 篇 × 3 语言 = 300 篇翻译记录

### 12.2 文章结构（统一模板）

每篇文章 MUST 包含以下 8 个部分，顺序固定：

```markdown
1. Title（标题）              — H1，含主关键词，≤ 60 字符
2. Meta Description（元描述）  — ≤ 150 字符，含关键词与 CTA
3. Introduction（引言）        — ≥ 150 字，引出主题与读者痛点
4. Scientific Explanation（科学解释）— ≥ 600 字，含至少 2 篇同行评审引用
5. Practical Advice（实践建议） — ≥ 300 字，含至少 3 条可操作建议（时间/频率/方法）
6. Related Games（相关游戏）   — 自然关联至少 1 款平台游戏，附跳转链接
7. FAQ（常见问题）            — ≥ 4 条问答，覆盖用户搜索意图
8. Internal Links（内链）      — 至少 3 条内链指向相关文章
```

### 12.3 元数据规范

每篇文章 MUST 包含以下结构化数据：

| 字段 | 用途 |
|---|---|
| `Title` | 页面标题（H1 + `<title>` tag） |
| `Meta Description` | 搜索结果摘要 |
| `JSON-LD` | Article Schema + FAQPage Schema 结构化数据 |
| `SEO Metadata` | OpenGraph / Twitter Card / Canonical URL / Hreflang |

### 12.4 内容质量约束

| 约束项 | 要求 |
|---|---|
| **降 AI 痕迹** | 禁止 "delve into"、"it's worth noting"、"in conclusion"、"unleash"、"harness"、"realm" 等 AI 高频词；段落长度变化 > 30%；段首句式不重复 |
| **跨文章查重** | 全局核心观点重复率 < 15%；同类别内 < 20%；禁止跨文章复制段落 |
| **科学引用** | 每篇至少 2 篇同行评审文献或权威机构报告；格式：作者+年份+期刊/机构；文献 MUST 真实可查 |
| **原创性** | 每篇至少 1 个原创观点或独特视角；禁止纯百科式复述 |
| **实用性** | 每篇至少 3 条可操作建议；建议须具体到时间、频率、方法 |
| **关联性** | 每篇关联至少 1 款平台游戏；关联须自然非生硬 |
| **多语言** | 每篇支持 en/zh/ja 三语；翻译须本地化非直译 |

### 12.5 完整文章清单

100 篇文章的完整清单（slug、主题、核心概念、科学引用、关联游戏）见 `.trae/specs/initialize-project-foundation/spec.md` 的"100 篇 SEO 文章完整规划"章节。任何新增/修改文章 MUST 同步更新该清单。

### 12.6 Content ↔ Game 闭环

```
用户阅读文章 → 关联游戏卡片 → 点击玩游戏 → 游戏完成 → 推荐"延伸阅读"文章
                                                              ↓
                                                        用户回到阅读
```

此闭环是 BrainVerse 留存的核心机制，所有文章页面 MUST 包含"Related Games"卡片，所有游戏结果页 MUST 包含"延伸阅读"文章推荐。

---

## 13. SEO 规则

### 13.1 每页必需元数据清单

BrainVerse 的每一个公开页面 MUST 包含以下 8 项 SEO 元素，缺失任何一项的 PR MUST 被拒绝：

| # | 元素 | 实现方式 |
|---|---|---|
| 1 | **Title** | `<title>` tag，含主关键词，≤ 60 字符 |
| 2 | **Meta Description** | `<meta name="description">`，≤ 150 字符，含 CTA |
| 3 | **Canonical URL** | `<link rel="canonical">`，指向该页面的规范 URL |
| 4 | **OpenGraph** | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` |
| 5 | **Twitter Metadata** | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` |
| 6 | **Structured Data** | JSON-LD 格式（Article / FAQPage / BreadcrumbList / Organization） |
| 7 | **Breadcrumbs** | 面包屑导航（视觉 + BreadcrumbList Schema） |
| 8 | **Hreflang** | `<link rel="alternate" hreflang="en|zh|ja">` 三语互指 |
| 9 | **Internal Links** | 至少 3 条内链指向相关页面 |

### 13.2 SEO 页面架构

BrainVerse 目标是构建 **300+ 可索引页面**：

| 页面类型 | 数量 | URL 模式 |
|---|---|---|
| 静态页面 | ~10 | `/[locale]/`, `/[locale]/games`, `/[locale]/dashboard` 等 |
| 游戏页面 | 6 × 3 = 18 | `/[locale]/games/[slug]` |
| 文章页面 | 100 × 3 = 300 | `/[locale]/articles/[slug]` |
| Brain Age 相关 | ~10 | `/[locale]/brain-age` 等 |
| 分类页 | 5 × 3 = 15 | `/[locale]/articles/category/[category]` |

### 13.3 程序化 SEO 实现

- 使用 Next.js `generateStaticParams` 预生成所有文章页面
- 使用 `generateMetadata` 函数动态生成每页的元数据
- `sitemap.xml` 与 `robots.txt` MUST 由 Next.js 自动生成，包含所有公开 URL
- 所有页面 MUST 支持 SSR（非纯 CSR），保证搜索引擎可索引

### 13.4 Hreflang 实现规范

```html
<link rel="alternate" hreflang="en" href="https://cowb.cc/en/articles/what-is-brain-age" />
<link rel="alternate" hreflang="zh" href="https://cowb.cc/zh/articles/what-is-brain-age" />
<link rel="alternate" hreflang="ja" href="https://cowb.cc/ja/articles/what-is-brain-age" />
<link rel="alternate" hreflang="x-default" href="https://cowb.cc/en/articles/what-is-brain-age" />
```

---

## 14. 数据库规则

### 14.1 核心原则

1. **Migration Based（迁移制）**：所有 schema 变更 MUST 通过 SQL migration 文件实现，禁止直接修改数据库
2. **Version Controlled（版本控制）**：所有 migration 文件 MUST 提交到 Git，文件名格式 `NNNN_description.sql`（如 `0001_init.sql`）
3. **Type Safe（类型安全）**：所有表 MUST 有对应的 TypeScript 接口，通过 Repository 模式访问，禁止裸 SQL 字符串拼接

### 14.2 Migration 规则

| 规则 | 说明 |
|---|---|
| 文件命名 | `workers/api/migrations/NNNN_description.sql`，NNNN 为 4 位递增序号 |
| 不可修改 | 已合并的 migration 文件 MUST NOT 修改，新变更 MUST 新增 migration |
| 不可删除 | 已合并的 migration 文件 MUST NOT 删除 |
| 必须可回滚 | 每个 migration SHOULD 包含对应的 down 迁移（D1 限制下可放宽） |
| 必须有索引 | 所有外键字段与高频查询字段 MUST 创建索引 |
| 必须有注释 | 复杂列 MUST 添加 SQL 注释说明用途 |

### 14.3 Repository 模式

```typescript
// 每张表一个 Repository 类，禁止裸 SQL
class UserRepository {
  constructor(private db: D1Database) {}
  async findById(id: string): Promise<User | null> { ... }
  async findByEmail(email: string): Promise<User | null> { ... }
  async create(input: CreateUserInput): Promise<User> { ... }
}
```

### 14.4 类型安全规则

1. **禁止 `any`**：所有数据库访问代码 MUST 使用具体类型
2. **Repository 返回类型**：所有 Repository 方法 MUST 返回明确类型（`Promise<User | null>`），禁止返回 `any` 或 `unknown`
3. **输入验证**：所有写入操作 MUST 通过 Zod schema 验证输入
4. **类型生成**：可考虑使用 `wrangler types` 自动生成 D1 绑定类型

### 14.5 永远不要做的事

- ❌ 永远不要直接在生产数据库执行 `ALTER TABLE`、`DROP TABLE`
- ❌ 永远不要在代码中拼接 SQL 字符串（使用参数化查询）
- ❌ 永远不要在 migration 中删除已有数据（除非有明确业务需求与审批）
- ❌ 永远不要修改已合并的 migration 文件

---

## 15. Admin Panel 模块清单

Admin Panel 是 BrainVerse 的后台管理系统，仅供 `admin` 角色用户访问。MVP 包含 **6 个模块**：

| # | 模块 | 功能 | 数据表 |
|---|---|---|---|
| 1 | **Article Management** | 文章 CRUD、发布/下线、置顶、排序 | `articles`, `article_translations` |
| 2 | **Translation Management** | 翻译 key 管理、缺失翻译告警、批量导出 | `article_translations` + i18n JSON |
| 3 | **SEO Management** | 元数据编辑、JSON-LD 验证、Canonical 检查 | `seo_metadata` |
| 4 | **Game Configuration** | 游戏启用/禁用、难度参数调整、维度配置 | `games` |
| 5 | **Feature Flags** | 功能开关切换、灰度发布控制 | `feature_flags` |
| 6 | **User Management** | 用户列表、角色修改、封禁/解封 | `users`, `admin_users` |

### 访问控制

- Admin Panel 路由位于 `/[locale]/admin/*`，MUST 通过 `requireAdmin()` 中间件保护
- 访问 Admin Panel MUST 满足：
  1. 用户已登录（Session 有效）
  2. 用户角色为 `admin`（存储在 `users.role` 或 `admin_users` 表）
  3. 通过 Turnstile 二次验证（防 Session 劫持）
- Admin 操作 MUST 记录审计日志（操作者、操作时间、操作内容、影响范围）

### Admin 用户初始化

首个 admin 用户 MUST 通过安全渠道（环境变量或 Wrangler secret）手动设置，禁止通过注册流程创建 admin 账户。

---

## 16. Feature Flags 策略

### 16.1 存储与访问

- **存储**：Feature Flags 存储在 D1 `feature_flags` 表
- **缓存**：通过 KV 缓存（key: `feature-flags`，TTL: 1 小时），减少 D1 读取
- **前端访问**：通过 `GET /api/feature-flags` 端点（公开，无需认证），前端启动时拉取并缓存

### 16.2 数据模型

```sql
CREATE TABLE feature_flags (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,        -- 如 'breathing-flow-game'
  label TEXT NOT NULL,             -- 人类可读名称
  description TEXT,                -- 用途说明
  enabled INTEGER NOT NULL DEFAULT 0,  -- 0=禁用, 1=启用
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 16.3 用途

1. **隐藏未完成功能**：开发中的模块通过 flag 隔离，避免影响生产用户体验
2. **分阶段发布**：先内部测试 → 少量用户 → 全量发布
3. **A/B 测试（未来）**：基于用户 ID hash 分流，MVP 不实现但保留扩展能力
4. **紧急回滚**：发现严重 bug 时快速禁用功能，无需重新部署

### 16.4 使用规范

- 所有新功能 MUST 默认 `enabled = 0`，经测试后由 Admin 手动启用
- 前端组件 MUST 通过 `useFeatureFlag(key)` hook 判断功能是否启用
- Feature Flag 检查 MUST 在前端与后端双端执行（前端控制 UI 显示，后端控制 API 访问）
- 禁止使用 Feature Flag 控制核心业务逻辑（如 Brain Age 计算），仅用于功能开关

---

## 17. Analytics 事件清单

BrainVerse 使用 Cloudflare Web Analytics（隐私优先，无需 Cookie）追踪以下 **16 个必需事件**。所有事件 MUST 通过统一的 `trackEvent(name, properties)` 函数触发。

| # | 事件名 | 触发时机 | 关键属性 |
|---|---|---|---|
| 1 | `page_view` | 任何页面加载完成 | `path`, `locale`, `referrer` |
| 2 | `article_view` | 文章详情页加载 | `slug`, `category`, `locale` |
| 3 | `brain_test_start` | 用户开始 Brain Age 测试 | `dimension` |
| 4 | `brain_test_finish` | 用户完成 Brain Age 测试 | `duration_ms`, `completed` (bool) |
| 5 | `brain_age_generated` | 脑力年龄计算完成 | `brain_age`, `percentile` |
| 6 | `game_start` | 用户开始一局游戏 | `game_slug`, `dimension`, `difficulty` |
| 7 | `game_pause` | 用户暂停游戏 | `game_slug`, `elapsed_ms` |
| 8 | `game_finish` | 用户完成一局游戏 | `game_slug`, `score`, `duration_ms`, `accuracy` |
| 9 | `achievement_unlock` | 用户解锁成就 | `achievement_id`, `category` |
| 10 | `streak_update` | 用户连续打卡更新 | `current_streak`, `longest_streak` |
| 11 | `pet_level_up` | 脑力宠物升级 | `pet_type`, `new_level`, `new_stage` |
| 12 | `share` | 用户分享成绩 | `platform`, `content_type` |
| 13 | `challenge_create` | 用户创建挑战 | `game_slug`, `target_type` (friend/public) |
| 14 | `challenge_accept` | 用户接受挑战 | `challenge_id`, `game_slug` |
| 15 | `profile_view` | 用户查看自己或他人 Profile | `target_user_id`, `is_self` |
| 16 | `language_change` | 用户切换语言 | `from_locale`, `to_locale` |

### 实现规范

1. **统一入口**：所有事件 MUST 通过 `@brainverse/shared` 导出的 `trackEvent()` 函数触发，禁止直接调用 analytics SDK
2. **属性命名**：使用 `snake_case`，与数据库列名一致
3. **无 PII**：禁止发送用户邮箱、姓名等个人身份信息
4. **前端触发**：所有事件在前端触发，通过 Cloudflare Web Analytics beacon 上报
5. **后端补充**：关键事件（如 `brain_age_generated`）可在后端二次记录到 D1 用于业务分析

---

## 18. 错误处理策略

### 18.1 核心原则

- **不使用付费监控平台**（如 Sentry、Datadog），完全基于 Cloudflare 原生能力
- **优雅降级**：错误发生时 MUST 给用户友好的回退体验，而非白屏
- **可观测**：所有错误 MUST 被记录，便于事后排查

### 18.2 错误处理层级

| 层级 | 机制 | 说明 |
|---|---|---|
| 1. **Cloudflare 原生日志** | Workers `console.log` / `console.error` | 自动收集到 Cloudflare dashboard，免费 |
| 2. **应用日志** | 结构化日志（JSON 格式） | 记录 request_id、user_id、error_code、stack_trace |
| 3. **Error Boundaries** | React Error Boundary 组件 | 捕获前端渲染错误，显示回退 UI |
| 4. **Graceful Fallbacks** | 加载失败时的回退 UI | 骨架屏 → 错误提示 → 重试按钮 |

### 18.3 前端错误处理

```typescript
// 1. 全局 Error Boundary（app/error.tsx）
export default function Error({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    logError('react_error_boundary', error);
  }, [error]);
  return <ErrorFallback onRetry={reset} />;
}

// 2. 路由级 not-found（app/not-found.tsx）
export default function NotFound() {
  return <NotFoundFallback />;
}

// 3. API 调用错误处理
try {
  const data = await fetchAPI('/api/scores');
} catch (error) {
  showToast(t('errors.network'));
  // 降级到本地缓存或空状态
}
```

### 18.4 后端错误处理

```typescript
// 统一错误响应格式
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email format is invalid",
    "request_id": "req_xxx"
  }
}

// 错误码枚举
type ErrorCode =
  | 'VALIDATION_ERROR'      // 400
  | 'UNAUTHORIZED'          // 401
  | 'FORBIDDEN'             // 403
  | 'NOT_FOUND'             // 404
  | 'RATE_LIMITED'          // 429
  | 'INTERNAL_ERROR';       // 500
```

### 18.5 错误上报规范

- **前端错误**：通过 Error Boundary 捕获，调用 `logError()` 上报到 Cloudflare Analytics 自定义事件
- **后端错误**：Workers 中间件捕获异常，记录结构化日志到 `console.error`（Cloudflare 自动收集）
- **用户可感知错误**：MUST 显示 Toast 或 Inline 错误提示，包含可操作的恢复建议
- **静默错误**：不影响用户体验的错误（如 Analytics 上报失败）MUST 静默处理，不干扰用户

---

## 19. 备份策略

BrainVerse 完全基于 Cloudflare 免费计划，备份策略 MUST 不引入付费服务，依赖脚本与 GitHub 仓库实现零成本备份。

### 19.1 备份清单

| 备份对象 | 备份方式 | 频率 | 存储位置 |
|---|---|---|---|
| **D1 数据库** | `wrangler d1 export` 脚本 | 每日 | GitHub 仓库（压缩）+ R2 |
| **内容数据** | 文章 JSON 导出脚本 | 每周 | GitHub 仓库 |
| **配置数据** | Feature Flags / Game Config 导出 | 每周 | GitHub 仓库 |
| **代码仓库** | Git 远程备份 | 每次 push | GitHub（主）+ 镜像仓库（可选） |

### 19.2 D1 Export 脚本

```bash
# scripts/backup-d1.sh
# 每日通过 GitHub Actions 执行
wrangler d1 export brainverse-db --output=backup-$(date +%Y%m%d).sql
gzip backup-$(date +%Y%m%d).sql
# 上传到 R2
wrangler r2 object put brainverse-backups/d1/backup-$(date +%Y%m%d).sql.gz \
  --file=backup-$(date +%Y%m%d).sql.gz
# 提交到 backup 分支
git add backup-$(date +%Y%m%d).sql.gz
git commit -m "chore(backup): D1 export $(date +%Y%m%d)"
git push origin backup
```

### 19.3 内容备份

文章内容存储在 D1 `articles` 与 `article_translations` 表，备份策略：

1. **JSON 导出**：每周通过脚本导出所有文章为 JSON 文件，存入 `backups/content/` 目录
2. **版本控制**：JSON 文件提交到 Git，便于追踪内容变更历史
3. **Markdown 镜像（可选）**：关键文章可同步导出为 Markdown，存入 `content/` 目录

### 19.4 配置备份

- **Feature Flags**：每周导出为 JSON，存入 `backups/config/feature-flags.json`
- **Game Configuration**：游戏配置变更时自动导出
- **wrangler.toml**：已纳入版本控制，每次变更通过 PR

### 19.5 GitHub 备份

- **主仓库**：所有代码、migration、文档、备份文件均提交到 GitHub
- **分支策略**：
  - `main`：生产代码
  - `backup`：自动备份分支（D1 export、内容导出）
  - `develop`：开发分支（可选）
- **GitHub Actions**：配置定时 workflow 执行备份脚本（`cron: '0 2 * * *'` 每日凌晨 2 点）

### 19.6 恢复流程

1. **D1 恢复**：从 `backup-YYYYMMDD.sql.gz` 解压，通过 `wrangler d1 execute brainverse-db --file=backup.sql` 恢复
2. **内容恢复**：从 `backups/content/` JSON 文件重新插入到 D1
3. **配置恢复**：从 `backups/config/` JSON 恢复 Feature Flags

### 19.7 备份验证

- 每月 MUST 执行一次恢复演练，验证备份文件可用
- 备份失败 MUST 通过 GitHub Actions 通知（issue 或 email）

---

## 附录：文档维护规则

1. **本文档为活文档**：任何业务规则、技术栈、模块定义的变更 MUST 同步更新本文件
2. **变更通过 PR**：本文档的修改 MUST 通过 Pull Request，经 Lead Architect 审批
3. **版本化**：重大变更 MUST 在文件头部更新版本号与日期
4. **单一真相源**：本文件是项目规则的单一真相源，其他文档（context/、specs/、docs/）MUST 与本文件保持一致，冲突时以本文件为准

---

**End of PROJECT.md**

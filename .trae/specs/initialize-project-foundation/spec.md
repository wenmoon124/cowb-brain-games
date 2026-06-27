# BrainVerse 项目初始化与基础架构 Spec

## Why

BrainVerse (cowb.cc) 是一个全新项目，当前仓库仅包含 `BrainVerse-Design/` 设计参考文件（HTML 静态页面 + global.css），没有任何源代码、文档框架或项目结构。需要从零搭建完整的 monorepo 项目基础架构，建立文档体系，并规划 MVP 开发路线图。

## 项目审计报告

### 当前仓库状态

| 类别 | 状态 | 详情 |
|---|---|---|
| 设计参考文件 | ✅ 存在 | `BrainVerse-Design/` 包含 18 个游戏页面 + 6 个功能页面的 HTML 设计稿 |
| 全局样式 | ✅ 存在 | `BrainVerse-Design/styles/global.css` 含完整 Design Token 系统 |
| 源代码 | ❌ 缺失 | 无任何前端/后端代码 |
| 项目结构 | ❌ 缺失 | 无 monorepo 结构、无 package.json |
| 文档体系 | ❌ 缺失 | 无 PROJECT.md / AGENTS.md / context/ / specs/ / docs/ |
| 数据库 | ❌ 缺失 | 无 D1 schema、无迁移文件 |
| API 层 | ❌ 缺失 | 无 Workers API 代码 |
| 配置文件 | ❌ 缺失 | 无 tsconfig、tailwind、next.config 等 |
| CI/CD | ❌ 缺失 | 无部署配置 |

### 设计文件清单

- `pages/landing/` — 着陆页设计
- `pages/dashboard/` — 仪表盘设计
- `pages/game-hub/` — 游戏中心设计
- `pages/game-template/` — 游戏模板
- `pages/memory-games/` — 4 个记忆力游戏 (memory-matrix, backward-digit-span, spatial-sequence, pattern-match)
- `pages/attention-games/` — 4 个注意力游戏 (attention-span, eagle-eye, distraction-filter, split-focus)
- `pages/reaction-games/` — 3 个反应速度游戏 (rapid-response, color-match-stroop, click-horizon)
- `pages/executive-games/` — 4 个执行功能游戏 (tower-of-logic, change-flex, path-finder, matrix-reasoning)
- `pages/relaxation-games/` — 3 个放松游戏 (breath-synchronizer, audio-alpha-diver, stress-sandbox)
- `pages/pk-battle/` — PK 对战页
- `pages/seo-science/` — SEO 科学问答页
- `pages/settings/` — 设置页
- `components/cookie-banner.html` — Cookie 同意横幅组件
- `styles/global.css` — 完整设计令牌系统（2272 行）

### 设计系统令牌摘要

- 主色：`#4A7CFF`（蓝色）
- 辅色：`#50C8A8`（青绿）、`#FFB14A`（琥珀）
- 5 个认知维度色：Memory `#8B5CF6`、Attention `#06B6D4`、Reaction `#FFB14A`、Executive `#10B981`、Relaxation `#4A7CFF`
- 支持深色模式（`prefers-color-scheme` + `.dark` class）
- 字体：Inter
- 完整组件库：按钮、卡片、导航、Toast、Modal、进度条、徽章、骨架屏、标签页等

## What Changes

### 1. Monorepo 项目结构搭建
- 创建 pnpm workspace monorepo 结构
- 初始化 `apps/web`（Next.js 前端应用）
- 初始化 `workers/api`（Cloudflare Workers API）
- 创建 `packages/` 共享包目录结构

### 2. 文档框架建立
- 创建 `PROJECT.md` — 项目总览与业务规则
- 创建 `AGENTS.md` — AI 开发代理指南
- 创建 `context/` — 架构上下文文档（00-project, 01-product, 02-architecture）
- 创建 `docs/` — 开发文档目录
- 创建 `decisions/` — 架构决策记录目录
- 创建 `specs/` — 功能规格目录

### 3. 核心配置文件
- `package.json` — 根 workspace 配置
- `tsconfig.json` — TypeScript 严格模式配置
- `tailwind.config.ts` — TailwindCSS 配置（映射 Design Token）
- `next.config.js` — Next.js 配置（i18n 路由、SEO、PWA）
- `wrangler.toml` — Cloudflare Workers 配置
- `.eslintrc` / `.prettierrc` — 代码规范
- `.gitignore` — Git 忽略规则

### 4. 数据库基础
- D1 schema 初始迁移文件
- 类型定义生成
- Repository 层骨架

### 5. MVP 开发路线图
- 定义 5 个开发阶段的任务分解与优先级

## Impact

- Affected specs: 全新项目，无已有 spec 受影响
- Affected code: 从零创建全部基础架构文件

## ADDED Requirements

### Requirement: Monorepo 项目结构
系统 SHALL 使用 pnpm workspace 搭建 monorepo，包含 `apps/web`（Next.js）、`workers/api`（Cloudflare Workers）和 `packages/` 下的共享包。

#### Scenario: 项目结构验证
- **WHEN** 开发者克隆仓库并运行 `pnpm install`
- **THEN** 所有 workspace 依赖正确安装
- **AND** `pnpm dev` 可同时启动前端和 API 开发服务器

### Requirement: 文档框架
系统 SHALL 包含完整的项目文档体系，包括 PROJECT.md、AGENTS.md、context/ 目录下的架构上下文文档。

#### Scenario: 文档加载
- **WHEN** AI 代理开始实现功能
- **THEN** 可按顺序读取 context/00-project.md → context/01-product.md → context/02-architecture.md
- **AND** 获取完整的项目背景和架构约束

### Requirement: Design Token 映射
系统 SHALL 将 `BrainVerse-Design/styles/global.css` 中的 CSS 自定义属性映射到 TailwindCSS 配置中。

#### Scenario: 设计令牌一致性
- **WHEN** 开发者使用 TailwindCSS 类名
- **THEN** 颜色值与设计稿中的 CSS 变量保持一致
- **AND** 深色模式自动切换正常工作

### Requirement: 多语言路由
系统 SHALL 支持 `/en/`、`/zh/`、`/ja/` 三种语言路由，默认语言为英语。

#### Scenario: 语言路由
- **WHEN** 用户访问 `/zh/games`
- **THEN** 页面以简体中文显示
- **AND** 所有 UI 文本来自翻译 key，无硬编码文本

### Requirement: Cloudflare 免费计划约束
系统 SHALL 仅使用 Cloudflare 免费计划服务（Pages、Workers、D1、KV、R2、Analytics、Turnstile），不使用任何付费服务。

#### Scenario: 免费计划合规
- **WHEN** 架构设计涉及 Cloudflare 服务
- **THEN** 仅使用允许的免费服务列表
- **AND** 如需付费功能，设计免费替代方案

## MVP 开发路线图

### Phase 1: 基础架构（当前 Spec）
- Monorepo 搭建
- 文档框架
- 配置文件
- 数据库基础迁移
- Design Token 映射

### Phase 2: 核心页面与认证
- Landing Page
- 用户认证系统（Cloudflare Turnstile + D1）
- 用户 Dashboard
- 用户 Profile
- 多语言 i18n 框架

### Phase 3: Brain Engine 与游戏
- Brain Age 评估系统
- 6 个 MVP 游戏（Visual Search、Digit Span、Reaction Training、Stroop Challenge、Spatial Memory、Breathing Flow）
- 游戏评分引擎
- 自适应难度系统

### Phase 4: Growth Engine
- 成就系统
- Streak 系统
- Brain Pet 系统
- 挑战系统
- 分享系统

### Phase 5: Content Engine 与 SEO
- 100 篇 SEO 文章完整规划与生成（见下方详细清单）
- 文章质量验证系统（降 AI 痕迹、查重、科学引用核查）
- CMS 能力
- 程序化 SEO 架构
- Admin 面板
- Feature Flags 系统

## 100 篇 SEO 文章完整规划

### 质量约束规范

| 约束项 | 要求 |
|---|---|
| **降 AI 痕迹** | 禁止使用 "delve into"、"it's worth noting"、"in conclusion"、"unleash"、"harness"、"realm" 等 AI 高频词；段落长度变化大于 30%（短句-中句-长句交替）；每段开头句式不重复 |
| **内容查重** | 100 篇文章之间核心观点重复率 < 15%；同类别内重复率 < 20%；禁止跨文章复制段落 |
| **科学引用** | 每篇文章至少引用 2 篇同行评审文献或权威机构报告；引用格式：作者+年份+期刊/机构；文献必须真实可查 |
| **原创性** | 每篇文章须有至少 1 个原创观点或独特视角；禁止纯百科式复述 |
| **实用性** | 每篇文章须包含至少 3 条可操作建议；建议须具体到时间、频率、方法 |
| **关联性** | 每篇文章须关联至少 1 款平台游戏；关联须自然非生硬 |
| **结构一致性** | 统一结构：标题→元描述→引言→科学解释→实践建议→相关游戏→FAQ→内链 |
| **多语言** | 每篇文章须支持 en/zh/ja 三语版本；翻译须本地化非直译 |

### 生成顺序设计

| 批次 | 文章数 | 类别 | 优先级 | 依赖 |
|---|---|---|---|---|
| Batch 1 | 5 | Brain Age 基础概念 | P0 | 无 |
| Batch 2 | 5 | Memory 基础概念 | P0 | 无 |
| Batch 3 | 5 | Attention 基础概念 | P0 | 无 |
| Batch 4 | 5 | Focus 基础概念 | P0 | 无 |
| Batch 5 | 5 | Relaxation 基础概念 | P0 | 无 |
| Batch 6 | 15 | Brain Age 进阶 | P1 | Batch 1 |
| Batch 7 | 15 | Memory 进阶 | P1 | Batch 2 |
| Batch 8 | 15 | Attention 进阶 | P1 | Batch 3 |
| Batch 9 | 15 | Focus 进阶 | P1 | Batch 4 |
| Batch 10 | 15 | Relaxation 进阶 | P1 | Batch 5 |

### 文章清单（100 篇）

#### Brain Age 类别（20 篇）

| # | Slug | 主题 | 核心概念 | 科学引用 | 关联游戏 |
|---|---|---|---|---|---|
| 1 | what-is-brain-age | 什么是脑力年龄？科学定义与测量方法 | 脑力年龄 vs 实际年龄、认知老化曲线 | Luria (1973) Neuropsychology; Salthouse (2009) Psychology and Aging | Brain Age Assessment |
| 2 | brain-age-vs-biological-age | 脑力年龄与生物年龄的区别 | 认知衰老 vs 细胞衰老、端粒与认知 | Erdogan et al. (2022) Aging Cell | Brain Age Assessment |
| 3 | how-to-test-brain-age | 如何科学测试你的脑力年龄 | 标准化认知测试、信效度、在线评估局限 | Wechsler (1955) WAIS; Foley (2019) JMRI | Brain Age Assessment |
| 4 | brain-age-myths-debunked | 5 个关于脑力年龄的常见误区 | 左脑右脑、只用 10% 大脑、脑力年龄不可变 | Beyerstein (1999) Sci Rev Alt Med | Brain Age Assessment |
| 5 | factors-affecting-brain-age | 影响脑力年龄的 7 大因素 | 睡眠、运动、饮食、社交、压力、学习、遗传 | Livingston (2020) Lancet Dementia Prevention | Brain Age Assessment |
| 6 | brain-age-and-sleep-quality | 睡眠质量如何影响你的脑力年龄 | 慢波睡眠与记忆巩固、睡眠剥夺与认知下降 | Walker (2017) Why We Sleep; Diekelmann (2010) Sleep Med Rev | Brain Age Assessment |
| 7 | exercise-and-brain-age | 有氧运动对脑力年龄的逆转效应 | BDNF、海马体神经发生、有氧 vs 阻力训练 | Erickson (2011) PNAS; Hillman (2008) Nat Rev Neurosci | Reaction Training |
| 8 | diet-and-cognitive-decline | MIND 饮食与脑力年龄关系 | 地中海-DASH 干预、类黄酮、Omega-3 | Morris (2015) Alzheimer's Dement | Brain Age Assessment |
| 9 | brain-age-and-stress | 慢性压力加速脑力衰老的机制 | 皮质醇、海马体萎缩、前额叶执行功能 | Lupien (2009) Nat Rev Neurosci | Breathing Flow |
| 10 | social-engagement-brain-health | 社交活动如何延缓脑力衰老 | 社交网络规模与认知储备、孤独感与痴呆风险 | Krueger (2009) Pers Soc Psychol Bull | Brain Age Assessment |
| 11 | brain-age-numbers-by-decade | 各年龄段脑力年龄正常范围 | 20-80 岁认知变化曲线、个体差异 | Salthouse (2004) Dev Neuropsychol | Brain Age Assessment |
| 12 | neuroplasticity-and-brain-age | 神经可塑性：脑力年龄可以逆转吗 | 突触可塑性、髓鞘化、成人神经发生 | Pascual-Leone (2005) Cortex; Erickson (2011) PNAS | Spatial Memory |
| 13 | brain-age-and-education | 教育水平对脑力年龄的保护效应 | 认知储备假说、教育年限与痴呆风险 | Stern (2012) Neuron; Sharp (2018) Lancet Neurol | Brain Age Assessment |
| 14 | meditation-brain-age | 冥想练习对脑力年龄的影响 | 默认模式网络、灰质密度、注意力网络 | Lazar (2005) Neuroreport; Tang (2015) Nat Rev Neurosci | Breathing Flow |
| 15 | brain-age-and-hearing-loss | 听力下降与脑力衰老的隐藏联系 | 认知负荷理论、社交退缩假说、感觉剥夺 | Lin (2011) JAMA Intern Med | Brain Age Assessment |
| 16 | brain-age-gender-differences | 男性和女性的脑力衰老差异 | 雌激素保护、灰白质差异、寿命差异 | Mosconi (2017) J Alzheimers Dis | Brain Age Assessment |
| 17 | brain-age-and-gut-microbiome | 肠脑轴与脑力年龄的前沿研究 | 肠道菌群、短链脂肪酸、迷走神经通路 | Cryan (2019) Nat Rev Gastroenterol Hepatol | Brain Age Assessment |
| 18 | brain-age-tracking-frequency | 应该多久测一次脑力年龄 | 测试学习效应、有意义变化指数、季节波动 | Hertzog (2018) Intelligence | Brain Age Assessment |
| 19 | brain-age-and-chronic-disease | 慢性疾病对脑力年龄的累积影响 | 糖尿病、高血压、心血管病与认知下降 | Biessels (2014) Lancet Neurol | Brain Age Assessment |
| 20 | lowering-brain-age-naturally | 10 种科学方法自然降低脑力年龄 | 综合干预方案、循证等级、优先级排序 | Ngandu (2015) Lancet FINGER Study | All Games |

#### Memory 类别（20 篇）

| # | Slug | 主题 | 核心概念 | 科学引用 | 关联游戏 |
|---|---|---|---|---|---|
| 21 | types-of-memory-explained | 人类记忆的 5 种类型详解 | 感觉、短期、工作、长期、程序性记忆 | Baddeley (1992) Science; Tulving (1972) Episodic Memory | Digit Span |
| 22 | how-working-memory-works | 工作记忆：大脑的临时工作台 | 中央执行系统、语音环路、视觉空间画板 | Baddeley (2000) Mem Cognit | Digit Span |
| 23 | memory-consolidation-sleep | 睡眠中记忆是如何巩固的 | 慢波睡眠重放、REM 情绪记忆、睡眠纺锤波 | Stickgold (2005) Nature; Rasch (2013) Curr Top Behav Neurosci | Spatial Memory |
| 24 | forgetting-curve-ebbinghaus | 艾宾浩斯遗忘曲线与间隔重复 | 遗忘规律、间隔效应、最佳复习时间点 | Ebbinghaus (1885) Memory; Cepeda (2008) Psychol Bull | Digit Span |
| 25 | spatial-memory-navigation | 空间记忆与导航能力 | 位置细胞、网格细胞、海马体认知地图 | O'Keefe (1978) Hippocampus; Moser (2014) Nobel Prize | Spatial Memory |
| 26 | memory-and-emotion | 情绪如何增强或干扰记忆 | 杏仁核-海马体回路、闪光灯记忆、创伤记忆 | McGaugh (2004) Curr Opin Neurobiol | Spatial Memory |
| 27 | chunking-memory-strategy | 记忆组块化：提升记忆容量的技巧 | 米勒 7±2、组块形成、专家记忆模式 | Miller (1956) Psychol Rev; Ericsson (1980) Science | Digit Span |
| 28 | memory-palace-technique | 记忆宫殿法：古希腊记忆术 | 方法位置法、视觉空间记忆、记忆竞赛选手 | Maguire (2003) Nat Neurosci | Spatial Memory |
| 29 | false-memories-formation | 虚假记忆如何产生 | 来源监控错误、误导信息效应、植入记忆 | Loftus (1996) Am Psychol; Schacter (1999) Neuron | Visual Search |
| 30 | memory-and-aging-normal | 正常衰老中的记忆变化 | 情节记忆下降、程序性记忆保留、前额叶老化 | Grady (2013) Neuropsychologia | Brain Age Assessment |
| 31 | improve-working-memory | 7 种科学方法提升工作记忆 | n-back 训练、有氧运动、正念冥想转移效度 | Klingberg (2010) Trends Cogn Sci | Digit Span |
| 32 | memory-and-nutrition | 营养素对记忆力的直接影响 | 胆碱、Omega-3 DHA、类黄酮、维生素 B12 | Gomez-Pinilla (2008) Nat Rev Neurosci | Memory games |
| 33 | prospective-memory | 前瞻性记忆：记住未来要做的事 | 基于事件 vs 基于时间、执行意图、遗漏 | McDaniel (2007) Prospective Memory | Digit Span |
| 34 | memory-reconsolidation | 记忆再巩固：回忆即修改 | 记忆不稳定性、干预窗口、PTSD 治疗 | Nader (2000) Nature; Schiller (2010) Nature | Spatial Memory |
| 35 | visual-memory-vs-verbal | 视觉记忆与语言记忆的差异 | 双重编码理论、个体差异、学习风格 | Paivio (1971) Dual Coding Theory | Visual Search |
| 36 | memory-and-exercise-mechanism | 运动增强记忆力的神经机制 | BDNF、IGF-1、海马体体积增大 | van Praag (2009) Trends Cogn Sci | Spatial Memory |
| 37 | memory-supplements-evidence | 记忆补充剂：哪些有效哪些无效 | 银杏叶、石杉碱甲、Omega-3 循证评估 | Dodge (2008) J Alzheimers Dis; Swordfall (2021) Cochrane | Memory games |
| 38 | childhood-memory-development | 儿童记忆发展关键期 | 婴儿期遗忘、自传体记忆萌芽、情景记忆 | Bauer (2007) Remembering the Times | Digit Span |
| 39 | memory-and-music | 音乐训练对记忆力的增强效应 | 听觉工作记忆、跨模态转移、音乐家脑结构 | Kraus (2009) Nat Rev Neurosci | Spatial Memory |
| 40 | memory-decline-prevention | 预防记忆衰退的长期策略 | 认知储备、生活方式综合干预、MCI 早期信号 | Valenzuela (2009) PLoS One | All Memory Games |

#### Attention 类别（20 篇）

| # | Slug | 主题 | 核心概念 | 科学引用 | 关联游戏 |
|---|---|---|---|---|---|
| 41 | types-of-attention | 注意力的 5 种类型 | 选择性、持续性、分配性、交替性、执行注意 | Posner (1980) Q J Exp Psychol; Petersen (2012) Neuron | Visual Search |
| 42 | selective-attention-mechanism | 选择性注意的认知机制 | 注意过滤器、特征整合理论、注意盲视 | Treisman (1980) Cognit Psychol; Broadbent (1958) | Visual Search |
| 43 | sustained-attention-vigilance | 持续性注意与警觉性衰减 | 警觉递减、时间任务、信号检测论 | Parasuraman (1998) The Attentive Brain | Visual Search |
| 44 | attention-deficit-myths | 注意力缺陷的 6 大误区 | ADHD vs 正常注意力波动、注意力 span、成人 ADHD | Barkley (2014) ADHD in Adults | Visual Search |
| 45 | multitasking-brain-cost | 多任务处理的大脑代价 | 任务切换成本、双任务干扰、前额叶瓶颈 | Meyer (1997) J Exp Psychol; Rubinstein (2001) Hum Factors | Stroop Challenge |
| 46 | stroop-effect-explained | 斯特鲁普效应：颜色与文字的冲突 | 认知干扰、反应冲突、自动化阅读 | Stroop (1935) J Exp Psychol; MacLeod (1991) Psychol Bull | Stroop Challenge |
| 47 | attention-and-meditation | 正念冥想训练注意力的科学 | 注意力网络训练、Alpha 波、默认模式网络 | Tang (2015) Nat Rev Neurosci; Lutz (2008) Trends Cogn Sci | Breathing Flow |
| 48 | visual-search-efficiency | 视觉搜索效率：特征 vs 组合 | 特征搜索、组合搜索、引导搜索模型 | Wolfe (1994) Psychon Bull Rev; Treisman (1980) | Visual Search |
| 49 | attention-blink-phenomenon | 注意瞬脱：500ms 的注意力黑洞 | RSVP 范式、T1-T2 离散性、注意瓶颈 | Raymond (1992) J Exp Psychol; Shapiro (2017) | Visual Search |
| 50 | distractibility-causes | 为什么你容易分心：7 个原因 | 注意力残留、数字干扰、焦虑、睡眠不足 | Leroy (2009) OHP; Wilmer (2017) Sleep | Visual Search |
| 51 | attention-training-games | 注意力训练游戏真的有效吗 | 近迁移 vs 远迁移、训练特异性、元分析证据 | Shipstead (2012) Psychol Bull; Simons (2016) Psychol Sci | Visual Search |
| 52 | adhd-and-attention-games | ADHD 与认知训练的前沿研究 | 工作记忆训练、行为干预、药物 vs 训练 | Cortese (2020) Lancet Psychiatry | Visual Search |
| 53 | attention-and-caffeine | 咖啡因如何影响注意力 | 腺苷受体拮抗、剂量效应、耐受性 | McLellan (2016) Nutrients; Haskell (2005) Hum Psychopharmacol | Reaction Training |
| 54 | attention-in-digital-age | 数字时代的注意力危机 | 技术干扰、注意力 span 缩短、深度工作 | Carr (2010) The Shallows; Mark (2018) | Visual Search |
| 55 | inattentional-blindness | 非注意盲视：看不见的看见了 | 变化盲视、非注意盲视、感知与注意 | Simons (1999) Perc; Mack (2003) Inattentional Blindness | Visual Search |
| 56 | attention-and-emotion | 情绪状态对注意力的影响 | 情绪 Stroop、威胁相关注意偏向、焦虑 | Mathews (1994) J Abnorm Psychol | Stroop Challenge |
| 57 | attention-development-children | 儿童注意力发展里程碑 | 执行注意发展、持续性注意 maturation、年龄标准 | Posner (2007) Educ Psychol | Visual Search |
| 58 | attention-and-aging | 老年人注意力变化与应对 | 抑制衰退假说、选择性注意下降、补偿机制 | Hasher (1999) Psychol Bull; Lustig (2003) Dev Neuropsychol | Visual Search |
| 59 | flow-state-attention | 心流状态：注意力的极致体验 | 心流特征、挑战-技能平衡、自主性 | Csikszentmihalyi (1990) Flow; Dietrich (2004) Conscious Cogn | All Games |
| 60 | improving-focus-naturally | 自然提升注意力的 12 种方法 | 环境、习惯、饮食、运动综合方案 | Klingberg (2010) Trends Cogn Sci | Visual Search |

#### Focus 类别（20 篇）

| # | Slug | 主题 | 核心概念 | 科学引用 | 关联游戏 |
|---|---|---|---|---|---|
| 61 | focus-vs-attention-difference | 专注力与注意力的区别 | 注意力是底层、专注力是上层状态、认知控制 | Chun (2011) Cogn Neurosci | Visual Search |
| 62 | deep-work-brain-science | 深度工作的脑科学原理 | 前额叶持续激活、默认模式网络抑制、神经同步 | Newport (2016) Deep Work; Csikszentmihalyi (1990) | All Games |
| 63 | pomodoro-technique-science | 番茄工作法的科学依据 | 注意力周期、90 分钟超日节律、休息恢复 | Kleitman (1969) Sleep; Ariga (2011) Cognition | Stroop Challenge |
| 64 | focus-and-procrastination | 专注力与拖延症的神经学 | 即时满足 vs 延迟满足、默认模式网络、时间折扣 | Steel (2007) Psychol Bull; Schraw (2007) | Stroop Challenge |
| 65 | flow-triggers-and-blockers | 心流触发器与阻碍因素 | 清晰目标、即时反馈、技能匹配、干扰因素 | Nakamura (2002) Theory of Flow | All Games |
| 66 | focus-and-dopamine | 多巴胺与专注力的关系 | 奖赏回路、期待 vs 实现、多巴胺基线 | Volkow (2009) JAMA; Westbrook (2019) Cognition | Reaction Training |
| 67 | music-and-focus | 哪种音乐最能提升专注力 | 莫扎特效应、白噪音、自然声、个性化音乐 | Rauscher (1993) Nature; Angwin (2017) PLoS One | All Games |
| 68 | focus-environment-design | 专注环境的科学设计 | 光照、温度、噪音、色彩对专注的影响 | Choi (2019) Build Environ; Veitch (2008) Light Res Technol | All Games |
| 69 | digital-minimalism-focus | 数字极简主义：夺回专注力 | 注意力经济、设计伦理、数字断舍离 | Newport (2019) Digital Minimalism; Alter (2017) Irresistible | All Games |
| 70 | focus-and-breakfast | 早餐如何影响上午的专注力 | 血糖稳定、低 GI 食物、葡萄糖与认知 | Benton (2007) Nutr Res Rev; Hoyland (2009) Appetite | Stroop Challenge |
| 71 | focus-morning-vs-evening | 晨型人 vs 夜型人的专注策略 | 昼夜节律、认知高峰、时间类型匹配 | Schmidt (2007) Behav Neurosci; Roenneberg (2003) Chronobiol Int | All Games |
| 72 | focus-and-anxiety | 焦虑如何破坏专注力 | 担忧占据工作记忆、注意力偏向、皮质醇 | Eysenck (2007) Emot Cognit Perform; Berggren (2013) | Stroop Challenge |
| 73 | focus-and-temperature | 室温对专注力的精确影响 | 最佳温度区间、热舒适、认知任务类型 | Lan (2011) Build Environ; Wyon (2004) | Stroop Challenge |
| 74 | focus-tracking-tools | 专注力追踪工具科学评估 | 时间追踪、注意力监测、数据可视化 | Mark (2008) CHI; Dabbish (2011) TOCHI | All Games |
| 75 | focus-and-boredom | 无聊与专注：硬币的两面 | 无聊的适应性功能、探索行为、注意力重定向 | Eastwood (2012) Persp Psychol Sci | All Games |
| 76 | intermittent-focus-bursts | 间歇性专注爆发 vs 持续专注 | 冲刺模式、注意力恢复理论、自然接触 | Kaplan (1995) Environ Behav; Ariga (2011) Cognition | All Games |
| 77 | focus-and-body-posture | 身体姿势对专注力的影响 | 具身认知、直立姿势与自信、前额叶激活 | Nair (2015) Health Psychol; Cuddy (2018) Presence | All Games |
| 78 | focus-and-nature-walks | 自然散步恢复专注力的证据 | 注意力恢复理论、自然 vs 城市认知效应 | Berman (2008) Psychol Sci; Bratman (2015) PNAS | Breathing Flow |
| 79 | focus-and-hydration | 脱水对专注力的隐性损害 | 2% 脱水阈值、认知功能衰减、儿童与老人 | Adan (2012) J Am Coll Nutr; Ganio (2011) Br J Nutr | Stroop Challenge |
| 80 | building-focus-habit | 如何建立持久专注习惯 | 习惯回路、最小可行习惯、环境设计、21 天修正 | Lally (2010) Eur J Soc Psychol; Duhigg (2012) | All Games |

#### Relaxation 类别（20 篇）

| # | Slug | 主题 | 核心概念 | 科学引用 | 关联游戏 |
|---|---|---|---|---|---|
| 81 | relaxation-response-science | 放松反应的科学机制 | 副交感神经激活、心率变异性、自主神经平衡 | Benson (1975) Relaxation Response; Porges (2011) Polyvagal | Breathing Flow |
| 82 | breathing-techniques-comparison | 6 种呼吸技术对比评测 | 腹式呼吸、4-7-8、箱式呼吸、交替鼻孔、蜂鸣式、共振呼吸 | Brown (2013) The Healing Power of the Breath; Russo (2017) Front Psychol | Breathing Flow |
| 83 | vagus-nerve-stimulation | 迷走神经刺激与放松 | 迷走神经张力、HRV 生物反馈、非侵入性刺激 | Porges (2011) Polyvagal Theory; Bonaz (2018) J Neurogastroenterol Motil | Breathing Flow |
| 84 | cortisol-and-relaxation | 皮质醇：压力激素的平衡艺术 | HPA 轴、昼夜节律、慢性压力与皮质醇基线 | Sapolsky (2004) Why Zebras Don't Get Ulcers | Breathing Flow |
| 85 | meditation-types-guide | 冥想类型完全指南 | 正念、慈心、身体扫描、行走冥想、超觉冥想 | Goleman (2017) Altered Traits; Kabat-Zinn (1990) MBSR | Breathing Flow |
| 86 | progressive-muscle-relaxation | 渐进式肌肉放松法详解 | Jacobson 技术、肌电反馈、焦虑应用 | Jacobson (1938) Progressive Relaxation; Bernstein (1973) | Breathing Flow |
| 87 | guided-imagery-relaxation | 引导想象放松法 | 视觉想象、场景构建、运动表现增强 | Cumming (2008) Sport Psychol; Onieva-Padilla (2016) Iran J Nurs Midwifery | Breathing Flow |
| 88 | yoga-and-brain-relaxation | 瑜伽对大脑放松的神经科学 | GABA 升高、默认模式网络、皮质醇下降 | Streeter (2012) Med Hypotheses; Pascoe (2017) J Psychiatr Res | Breathing Flow |
| 89 | stress-inoculation-training | 压力接种训练：主动应对压力 | 认知行为框架、暴露层次、压力疫苗 | Meichenbaum (1985) Stress Inoculation Training | Breathing Flow |
| 90 | relaxation-and-immunity | 放松训练对免疫系统的影响 | 自然杀伤细胞、炎症标志物、慢性压力免疫抑制 | Segerstrom (2004) Psychol Bull; Glaser (2005) Stress Medicine | Breathing Flow |
| 91 | sleep-relaxation-protocol | 睡前放松协议：科学入睡法 | 体温下降、褪黑素、睡前 90 分钟、认知洗牌 | Walker (2017) Why We Sleep; Bootzin (1972) Behav Ther | Breathing Flow |
| 92 | nature-sounds-relaxation | 自然声对大脑的放松效应 | 进化适应性、注意恢复理论、白/粉/棕噪音 | Alvarsson (2010) J Acoust Soc Am; Annerstedt (2013) Front Psychol | Breathing Flow |
| 93 | biofeedback-relaxation-guide | 生物反馈放松训练入门 | HRV 生物反馈、肌电反馈、脑电神经反馈 | Lehrer (2000) Appl Psychophysiol Biofeedback; Wheat (2010) | Breathing Flow |
| 94 | relaxation-and-creativity | 放松状态下的创造力激发 | 默认模式网络、Alpha/Theta 波、酝酿效应 | Kounios (2009) Trends Cogn Sci; Jung-Beeman (2004) PLoS Biol | Breathing Flow |
| 95 | workplace-micro-relaxation | 工作场所微型放松技术 | 5 分钟协议、桌面伸展、微冥想、过渡仪式 | Kalia (2018) Stress Health; Wolever (2012) J Occup Health Psychol | Breathing Flow |
| 96 | relaxation-for-children | 儿童放松训练：适龄方法 | 游戏化放松、睡前仪式、焦虑儿童特殊方法 | Goldstein (2016) Childhood Education; Hagen (2014) J Child Adolesc | Breathing Flow |
| 97 | yoga-nidra-deep-relaxation | 瑜伽休息术（瑜伽尼德拉）深度放松 | 意识状态、Sankalpa、61 点、意识漂浮 | Saraswati (1998) Yoga Nidra; Eastman-Mueller (2013) | Breathing Flow |
| 98 | relaxation-and-pain-management | 放松技术在慢性疼痛管理中的应用 | 疼痛门控理论、内啡肽、认知行为疼痛管理 | Hoffman (2011) J Pain; Morone (2011) JAMA | Breathing Flow |
| 99 | seasonal-relaxation-strategies | 季节性放松策略调整 | SAD、光照疗法、冬季 vs 夏季压力模式 | Rosenthal (1984) Arch Gen Psychiatry; Terman (2016) J Clin Psychiatry | Breathing Flow |
| 100 | daily-relaxation-routine | 日常放松方案：从早到晚的完整指南 | 晨间激活、日间微调、晚间降档、个性化定制 | Kabat-Zinn (1990) Full Catastrophe Living; Benson (1975) | Breathing Flow |

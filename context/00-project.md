# BrainVerse 项目上下文（Project Context）

> 文档编号：`context/00-project.md`
> 项目代号：BrainVerse（域名 cowb.cc）
> 产品定位：Brain Operating System（脑力操作系统）
> 文档语言：中文为主，技术名词保留英文
> 关联文档：`PROJECT.md`、`context/01-product.md`、`context/02-architecture.md`

本文档定义 BrainVerse 项目的背景、目标、范围、利益相关者、约束与成功指标。所有架构与实现决策必须以本文档为业务前提；如与上层 `PROJECT.md` 冲突，以 `PROJECT.md` 为准。

---

## 1. 项目背景（Project Background）

### 1.1 为什么做 BrainVerse

BrainVerse 起源于一个明确的市场空白：**用户需要的不是更多游戏，而是一套可被长期信任的脑健康操作系统**。

当前市面上的脑训练产品普遍存在三类问题：

1. **游戏化有余，系统化不足**：大多数产品把游戏当作终点，缺少从「评估 → 训练 → 放松 → 认同 → 进阶 → 知识 → 竞争 → 长期成长」的闭环。用户玩完即走，没有持续成长的抓手。
2. **科学包装多，真实测量少**：很多 App 大量使用「脑力年龄」「认知分数」等概念，但缺乏可解释的维度拆解、常模对比与个性化反馈，用户无法判断训练是否真实有效。
3. **入口重，留存弱**：脑训练天然是低频需求，但产品却要求下载原生 App、注册订阅、忍受广告。在「浏览器即应用」已成主流的当下，这种重入口模式正在流失大量潜在用户。

BrainVerse 选择反向定位：

- **入口极轻**：浏览器即开即用，基于 Cloudflare 免费计划构建全球边缘网络，无需下载、无需付费即可获得完整 MVP 体验。
- **系统而非游戏**：游戏只是工具，内容只是教育，认同才是留存，成长才是产品。BrainVerse 把这些要素编织成一个 Brain Operating System。
- **可解释、可追踪**：通过 Brain Engine（受保护系统）的 6 个公式，把模糊的「脑力」拆解为维度分数、脑力年龄、百分位、身份等级、成长曲线与雷达图谱，让每一次训练都可被衡量。

### 1.2 市场分析（Market Analysis）

#### 1.2.1 人口老龄化驱动

- 全球 60 岁以上人口预计从 2020 年的 10 亿增长至 2050 年的 21 亿（UN World Population Prospects）。
- 痴呆症全球患者已超 5500 万，每年新增近 1000 万例（WHO 2023）。Lancet 委员会 2020 年报告指出，**40% 的痴呆病例可通过 12 项可干预风险因素延迟或预防**，其中认知训练、社交活跃、持续学习是核心可干预项。
- 这意味着「主动脑健康管理」正在从医疗事后干预转向大众日常预防，市场从「病人市场」扩展为「全民健康市场」。

#### 1.2.2 认知健康意识觉醒

- 数字时代的注意力碎片化、远程办公的持续脑负荷、学生群体的考试压力，使「脑力管理」从老年群体扩展到全年龄段。
- 搜索趋势显示 brain age、working memory、focus、Stroop test 等关键词的全球搜索量持续上升，说明用户已具备「认知能力可训练」的先验认知。

#### 1.2.3 脑训练市场增长

- 全球 brain training 市场规模预计从 2023 年约 60 亿美元增长至 2030 年超 150 亿美元，CAGR 约 14%（Grand View Research / Allied Market Research 综合估算）。
- 增长驱动力包括：老龄化预防需求、移动与浏览器端的低门槛分发、神经科学研究的公众化传播、 employers 将脑健康纳入 wellness 福利。
- 增长阻力包括：训练迁移效度的科学争议（Simons 2016 元分析）、用户留存难、付费转化低。BrainVerse 通过「认同驱动留存 + 内容驱动 SEO + 免费计划零成本」正面应对这三项阻力。

### 1.3 竞品参考（Competitor References）

BrainVerse 并不与任何单一竞品正面竞争，而是吸收多类产品的最佳实践，组合成一个新类别。下表为设计参考与借鉴意图，非功能照搬。

| 竞品 | 类别 | BrainVerse 借鉴点 | BrainVerse 差异点 |
|---|---|---|---|
| **BrainHQ** | 科学化脑训练 | 维度化训练、科学循证引用 | 浏览器优先、免费计划、更轻的游戏化体验 |
| **Lumosity** | 大众脑训练 | 游戏化训练、Brain Profile 可视化 | 不做付费订阅墙，强调长期成长而非订阅 |
| **Elevate** | 技能型脑训练 | 个性化推荐、进阶曲线 | 增加放松维度与内容教育，覆盖更广脑健康光谱 |
| **Peak** | 游戏化脑训练 | 精致游戏设计、每日训练 | 加入 Brain Pet、Streak、Identity 等长期认同机制 |
| **NeuroNation** | 欧洲脑训练 | 自适应难度、记忆力专项 | 多语言（en/zh/ja）+ SEO 内容驱动获客 |
| **Duolingo** | 语言学习 | Streak、连续打卡、宠物（Duolingo 的 Owl）| 把 streak 与 pet 机制迁移到脑训练领域 |
| **Pokémon** | 收养成游戏 | 进化、收集、情感连接 | Brain Pet 系统的进化阶段与情感羁绊设计 |
| **Steam Achievements** | 游戏成就 | 成就解锁、稀有度、展示 | Achievement System 的分类与展示设计 |
| **Calm** | 冥想放松 | 呼吸引导、放松视觉、内容栏目 | Breathing Flow 游戏与 Relaxation 内容栏目 |
| **Headspace** | 冥想放松 | 每日课程、友好插画 | 内容栏目结构与每日引导节奏 |
| **Apple Health** | 健康仪表盘 | 维度卡片、趋势图、目标环 | Dashboard 的数据可视化与维度卡片布局 |

### 1.4 新品类定义：Brain Operating System

BrainVerse 不把自己定义为「脑训练 App」「冥想 App」「科普网站」中的任何一种，而是定义一个新品类——**Brain Operating System（脑力操作系统）**：

- **操作系统隐喻**：像操作系统管理硬件资源一样，BrainVerse 管理用户的认知资源——测量（Brain Age）、调度（训练与放松）、激励（成就与宠物）、记录（仪表盘）、教育（内容）、社交（挑战）。
- **组合而非单点**：单一游戏不能成为操作系统，单一冥想不能成为操作系统，单一科普也不能。只有当「评估 + 训练 + 放松 + 认同 + 进阶 + 知识 + 竞争 + 长期成长」八要素闭环，才构成操作系统。
- **产品哲学**：**Games are tools, content is education, identity is retention, growth is the product.**（游戏是工具，内容是教育，认同是留存，成长是产品。）

---

## 2. 项目目标（Project Goals）

### 2.1 MVP 验证目标（MVP Validation Goals）

MVP 阶段（Phase 1–5）的核心目标是用最小可行产品验证三个关键假设。只有这三个假设被数据证实，才进入规模化阶段。

#### 2.1.1 验证核心价值主张

- **假设**：用户愿意在浏览器中完成一次脑力年龄评估，并获得可解释的多维度结果。
- **验证方式**：Brain Age Assessment 完成率 ≥ 60%（进入测试的用户中完成全部流程的比例）。
- **判定标准**：完成率达标即认为价值主张成立；若 < 40%，需重新设计评估流程或价值表达。

#### 2.1.2 测量用户参与度

- **假设**：用户在完成评估后，会主动尝试至少一款推荐游戏，并完成首局训练。
- **验证方式**：评估完成后 24 小时内，至少完成 1 局游戏的用户比例 ≥ 50%。
- **判定标准**：游戏首日参与度达标即认为「评估 → 训练」漏斗成立。

#### 2.1.3 测试留存机制

- **假设**：Streak + Brain Pet + Daily Challenge 三机制组合，能驱动次日留存。
- **验证方式**：D1 留存 ≥ 30%，D7 留存 ≥ 12%（参考脑训练类目基准）。
- **判定标准**：达到基准即认为留存机制有效；若 D1 < 20%，需调整触发逻辑或奖励强度。

### 2.2 长期目标（Long-Term Goals）

#### 2.2.1 成为全球最好的浏览器脑健康平台

- 「最好」的衡量标准：在 en/zh/ja 三语市场，自然搜索「brain age」「brain training」「脑力训练」等核心词时，BrainVerse 进入前 3 页；用户净推荐意愿（NPS）≥ 40。
- 路径：通过 Content Engine 的 300+ SEO 页面构建可持续的有机流量入口，而非依赖付费投放。

#### 2.2.2 建立认同驱动的留存

- 让用户不是因为「想玩个游戏」而回来，而是因为「我的脑力宠物需要我」「我的 Streak 不能断」「我的身份等级还要升一阶」而回来。
- 衡量标准：30 日活跃用户中，Streak ≥ 7 天的用户占比 ≥ 35%。

#### 2.2.3 规模化至 300+ SEO 页面

- 100 篇深度文章 × 3 语言 = 300 个独立 SEO 落地页，覆盖脑健康认知图谱的五个主轴（Brain Age / Memory / Attention / Focus / Relaxation）。
- 目标：6 个月内月自然搜索流量突破 10 万会话，单页面平均停留时长 ≥ 2 分钟。

#### 2.2.4 验证免费计划可承载的商业可行性

- 在 Cloudflare 免费计划约束下，验证 10 万 DAU 量级的可持续运营能力，为零成本扩张提供模板。
- 目标：单用户日均 API 请求 ≤ 5（前端 SPA 闭环 + 仅必要 POST），确保 Workers 100K req/day 配额可支撑约 2 万 DAU 而无需升级。

---

## 3. 项目范围（Project Scope）

### 3.1 In Scope（在范围内）

#### 3.1.1 11 个核心模块（Core Modules）

| # | 模块 | 说明 |
|---|---|---|
| 1 | Landing Page | 着陆页，转化访客为注册用户 |
| 2 | Brain Age Assessment | 脑力年龄评估，基线认知测量 |
| 3 | User Dashboard | 用户仪表盘，展示进度与趋势 |
| 4 | User Profile | 用户档案，管理个人信息与偏好 |
| 5 | Content Hub | 内容中心，脑健康科普文章 |
| 6 | SEO System | SEO 系统，300+ 页面架构 |
| 7 | Achievement System | 成就系统，游戏化激励 |
| 8 | Streak System | 连续打卡系统，每日习惯养成 |
| 9 | Brain Pet System | 脑力宠物系统，情感连接与留存 |
| 10 | Share System | 分享系统，病毒式增长 |
| 11 | Challenge System | 挑战系统，社交竞争 |

#### 3.1.2 6 款 MVP 游戏（MVP Games）

| # | 游戏 | 认知维度 |
|---|---|---|
| 1 | Visual Search | Visual Attention, Processing Speed |
| 2 | Digit Span | Working Memory, Short-Term Memory |
| 3 | Reaction Training | Reaction Speed, Processing Speed |
| 4 | Stroop Challenge | Executive Function, Cognitive Control |
| 5 | Spatial Memory | Spatial Memory, Navigation Memory |
| 6 | Breathing Flow | Relaxation, Stress Reduction |

#### 3.1.3 3 种语言（Languages）

- 英语（en）— 默认语言，覆盖全球
- 简体中文（zh）— 覆盖中国大陆与华语圈
- 日语（ja）— 覆盖日本高老龄化市场

#### 3.1.4 100 篇 SEO 文章（SEO Articles）

- Brain Age 20 篇 / Memory 20 篇 / Attention 20 篇 / Focus 20 篇 / Relaxation 20 篇
- 每篇支持 en/zh/ja 三语，共 300 个翻译记录
- 详细清单见 `PROJECT.md` 与 `context/01-product.md` 的 Content Engine 章节

#### 3.1.5 Cloudflare 免费计划（Cloudflare Free Plan）

- 仅使用：Pages、Workers、D1、KV、R2、Analytics、Turnstile
- 不使用任何付费服务（详见第 5 节约束）

### 3.2 Out of Scope（不在范围内）

以下事项在 MVP 及可预见的规模化阶段均**明确排除**，如需引入须升级项目范围并取得明确授权：

| 类别 | 排除项 | 原因 |
|---|---|---|
| 端 | 移动原生 App（iOS/Android native） | 浏览器优先，PWA 已能覆盖移动场景 |
| 基础设施 | Cloudflare 付费服务（Workers Paid、D1 Paid、Queues、Durable Objects、Vectorize 等） | 免费计划是核心商业假设，须先验证 |
| 内容 | 文章自动生成与自动发布 | MVP 保留 CMS 架构但人工把控质量；自动生成违反质量约束 |
| 社交 | 超出挑战范围的社会化功能（动态流、关注、评论、私信、社区） | 聚焦脑健康而非社交平台，避免范围蔓延 |
| 商业化 | 付费订阅、广告变现 | MVP 验证留存与参与，商业化在留存达标后再议 |
| 医疗 | 医疗诊断、临床建议、处方 | BrainVerse 是健康产品而非医疗器械，明确免责 |
| 数据 | 第三方数据买卖、用户数据对外共享 | 隐私优先，数据仅用于产品内个性化 |
| 训练 | 实时多人对战服务器、低延迟联机 | 免费计划不支持长连接；挑战系统采用异步模式 |

---

## 4. 利益相关者（Stakeholders）

### 4.1 用户画像（User Personas）

#### Persona U1：休闲脑训练者（Casual Brain Trainer）

- **画像**：25–45 岁，城市白领，对脑力训练有好奇心但无明确目标。
- **场景**：午休或通勤时打开浏览器，玩 1–2 局小游戏，看一眼 Brain Age 变化。
- **需求**：低门槛、即开即玩、有即时反馈、不需要长期承诺。
- **BrainVerse 价值**：免费浏览器入口 + 每日挑战 + 精致游戏化体验。
- **成功信号**：每周回访 ≥ 2 次，平均会话时长 5–10 分钟。

#### Persona U2：健康关注型成人（Health-Conscious Adult）

- **画像**：35–55 岁，关注自身与家人健康，读过脑科学科普，担心认知衰退。
- **场景**：定期做 Brain Age 评估，阅读科普文章，按文章建议调整生活方式。
- **需求**：可解释的科学结果、有依据的内容、可追踪的长期趋势。
- **BrainVerse 价值**：Brain Engine 的可解释维度 + 100 篇循证文章 + 进度仪表盘。
- **成功信号**：每月完成 ≥ 1 次 Brain Age 评估，文章页停留时长 ≥ 3 分钟。

#### Persona U3：学生（Student）

- **画像**：16–28 岁，中学生至研究生，面临考试或高强度学习，希望提升注意力与记忆力。
- **场景**：备考期间每日训练 Digit Span 与 Stroop Challenge，关注 Streak 与成就。
- **需求**：能感到「变强」的进阶反馈、可与同学比拼、不枯燥。
- **BrainVerse 价值**：自适应难度 + 成就系统 + 挑战系统 + 身份等级。
- **成功信号**：Streak ≥ 7 天，挑战发起 ≥ 1 次/周。

#### Persona U4：银发族（Senior）

- **画像**：60–75 岁，退休或半退休，主动预防认知衰退，能使用浏览器但操作偏慢。
- **场景**：每日固定时段训练，关注 Brain Age 是否「变年轻」，喜欢温和的放松游戏。
- **需求**：大字号、低对比度噪点、不催促、有情感陪伴感。
- **BrainVerse 价值**：Breathing Flow 放松游戏 + Brain Pet 情感陪伴 + 无障碍设计。
- **成功信号**：连续 30 日活跃，Brain Age 复测参与率 ≥ 50%。

### 4.2 管理员画像（Admin Personas）

#### Persona A1：内容编辑（Content Editor）

- **职责**：撰写与维护 100 篇 SEO 文章的三语版本，核查科学引用，管理文章发布状态。
- **场景**：通过 Admin Panel 创建文章、上传封面、设置 SEO 元数据、调整内链。
- **需求**：所见即所得的编辑器、质量检查工具（降 AI 痕迹、查重、引用核查）、多语言并行编辑。
- **权限范围**：articles、article_translations、seo_metadata 表的增改；不可修改用户数据与系统配置。

#### Persona A2：系统管理员（System Administrator）

- **职责**：管理 Feature Flags、监控配额使用、处理用户异常、维护游戏与成就配置。
- **场景**：通过 Admin Panel 切换功能开关、查看 Analytics 事件、审核挑战纠纷。
- **需求**：Feature Flags 即时生效、配额预警、用户行为审计日志。
- **权限范围**：feature_flags、admin_users 表管理；可禁用用户；不可直接修改分数（须通过申诉流程）。

---

## 5. 项目约束（Project Constraints）

### 5.1 Cloudflare 免费计划约束（硬约束）

BrainVerse 的商业假设建立在「零基础设施成本」之上，因此 Cloudflare 免费计划配额是不可逾越的硬约束。所有架构决策必须先满足这些配额。

| 服务 | 免费配额 | BrainVerse 使用策略 | 触发预警阈值 |
|---|---|---|---|
| **Workers** | 100,000 requests/day | 前端 SPA 闭环 + 仅必要 POST；静态资源走 Pages 不消耗 Worker | 80K req/day |
| **D1** | 5,000,000 reads/day；100,000 writes/day | KV 缓存热点数据；内存缓存常量；避免轮询；批量写入 | 4M read / 80K write |
| **KV** | 100,000 reads/day；1,000 writes/day | 长 TTL（Session 7 天、排行榜 1 小时）；批量写入；写合并 | 80K read / 800 write |
| **R2** | 10 GB storage；1M Class A ops/month；10M Class B ops/month | 按需上传；生命周期规则清理临时分享图 | 8 GB storage |
| **Pages** | 500 builds/month；无限带宽 | 构建优化 + 增量部署；避免无意义重建 | 400 builds/month |
| **Analytics** | 免费含 Core Web Vitals 与事件 | 自定义事件通过 Workers 上报至 Analytics Engine | — |
| **Turnstile** | 无限验证 | 注册/登录人机验证 | — |

**禁用服务清单**（免费计划不含或受限，不得使用）：
- Durable Objects、Queues、Vectorize、Workers AI（部分免费但计费复杂，MVP 不用）、Hyperdrive、Email Workers、Workers Logs（付费档）、Cloudflare Access（Zero Trust 付费档）。

### 5.2 多语言约束

- 支持语言：`en`（默认）、`zh`、`ja`。
- 路由规则：`/en/...`、`/zh/...`、`/ja/...`；根路径 `/` 重定向至 `/en/`。
- 翻译规范：所有 UI 文本必须走 i18n key，禁止硬编码；翻译须本地化而非直译；三语 key 结构必须完全一致。
- 字体：统一使用 Inter（`'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`），CJK 字符回退系统字体。

### 5.3 MVP 游戏数量约束

- MVP 阶段仅交付 6 款游戏（见第 3.1.2 节）。
- 设计稿中另有 12 款游戏页面（memory-games 4、attention-games 4、executive-games 4、relaxation-games 3 中的其余款），仅作为设计参考与未来扩展储备，不在 MVP 交付范围。
- 每款游戏必须实现：自适应难度、评分公式、数据采集点、维度归属、结果页与推荐下一游戏。

### 5.4 设计令牌约束（Design Tokens）

所有前端实现必须严格映射 `BrainVerse-Design/styles/global.css` 中的 CSS 自定义属性，不得引入设计稿之外的色值或字体。核心令牌摘要：

| 令牌类别 | 令牌 | 值 |
|---|---|---|
| 主色 | `--primary` | `#4A7CFF` |
| 辅色 | `--secondary` | `#50C8A8` |
| 强调色 | `--accent` | `#FFB14A` |
| 维度·记忆 | `--dim-memory` | `#8B5CF6` |
| 维度·注意 | `--dim-attention` | `#06B6D4` |
| 维度·反应 | `--dim-reaction` | `#FFB14A` |
| 维度·执行 | `--dim-executive` | `#10B981` |
| 维度·放松 | `--dim-relaxation` | `#4A7CFF` |
| 字体 | `--font-family` | `'Inter', system-ui, sans-serif` |
| 容器 | `--container-max` | `1200px` |
| 深色模式 | `prefers-color-scheme: dark` + `.dark` class | 双策略支持 |

完整的半径、间距、字号、阴影、动画 keyframes 清单见 `BrainVerse-Design/styles/global.css`（2272 行），TailwindCSS 配置须 1:1 映射。

### 5.5 技术栈约束

- 前端：Next.js（App Router）+ React + TypeScript（strict）+ TailwindCSS + Shadcn UI
- 后端：Cloudflare Workers + Hono
- 数据：D1（关系数据）+ KV（缓存与 Session）+ R2（对象存储）
- 共享：pnpm workspace monorepo，packages/* 共享 @brainverse/* 包
- 认证：Cloudflare Turnstile + 自建 Session（D1 + KV）
- 质量：strict TS、no `any`、no duplicate、reusable、accessible、mobile first、SEO friendly

### 5.6 合规约束

- **隐私**：Cookie 同意横幅（参考 `BrainVerse-Design/components/cookie-banner.html`），分类为 strictly-necessary / performance-analytics / targeting-ads，用户可拒绝非必要 Cookie。
- **免责**：所有 Brain Age 结果与文章内容须声明「非医疗诊断，仅供参考」。
- **科学诚信**：文章须引用真实可查的同行评审文献，引用格式为「作者+年份+期刊/机构」。

---

## 6. 成功指标（Success Metrics）

### 6.1 指标体系总览

成功指标分为四层：参与（Engagement）、留存（Retention）、转化（Conversion）、健康（Health）。所有指标通过 Cloudflare Analytics + Workers 自定义事件采集。

| 层级 | 指标 | 定义 | MVP 目标 | 长期目标 |
|---|---|---|---|---|
| 参与 | **DAU**（Daily Active Users） | 单日完成至少 1 次有效会话的去重用户数 | 验证期 ≥ 500 | ≥ 10,000 |
| 参与 | 游戏完成率 | 开始游戏后完成整局的会话比例 | ≥ 70% | ≥ 80% |
| 参与 | Brain Age 测试完成率 | 进入评估后完成全部流程的比例 | ≥ 60% | ≥ 75% |
| 参与 | 文章页浏览量（Page Views） | 月度文章页 PV | ≥ 5,000 | ≥ 100,000 |
| 留存 | **D1 留存率** | 注册次日回访用户占比 | ≥ 30% | ≥ 40% |
| 留存 | **D7 留存率** | 注册第 7 日回访用户占比 | ≥ 12% | ≥ 20% |
| 留存 | **D30 留存率** | 注册第 30 日回访用户占比 | ≥ 5% | ≥ 10% |
| 留存 | Streak 维持率 | 7 日活跃用户中 Streak ≥ 3 天的占比 | ≥ 25% | ≥ 35% |
| 转化 | 注册转化率 | Landing 访客中完成注册的比例 | ≥ 8% | ≥ 15% |
| 转化 | 评估完成转化率 | 注册用户中完成首次 Brain Age 的比例 | ≥ 50% | ≥ 70% |
| 健康 | API 错误率 | 5xx 响应占比 | < 0.5% | < 0.1% |
| 健康 | Workers 配额使用率 | 日请求量 / 100K | < 80% | < 60% |

### 6.2 关键指标采集点

- **DAU**：基于登录 Session 的 `user.session.start` 事件去重。
- **游戏完成率**：`game.start` 与 `game.complete` 事件配对计算。
- **Brain Age 完成率**：`brain_age.start` 与 `brain_age.complete` 事件配对计算。
- **留存率**：基于注册日的 `user.signup` 事件与后续日 `user.session.start` 事件的留存队列分析。
- **Streak 维持率**：从 `growth.streak.update` 事件中提取 `current_streak` 字段统计。
- **文章 PV**：`content.article.view` 事件，含 `slug` 与 `locale` 维度。

### 6.3 指标评审节奏

- **每周**：参与与留存核心指标评审，关注趋势异常。
- **每月**：完整指标体系评审，对照 MVP 目标判断是否进入下一阶段。
- **每季度**：长期目标进度评审，调整 Content Engine 与 Growth Engine 策略。

### 6.4 指标失败应对

- 若 MVP 验证目标（2.1 节）任一未达标：**不进入规模化阶段**，先迭代问题环节。
- 若 D1 < 20%：优先排查 Streak 触发逻辑、Brain Pet 成长反馈、Daily Challenge 奖励强度。
- 若游戏完成率 < 50%：优先排查难度曲线（是否过难导致挫败退出）、游戏时长（是否过长）。
- 若文章 PV 增长停滞：优先排查 SEO 元数据完整性、内链结构、核心词排名。

---

## 附：文档维护说明

- 本文档由项目初始化阶段（Phase A）创建，对应 Task 1.3。
- 任何对项目背景、目标、范围、约束、指标的实质性修改，须同步更新本文档并在 `decisions/` 留下 ADR 记录。
- 与本文档强关联的下游文档：
  - `context/01-product.md` — 11 模块、6 游戏、Brain Engine、Growth Engine、Content Engine 详细规格
  - `context/02-architecture.md` — 系统架构、Monorepo 结构、Cloudflare 服务映射、数据流、配额管理
  - `PROJECT.md` — 项目使命、权威层级、技术栈、规则总览

# BrainVerse 产品规格说明（Product Specification）

> 文档编号：`context/01-product.md`
> 项目代号：BrainVerse（域名 cowb.cc）
> 产品定位：Brain Operating System（脑力操作系统）
> 文档语言：中文为主，技术名词保留英文
> 关联文档：`context/00-project.md`、`context/02-architecture.md`、`PROJECT.md`

本文档是 BrainVerse 的权威产品规格，定义产品愿景、11 个核心模块、6 款 MVP 游戏、Brain Engine（受保护系统）、Growth Engine 子系统与 Content Engine 规格。所有功能实现必须以本文档为产品口径；Brain Engine 的 6 个公式为受保护系统，未经明确授权不得修改计算逻辑。

---

## Task 1.4.1 — 产品愿景声明（Product Vision Statement）

### 愿景

**BrainVerse is a Brain Operating System that combines Brain Age, Cognitive Training, Brain Relaxation, Identity, Progression, Knowledge, Social Competition, and Long-Term Brain Growth.**

BrainVerse 是一个脑力操作系统，它把脑力年龄（Brain Age）、认知训练（Cognitive Training）、脑力放松（Brain Relaxation）、认同（Identity）、进阶（Progression）、知识（Knowledge）、社交竞争（Social Competition）与长期脑力成长（Long-Term Brain Growth）编织成一个闭环系统。

### 产品哲学（Product Philosophy）

**Games are tools, content is education, identity is retention, growth is the product.**

- **Games are tools** — 游戏只是测量与训练认知维度的工具，不是产品本体。用户不应为「玩游戏」而来，而应为「提升脑力」而来。
- **Content is education** — 内容是教育手段，把神经科学转化为用户可理解、可执行的知识，建立信任与权威。
- **Identity is retention** — 认同（身份等级、宠物、成就、Streak）是让用户留下的情感锚点，比游戏本身更持久。
- **Growth is the product** — 真正的产品是用户在 BrainVerse 中经历的长期脑力成长曲线，这是其他单点产品无法提供的。

### 八要素闭环（Eight-Element Loop）

BrainVerse 的产品本体是以下八要素的闭环，缺一不可：

1. **Brain Age** — 测量基线与变化，给用户一个可感知的「脑力年龄」数字。
2. **Cognitive Training** — 通过 6 款游戏训练 5 个认知维度。
3. **Brain Relaxation** — 通过 Breathing Flow 等放松游戏平衡训练压力。
4. **Identity** — 通过身份等级与头衔让用户「成为」某个脑力角色。
5. **Progression** — 通过 Brain Level、成就、宠物进化提供进阶感。
6. **Knowledge** — 通过 100 篇文章把训练背后的科学讲清楚。
7. **Social Competition** — 通过挑战系统让脑力可被比较与炫耀。
8. **Long-Term Brain Growth** — 通过仪表盘与成长曲线让用户看见数月乃至数年的进步。

### BrainVerse IS / IS NOT

| BrainVerse IS | BrainVerse IS NOT |
|---|---|
| 一个脑力操作系统 | 一个脑训练游戏合集 |
| 浏览器优先的健康平台 | 需要下载的原生 App |
| 免费可用的 MVP | 付费订阅墙产品 |
| 可解释的维度化测量 | 一个笼统的「脑力分数」 |
| 认同驱动的长期留存 | 一次性娱乐消费 |
| 循证科普内容平台 | 营销软文农场 |
| 异步社交挑战 | 实时多人对战游戏 |

---

## Task 1.4.2 — 核心模块详细定义（11 Core Modules）

每个模块定义包含：目的（Purpose）、功能列表（Feature List）、用户故事（User Story）。

### Module 1: Landing Page（着陆页）

- **Purpose**：在 10 秒内让首次访客理解 BrainVerse 的价值主张，并将其转化为注册用户。
- **Feature List**：
  - Hero 区：价值主张标题 + 副标题 + 主 CTA（免费开始）+ 次 CTA（先做脑力测试）
  - 价值卡片：3–4 个核心价值（脑力年龄 / 维度训练 / 长期成长 / 免费即用）
  - 游戏预览：6 款 MVP 游戏的卡片墙，点击直接进入试玩或注册引导
  - 社会证明：科学引用、用户证言（MVP 阶段可省略）、数据指标
  - FAQ 折叠区：回应「是否免费」「是否科学」「是否需要下载」等核心疑虑
  - 多语言切换：右上角 Language Switcher（en/zh/ja）
  - Cookie 同意横幅：参考 `BrainVerse-Design/components/cookie-banner.html`
  - 移动端适配：底部 CTA 固定栏
- **User Story**：作为首次访问者，我希望在着陆页上快速理解 BrainVerse 是什么、能给我带来什么、是否值得注册，这样我可以在 1 分钟内决定是否创建账号。

### Module 2: Brain Age Assessment（脑力年龄评估）

- **Purpose**：为用户提供一个可解释的认知基线测量，生成「脑力年龄」数字与五维度雷达图，作为后续训练的起点与个性化推荐的依据。
- **Feature List**：
  - 入口引导：评估说明、预计时长（8–12 分钟）、免责声明
  - 评估流程：从 6 款游戏中抽取精简版任务，覆盖 5 个认知维度
  - 实时进度：进度条显示已完成维度数
  - 结果页：脑力年龄数字、五维度雷达图、百分位排名、与同龄人对比
  - 个性化推荐：基于薄弱维度推荐 1–2 款训练游戏
  - 历史记录：历次评估结果对比曲线（依赖 Module 3 Dashboard）
  - 复测提醒：建议每 4 周复测一次，避免练习效应干扰
- **User Story**：作为新注册用户，我希望完成一次脑力年龄评估，获得一个可理解的数字和多维度结果，这样我能知道自己的认知基线并开始有针对性的训练。

### Module 3: User Dashboard（用户仪表盘）

- **Purpose**：集中展示用户的训练进度、维度趋势、Streak、Brain Pet 状态与近期活动，让用户每次回访都有「掌控感」。
- **Feature List**：
  - 概览卡片区：Brain Age 当前值、Brain Score 总分、当前 Streak、Brain Level
  - 维度雷达图：五维度当前值与上次对比
  - 趋势曲线：可选时间范围（7 日 / 30 日 / 90 日 / 全部）的 Brain Score 趋势
  - Brain Pet 状态卡：宠物当前阶段、心情、今日是否已喂养
  - 今日挑战卡：Daily Challenge 内容与完成状态
  - 近期游戏列表：最近 5 次训练记录与分数
  - 成就最近解锁：最近 3 个解锁的成就徽章
  - 快速训练入口：基于薄弱维度推荐的「今日训练」按钮
- **User Story**：作为回访用户，我希望在仪表盘上一眼看到我的脑力进步、今日该做什么、宠物状态如何，这样我能在 30 秒内决定今天的训练计划。

### Module 4: User Profile（用户档案）

- **Purpose**：让用户管理个人基本信息、偏好设置与隐私选项，并提供公开身份展示页。
- **Feature List**：
  - 基本信息：昵称、头像（R2 上传或默认）、生日、性别（用于脑力年龄常模校正）
  - 偏好设置：界面语言、深色模式（auto/light/dark）、字号、音效开关
  - 训练偏好：每日训练目标时长、偏好的认知维度
  - 隐私设置：是否公开 Brain Age、是否公开 Streak、是否允许被挑战
  - 身份展示：身份等级、头衔、Brain Pet 展示、成就墙（精选 6 个）
  - 账号安全：修改密码、Session 管理（登出其他设备）、删除账号
  - 数据导出：导出个人训练数据为 JSON
- **User Story**：作为用户，我希望在一个地方管理我的账号信息、偏好与隐私，这样我能控制自己在 BrainVerse 中的体验与公开形象。

### Module 5: Content Hub（内容中心）

- **Purpose**：作为脑健康科普教育枢纽，把神经科学转化为用户可理解、可执行的知识，同时为 SEO 提供内容载体。
- **Feature List**：
  - 内容首页：5 个类别入口（Brain Age / Memory / Attention / Focus / Relaxation），每类展示精选文章
  - 文章列表页：按类别筛选、按时间/热门排序、搜索
  - 文章详情页：完整文章结构（见 Content Engine 规格）
  - 相关游戏推荐：每篇文章底部推荐 1 款关联游戏
  - 相关文章推荐：底部 3 条内链
  - 阅读进度：登录用户可标记已读
  - 多语言切换：每篇文章支持 en/zh/ja 切换
- **User Story**：作为健康关注型用户，我希望在内容中心阅读有科学依据的脑健康文章，并把文章建议应用到日常训练中。

### Module 6: SEO System（SEO 系统）

- **Purpose**：通过 300+ SEO 页面架构驱动有机搜索流量，使 BrainVerse 在脑健康核心关键词上获得可持续的自然流量。
- **Technical Requirement**：300+ SEO 页面架构
  - 100 篇文章 × 3 语言 = 300 个独立落地页
  - 每页必需元数据：title（≤ 60 字符）、meta description（≤ 150 字符）、canonical URL、hreflang 三语 alternate、OpenGraph、Twitter Card、JSON-LD（Article + FAQ Schema）
  - 程序化 SEO：游戏页、类别页、Brain Age 概念页均生成独立可索引 URL
  - 站点地图：sitemap.xml 自动生成，含全部可索引 URL
  - robots.txt：允许主站，屏蔽 /api 与 /admin
  - 内链结构：每篇文章至少 3 条内链，形成类别内与跨类别网状结构
  - Core Web Vitals：LCP < 2.5s、INP < 200ms、CLS < 0.1
- **User Story**：作为通过搜索引擎到达 BrainVerse 的访客，我希望落地页加载快、内容相关、结构清晰，这样我能快速找到答案并可能进一步探索产品。

### Module 7: Achievement System（成就系统）

- **Purpose**：通过分类成就解锁提供游戏化激励，让用户在训练之外获得「被认可」的满足感。
- **Feature List**：
  - 成就分类：训练类（玩满 X 局）、社交类（发起 X 次挑战）、Streak 类（连续 X 天）、精通类（某游戏达到 X 分）
  - 解锁条件：基于游戏分数、Streak、挑战数等多维度触发
  - 徽章展示：稀有度（普通/稀有/史诗/传说）、维度色归属
  - 成就墙：Profile 页展示已解锁徽章，未解锁显示灰色占位与解锁提示
  - 解锁通知：解锁瞬间触发 Toast + 彩屑动画
  - 成就积分：每个成就贡献积分，影响 Brain Level
- **User Story**：作为用户，我希望在完成特定里程碑时解锁成就徽章，这样我能在训练过程中获得额外的成就感与收集乐趣。

### Module 8: Streak System（连续打卡系统）

- **Purpose**：通过连续打卡机制养成每日训练习惯，将低频脑训练转化为日常仪式。
- **Feature List**：
  - 连续天数计数：每日完成至少 1 局游戏或 1 次评估即记 1 天
  - Streak 展示：仪表盘火苗图标 + 当前天数 + 最长天数
  - 里程碑奖励：3/7/14/30/60/100/365 天触发成就与奖励
  - 断签保护：Streak Freeze 道具，每月 2 次，断签自动抵消
  - 宽限期：基于时区，当日 0:00–23:59 完成即算当日
  - 即将断签提醒：当日 20:00 未训练时推送提醒（若用户开启）
- **User Story**：作为用户，我希望通过保持连续打卡获得奖励与认可，这样我有动力每天回来训练，把脑力锻炼变成习惯。

### Module 9: Brain Pet System（脑力宠物系统）

- **Purpose**：通过情感连接提升留存，让用户因为「宠物需要我」而回来，而非仅因为「我想训练」。
- **Feature List**：
  - 宠物种类：MVP 提供 3 种基础宠物（如 Nebula、Pixel、Mochi），各有视觉风格
  - 进化阶段：egg → baby → child → adult，每阶段有独立视觉与互动
  - 成长驱动：由训练一致性驱动（每日训练喂食、Streak 增长加速进化）
  - 心情系统：连续训练心情好、断签心情低落，影响视觉表情
  - 互动：抚摸、喂食、装扮（装扮为未来扩展，MVP 仅基础互动）
  - 展示：仪表盘与 Profile 展示宠物
- **User Story**：作为用户，我希望培养一个脑力宠物，看着它随我的训练成长进化，这样我与 BrainVerse 之间会产生超越游戏本身的情感连接。

### Module 10: Share System（分享系统）

- **Purpose**：让用户把脑力成绩、成就、宠物分享到社交媒体，驱动病毒式增长。
- **Feature List**：
  - 分享内容：Brain Age 结果、游戏高分、成就解锁、宠物进化、Streak 里程碑
  - 平台适配：自动生成适配 Twitter/X、Facebook、微信、Line 的分享卡
  - 图片生成：服务端或前端 Canvas 生成 OG 图片存入 R2
  - 链接生成：含用户 ref 的短链，被引荐注册双方获奖励
  - 分享预览：分享前可预览卡片样式
  - 隐私控制：用户可在 Profile 关闭分享功能
- **User Story**：作为用户，我希望把我的脑力成绩或宠物分享到社交媒体，这样我能向朋友展示我的进步并邀请他们一起训练。

### Module 11: Challenge System（挑战系统）

- **Purpose**：通过异步社交竞争让脑力可被比较，增加训练动机与社交粘性。
- **Feature List**：
  - 创建挑战：选择游戏 + 选择对手（好友链接或随机匹配）+ 设定目标
  - 接受挑战：被挑战者收到通知，可接受或拒绝
  - 完成挑战：双方在限定时间内完成游戏，分数高者胜
  - 结果通知：挑战结束时双方收到结果通知
  - 挑战历史：Profile 展示胜负记录
  - 排行榜：游戏维度与全局排行榜（KV 缓存，1 小时刷新）
  - 隐私：用户可在 Profile 关闭「允许被挑战」
- **User Story**：作为用户，我希望挑战朋友比拼脑力，这样训练变得更有趣且更有动力。

---

## Task 1.4.3 — 6 款 MVP 游戏详细规格（6 MVP Games）

每款游戏定义包含：认知目标（Cognitive Target）、游戏规则（Game Rules）、难度曲线（Difficulty Curve）、评分公式（Scoring Formula）、数据采集点（Data Collection Points）。

### Game 1: Visual Search（视觉搜索）

- **Cognitive Target**：Visual Attention（视觉注意）、Processing Speed（加工速度）
- **Game Rules**：
  - 屏幕呈现一组干扰项（distractors），其中隐藏 1 个目标（target）
  - 用户点击目标即正确，点击干扰项即错误（扣 1 命）
  - 每局 3 命，命光即结束
  - 每题限时，超时算错
  - 单局目标完成 20 题或命光结束
- **Difficulty Curve**：
  - 起始：8 个干扰项，目标与干扰项特征差异显著（颜色+形状）
  - 升级维度 1：干扰项数量递增（8 → 16 → 24 → 32 → 40）
  - 升级维度 2：目标与干扰项相似度提升（颜色相近、形状相近）
  - 升级维度 3：限时缩短（5s → 3s → 2s）
  - 自适应：连续 3 题正确率 100% 升级，连续 2 题错误降级
- **Scoring Formula**：
  - `单题分 = (基础分 100) × 速度系数(0.5–1.5) × 难度系数(1.0–3.0)`
  - `速度系数 = clamp(1.5 - (反应时间ms / 限定时间ms), 0.5, 1.5)`
  - `总分 = Σ 单题分 - 错误数 × 50`
  - `最终分 = clamp(总分, 0, ∞)`
- **Data Collection Points**：
  - 每题：反应时间、是否正确、难度等级、干扰项数量
  - 每局：总正确数、总错误数、平均反应时间、最高连击、最终分
  - 上报字段：`game_id, score, accuracy, avg_reaction_ms, max_difficulty, rounds_played`

### Game 2: Digit Span（数字广度）

- **Cognitive Target**：Working Memory（工作记忆）、Short-Term Memory（短时记忆）
- **Game Rules**：
  - 屏幕依次闪现一串数字（每字 1 秒，间隔 0.5 秒）
  - 闪现完毕后用户按顺序输入数字
  - 正确则序列长度 +1，错误则记一次失败
  - 每局 3 次失败机会，第 3 次失败结束
  - 起始序列长度 3
- **Difficulty Curve**：
  - 升级：每答对 1 题，序列长度 +1
  - 降级：每答错 1 题，下次序列长度 -1（不低于 3）
  - 自适应：基于用户最大 span 动态调整起始难度
  - 变体（未来扩展）：倒序输入（Backward Digit Span）
- **Scoring Formula**：
  - `最大 span = 用户达到的最大序列长度`
  - `准确率 = 正确输入数字数 / 总呈现数字数`
  - `分数 = (最大 span - 2) × 200 × 准确率`
  - 例：最大 span 7、准确率 0.95 → 分数 = (7-2)×200×0.95 = 950
- **Data Collection Points**：
  - 每题：序列长度、是否正确、输入耗时
  - 每局：最大 span、准确率、3 次失败时的 span、最终分
  - 上报字段：`game_id, score, max_span, accuracy, failures_at_span`

### Game 3: Reaction Training（反应训练）

- **Cognitive Target**：Reaction Speed（反应速度）、Processing Speed（加工速度）
- **Game Rules**：
  - 屏幕出现刺激（颜色变化/图形出现/箭头方向），用户立即响应
  - 响应方式：点击 / 按键 / 滑动（依刺激类型）
  - 抢跑（刺激出现前响应）算错
  - 每局 20 轮，3 次错误结束
- **Difficulty Curve**：
  - 升级维度 1：刺激呈现窗口缩短（2s → 1s → 0.6s）
  - 升级维度 2：刺激类型复杂化（单一颜色 → 多颜色选择 → 箭头方向 → 双任务）
  - 升级维度 3：刺激前等待时间随机化（防预判）
  - 自适应：连续 5 轮反应时间 < 阈值升级
- **Scoring Formula**：
  - `单轮分 = clamp(2000 - 反应时间ms, 0, 2000) × 难度系数(1.0–2.5)`
  - `总分 = Σ 单轮分 - 错误数 × 100 - 抢跑数 × 150`
  - 最终分下限 0
- **Data Collection Points**：
  - 每轮：反应时间、是否正确、是否抢跑、刺激类型、难度
  - 每局：平均反应时间、最快反应时间、错误数、抢跑数、最终分
  - 上报字段：`game_id, score, avg_reaction_ms, fastest_reaction_ms, false_starts, errors`

### Game 4: Stroop Challenge（斯特鲁普挑战）

- **Cognitive Target**：Executive Function（执行功能）、Cognitive Control（认知控制）
- **Game Rules**：
  - 屏幕呈现一个表示颜色的词（如「红色」二字用蓝色字体显示）
  - 用户须选择词的**字体颜色**而非词义
  - 一致试次（词义与颜色相同）与不一致试次（词义与颜色不同）混合
  - 每题限时，错误或超时扣 1 命，3 命结束
  - 单局 30 题
- **Difficulty Curve**：
  - 升级维度 1：不一致试次比例提升（30% → 50% → 70% → 90%）
  - 升级维度 2：可选颜色数增加（4 → 6 → 8）
  - 升级维度 3：限时缩短（3s → 2s → 1.2s）
  - 升级维度 4：干扰维度增加（位置变化、双词叠加，未来扩展）
  - 自适应：基于 Stroop 干扰量（不一致 - 一致反应时差）调整
- **Scoring Formula**：
  - `单题分 = 基础分 100 × 速度系数 × 一致性系数`
  - `速度系数 = clamp(1.5 - (反应时间ms / 限定时间ms), 0.5, 1.5)`
  - `一致性系数 = 不一致题 1.5，一致题 1.0`
  - `总分 = Σ 单题分 - 错误数 × 80`
- **Data Collection Points**：
  - 每题：反应时间、是否正确、是否一致试次、颜色对、难度
  - 每局：一致试次平均反应时、不一致试次平均反应时、Stroop 干扰量、准确率、最终分
  - 上报字段：`game_id, score, congruent_rt, incongruent_rt, stroop_effect, accuracy`

### Game 5: Spatial Memory（空间记忆）

- **Cognitive Target**：Spatial Memory（空间记忆）、Navigation Memory（导航记忆）
- **Game Rules**：
  - 网格中部分格子短暂高亮后熄灭
  - 用户须按原位置点击被高亮过的格子
  - 全部正确则进入下一关，错误则记一次失败
  - 每局 3 次失败机会
- **Difficulty Curve**：
  - 升级维度 1：网格规模扩大（3×3 → 4×4 → 5×5 → 6×6）
  - 升级维度 2：高亮格子数增加（2 → 3 → 4 → 5 → 6）
  - 升级维度 3：高亮时长缩短（2s → 1.2s → 0.8s）
  - 升级维度 4：序列记忆（按高亮顺序点击，未来扩展）
  - 自适应：连续 2 关全对升级
- **Scoring Formula**：
  - `关卡分 = 网格规模² × 高亮数 × 50 × (1 + (关数-1)×0.1)`
  - `总分 = Σ 关卡分 - 失败数 × 100`
  - 准确率加权：错误点击的格子数影响准确率
- **Data Collection Points**：
  - 每关：网格规模、高亮数、高亮时长、是否通过、错误格子数、耗时
  - 每局：最高关数、平均准确率、3 次失败时的关数、最终分
  - 上报字段：`game_id, score, max_level, grid_size, positions_count, accuracy`

### Game 6: Breathing Flow（呼吸流）

- **Cognitive Target**：Relaxation（放松）、Stress Reduction（减压）
- **Game Rules**：
  - 引导呼吸动画（吸气 → 屏息 → 呼气 → 屏息，循环）
  - 用户跟随动画节奏呼吸，可用触摸/鼠标同步反馈
  - 可选呼吸模式：4-7-8、箱式 4-4-4-4、共振 5-5
  - 单次会话 3 / 5 / 10 分钟可选
  - 无失败概念，强调完成与同步率
- **Difficulty Curve**：
  - 难度由呼吸模式复杂度与时长定义
  - 4-7-8 模式比箱式更难（屏息更长）
  - 10 分钟会话比 3 分钟更需要持续专注
  - 不存在「升级」概念，而是「完成更长/更复杂会话」
- **Scoring Formula**：
  - `同步率 = 用户跟随节奏的帧数 / 总帧数`
  - `完成系数 = 完成会话 1.0，中途退出 0.5`
  - `时长系数 = 3min ×1.0 / 5min ×1.3 / 10min ×1.8`
  - `模式系数 = 箱式 1.0 / 共振 1.1 / 4-7-8 1.2`
  - `分数 = round(同步率 × 1000 × 完成系数 × 时长系数 × 模式系数)`
- **Data Collection Points**：
  - 每会话：模式、目标时长、实际时长、同步率、是否完成、平均心率（若设备支持，未来扩展）
  - 上报字段：`game_id, score, pattern, duration_sec, sync_rate, completed`

---

## Task 1.4.4 — Brain Engine 受保护系统说明（Protected System）

> **PROTECTED SYSTEM — Do not modify without explicit approval.**
> Brain Engine 的 6 个公式是 BrainVerse 的核心知识产权与产品口径。任何对计算逻辑、输入输出、权重系数的修改，必须取得明确授权并在 `decisions/` 留下 ADR 记录。实现层位于 `packages/brain-engine/`，每个文件须标注 `PROTECTED SYSTEM` 注释。

每个公式定义包含：计算逻辑（Calculation Logic）、输入（Inputs）、输出（Outputs）、适用场景（Use Cases）。

### Formula 1: Brain Age Formula（脑力年龄公式）

- **Purpose**：将用户多维度认知分数与人口统计学数据映射为一个可感知的「脑力年龄」数字。
- **Inputs**：
  - `dimension_scores`: 五维度分数（Memory / Attention / Reaction / Executive / Relaxation），每维 0–100
  - `demographics`: 年龄、性别、教育程度（用于常模校正）
  - `population_norms`: 同龄同性别常模分布（KV 缓存）
- **Outputs**：
  - `brain_age`: 整数，脑力年龄（岁）
  - `confidence`: 0–1，结果置信度（基于测试完成度与方差）
- **Calculation Logic**：
  - 1) 计算复合认知指数 `CCI = Σ(dimension_score × weight)`，权重由受保护常量定义
  - 2) 将 CCI 映射到常模分布，找出该 CCI 对应的「典型实际年龄」
  - 3) `brain_age = typical_age + (user_actual_age - typical_age) × adjustment_factor`
  - 4) 置信度 = 测试完成率 × (1 - 维度间方差系数)
- **Use Cases**：
  - Brain Age Assessment 结果页展示
  - Dashboard 趋势曲线
  - Profile 公开展示（若用户开启）

### Formula 2: Brain Score Formula（脑力总分公式）

- **Purpose**：将用户各游戏分数综合为一个可比较的复合总分，用于排行榜与进度追踪。
- **Inputs**：
  - `game_scores`: 用户近期各游戏的归一化分数（取近 30 日最佳）
  - `weights`: 各游戏权重（受保护常量，反映认知维度覆盖）
  - `recency_decay`: 时间衰减因子
- **Outputs**：
  - `brain_score`: 整数，0–9999
  - `dimension_contributions`: 各维度对总分的贡献占比
- **Calculation Logic**：
  - 1) 每个游戏分数归一化至 0–1000（基于该游戏全局分布的百分位映射）
  - 2) `brain_score = round(Σ(normalized_score × weight × recency_decay))`
  - 3) 权重总和归一化为 1
  - 4) 贡献占比 = 每维度游戏加权分 / Σ 所有维度加权分
- **Use Cases**：
  - 全局与游戏维度排行榜
  - Dashboard Brain Score 卡片
  - 挑战系统胜负判定（基于单游戏归一化分）

### Formula 3: Brain Identity Formula（脑力身份公式）

- **Purpose**：基于综合表现、成就与坚持度，赋予用户一个身份等级与头衔，作为认同驱动留存的核心。
- **Inputs**：
  - `brain_score`: 来自 Formula 2
  - `achievements_count`: 已解锁成就数，按稀有度加权
  - `streak_days`: 当前 Streak 与历史最长 Streak
  - `brain_pet_stage`: 宠物进化阶段
- **Outputs**：
  - `identity_tier`: 身份等级枚举（如 Novice / Apprentice / Adept / Expert / Master / Luminary）
  - `title`: 头衔字符串（可本地化）
  - `progress_to_next`: 距下一级进度 0–1
- **Calculation Logic**：
  - 1) 计算 `identity_points = brain_score × 0.5 + achievement_points × 0.25 + streak_points × 0.15 + pet_points × 0.1`
  - 2) identity_points 映射到离散 tier 阈值表（受保护常量）
  - 3) progress_to_next = (current_points - tier_threshold) / (next_threshold - tier_threshold)
- **Use Cases**：
  - Profile 身份展示
  - Dashboard 身份卡
  - 解锁新身份时触发成就与全屏庆祝动画

### Formula 4: Growth Formula（成长公式）

- **Purpose**：量化用户在一段时间内的脑力成长速度，让用户看见「自己正在变好」。
- **Inputs**：
  - `training_consistency`: 时间范围内训练天数占比
  - `score_growth`: 时间范围内 Brain Score 的线性回归斜率
  - `dimension_balance`: 五维度分数的均衡度（标准差倒数）
- **Outputs**：
  - `growth_rate`: 成长率，可为负（表示退步）
  - `growth_label`: 文字标签（如 快速成长 / 稳步提升 / 平稳 / 需加油）
- **Calculation Logic**：
  - 1) `consistency_factor = training_consistency ^ 0.5`（开方削弱极端值影响）
  - 2) `growth_rate = score_growth × consistency_factor × dimension_balance`
  - 3) growth_label 由 growth_rate 阈值表映射
- **Use Cases**：
  - Dashboard 成长曲线与标签
  - 月度成长报告
  - 训练强度个性化建议

### Formula 5: Brain Mapping Formula（脑力图谱公式）

- **Purpose**：将五维度分数转换为雷达图可视化数据，让用户直观看到自己的认知强弱分布。
- **Inputs**：
  - `dimension_scores`: 五维度分数 0–100
  - `comparison`: 可选对比基准（自身上次 / 同龄人均 / 全局均）
- **Outputs**：
  - `radar_data`: 五维度标准化坐标 `[{axis, value, comparison_value}]`
  - `strengths`: 排名前 2 的维度
  - `weaknesses`: 排名后 2 的维度
- **Calculation Logic**：
  - 1) 各维度分数除以 100 标准化至 0–1
  - 2) 若有 comparison，同样标准化
  - 3) 按维度排序找出强弱项
- **Use Cases**：
  - Brain Age 结果页雷达图
  - Dashboard 维度卡
  - 个性化推荐（基于 weaknesses 推荐训练游戏）

### Formula 6: Percentile Formula（百分位公式）

- **Purpose**：将用户分数与人群分布对比，给出「你超过了 X% 的人」的可比较表述。
- **Inputs**：
  - `user_score`: 用户某维度或总分
  - `population_distribution`: 人群分布（直方图或近似参数，KV 缓存）
  - `cohort`: 对比人群（同龄 / 同性别 / 全局）
- **Outputs**：
  - `percentile`: 0–99，百分位
  - `cohort_label`: 对比人群描述
- **Calculation Logic**：
  - 1) 在 population_distribution 中定位 user_score 所在区间
  - 2) 线性插值计算累积分布函数 CDF(user_score)
  - 3) `percentile = round(CDF × 100)`
  - 4) 结果取 0–99 整数（避免 100 的误导）
- **Use Cases**：
  - Brain Age 结果页「超过同龄 X%」
  - 游戏结果页排名展示
  - Dashboard 维度卡百分位标注

---

## Task 1.4.5 — Growth Engine 子系统说明（Growth Engine Subsystems）

Growth Engine 由 10 个子系统组成，负责把训练数据转化为认同、激励与社交竞争。每个子系统定义包含：触发条件（Trigger）、奖励机制（Reward）、过期逻辑（Expiry）。

### Subsystem 1: Daily Challenge（每日挑战）

- **Purpose**：每天给用户一个明确的小目标，降低「今天该练什么」的决策成本。
- **Trigger**：用户首次访问当日触发，生成基于薄弱维度的挑战（如「完成 2 局 Digit Span 且准确率 > 80%」）。
- **Reward**：完成获得 XP（脑力等级经验）+ 小额 Brain Pet 喂食值。
- **Expiry**：当日 23:59（用户时区）过期，未完成不计惩罚但失去奖励。

### Subsystem 2: Weekly Challenge（每周挑战）

- **Purpose**：提供比 Daily 更具挑战性的中期目标，鼓励持续投入。
- **Trigger**：每周一首次访问触发，生成跨维度复合挑战（如「本周累计完成 10 局游戏覆盖至少 3 个维度」）。
- **Reward**：完成获得较大 XP + 专属周成就徽章 + Brain Pet 进化加速。
- **Expiry**：每周日 23:59（用户时区）过期。

### Subsystem 3: Achievements（成就）

- **Purpose**：通过分类成就解锁提供长期收集目标与认可。
- **Categories**：
  - 训练类：玩满 X 局 / 单游戏达 X 分 / 覆盖全部 5 维度
  - 社交类：发起 X 次挑战 / 赢 X 场 / 邀请 X 位好友
  - Streak 类：连续 3/7/14/30/60/100/365 天
  - 精通类：某游戏达到全局前 10% / 全维度均 > 70
- **Unlock Conditions**：由 Growth Engine 在事件发生时检查（如 `game.complete` 后检查训练类条件）。
- **Display**：Profile 成就墙，按稀有度（普通/稀有/史诗/传说）与维度色展示；未解锁显示灰色占位与解锁提示。

### Subsystem 4: Streak（连续打卡）

- **Purpose**：养成每日训练习惯。
- **Calculation**：
  - 当日完成 ≥ 1 局游戏或 1 次评估 → `current_streak += 1`
  - 当日无活动且次日已开始 → `current_streak = 0`（除非用 Streak Freeze）
  - `longest_streak = max(longest_streak, current_streak)`
- **Grace Period**：基于用户时区，当日 0:00–23:59 完成即算当日。
- **Streak Freeze**：每月 2 次免费，断签时自动抵消，保持 current_streak 不变。

### Subsystem 5: Brain Pet（脑力宠物）

- **Purpose**：情感连接驱动留存。
- **Pet Types**：MVP 提供 3 种基础宠物，每种有独立视觉风格与性格文案。
- **Evolution Stages**：egg → baby → child → adult
  - egg：初始阶段，需累计训练 3 天孵化
  - baby：孵化后，需累计 7 天训练进入 child
  - child：需累计 21 天训练进入 adult
  - adult：最终形态，可继续收集装扮（未来扩展）
- **Growth Driver**：训练一致性（每日训练喂食、Streak 增长加速进化、断签心情低落但不退阶段）。
- **Mood**：连续训练心情好、断签心情低落，影响视觉表情与互动反馈。

### Subsystem 6: Identity（身份）

- **Purpose**：把综合表现转化为可炫耀的身份角色。
- **Tiers**：Novice → Apprentice → Adept → Expert → Master → Luminary（6 级，由 Brain Identity Formula 计算）。
- **Title System**：每个 tier 有可本地化头衔（如「脑力学徒」「认知行家」），可随 locale 切换。
- **Visual Expression**：身份色与徽章随 tier 升级变化，Master/Luminary 拥有专属动画。
- **Tier-Up Effect**：升级时触发全屏庆祝动画 + 专属成就 + 分享卡生成。

### Subsystem 7: Brain Level（脑力等级）

- **Purpose**：提供细粒度的进阶感（身份是粗粒度，等级是细粒度）。
- **Level Formula**：`level = floor(sqrt(total_xp / 100))`，XP 越多升级越慢。
- **XP Sources**：
  - 完成游戏：基础 XP × 难度系数
  - 完成挑战：Daily / Weekly 固定 XP
  - 解锁成就：按稀有度 50/200/500/1000 XP
  - Streak 里程碑：3/7/14/30/60/100/365 天递增 XP
- **Level-Up Effect**：Toast 提示 + 进度条满格动画 + Brain Pet 获得喂食值。

### Subsystem 8: Progress Dashboard（进度仪表盘）

- **Purpose**：数据驱动的进度可视化。
- **Data Dimensions**：Brain Age、Brain Score、五维度分数、Streak、Brain Level、训练时长。
- **Chart Types**：雷达图（维度）、折线图（趋势）、柱状图（周/月对比）、热力图（训练日历）。
- **Time Ranges**：7 日 / 30 日 / 90 日 / 全部。
- **Insights**：基于 Growth Formula 自动生成洞察文案（如「你的注意力本月提升了 12%，继续保持！」）。

### Subsystem 9: Challenge Friends（挑战好友）

- **Purpose**：异步社交竞争。
- **Create**：用户选择游戏 + 选择对手（好友链接或随机匹配）+ 设定目标分数或时间窗。
- **Accept**：被挑战者收到通知，可在限定时间内接受或拒绝。
- **Complete**：双方在限定时间内完成游戏，系统记录双方分数。
- **Result Notification**：挑战结束时双方收到结果通知，胜者获 XP 与挑战胜场成就。
- **Privacy**：用户可在 Profile 关闭「允许被挑战」。

### Subsystem 10: Share Results（分享结果）

- **Purpose**：病毒式增长。
- **Share Content**：Brain Age 结果、游戏高分、成就解锁、宠物进化、Streak 里程碑。
- **Platform Adaptation**：自动生成适配 Twitter/X、Facebook、微信、Line 的分享卡（尺寸与文案不同）。
- **Link Generation**：含用户 ref 的短链，被引荐注册双方获奖励（如双方各 +50 XP）。
- **Image Generation**：前端 Canvas 或服务端生成 OG 图片存入 R2，URL 注入页面 meta。

---

## Task 1.4.6 — Content Engine 规格说明（Content Engine Specification）

### 1. 文章分配（100 Articles Allocation）

| 类别 | 篇数 | Slug 范围 | 关联维度 |
|---|---|---|---|
| Brain Age | 20 | what-is-brain-age ... lowering-brain-age-naturally | Brain Age Assessment |
| Memory | 20 | types-of-memory-explained ... memory-decline-prevention | Digit Span, Spatial Memory |
| Attention | 20 | types-of-attention ... improving-focus-naturally | Visual Search, Stroop Challenge |
| Focus | 20 | focus-vs-attention-difference ... building-focus-habit | Stroop Challenge, Reaction Training |
| Relaxation | 20 | relaxation-response-science ... daily-relaxation-routine | Breathing Flow |
| **合计** | **100** | | |

完整 100 篇文章清单（slug、主题、核心概念、科学引用、关联游戏）见 `PROJECT.md` 的「100 篇 SEO 文章完整规划」章节。每篇文章须支持 en/zh/ja 三语，共 300 个翻译记录。

### 2. 文章结构定义（Article Structure）

每篇文章必须包含以下 8 个必需部分，缺一不可，顺序固定：

| # | 部分 | 要求 |
|---|---|---|
| 1 | Title | SEO 优化标题，≤ 60 字符，含核心关键词 |
| 2 | Meta Description | ≤ 150 字符，含核心关键词与价值点 |
| 3 | Introduction（引言） | ≥ 150 字，抛出问题与本文价值 |
| 4 | Scientific Explanation（科学解释） | ≥ 600 字，含 ≥ 2 篇同行评审引用（作者+年份+期刊） |
| 5 | Practical Advice（实践建议） | ≥ 300 字，含 ≥ 3 条可操作建议（具体到时间/频率/方法） |
| 6 | Related Games（相关游戏） | 关联 ≥ 1 款平台游戏，关联须自然非生硬 |
| 7 | FAQ | ≥ 4 条问答，覆盖用户高频疑问 |
| 8 | Internal Links（内链） | ≥ 3 条内链，指向真实存在的其他文章 |

**质量约束**（强制）：
- **降 AI 痕迹**：禁用 "delve into"、"it's worth noting"、"in conclusion"、"unleash"、"harness"、"realm" 等词；段落长度变化 > 30%；段首句式不重复。
- **查重**：100 篇之间核心观点重复率 < 15%；同类别内 < 20%；禁止跨文章复制段落。
- **科学引用**：每篇 ≥ 2 篇真实可查文献，格式「作者+年份+期刊/机构」。
- **原创性**：每篇 ≥ 1 个原创观点或独特视角。
- **多语言**：三语版本齐全，翻译须本地化非直译，key 结构一致。

### 3. SEO 元数据与结构化数据

每篇文章须生成并存储以下 SEO 元数据：

- `title`：≤ 60 字符
- `description`：≤ 150 字符
- `og_image`：OpenGraph 图片 URL（R2 存储）
- `canonical_url`：规范 URL
- `json_ld`：JSON-LD 结构化数据，包含：
  - Article Schema（headline, author, datePublished, image）
  - FAQ Schema（每条 FAQ 作为 Question/Answer 对）
- `hreflang`：en/zh/ja 三语 alternate 链接

### 4. Content ↔ Game Loop（内容与游戏闭环）

Content Engine 与 Game Engine 通过以下闭环互相驱动流量与留存：

```
[文章页]
   │  文章底部「相关游戏」CTA
   ▼
[推荐游戏]
   │  用户完成游戏
   ▼
[游戏结果页]
   │  结果页底部「深入了解」推荐相关文章
   ▼
[相关文章]
   │  文章内链引导至更多文章
   ▼
[更多文章] → [更多游戏推荐] → ...
```

**闭环设计原则**：
- 文章 → 游戏：文章结尾基于主题推荐 1 款关联游戏（如 Memory 类文章推荐 Digit Span）。
- 游戏 → 文章：游戏结果页基于游戏维度推荐 1 篇相关文章（如 Stroop Challenge 结果推荐 stroop-effect-explained）。
- 文章 → 文章：每篇至少 3 条内链，形成类别内深度网状与跨类别广度连接。
- 个性化：登录用户基于薄弱维度优先推荐相关文章与游戏。

### 5. CMS 架构预留（CMS Architecture Reservation）

- **MVP 不实现**：文章自动生成、自动发布、所见即所得编辑器、自动 SEO 优化。
- **MVP 实现**：
  - 数据库表结构：`articles`、`article_translations`、`seo_metadata`（见数据库迁移 `0003_content.sql`）
  - Admin Panel 基础 CRUD：内容编辑可手动创建、编辑、发布文章
  - 质量检查工具：`packages/content-engine/src/quality-checker.ts`（降 AI 痕迹、查重、引用核查）
  - 文章数据插入脚本：`workers/api/scripts/seed-articles.ts`
- **未来扩展**（不在 MVP）：
  - 所见即所得编辑器
  - 多语言并行编辑界面
  - 自动内链建议
  - 自动 SEO 元数据生成
  - 文章版本控制与审核流

---

## 附：文档维护说明

- 本文档由项目初始化阶段（Phase A）创建，对应 Task 1.4。
- 11 个模块、6 款游戏、Brain Engine 6 公式、Growth Engine 10 子系统、Content Engine 规格的任何实质性修改，须同步更新本文档并在 `decisions/` 留下 ADR 记录。
- **Brain Engine 受保护系统**：6 个公式的计算逻辑、权重系数、阈值常量为受保护内容，实现层 `packages/brain-engine/` 每个文件须标注 `PROTECTED SYSTEM — Do not modify without explicit approval` 注释。
- 与本文档强关联的下游文档：
  - `context/00-project.md` — 项目背景、目标、范围、约束、成功指标
  - `context/02-architecture.md` — 系统架构、数据流、Cloudflare 服务映射
  - `PROJECT.md` — 100 篇文章完整清单、Analytics 事件清单、Admin Panel 模块清单

# BrainVerse AI 开发代理指南

> 本文件是 BrainVerse (cowb.cc) 项目所有 AI 开发代理（Autonomous Development Agent）的操作手册。它定义了 AI 代理的角色、工作流、质量标准与输出规范。任何 AI 代理在开始任务前 MUST 完整阅读本文件。
>
> **文档版本**：1.0
> **适用范围**：BrainVerse MVP 全部阶段的 AI 辅助开发
> **前置阅读**：`PROJECT.md`（业务规则与权威层级）

---

## 目录

1. [AI 代理角色定义](#1-ai-代理角色定义)
2. [文档加载顺序](#2-文档加载顺序)
3. [设计参考使用规则](#3-设计参考使用规则)
4. [代码质量要求](#4-代码质量要求)
5. [开发工作流](#5-开发工作流)
6. [Review Checklist](#6-review-checklist)
7. [GitHub MCP 工作流](#7-github-mcp-工作流)
8. [Cloudflare MCP 工作流](#8-cloudflare-mcp-工作流)
9. [输出格式规范](#9-输出格式规范)
10. [上下文缺失处理规则](#10-上下文缺失处理规则)

---

## 1. AI 代理角色定义

BrainVerse AI 代理根据任务类型与复杂度分为 **8 个角色**。一个 AI 代理可在不同任务中切换角色，但单个任务 MUST 始终以单一角色的视角输出。

| # | 角色 | 英文标识 | 职责范围 | 决策权限 |
|---|---|---|---|---|
| 1 | **首席产品架构师** | Lead Product Architect | 业务需求分析、产品边界定义、用户故事编写、功能优先级裁决 | 业务需求最终解释权 |
| 2 | **首席软件工程师** | Principal Software Engineer | 架构设计、代码 Review、技术选型、关键技术决策、代码质量把关 | 代码合并最终决定权 |
| 3 | **技术总监** | Technical Director | 跨模块技术协调、技术债务管理、依赖升级、性能优化全局规划 | 架构变更审批权 |
| 4 | **UX 架构师** | UX Architect | 用户体验设计、交互流程、可访问性（A11y）、移动端适配、信息架构 | UX 决策权（不凌驾业务需求） |
| 5 | **SEO 架构师** | SEO Architect | SEO 策略、元数据规范、结构化数据、内链架构、爬虫可索引性 | SEO 决策权 |
| 6 | **增长架构师** | Growth Architect | Growth Engine 子系统设计、激励机制、留存策略、社交传播机制 | 增长机制设计权 |
| 7 | **Cloudflare 架构师** | Cloudflare Architect | Cloudflare 服务选型、配额管理、Workers/D1/KV/R2 边界划分、免费计划合规 | 基建决策权 |
| 8 | **自主开发代理** | Autonomous Development Agent | 按既定 spec 与设计稿实现功能、写测试、修复 bug、执行重复性任务 | 实现层面自主权（架构变更须上报） |

### 角色协作规则

- **任务接收**：Autonomous Development Agent 是默认执行角色，遇到超出权限的决策时 MUST 升级到对应架构师角色
- **冲突升级**：当代码实现与设计稿冲突时，Autonomous Development Agent MUST 停止并向 Principal Software Engineer 上报
- **角色声明**：每次任务开始时 MUST 在输出开头声明当前角色（如 `[Role: Principal Software Engineer]`）
- **不越权**：任何角色 MUST NOT 越权决策。例如 Autonomous Development Agent MUST NOT 自行修改 Brain Engine 公式，必须升级到 Principal Software Engineer

### 角色选择决策树

```
任务类型？
├── 业务需求/用户故事 → Lead Product Architect
├── 架构设计/技术选型 → Principal Software Engineer
├── 跨模块协调/技术债 → Technical Director
├── 用户体验/交互/可访问性 → UX Architect
├── SEO/元数据/结构化数据 → SEO Architect
├── 成就/打卡/宠物/分享 → Growth Architect
├── Cloudflare 服务/配额 → Cloudflare Architect
└── 按 spec 实现功能/修 bug → Autonomous Development Agent
```

---

## 2. 文档加载顺序

AI 代理在开始任何任务前 MUST 按以下顺序加载并阅读项目文档。**顺序不可打乱**，因为后续文档依赖前置文档的上下文。

### 2.1 标准加载顺序

```
1. PROJECT.md            ← 项目使命、业务规则、技术栈、权威层级（最高权威）
       ↓
2. AGENTS.md（本文件）   ← AI 代理工作流与质量标准
       ↓
3. BrainVerse-Design/    ← 设计参考（HTML 设计稿 + global.css Design Token）
       ↓
4. context/              ← 架构上下文文档
   ├── 00-project.md     ← 项目背景、目标、范围、利益相关者
   ├── 01-product.md     ← 11 个模块定义、6 款游戏规格、Brain Engine、Growth Engine
   └── 02-architecture.md ← 系统架构、Monorepo 结构、数据流、Cloudflare 服务映射
       ↓
5. specs/                ← 功能规格（按需加载相关 spec）
       ↓
6. docs/                 ← 开发文档（按需加载）
   ├── development.md
   ├── deployment.md
   ├── database.md
   ├── testing.md
   ├── seo.md
   └── i18n.md
       ↓
7. decisions/            ← 架构决策记录（ADR，按需加载）
```

### 2.2 必须首先加载的文档

以下 3 个文档 MUST 在任何任务开始前**首先完整加载**，不得跳过：

| 顺序 | 文档 | 原因 |
|---|---|---|
| 1 | `context/00-project.md` | 理解项目背景与目标，避免脱离业务上下文 |
| 2 | `context/01-product.md` | 理解产品模块与功能边界，避免实现错误功能 |
| 3 | `context/02-architecture.md` | 理解系统架构与约束，避免破坏架构一致性 |

### 2.3 按需加载策略

- **实现具体功能前**：加载 `specs/` 下对应的功能 spec
- **数据库相关任务**：加载 `docs/database.md` + 相关 migration 文件
- **部署相关任务**：加载 `docs/deployment.md`
- **SEO 相关任务**：加载 `docs/seo.md` + `PROJECT.md` 第 13 节
- **i18n 相关任务**：加载 `docs/i18n.md` + `PROJECT.md` 第 7 节
- **涉及设计稿**：加载 `BrainVerse-Design/` 下对应 HTML 文件

### 2.4 文档加载完成确认

加载完必读文档后，AI 代理 MUST 在任务输出的开头确认：

```
[Role: <角色名>]
[Context Loaded: PROJECT.md ✓, AGENTS.md ✓, context/00-project.md ✓, context/01-product.md ✓, context/02-architecture.md ✓]
[Task: <任务描述>]
```

---

## 3. 设计参考使用规则

`BrainVerse-Design/` 目录下的 HTML 设计稿与 `styles/global.css` 是**参考性质**，不是实现规范。AI 代理 MUST 严格遵守以下规则。

### 3.1 核心原则

| 原则 | 说明 |
|---|---|
| **设计稿是参考** | 设计稿用于理解视觉风格、布局意图、交互模式，不是逐像素复刻的契约 |
| **业务逻辑是权威** | 当设计稿与业务需求冲突时，**业务需求胜出** |
| **架构优先于视觉** | 当设计稿与架构约束冲突时，**架构胜出** |
| **Design Token 是契约** | `global.css` 中的 Design Token（颜色、间距、圆角、字体）是视觉契约，MUST 通过 TailwindCSS 配置精确映射 |

### 3.2 冲突处理矩阵

| 冲突场景 | 裁决 | 处理方式 |
|---|---|---|
| 设计稿与业务需求冲突 | **业务需求胜出** | 调整设计实现，在 PR 说明冲突原因 |
| 设计稿与架构约束冲突 | **架构胜出** | 调整设计实现，在 PR 说明冲突原因 |
| 设计稿与技术栈限制冲突 | **技术栈限制胜出** | 寻找技术可行的替代方案 |
| 设计稿与可访问性冲突 | **可访问性胜出** | 设计 MUST 调整以满足 A11y 标准 |
| Design Token 与设计稿冲突 | **Design Token 胜出** | 以 `global.css` 为准 |

### 3.3 严禁的行为

- ❌ **严禁**为追求视觉一致而牺牲业务规则（如把必填字段做成可选以匹配设计稿）
- ❌ **严禁**为匹配设计稿而引入额外依赖（如动画库），除非 spec 明确要求
- ❌ **严禁**直接复制设计稿的 HTML/CSS 到生产代码（设计稿是参考，生产代码 MUST 用 React + TailwindCSS 重写）
- ❌ **严禁**忽略设计稿中的可访问性问题（如对比度不足、缺少 focus 状态）

### 3.4 允许的行为

- ✅ **允许**在设计稿基础上优化可访问性（添加 aria-label、focus 状态、键盘导航）
- ✅ **允许**根据技术栈特性调整布局实现方式（如用 CSS Grid 替代 Flexbox）
- ✅ **允许**在保持视觉风格一致的前提下简化复杂动画
- ✅ **允许**根据响应式需求调整移动端布局（设计稿可能未覆盖所有断点）

### 3.5 Design Token 映射规则

`BrainVerse-Design/styles/global.css` 中的 CSS 自定义属性 MUST 100% 映射到 `apps/web/tailwind.config.ts`：

```typescript
// tailwind.config.ts MUST 精确映射以下 Design Token
colors: {
  primary: '#4A7CFF',     // --color-primary
  secondary: '#50C8A8',   // --color-secondary
  accent: '#FFB14A',      // --color-accent
  dim: {
    memory: '#8B5CF6',
    attention: '#06B6D4',
    reaction: '#FFB14A',
    executive: '#10B981',
    relaxation: '#4A7CFF',
  }
}
```

任何 Design Token 的修改 MUST 同步更新 `tailwind.config.ts`，并通过 PR 审批。

---

## 4. 代码质量要求

BrainVerse 的所有代码 MUST 满足以下 9 项质量要求。PR Review 时 MUST 逐项检查，任一不达标的 PR MUST 被拒绝。

### 4.1 九项质量要求

| # | 要求 | 说明 | 验收标准 |
|---|---|---|---|
| 1 | **Strict TypeScript** | 启用所有严格选项（`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`） | `pnpm typecheck` 零错误 |
| 2 | **No `any`** | 禁止使用 `any` 类型，包括显式与隐式 | ESLint `@typescript-eslint/no-explicit-any` 规则 error |
| 3 | **No Duplicated Logic** | 禁止复制粘贴逻辑；重复逻辑 MUST 抽取为共享函数/组件/ hook | 代码 Review 时人工检查 |
| 4 | **Reusable Components** | 组件 MUST 可复用，props 设计合理，避免 prop 蔓延 | 组件可被至少 2 处调用 |
| 5 | **Accessible UI** | 所有 UI MUST 满足 WCAG 2.1 AA 标准 | 键盘可导航、屏幕阅读器友好、对比度 ≥ 4.5:1 |
| 6 | **Mobile First** | 样式 MUST 以移动端为基准，通过响应式断点扩展到桌面端 | 移动端 (375px) 与桌面端 (1440px) 均无横向滚动 |
| 7 | **SEO Friendly** | 所有公开页面 MUST 包含完整 SEO 元数据（见 PROJECT.md 第 13 节） | Lighthouse SEO 评分 ≥ 90 |
| 8 | **High Performance** | 页面加载性能 MUST 达标 | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| 9 | **Clean Architecture** | 分层清晰：UI / Logic / Data 分离；依赖方向单向（外层依赖内层） | 无循环依赖，无跨层调用 |

### 4.2 代码风格

- **格式化**：使用 Prettier（`semi: false`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `printWidth: 100`）
- **命名约定**：
  - 组件：PascalCase（`GameCard.tsx`）
  - 函数/变量：camelCase（`calculateBrainAge`）
  - 常量：UPPER_SNAKE_CASE（`MAX_STREAK_DAYS`）
  - 类型/接口：PascalCase（`BrainAgeResult`）
  - 文件名：组件 PascalCase，工具函数 camelCase，类型 kebab-case（`brain-age.ts`）
- **导入顺序**：React → 第三方库 → `@brainverse/*` 包 → `@/` 别名 → 相对路径 → 类型导入

### 4.3 注释规则

- **不写废话注释**：好的代码自己说话，仅在复杂逻辑处添加注释
- **PROTECTED SYSTEM 注释**：Brain Engine 公式文件 MUST 保留 `// PROTECTED SYSTEM` 注释
- **TODO 规范**：`// TODO([name]): [description]`，禁止无主 TODO
- **JSDoc**：导出的公共 API 函数 MUST 有 JSDoc 注释

### 4.4 测试要求

- **单元测试**：所有工具函数、纯逻辑、Brain Engine 公式 MUST 有单元测试
- **覆盖率**：核心包（`@brainverse/brain-engine`, `@brainverse/game-engine`）测试覆盖率 MUST ≥ 80%
- **测试框架**：Vitest
- **测试命名**：`describe('UserRepository', () => { it('should find user by email', ...) })`
- **禁止**：禁止写只验证"不报错"的空测试

---

## 5. 开发工作流

BrainVerse AI 代理执行任何开发任务 MUST 遵循以下 **12 步工作流**。任何步骤的跳过 MUST 在 PR 描述中说明原因。

### 工作流步骤

```
Step 1:  Read Documentation       — 阅读相关文档（PROJECT.md / context/ / specs/）
   ↓
Step 2:  Read Specifications      — 阅读功能 spec，理解验收标准
   ↓
Step 3:  Read Architecture        — 阅读 context/02-architecture.md，理解架构约束
   ↓
Step 4:  Read Design References   — 阅读 BrainVerse-Design/ 下相关设计稿
   ↓
Step 5:  Implement                — 实现（写代码，遵循质量要求）
   ↓
Step 6:  Write Tests              — 编写单元测试
   ↓
Step 7:  Run Tests                — 运行测试，确保全部通过
   ↓
Step 8:  Run Type Check           — 运行 pnpm typecheck，确保零错误
   ↓
Step 9:  Build                    — 运行 pnpm build，确保构建成功
   ↓
Step 10: Review                   — 自查 Review Checklist（见第 6 节）
   ↓
Step 11: Commit & Push            — 提交代码（遵循 commit 规范）并推送
   ↓
Step 12: Create PR                — 创建 Pull Request，等待 Review
```

### 部署阶段（PR 合并后）

```
Step 13: Deploy Preview           — 部署到 preview.cowb.cc
   ↓
Step 14: Validate Preview         — 在预览环境验证功能
   ↓
Step 15: Deploy Production        — 部署到 cowb.cc
   ↓
Step 16: Verify Production        — 在生产环境验证功能（路由、SEO、Analytics、本地化、性能、可访问性、移动端、桌面端）
   ↓
Step 17: Update Changelog         — 更新 CHANGELOG.md
   ↓
Step 18: Update Documentation     — 更新相关文档（如有变更）
```

### 工作流执行规则

1. **不得跳过 Step 1–4**：未阅读文档直接实现代码的 PR MUST 被拒绝
2. **测试先行**：复杂逻辑鼓励 TDD（先写测试再实现），但 MVP 阶段不强制
3. **本地验证**：Step 6–9 MUST 在本地全部通过后才能提交
4. **自查必做**：Step 10 自查 MUST 逐项核对 Review Checklist，不能敷衍
5. **小步提交**：单个 PR 控制在 500 行以内（不含测试），大功能拆分为多个 PR

### 紧急修复（Hotfix）工作流

紧急 bug 修复可简化为：

```
Read Context → Fix → Test → Type Check → Build → Review → Commit → PR → Hot Deploy → Verify
```

但 MUST 在 PR 描述中标注 `[HOTFIX]` 并说明紧急原因。

---

## 6. Review Checklist

PR Review 时 MUST 逐项核对以下 **11 项检查清单**。任一不达标的 PR MUST 被拒绝并要求修改。

| # | 检查项 | 验收标准 | 验证方式 |
|---|---|---|---|
| 1 | **Architecture（架构）** | 实现符合 `context/02-architecture.md`；无跨层调用；无循环依赖 | 人工 Review |
| 2 | **Business Rules（业务规则）** | 实现符合 `PROJECT.md` 与 `context/01-product.md`；无业务逻辑偏差 | 人工 Review |
| 3 | **Types（类型）** | Strict TS 通过；无 `any`；无 `@ts-ignore`；类型完整 | `pnpm typecheck` 零错误 |
| 4 | **Testing（测试）** | 新功能有单元测试；测试通过；覆盖率不下降；边界值覆盖 | `pnpm test` 通过 |
| 5 | **Performance（性能）** | LCP < 2.5s；CLS < 0.1；INP < 200ms；无未优化的图片；无阻塞渲染的 JS | Lighthouse 审计 |
| 6 | **Accessibility（可访问性）** | WCAG 2.1 AA；键盘可导航；对比度 ≥ 4.5:1；有 aria-label；有 focus 状态 | axe 工具 + 人工 |
| 7 | **SEO** | Title / Meta Description / Canonical / OpenGraph / Twitter / JSON-LD / Breadcrumbs / Hreflang 齐全 | Lighthouse SEO ≥ 90 |
| 8 | **Localization（本地化）** | 无硬编码文本；所有 UI 文本通过翻译 key；en/zh/ja 三语 key 结构一致 | `grep` 检查硬编码字符串 |
| 9 | **Security（安全）** | 输入验证（Zod）；无 SQL 注入；CORS 配置正确；Turnstile 集成；无敏感信息泄露 | 人工 Review + ESLint |
| 10 | **Documentation（文档）** | 复杂逻辑有注释；公共 API 有 JSDoc；相关文档已更新（如 spec 变更） | 人工 Review |
| 11 | **Deployment（部署）** | `pnpm build` 成功；无新依赖未在 package.json 声明；环境变量已配置 | 本地构建 + 预览部署 |

### Review 流程

1. **自动化检查**：CI 自动运行 Type Check / Test / Build / Lint
2. **人工 Review**：由 Principal Software Engineer 或同等角色逐项核对 Checklist
3. **Review 反馈**：使用 GitHub PR Comments，明确指出问题与修改建议
4. **修改后重审**：作者修改后重新提交，Reviewer 再次核对
5. **合并条件**：所有自动化检查通过 + 人工 Review 通过 + 至少 1 个 Approve

### Review 评语规范

- ✅ `LGTM, good job on the test coverage.`
- ⚠️ `NIT: consider extracting this to a shared util.`
- ❌ `BLOCKER: this hardcodes Chinese text, must use translation key.`
- ❌ `BLOCKER: missing JSON-LD on article page, fails SEO checklist.`

---

## 7. GitHub MCP 工作流

AI 代理使用 GitHub MCP（Model Context Protocol）执行 Git 操作时 MUST 遵循以下工作流。

### 7.1 标准工作流

```
1. Branch（创建分支）
   ↓
2. Implement（实现）
   ↓
3. Test（测试）
   ↓
4. Commit（提交）
   ↓
5. Push（推送）
   ↓
6. Create PR（创建 Pull Request）
   ↓
7. Update Changelog（更新变更日志）
   ↓
8. Update Documentation（更新文档）
```

### 7.2 分支命名规范

| 分支类型 | 命名格式 | 示例 |
|---|---|---|
| Feature | `feat/<scope>-<description>` | `feat/brain-age-assessment` |
| Bug Fix | `fix/<scope>-<description>` | `fix/digit-span-scoring` |
| Hotfix | `hotfix/<scope>-<description>` | `hotfix/auth-redirect` |
| Refactor | `refactor/<scope>-<description>` | `refactor/game-engine-base` |
| Docs | `docs/<description>` | `docs/update-seo-rules` |
| Chore | `chore/<description>` | `chore/update-deps` |

### 7.3 Commit Message 规范

采用 Conventional Commits 格式：

```
<type>(<scope>): <summary>

<body>
```

#### Type 枚举

| Type | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（无功能变化） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `docs` | 文档变更 |
| `chore` | 构建/工具/依赖 |
| `style` | 代码格式（不影响逻辑） |
| `ci` | CI/CD 配置 |

#### Scope 枚举

| Scope | 用途 |
|---|---|
| `web` | 前端应用（apps/web） |
| `api` | 后端 Workers（workers/api） |
| `db` | 数据库迁移 |
| `brain-engine` | Brain Engine 包 |
| `game-engine` | Game Engine 包 |
| `growth-engine` | Growth Engine 包 |
| `content-engine` | Content Engine 包 |
| `ui` | UI 组件包 |
| `shared` | 共享包 |
| `i18n` | 多语言 |
| `seo` | SEO 相关 |
| `auth` | 认证 |
| `docs` | 文档 |

#### Commit Message 示例

```
feat(brain-engine): implement Brain Age formula v1

- Implement core Brain Age calculation based on 5-dimension scores
- Add age normalization with 18-80 range clamping
- Add comprehensive unit tests covering edge cases
- Mark as PROTECTED SYSTEM

What changed: Added calculateBrainAge() function in packages/brain-engine/src/brain-age.ts
Why changed: MVP Phase 3 requires Brain Age Assessment module
Files affected:
  - packages/brain-engine/src/brain-age.ts (new)
  - packages/brain-engine/src/index.ts (export added)
  - packages/brain-engine/tests/brain-age.test.ts (new)
Expected impact: Brain Age Assessment feature can now compute results
Testing performed: 24 unit tests, all passing; edge cases (min/max/empty) covered
```

### 7.4 Commit Body 必需字段

每个 commit 的 body MUST 包含以下 5 个字段（适用于非 trivial 提交）：

```
What changed: <变更内容摘要>
Why changed: <变更原因，关联业务需求或 spec>
Files affected: <影响文件列表>
Expected impact: <预期影响，如功能可用性、性能、兼容性>
Testing performed: <执行的测试，如 unit tests / manual test>
```

### 7.5 PR 创建规范

PR 标题 MUST 与主 commit message 一致。PR 描述 MUST 包含：

```markdown
## Summary
<一句话概述本 PR 做了什么>

## Changes
- <变更点 1>
- <变更点 2>

## Related
- Spec: <spec 文件路径>
- Issue: #<issue 编号>（如有）

## Testing
- [ ] Unit tests pass
- [ ] Type check pass
- [ ] Build success
- [ ] Manual test on preview

## Checklist
- [ ] Architecture compliant
- [ ] No `any` types
- [ ] No hardcoded text
- [ ] SEO metadata complete
- [ ] Accessibility verified
- [ ] Documentation updated
```

### 7.6 禁止的 Git 操作

- ❌ **禁止** `git push --force` 到 `main` 分支
- ❌ **禁止**直接 push 到 `main`（MUST 通过 PR）
- ❌ **禁止** `git commit -m "wip"` 或无意义 commit message
- ❌ **禁止**在 commit 中包含 secrets（.env、credentials）
- ❌ **禁止** `git rebase -i` 交互式操作（AI 代理无法处理交互输入）

---

## 8. Cloudflare MCP 工作流

AI 代理使用 Cloudflare MCP 执行部署操作时 MUST 遵循以下工作流。

### 8.1 部署工作流

```
1. Build（构建）
   - pnpm build
   ↓
2. Type Check（类型检查）
   - pnpm typecheck
   ↓
3. Tests（测试）
   - pnpm test
   ↓
4. Deploy Preview（部署预览）
   - 部署到 preview.cowb.cc
   - 使用 wrangler pages deploy 或 wrangler deploy
   ↓
5. Validate Preview（验证预览）
   - 在 preview.cowb.cc 上手动/自动验证功能
   ↓
6. Deploy Production（部署生产）
   - 部署到 cowb.cc
   - 仅在 PR 合并后执行
   ↓
7. Verify Production（验证生产）
   - 在 cowb.cc 上全面验证（见 8.2 验证清单）
```

### 8.2 生产环境验证清单

部署到 `cowb.cc` 后 MUST 验证以下 8 项：

| # | 验证项 | 验证内容 | 工具 |
|---|---|---|---|
| 1 | **Routing（路由）** | 所有路由可访问；多语言路由 `/en/` `/zh/` `/ja/` 正确；404 页面正常 | 浏览器手动 |
| 2 | **SEO（搜索引擎优化）** | `<title>` / `<meta>` / Canonical / OpenGraph / JSON-LD 齐全；sitemap.xml 可访问 | Lighthouse + View Source |
| 3 | **Analytics（分析）** | Cloudflare Web Analytics beacon 触发；自定义事件上报 | Cloudflare Dashboard |
| 4 | **Localization（本地化）** | 三语切换正常；无硬编码文本；翻译 key 无缺失 | 三语逐页浏览 |
| 5 | **Performance（性能）** | LCP < 2.5s；CLS < 0.1；INP < 200ms | Lighthouse |
| 6 | **Accessibility（可访问性）** | 键盘可导航；屏幕阅读器友好；对比度达标 | axe DevTools |
| 7 | **Mobile（移动端）** | 375px 宽度下无横向滚动；触控目标 ≥ 44px；底部导航正常 | Chrome DevTools 移动模拟 |
| 8 | **Desktop（桌面端）** | 1440px 宽度下布局正常；hover 状态正常 | 浏览器桌面模式 |

### 8.3 部署命令规范

```bash
# 前端部署到预览
wrangler pages deploy apps/web/out --project-name=brainverse --branch=preview

# 前端部署到生产
wrangler pages deploy apps/web/out --project-name=brainverse --branch=main

# Workers API 部署到预览
wrangler deploy --env preview

# Workers API 部署到生产
wrangler deploy --env production

# D1 迁移
wrangler d1 execute brainverse-db --file=workers/api/migrations/0001_init.sql --env production
```

### 8.4 部署安全规则

- **预览优先**：所有变更 MUST 先部署到 `preview.cowb.cc` 验证，通过后才部署生产
- **生产权限**：部署生产 MUST 经过 Principal Software Engineer 确认
- **回滚准备**：部署前 MUST 确认上一版本可回滚（Pages 支持即时回滚到任意历史部署）
- **Migration 顺序**：D1 migration MUST 按序号顺序执行，禁止跳过
- **Secret 管理**：所有 secrets MUST 通过 `wrangler secret put` 设置，禁止硬编码在代码或 wrangler.toml

### 8.5 Cloudflare 免费计划合规检查

每次部署前 MUST 确认：

- ✅ 未使用 Durable Objects / Queues / Vectorize / Workers AI / AI Gateway / Browser Rendering / Cloudflare Images / Stream
- ✅ Workers 请求量在 100K/day 内
- ✅ D1 读取在 5M/day 内，写入在 100K/day 内
- ✅ KV 读取在 100K/day 内，写入在 1K/day 内
- ✅ R2 存储在 10GB 内

---

## 9. 输出格式规范

AI 代理完成任务后 MUST 按以下格式输出任务报告。报告 MUST 包含所有 11 个字段（不适用的标注 N/A）。

### 9.1 标准输出模板

```markdown
## Task Report

### Summary
<一句话概述完成了什么任务>

### Files Created
- `<file_path>` — <文件用途说明>

### Files Updated
- `<file_path>` — <修改内容说明>

### Database Changes
- <表名变更说明，或 N/A>

### API Changes
- <端点变更说明，或 N/A>

### Tests Added
- <测试文件与覆盖场景，或 N/A>

### Analytics Added
- <新增的 Analytics 事件，或 N/A>

### SEO Added
- <新增的 SEO 元数据，或 N/A>

### Deployment Status
- [ ] Preview deployed: <URL or pending>
- [ ] Production deployed: <URL or pending>

### Commit Message
```
<commit message>
```

### Risks
- <已知风险或注意事项，或 None>

### Next Recommended Task
- <建议的下一个任务>
```

### 9.2 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| Summary | ✅ | 一句话总结，便于快速理解 |
| Files Created | ✅ | 新建文件清单，含路径与用途 |
| Files Updated | ✅ | 修改文件清单，含路径与修改内容 |
| Database Changes | ✅ | 涉及的表结构或数据变更，无则 N/A |
| API Changes | ✅ | 新增/修改/删除的 API 端点，无则 N/A |
| Tests Added | ✅ | 新增测试文件与覆盖场景，无则 N/A |
| Analytics Added | ✅ | 新增的 Analytics 事件（见 PROJECT.md 第 17 节），无则 N/A |
| SEO Added | ✅ | 新增的 SEO 元数据（见 PROJECT.md 第 13 节），无则 N/A |
| Deployment Status | ✅ | 部署状态（预览/生产） |
| Commit Message | ✅ | 完整的 commit message（见第 7.3 节格式） |
| Risks | ✅ | 已知风险、注意事项、技术债务，无则 None |
| Next Recommended Task | ✅ | 建议的下一步任务，便于上下文传递 |

### 9.3 输出原则

- **简洁但不遗漏**：每个字段简明扼要，但不省略关键信息
- **路径用绝对路径或仓库相对路径**：便于人类与 AI 代理定位
- **Commit Message 完整**：必须可直接复制执行
- **风险诚实**：不得隐瞒已知风险或潜在问题
- **下一步明确**：Next Recommended Task MUST 是具体可执行的任务，不是模糊建议

---

## 10. 上下文缺失处理规则

当 AI 代理在执行任务时发现关键上下文缺失，MUST **立即停止**并按本节规则请求补充，**严禁猜测或编造**。

### 10.1 核心原则

| 原则 | 说明 |
|---|---|
| **Never Guess（绝不猜测）** | 缺少信息时 MUST 停止，不得基于猜测继续实现 |
| **Never Hallucinate（绝不幻觉）** | 不得编造不存在的 API、库、配置或业务规则 |
| **Never Invent Architecture（绝不发明架构）** | 不得自行设计未在 `context/02-architecture.md` 中定义的架构 |
| **Never Invent Business Rules（绝不明发明业务规则）** | 不得自行发明未在 `PROJECT.md` 或 `context/01-product.md` 中定义的业务规则 |

### 10.2 上下文缺失的典型场景

| 场景 | 触发条件 | 处理方式 |
|---|---|---|
| **Missing Specification（缺失规格）** | 任务涉及的模块在 `specs/` 下没有对应 spec | STOP，请求补充 spec |
| **Missing Design（缺失设计）** | 任务涉及的页面在 `BrainVerse-Design/` 下没有设计稿 | STOP，请求设计稿或声明按通用 UI 实现 |
| **Missing Database Definition（缺失数据库定义）** | 任务涉及的表在 `workers/api/migrations/` 下没有定义 | STOP，请求先创建 migration |
| **Missing API Contract（缺失 API 契约）** | 任务涉及的 API 端点没有明确请求/响应格式 | STOP，请求明确 API 契约 |
| **Missing Translation Key（缺失翻译 key）** | 实现需要的翻译 key 在 i18n JSON 中不存在 | STOP，请求先添加翻译 key |
| **Missing Type Definition（缺失类型定义）** | 任务涉及的数据类型未在 `packages/core` 或 `packages/shared` 中定义 | STOP，请求先定义类型 |

### 10.3 STOP 与 Request 流程

当遇到上下文缺失时，AI 代理 MUST 按以下格式输出：

```markdown
## ⚠️ STOP: Missing Context Detected

### Current Task
<当前任务描述>

### Missing Context Type
- [x] Missing Specification
- [ ] Missing Design
- [ ] Missing Database Definition
- [ ] Missing API Contract
- [ ] Missing Translation Key
- [ ] Missing Type Definition
- [ ] Other: <说明>

### What's Missing
<具体说明缺少什么>

### What I Need
<说明需要补充什么信息才能继续>

### What I've Done So Far
<说明已完成的工作，便于上下文传递>

### Recommended Next Step
<建议的补充上下文的步骤>
```

### 10.4 严禁的行为

- ❌ **严禁**在缺少 spec 的情况下自行"推断"功能需求
- ❌ **严禁**在缺少 API 契约的情况下自行设计响应格式
- ❌ **严禁**在缺少数据库定义的情况下自行添加表或字段
- ❌ **严禁**在缺少类型定义的情况下使用 `any` 临时绕过
- ❌ **严禁**在缺少翻译 key 的情况下硬编码文本临时绕过
- ❌ **严禁**在缺少设计稿的情况下"参考类似页面"自行设计（除非任务明确允许）

### 10.5 允许的临时方案

在以下情况下，AI 代理可以使用明确的临时方案，但 MUST 在输出中标注 `[TEMPORARY]`：

- ✅ 设计稿缺失但任务明确说明"按通用 UI 实现"
- ✅ 翻译 key 缺失但任务明确说明"先用英语占位，后续补翻译"
- ✅ 测试数据缺失但任务明确说明"用 mock 数据"

临时方案 MUST 在后续 PR 中替换为正式实现，技术债务 MUST 记录在 `docs/tech-debt.md`（如存在）或 PR 描述中。

### 10.6 升级机制

当 Autonomous Development Agent 遇到以下情况时 MUST 升级到对应角色：

| 情况 | 升级到 |
|---|---|
| 业务需求不明确 | Lead Product Architect |
| 架构决策需要变更 | Principal Software Engineer |
| 跨模块依赖需要协调 | Technical Director |
| UX 决策需要裁决 | UX Architect |
| SEO 策略需要裁决 | SEO Architect |
| Cloudflare 服务选型需要决策 | Cloudflare Architect |
| Brain Engine 公式需要修改 | Principal Software Engineer（强制审批） |

升级时 MUST 在输出中明确：

```markdown
## ⬆️ Escalation Required

This task requires decision from <Role>.
Reason: <说明为什么需要升级>
Current blocker: <当前阻塞点>
```

---

## 附录：术语表

| 术语 | 说明 |
|---|---|
| **MUST** | 必须执行（RFC 2119） |
| **MUST NOT** | 禁止执行（RFC 2119） |
| **SHOULD** | 强烈建议（RFC 2119） |
| **MAY** | 可选（RFC 2119） |
| **PR** | Pull Request |
| **ADR** | Architecture Decision Record（架构决策记录） |
| **MCP** | Model Context Protocol（模型上下文协议） |
| **A11y** | Accessibility（可访问性） |
| **i18n** | Internationalization（国际化） |
| **l10n** | Localization（本地化） |
| **PROTECTED SYSTEM** | 受保护系统（见 PROJECT.md 第 10 节） |
| **Design Token** | 设计令牌（颜色、间距、字体等视觉契约） |

---

## 附录：文档维护规则

1. **本文档为活文档**：AI 代理工作流的变更 MUST 同步更新本文件
2. **变更通过 PR**：本文件的修改 MUST 通过 Pull Request，经 Principal Software Engineer 审批
3. **与 PROJECT.md 一致**：本文件不得与 `PROJECT.md` 冲突，冲突时以 `PROJECT.md` 为准
4. **版本化**：重大变更 MUST 在文件头部更新版本号与日期

---

**End of AGENTS.md**

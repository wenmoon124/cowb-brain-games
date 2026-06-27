# 开发环境搭建指南

本文档详细说明 BrainVerse 项目（cowb.cc）的本地开发环境搭建流程、代码规范、Git 工作流以及常用开发命令。所有开发者在开始贡献代码前，请完整阅读本指南。

---

## 1. 前置要求

BrainVerse 是基于 pnpm workspace 的 monorepo 项目，开发前请确保本地环境满足以下要求。

### 1.1 必需工具

| 工具 | 最低版本 | 推荐版本 | 说明 |
|---|---|---|---|
| Node.js | >= 20.0.0 | 20.x LTS | 使用 `node -v` 验证；推荐通过 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 管理多版本 |
| pnpm | >= 9.0.0 | 9.x latest | 使用 `pnpm -v` 验证；通过 `npm install -g pnpm` 或 [Corepack](https://nodejs.org/api/corepack.html) 安装 |
| Git | >= 2.30 | latest | 使用 `git --version` 验证 |

### 1.2 推荐工具

- **Visual Studio Code**（推荐 IDE）— 安装以下扩展：
  - ESLint
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
  - Cloudflare Workers Snippets
  - EditorConfig for VS Code
- **Wrangler CLI** — Cloudflare Workers 命令行工具，通过 `pnpm add -g wrangler` 或在 `workers/api` 目录下使用 `pnpm dlx wrangler`
- **SQLite Viewer**（VS Code 扩展）— 用于查看本地 D1 数据库

### 1.3 系统要求

- **操作系统**：Windows 10/11、macOS 12+、Ubuntu 20.04+（需支持 Node.js 20）
- **内存**：至少 8GB RAM（推荐 16GB，Next.js 构建较耗内存）
- **磁盘空间**：至少 5GB 可用空间（含 node_modules、.next、.wrangler 缓存）

### 1.4 Cloudflare 账户

- 注册 [Cloudflare 账户](https://dash.cloudflare.com/sign-up)（免费计划即可）
- 通过 `wrangler login` 完成授权登录
- 确认账户已启用 Workers、Pages、D1、KV、R2 服务

### 1.5 环境验证

```bash
# 验证 Node.js
node -v  # 应输出 v20.x.x

# 验证 pnpm
pnpm -v  # 应输出 9.x.x

# 验证 Git
git --version

# 验证 Wrangler（可选，在 workers/api 目录下）
pnpm dlx wrangler --version
```

---

## 2. 环境搭建步骤

### 2.1 克隆仓库

```bash
git clone https://github.com/<your-org>/brainverse.git
cd brainverse
```

> 若使用 SSH：`git clone git@github.com:<your-org>/brainverse.git`

### 2.2 安装依赖

```bash
pnpm install
```

pnpm 会根据根目录 `pnpm-workspace.yaml` 中定义的 `apps/*`、`packages/*`、`workers/*` 自动链接所有 workspace 包。

依赖安装完成后，`@brainverse/*` 系列内部包会通过 workspace 协议自动建立软链接，无需手动发布。

### 2.3 配置 Workers 本地环境变量

在 `workers/api/` 目录下创建 `.dev.vars` 文件，用于本地开发时注入 Workers 运行时环境变量：

```bash
# workers/api/.dev.vars
# 本地开发环境变量（请勿提交到 Git）

# 应用配置
APP_URL=http://localhost:3000
ENVIRONMENT=development

# Cloudflare Turnstile（本地可使用测试密钥）
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# 其他密钥
SESSION_SECRET=local-development-session-secret-min-32-chars
```

> **安全提示**：`.dev.vars` 已在 `.gitignore` 中忽略，切勿提交到版本控制。Turnstile 测试密钥来自 [Cloudflare 官方文档](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)，仅用于本地开发。

### 2.4 创建本地 D1 数据库

首次开发需要创建本地 D1 数据库。在 `workers/api/` 目录下执行：

```bash
cd workers/api

# 创建本地 D1 数据库（Miniflare 自动管理本地 SQLite 文件）
pnpm dlx wrangler d1 create brainverse-db
```

执行后，Wrangler 会在终端输出类似以下内容：

```toml
[[d1_databases]]
binding = "DB"
database_name = "brainverse-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 你的实际 ID
```

将输出的 `database_id` 填入 `workers/api/wrangler.toml` 对应字段。本地开发时，Miniflare 会在 `.wrangler/state/` 目录下创建 SQLite 文件，无需连接远程数据库。

### 2.5 执行数据库迁移

将初始化迁移应用到本地 D1：

```bash
cd workers/api

# 应用所有未执行的迁移到本地 D1
pnpm dlx wrangler d1 migrations apply brainverse-db --local
```

迁移文件位于 `workers/api/migrations/` 目录，按 `NNNN_description.sql` 命名规范组织。详细流程参见 [database.md](./database.md)。

### 2.6 验证本地服务启动

打开两个终端窗口分别启动前端和 API：

```bash
# 终端 1：启动前端（apps/web）
pnpm dev
# 默认访问 http://localhost:3000

# 终端 2：启动 Workers API（workers/api）
cd workers/api
pnpm dev
# 默认访问 http://localhost:8787
```

或在项目根目录使用一条命令同时启动（依赖 concurrently）：

```bash
pnpm dev
```

访问 `http://localhost:3000/en` 应能看到 BrainVerse 首页；访问 `http://localhost:8787/health` 应返回：

```json
{ "status": "ok", "timestamp": "2026-..." }
```

### 2.7 完整搭建流程一览

```bash
# 1. 克隆
git clone https://github.com/<your-org>/brainverse.git
cd brainverse

# 2. 安装依赖
pnpm install

# 3. 创建 Workers 本地环境变量
cp workers/api/.dev.vars.example workers/api/.dev.vars
# 编辑 .dev.vars 填入实际值

# 4. 创建 D1 数据库并配置 wrangler.toml
cd workers/api
pnpm dlx wrangler d1 create brainverse-db
# 将输出 database_id 填入 wrangler.toml

# 5. 应用迁移
pnpm dlx wrangler d1 migrations apply brainverse-db --local

# 6. 启动开发服务器
cd ..
pnpm dev
```

---

## 3. 代码规范

BrainVerse 采用严格的代码规范以保证代码质量与团队协作一致性。所有规范通过 ESLint、Prettier、TypeScript 编译器自动强制执行。

### 3.1 TypeScript 严格模式

根 `tsconfig.json` 启用以下严格选项：

```jsonc
{
  "compilerOptions": {
    "strict": true,                          // 启用所有严格类型检查
    "noUncheckedIndexedAccess": true,        // 数组/对象索引访问返回 T | undefined
    "exactOptionalPropertyTypes": true,      // 区分 undefined 与可省略属性
    "noImplicitOverride": true,              // 覆写方法必须显式声明 override
    "noPropertyAccessFromIndexSignature": true, // 索引签名属性必须用 [] 访问
    "noFallthroughCasesInSwitch": true,      // switch 必须有 break 或 return
    "noImplicitReturns": true                // 函数所有路径必须返回
  }
}
```

### 3.2 禁止使用 any

- **规则**：`@typescript-eslint/no-explicit-any: error`
- **原则**：禁止显式声明 `any` 类型；如类型不确定，使用 `unknown` 并通过类型守卫收窄
- **例外**：无。如遇第三方库类型缺失，应通过 `declare module` 补充类型声明，而非使用 `any`

```typescript
// ❌ 禁止
function parse(data: any) {
  return data.value
}

// ✅ 正确
function parse(data: unknown): unknown {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value
  }
  throw new Error('Invalid data')
}
```

### 3.3 ESLint 配置

根目录 `.eslintrc.cjs` 关键规则：

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier', // 关闭与 Prettier 冲突的规则
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': 'error', // import type 分离
    'prefer-const': 'error',
    'no-duplicate-imports': 'error',
  },
  ignorePatterns: ['node_modules', 'dist', '.next', '.wrangler', '.mf'],
}
```

### 3.4 Prettier 配置

根目录 `.prettierrc`：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

> 提交前请运行 `pnpm format` 统一格式。

### 3.5 命名约定

| 类型 | 约定 | 示例 |
|---|---|---|
| 文件名（组件） | PascalCase | `GameCard.tsx` |
| 文件名（工具/模块） | kebab-case | `score-engine.ts` |
| 文件名（测试） | 源文件名 + `.test` | `score-engine.test.ts` |
| TypeScript 接口 | PascalCase | `interface GameResult` |
| TypeScript 类型别名 | PascalCase | `type Locale = 'en' \| 'zh' \| 'ja'` |
| 常量 | UPPER_SNAKE_CASE | `const LOCALES = [...]` |
| 变量/函数 | camelCase | `function calculateScore()` |
| React 组件 | PascalCase | `function GameCard()` |
| React Hook | camelCase + `use` 前缀 | `function useGameSession()` |
| CSS 类名 | kebab-case（Tailwind 优先） | `class="game-card"` |
| 数据库表 | snake_case | `brain_age_results` |
| 数据库列 | snake_case | `played_at` |
| API 路由 | kebab-case | `/api/brain-age/calculate` |

### 3.6 Commit 规范

所有提交信息必须遵循 **Conventional Commits** 规范：

```
type(scope): summary

[optional body]

[optional footer]
```

#### type 取值

| type | 含义 | 示例 |
|---|---|---|
| `feat` | 新功能 | `feat(games): add Visual Search game` |
| `fix` | Bug 修复 | `fix(auth): resolve session expiry redirect loop` |
| `docs` | 文档变更 | `docs(database): add migration naming convention` |
| `style` | 代码格式（不影响逻辑） | `style: format with prettier` |
| `refactor` | 重构（无功能变化） | `refactor(core): extract score calculation` |
| `perf` | 性能优化 | `perf(api): add KV cache for leaderboard` |
| `test` | 测试相关 | `test(brain-engine): add percentile tests` |
| `chore` | 构建/工具/依赖 | `chore(deps): upgrade hono to 4.3.0` |
| `ci` | CI 配置 | `ci: add github actions deploy workflow` |
| `revert` | 回滚 | `revert: feat(games): add Visual Search game` |

#### scope 取值

scope 对应 monorepo 中的包或模块：

- `web` — apps/web
- `api` — workers/api
- `shared` / `core` / `brain-engine` / `game-engine` / `growth-engine` / `content-engine` / `ui` — packages/*
- `db` — 数据库迁移
- `i18n` — 多语言
- `seo` — SEO 相关
- `deps` — 依赖升级
- 无 scope — 跨多个模块或项目级变更

#### 示例

```
feat(games): implement Stroop Challenge game logic

- Add StroopChallenge class extending BaseGame
- Implement color-word conflict round generation
- Add adaptive difficulty based on accuracy window
- Wire up score submission to POST /api/scores

Closes #123
```

```
fix(api): handle D1 connection reset in score repository

Retry once on SQLITE_BUSY error before propagating.
Affects: workers/api/src/db/repositories/score-repo.ts
```

---

## 4. Git 工作流

BrainVerse 采用基于 `main` 分支的特性分支工作流（GitHub Flow），保证主线代码始终可部署。

### 4.1 分支模型

```
main（始终可部署到生产环境）
 ├── feature/<scope>-<short-description>   ← 功能开发
 ├── fix/<scope>-<short-description>       ← Bug 修复
 ├── chore/<scope>-<short-description>     ← 工程任务
 ├── docs/<short-description>              ← 文档
 └── hotfix/<short-description>            ← 紧急生产修复
```

#### 分支命名规范

- 全部小写，单词用连字符分隔
- 必须包含 type 前缀和简短描述
- 示例：
  - `feature/games-stroop-challenge`
  - `fix/auth-session-expiry`
  - `chore/deps-upgrade-hono`
  - `docs/database-migration-guide`
  - `hotfix/leaderboard-cache-miss`

### 4.2 工作流步骤

#### Step 1：从 main 创建特性分支

```bash
# 确保 main 最新
git checkout main
git pull origin main

# 创建并切换到新分支
git checkout -b feature/games-stroop-challenge
```

#### Step 2：开发并提交

```bash
# 编写代码...
# 运行检查
pnpm typecheck
pnpm lint
pnpm test

# 暂存具体文件（避免 git add -A）
git add apps/web/components/games/stroop-challenge.tsx
git add packages/game-engine/src/games/stroop.ts

# 提交（使用规范的 commit message）
git commit -m "feat(games): implement Stroop Challenge core logic"
```

> **注意**：每个 commit 应是一个完整的逻辑单元，便于 review 和回滚。避免一个 commit 包含多个不相关变更。

#### Step 3：与 main 同步

开发期间若 main 有更新，使用 rebase 保持线性历史：

```bash
git fetch origin
git rebase origin/main

# 如有冲突，解决后继续
git add <resolved-files>
git rebase --continue
```

#### Step 4：推送到远程

```bash
git push -u origin feature/games-stroop-challenge
```

#### Step 5：创建 Pull Request

在 GitHub 上创建 PR，目标分支为 `main`。PR 描述应包含：

- **What**：本 PR 做了什么
- **Why**：为什么需要这个变更（关联 Issue）
- **How**：实现方式（若非显然）
- **Testing**：如何测试
- **Checklist**：
  - [ ] 通过 `pnpm typecheck`
  - [ ] 通过 `pnpm lint`
  - [ ] 通过 `pnpm test`
  - [ ] 新增测试覆盖新代码
  - [ ] 无硬编码文本（使用 i18n key）
  - [ ] 数据库变更已添加迁移
  - [ ] 文档已更新（如需要）

#### Step 6：代码审查

- 至少需要 1 位审查者 approve（核心模块如 brain-engine 需 2 位）
- 审查者关注点：
  - 架构一致性（是否符合 `context/02-architecture.md`）
  - 业务正确性（是否符合 `PROJECT.md` 业务规则）
  - 类型安全（无 `any`、严格模式通过）
  - 测试覆盖
  - 性能影响（特别是 D1/KV 配额）
  - 可访问性（a11y）
  - SEO 影响
  - 多语言完整性

#### Step 7：合并

- 审查通过后，使用 **Squash and merge** 合并到 main
- 合并后删除特性分支
- main 分支的每次合并都会触发预发布部署到 `preview.cowb.cc`

#### Step 8：清理

```bash
git checkout main
git pull origin main
git branch -d feature/games-stroop-challenge
git push origin --delete feature/games-stroop-challenge
```

### 4.3 紧急修复流程

生产环境出现紧急 Bug 时：

1. 从 `main` 创建 `hotfix/<description>` 分支
2. 修复并提交
3. 创建 PR，标记为紧急
4. 审查通过后合并到 main
5. main 自动部署到生产
6. 如有已发布的 tag，根据需要决定是否发布新版本

### 4.4 禁止行为

- ❌ 禁止直接向 `main` 分支提交
- ❌ 禁止 `git push --force` 到 `main` 分支
- ❌ 禁止跳过代码审查自合并 PR
- ❌ 禁止提交 `.env`、`.dev.vars`、密钥文件
- ❌ 禁止提交 `node_modules`、`.next`、`.wrangler` 等构建产物

---

## 5. 开发命令

根 `package.json` 定义了跨 workspace 的便捷命令，所有命令均通过 pnpm 递归执行。

### 5.1 开发服务器

```bash
# 同时启动前端 + Workers API 开发服务器
pnpm dev

# 仅启动前端（apps/web）
pnpm --filter @brainverse/web dev

# 仅启动 Workers API（workers/api）
pnpm --filter @brainverse/api dev
```

### 5.2 构建

```bash
# 构建所有 workspace 包
pnpm build

# 仅构建前端
pnpm --filter @brainverse/web build

# 仅构建 API
pnpm --filter @brainverse/api build
```

### 5.3 测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 以 watch 模式运行测试
pnpm test:watch

# 仅运行特定包的测试
pnpm --filter @brainverse/brain-engine test
```

详细测试策略见 [testing.md](./testing.md)。

### 5.4 类型检查

```bash
# 对所有 workspace 执行 TypeScript 类型检查
pnpm typecheck

# 仅检查特定包
pnpm --filter @brainverse/api typecheck
```

> `typecheck` 命令使用 `tsc --noEmit`，不产出文件，仅校验类型。

### 5.5 Lint 与格式化

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复可修复的 lint 问题
pnpm lint --fix

# 格式化代码（Prettier）
pnpm format

# 检查格式是否正确（不修改文件，CI 用）
pnpm format:check
```

### 5.6 数据库迁移

```bash
# 应用本地迁移（开发环境）
pnpm db:migrate
# 等价于：cd workers/api && wrangler d1 migrations apply brainverse-db --local

# 应用远程迁移（生产环境，需确认）
pnpm db:migrate:remote
# 等价于：cd workers/api && wrangler d1 migrations apply brainverse-db --remote

# 创建新迁移（需手动创建 SQL 文件，参见 database.md）
# 文件位置：workers/api/migrations/NNNN_description.sql
```

详细迁移流程见 [database.md](./database.md)。

### 5.7 部署

```bash
# 部署前端到 Cloudflare Pages
pnpm deploy:web

# 部署 API 到 Cloudflare Workers
pnpm deploy:api
```

详细部署流程见 [deployment.md](./deployment.md)。

### 5.8 其他实用命令

```bash
# 清理所有构建产物和缓存
pnpm clean

# 重新安装依赖（删除 node_modules 后 install）
pnpm reinstall

# 检查 workspace 包依赖关系
pnpm ls --filter @brainverse/web --depth 1
```

### 5.9 命令速查表

| 命令 | 用途 | 频率 |
|---|---|---|
| `pnpm dev` | 启动开发服务器 | 日常 |
| `pnpm build` | 构建所有包 | 提交前 / CI |
| `pnpm test` | 运行测试 | 提交前 / CI |
| `pnpm typecheck` | 类型检查 | 提交前 / CI |
| `pnpm lint` | ESLint 检查 | 提交前 / CI |
| `pnpm format` | Prettier 格式化 | 提交前 |
| `pnpm db:migrate` | 本地数据库迁移 | 数据库变更时 |

---

## 6. 常见问题

### Q1：`pnpm install` 后某些 `@brainverse/*` 包找不到？

确认 `pnpm-workspace.yaml` 包含所有 workspace 路径：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'workers/*'
```

并确认根 `tsconfig.json` 的 `paths` 别名已正确配置。

### Q2：Workers 本地开发报错 `D1: database not found`？

检查 `workers/api/wrangler.toml` 中 `database_id` 是否已填入实际值。本地开发使用 `--local` 标志，Miniflare 会在 `.wrangler/state/` 创建 SQLite 文件。

### Q3：前端访问 API 出现 CORS 错误？

确认 `workers/api/src/index.ts` 中 CORS 中间件允许 `http://localhost:3000`。本地开发时 `.dev.vars` 中 `APP_URL` 应为 `http://localhost:3000`。

### Q4：如何查看本地 D1 数据库内容？

使用 VS Code 的 SQLite Viewer 扩展打开 `.wrangler/state/v3/d1/miniflare/D1DatabaseObject/<hash>.sqlite` 文件。或使用命令行：

```bash
cd workers/api
pnpm dlx wrangler d1 execute brainverse-db --local --command "SELECT * FROM users LIMIT 10"
```

### Q5：迁移应用失败如何回滚？

D1 迁移是单向的，无内置回滚。如需回滚：

1. 创建新的迁移文件（如 `0005_revert_xxx.sql`），包含反向 SQL
2. 应用新迁移

永远不要手动修改已应用的迁移文件，参见 [database.md](./database.md) 的迁移规范。

---

## 7. 相关文档

- [deployment.md](./deployment.md) — Cloudflare 部署指南
- [database.md](./database.md) — D1 数据库使用指南
- [testing.md](./testing.md) — 测试策略
- [seo.md](./seo.md) — SEO 架构
- [i18n.md](./i18n.md) — 国际化指南
- `../PROJECT.md` — 项目总览与业务规则
- `../AGENTS.md` — AI 开发代理指南

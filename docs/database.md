# D1 数据库指南

本文档详细说明 BrainVerse 项目（cowb.cc）使用 Cloudflare D1 数据库的规范，涵盖 D1 概述、迁移流程、迁移文件命名规范、Repository 模式、类型安全、查询最佳实践以及备份策略。

> **核心原则**：所有数据库 schema 变更必须通过迁移文件，禁止直接修改线上 schema；所有查询通过 Repository 模式封装，禁止在路由层直接执行 SQL。

---

## 1. D1 概述

### 1.1 什么是 D1

Cloudflare D1 是基于 SQLite 的 serverless 数据库，运行在 Cloudflare 边缘网络。D1 提供全球分布式读取、自动备份、零运维的数据库服务，与 Workers 原生集成。

### 1.2 关键特性

| 特性 | 说明 |
|---|---|
| **底层引擎** | SQLite（完整 ACID 事务支持） |
| **部署位置** | Cloudflare 边缘网络（主副本 + 全球读取副本） |
| **访问方式** | Workers 绑定（`env.DB`），无需连接池 |
| **查询语言** | SQL（SQLite 方言） |
| **事务支持** | 支持单数据库事务，不支持跨数据库 |
| **自动备份** | 时间点恢复（PITR），可恢复到过去 30 天任意时间点 |
| **本地开发** | 通过 Miniflare 在本地模拟，无需连接远程数据库 |

### 1.3 免费计划配额

BrainVerse 使用 Cloudflare 免费计划，D1 配额如下：

| 配额项 | 免费计划 | BrainVerse 应对策略 |
|---|---|---|
| **读取行数** | 5,000,000 行/天 | KV 缓存热点数据、内存缓存、避免 N+1 查询 |
| **写入行数** | 100,000 行/天 | 批量写入、异步队列、仅必要写入 |
| **存储空间** | 5 GB | 定期清理过期数据、归档历史数据到 R2 |
| **数据库数量** | 10 个 | 单一生产库 + 预发布库即可 |
| **并发查询** | 1000/分钟 | 控制请求频率、使用 KV 卸载读流量 |

> **配额监控**：在 Cloudflare Dashboard → Workers & Pages → D1 中查看每日用量。当用量达到 80% 时需要告警并优化。

### 1.4 D1 与传统数据库的差异

| 维度 | 传统数据库（PostgreSQL/MySQL） | D1 (SQLite) |
|---|---|---|
| 部署 | 中心化服务器 | 边缘网络分布式 |
| 连接 | 需要连接池 | 无连接（绑定注入） |
| 数据类型 | 丰富（JSONB、ARRAY 等） | 基础类型（INTEGER、TEXT、REAL、BLOB） |
| 布尔值 | 原生 BOOLEAN | 用 INTEGER 0/1 表示 |
| 日期时间 | DATE/TIMESTAMP 类型 | 用 TEXT (ISO 8601) 或 INTEGER (Unix timestamp) 存储 |
| JSON | JSONB 类型 | TEXT 存储 + 应用层解析 |
| 外键 | 强制约束 | 支持但默认关闭，需 `PRAGMA foreign_keys = ON` |
| 索引 | 多种类型 | B-tree 索引 |
| 迁移 | 多种工具（Prisma Migrate、Alembic 等） | Wrangler D1 migrations |

### 1.5 BrainVerse D1 使用约定

基于 SQLite 特性与项目需求，BrainVerse 制定以下约定：

1. **主键**：统一使用 `TEXT` 类型存储 UUID（如 `cuid` 或 `uuid v4`），避免自增 ID 暴露数据规模
2. **时间戳**：统一使用 `TEXT` 存储 ISO 8601 格式字符串（如 `2026-06-25T10:30:00.000Z`）
3. **布尔值**：使用 `INTEGER` 0/1 表示，0 = false，1 = true
4. **JSON 数据**：使用 `TEXT` 存储 JSON 字符串，在 Repository 层序列化/反序列化
5. **外键**：显式定义外键约束，应用层补充数据完整性校验
6. **软删除**：业务关键数据（用户、文章）使用软删除（`deleted_at TEXT` 字段），非关键数据物理删除

---

## 2. 迁移流程

### 2.1 迁移文件位置

所有迁移文件位于 `workers/api/migrations/` 目录：

```
workers/api/migrations/
├── 0001_init.sql
├── 0002_growth.sql
├── 0003_content.sql
├── 0004_admin.sql
└── ...
```

### 2.2 迁移流程原则

1. **所有 schema 变更必须通过迁移文件**——禁止直接在 D1 Dashboard 或通过 `wrangler d1 execute` 修改线上 schema
2. **迁移文件一旦应用，不得修改**——已执行的迁移文件不可变，需要变更请创建新迁移
3. **迁移必须可前向执行**——D1 迁移是单向的，无内置回滚，迁移文件只包含"前进"SQL
4. **迁移必须幂等友好**——使用 `CREATE TABLE IF NOT EXISTS`、`CREATE INDEX IF NOT EXISTS` 等避免重复执行报错
5. **迁移与代码同步部署**——schema 变更的迁移与对应代码变更应在同一个 PR 中

### 2.3 创建新迁移

```bash
cd workers/api

# 1. 确定迁移编号（取现有最大编号 + 1）
ls migrations/  # 查看现有迁移

# 2. 创建迁移文件
# 文件名格式：NNNN_description.sql
# 示例：0005_add_user_avatar.sql
touch migrations/0005_add_user_avatar.sql
```

### 2.4 编写迁移文件

迁移文件示例：

```sql
-- migrations/0005_add_user_avatar.sql
-- Description: Add avatar_url column to users table
-- Author: <developer>
-- Date: 2026-06-25

-- Add avatar_url column (nullable, existing users get NULL)
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Add avatar_updated_at for cache busting
ALTER TABLE users ADD COLUMN avatar_updated_at TEXT;

-- Create index for future avatar queries (if needed)
CREATE INDEX IF NOT EXISTS idx_users_avatar ON users(avatar_url) WHERE avatar_url IS NOT NULL;
```

#### 迁移文件编写规范

1. **文件头部注释**：包含描述、作者、日期
2. **每个语句独立一行**：便于阅读和定位错误
3. **使用 IF NOT EXISTS**：避免幂等性问题
4. **大表 ALTER TABLE 注意**：SQLite 的 `ALTER TABLE` 有限制，复杂变更可能需要"重建表"模式
5. **数据迁移与 schema 迁移分离**：如需数据迁移，建议拆分为两个迁移文件

### 2.5 应用迁移

#### 2.5.1 本地开发环境

```bash
cd workers/api

# 应用所有未执行的迁移到本地 D1
pnpm dlx wrangler d1 migrations apply brainverse-db --local
```

Miniflare 会在 `.wrangler/state/v3/d1/` 目录下维护本地 SQLite 文件与迁移记录表 `d1_migrations`。

#### 2.5.2 预发布环境

```bash
cd workers/api

# 应用迁移到预发布 D1
pnpm dlx wrangler d1 migrations apply brainverse-db --remote --env preview
```

#### 2.5.3 生产环境

```bash
cd workers/api

# ⚠️ 应用迁移到生产 D1
pnpm dlx wrangler d1 migrations apply brainverse-db --remote
```

> **生产迁移流程**：
> 1. 本地测试通过
> 2. 预发布环境验证通过
> 3. 备份生产数据库（见第 7 节）
> 4. 应用迁移
> 5. 立即部署对应代码

### 2.6 查看迁移状态

```bash
cd workers/api

# 查看已应用与未应用的迁移
pnpm dlx wrangler d1 migrations list brainverse-db --remote
```

输出示例：

```
Migrations to be applied:
- 0005_add_user_avatar.sql

Migrations already applied:
- 0001_init.sql
- 0002_growth.sql
- 0003_content.sql
- 0004_admin.sql
```

### 2.7 便捷命令

根 `package.json` 提供便捷命令：

```bash
# 本地迁移
pnpm db:migrate

# 远程迁移（生产）
pnpm db:migrate:remote
```

---

## 3. 迁移文件命名规范

### 3.1 命名格式

```
NNNN_description.sql
```

- **NNNN**：四位数字序号，从 `0001` 开始，单调递增，不足补零
- **description**：简短描述，全小写，单词用下划线分隔（snake_case）
- **.sql**：固定扩展名

### 3.2 命名示例

| 文件名 | 说明 |
|---|---|
| `0001_init.sql` | 初始化所有基础表 |
| `0002_growth.sql` | Growth Engine 相关表（achievements、streaks、brain_pets、challenges） |
| `0003_content.sql` | Content Engine 相关表（articles、article_translations、seo_metadata） |
| `0004_admin.sql` | Admin 相关表（feature_flags、admin_users） |
| `0005_add_user_avatar.sql` | 给 users 表添加 avatar 字段 |
| `0006_add_article_views_index.sql` | 给 articles 表添加视图索引 |
| `0007_create_notifications_table.sql` | 创建通知表 |

### 3.3 编号规则

- **编号必须连续且唯一**：不可跳号、不可重复
- **新迁移编号 = 现有最大编号 + 1**：创建前先检查 `ls migrations/`
- **编号不回收**：即使迁移被废弃，编号也不可重用
- **多开发者协作时**：创建迁移前先 `git pull`，避免编号冲突；如冲突，后提交者调整编号

### 3.4 描述规范

- 使用英文，snake_case
- 描述应清晰表达迁移目的，避免过于抽象
- 好的描述：`add_user_avatar`、`create_notifications_table`、`add_index_on_scores_played_at`
- 差的描述：`update`、`fix`、`misc`

---

## 4. Repository 模式

BrainVerse 采用 Repository 模式封装所有数据库访问，实现数据访问层与业务逻辑层解耦。

### 4.1 架构概览

```
┌─────────────────────────────────────────────────┐
│                  Route Handler                   │
│              (workers/api/src/routes/)           │
└────────────────────┬────────────────────────────┘
                     │ 调用
                     ▼
┌─────────────────────────────────────────────────┐
│                Business Logic                    │
│         (调用 Repository 方法，组合业务)           │
└────────────────────┬────────────────────────────┘
                     │ 调用
                     ▼
┌─────────────────────────────────────────────────┐
│                Repository Layer                  │
│          (workers/api/src/db/repositories/)      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │UserRepo  │ │ScoreRepo │ │ArticleRepo   │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
└────────────────────┬────────────────────────────┘
                     │ D1 query
                     ▼
┌─────────────────────────────────────────────────┐
│                   D1 Database                    │
│                  (env.DB binding)                │
└─────────────────────────────────────────────────┘
```

### 4.2 目录结构

```
workers/api/src/db/
├── types.ts                    # 所有表的 TypeScript 接口
├── database.ts                 # D1Database 包装类（可选）
└── repositories/
    ├── user-repo.ts            # users 表 Repository
    ├── session-repo.ts         # sessions 表 Repository
    ├── game-repo.ts            # games 表 Repository
    ├── score-repo.ts           # scores 表 Repository
    ├── brain-age-repo.ts       # brain_age_results 表 Repository
    ├── achievement-repo.ts     # achievements 表 Repository
    ├── streak-repo.ts          # streaks 表 Repository
    ├── brain-pet-repo.ts       # brain_pets 表 Repository
    ├── challenge-repo.ts       # challenges 表 Repository
    ├── article-repo.ts         # articles + article_translations 表 Repository
    ├── feature-flag-repo.ts    # feature_flags 表 Repository
    └── index.ts                # 导出所有 Repository + 工厂函数
```

### 4.3 Repository 类规范

**核心规则：每张表对应一个 Repository 类**。如果一个 Repository 需要操作多张表（如 `ArticleRepository` 同时操作 `articles` 和 `article_translations`），则在主表 Repository 中注入或组合其他 Repository。

#### 4.3.1 Repository 类模板

```typescript
// workers/api/src/db/repositories/user-repo.ts
import type { D1Database } from '@cloudflare/workers-types'
import type { User, NewUser } from '../types'

export class UserRepository {
  constructor(private readonly db: D1Database) {}

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<User>()

    return result ?? null
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<User>()

    return result ?? null
  }

  /**
   * 创建新用户
   */
  async create(data: NewUser): Promise<User> {
    const id = data.id ?? generateId()
    const now = new Date().toISOString()

    await this.db
      .prepare(
        `INSERT INTO users (id, email, password_hash, nickname, locale, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        data.email,
        data.passwordHash,
        data.nickname,
        data.locale ?? 'en',
        data.role ?? 'user',
        now,
        now
      )
      .run()

    const user = await this.findById(id)
    if (!user) {
      throw new Error('Failed to create user: user not found after insert')
    }
    return user
  }

  /**
   * 更新用户信息
   */
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const sets: string[] = []
    const values: (string | number)[] = []

    if (data.nickname !== undefined) {
      sets.push('nickname = ?')
      values.push(data.nickname)
    }
    if (data.locale !== undefined) {
      sets.push('locale = ?')
      values.push(data.locale)
    }
    if (data.avatar_url !== undefined) {
      sets.push('avatar_url = ?')
      values.push(data.avatar_url)
    }

    if (sets.length === 0) {
      return this.findById(id)
    }

    sets.push('updated_at = ?')
    values.push(new Date().toISOString())
    values.push(id)

    await this.db
      .prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()

    return this.findById(id)
  }
}
```

#### 4.3.2 Repository 方法命名约定

| 方法前缀 | 含义 | 返回值 | 示例 |
|---|---|---|---|
| `find` | 查询单条记录 | `T \| null` | `findById`, `findByEmail` |
| `findAll` | 查询多条记录 | `T[]` | `findAll`, `findByCategory` |
| `count` | 统计数量 | `number` | `countByUser`, `countActive` |
| `create` | 创建记录 | `T` | `create`, `createMany` |
| `update` | 更新记录 | `T \| null` | `update`, `updateStatus` |
| `delete` | 物理删除 | `boolean` | `delete`, `deleteById` |
| `upsert` | 存在则更新，不存在则创建 | `T` | `upsert` |

### 4.4 工厂函数

`workers/api/src/db/repositories/index.ts` 提供工厂函数，统一创建所有 Repository 实例：

```typescript
// workers/api/src/db/repositories/index.ts
import type { D1Database } from '@cloudflare/workers-types'
import { UserRepository } from './user-repo'
import { SessionRepository } from './session-repo'
import { GameRepository } from './game-repo'
import { ScoreRepository } from './score-repo'
import { BrainAgeRepository } from './brain-age-repo'
import { AchievementRepository } from './achievement-repo'
import { StreakRepository } from './streak-repo'
import { BrainPetRepository } from './brain-pet-repo'
import { ChallengeRepository } from './challenge-repo'
import { ArticleRepository } from './article-repo'
import { FeatureFlagRepository } from './feature-flag-repo'

export {
  UserRepository,
  SessionRepository,
  GameRepository,
  ScoreRepository,
  BrainAgeRepository,
  AchievementRepository,
  StreakRepository,
  BrainPetRepository,
  ChallengeRepository,
  ArticleRepository,
  FeatureFlagRepository,
}

export interface Repositories {
  users: UserRepository
  sessions: SessionRepository
  games: GameRepository
  scores: ScoreRepository
  brainAge: BrainAgeRepository
  achievements: AchievementRepository
  streaks: StreakRepository
  brainPets: BrainPetRepository
  challenges: ChallengeRepository
  articles: ArticleRepository
  featureFlags: FeatureFlagRepository
}

/**
 * 创建所有 Repository 实例
 * 在 Route Handler 中通过 c.get('repos') 获取
 */
export function createRepositories(db: D1Database): Repositories {
  return {
    users: new UserRepository(db),
    sessions: new SessionRepository(db),
    games: new GameRepository(db),
    scores: new ScoreRepository(db),
    brainAge: new BrainAgeRepository(db),
    achievements: new AchievementRepository(db),
    streaks: new StreakRepository(db),
    brainPets: new BrainPetRepository(db),
    challenges: new ChallengeRepository(db),
    articles: new ArticleRepository(db),
    featureFlags: new FeatureFlagRepository(db),
  }
}
```

### 4.5 在路由中使用

通过 Hono 中间件将 Repositories 注入到 Context：

```typescript
// workers/api/src/middleware/repositories.ts
import { createMiddleware } from 'hono/factory'
import type { Bindings } from '../types'
import { createRepositories } from '../db/repositories'

export const repositoriesMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: { repos: ReturnType<typeof createRepositories> }
}>(async (c, next) => {
  const repos = createRepositories(c.env.DB)
  c.set('repos', repos)
  await next()
})
```

在路由中使用：

```typescript
// workers/api/src/routes/scores.ts
import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.post('/', async (c) => {
  const repos = c.get('repos')
  const body = await c.req.json()

  const score = await repos.scores.create({
    userId: body.userId,
    gameId: body.gameId,
    score: body.score,
    difficulty: body.difficulty,
    correctCount: body.correctCount,
    wrongCount: body.wrongCount,
    avgReactionMs: body.avgReactionMs,
    roundsPlayed: body.roundsPlayed,
    playedAt: new Date().toISOString(),
  })

  return c.json({ data: score }, 201)
})

app.get('/my', async (c) => {
  const repos = c.get('repos')
  const session = c.get('session')

  const scores = await repos.scores.findByUser(session.userId, { limit: 20 })
  return c.json({ data: scores })
})

export default app
```

---

## 5. 类型安全

### 5.1 类型定义文件

所有表的 TypeScript 接口定义在 `workers/api/src/db/types.ts`，与数据库 schema 一一对应。

### 5.2 类型定义规范

```typescript
// workers/api/src/db/types.ts

// ============ 基础类型 ============

export type Locale = 'en' | 'zh' | 'ja'
export type GameDimension = 'memory' | 'attention' | 'reaction' | 'executive' | 'relaxation'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type UserRole = 'user' | 'admin'

// ============ Users 表 ============

/** 对应 users 表完整记录 */
export interface User {
  id: string
  email: string
  passwordHash: string
  nickname: string
  locale: Locale
  role: UserRole
  avatarUrl: string | null
  avatarUpdatedAt: string | null
  createdAt: string
  updatedAt: string
}

/** 创建用户时的输入（id、时间戳由 Repository 填充） */
export interface NewUser {
  id?: string
  email: string
  passwordHash: string
  nickname: string
  locale?: Locale
  role?: UserRole
}

// ============ Sessions 表 ============

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

export interface NewSession {
  id?: string
  userId: string
  token: string
  expiresAt: string
}

// ============ Games 表 ============

export interface Game {
  id: string
  slug: string
  dimension: GameDimension
  nameKey: string
  descriptionKey: string
  icon: string | null
  isActive: boolean  // D1 INTEGER 0/1，Repository 层转换
  createdAt: string
}

// ============ Scores 表 ============

export interface Score {
  id: string
  userId: string
  gameId: string
  score: number
  difficulty: Difficulty
  correctCount: number
  wrongCount: number
  avgReactionMs: number | null
  roundsPlayed: number
  playedAt: string
}

export interface NewScore {
  id?: string
  userId: string
  gameId: string
  score: number
  difficulty?: Difficulty
  correctCount?: number
  wrongCount?: number
  avgReactionMs?: number | null
  roundsPlayed?: number
  playedAt: string
}

// ============ Brain Age Results 表 ============

export interface BrainAgeResult {
  id: string
  userId: string
  brainAge: number
  dimensionScores: DimensionScores  // JSON 字段，Repository 层序列化/反序列化
  testDate: string
  createdAt: string
}

export interface DimensionScores {
  memory: number
  attention: number
  reaction: number
  executive: number
  relaxation: number
}

// ============ Articles 表 ============

export interface Article {
  id: string
  slug: string
  category: ArticleCategory
  published: boolean
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type ArticleCategory = 'brain-age' | 'memory' | 'attention' | 'focus' | 'relaxation'

export interface ArticleTranslation {
  id: string
  articleId: string
  locale: Locale
  title: string
  metaDescription: string | null
  content: string
  faq: FaqItem[] | null  // JSON 字段
  createdAt: string
  updatedAt: string
}

export interface FaqItem {
  question: string
  answer: string
}
```

### 5.3 类型与 Schema 同步

**核心规则：`types.ts` 中的接口必须与数据库 schema 严格对应**。

- 数据库新增列 → 同步更新对应接口（创建迁移 + 修改 `types.ts` + 修改 Repository）
- 数据库删除列 → 同步移除对应接口字段
- 数据库修改列类型 → 同步修改接口字段类型

#### 同步检查清单（每个涉及数据库的 PR 必须完成）

- [ ] 迁移文件已创建
- [ ] `types.ts` 中接口已更新
- [ ] Repository 中相关方法已更新
- [ ] 受影响的路由已更新
- [ ] 测试已更新并通过

### 5.4 类型安全查询

D1 的 `prepare().first<T>()` 和 `prepare().all<T>()` 支持泛型参数，可将查询结果映射到 TypeScript 接口：

```typescript
// 单行查询，返回 T | null
const user = await db
  .prepare('SELECT * FROM users WHERE id = ?')
  .bind(userId)
  .first<User>()

// 多行查询，返回 { results: T[], success: boolean, meta: ... }
const { results } = await db
  .prepare('SELECT * FROM scores WHERE user_id = ? ORDER BY played_at DESC LIMIT ?')
  .bind(userId, limit)
  .all<Score>()
```

> **注意**：D1 的类型映射是"声明式"的，运行时不会校验。务必确保 SQL 查询的列与接口字段匹配，避免类型与实际数据不符。

### 5.5 Boolean 与 JSON 处理

SQLite 无原生 Boolean 和 JSON 类型，需在 Repository 层转换：

```typescript
// Boolean 转换
export function toBool(value: number | null | undefined): boolean {
  return value === 1
}

export function fromBool(value: boolean): number {
  return value ? 1 : 0
}

// JSON 转换
export function toJson<T>(value: T): string {
  return JSON.stringify(value)
}

export function fromJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}
```

Repository 中使用：

```typescript
async findById(id: string): Promise<Article | null> {
  const row = await this.db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .bind(id)
    .first<ArticleRow>()

  if (!row) return null

  return {
    ...row,
    published: toBool(row.published),
    featured: toBool(row.featured),
  }
}
```

---

## 6. 查询最佳实践

### 6.1 使用 Prepared Statements

所有查询必须使用 `prepare().bind()` 形式，禁止字符串拼接 SQL，防止 SQL 注入：

```typescript
// ✅ 正确：使用 prepared statement
const user = await db
  .prepare('SELECT * FROM users WHERE id = ? AND locale = ?')
  .bind(userId, locale)
  .first<User>()

// ❌ 禁止：字符串拼接 SQL（SQL 注入风险）
const user = await db
  .prepare(`SELECT * FROM users WHERE id = '${userId}'`)
  .first()
```

### 6.2 避免 N+1 查询

N+1 查询是性能杀手，在循环中执行查询会迅速耗尽 D1 配额。

```typescript
// ❌ 禁止：N+1 查询
const users = await repos.users.findAll()
for (const user of users) {
  const scores = await repos.scores.findByUser(user.id)  // 每个用户一次查询
  user.scores = scores
}

// ✅ 正确：批量查询
const users = await repos.users.findAll()
const userIds = users.map(u => u.id)
const allScores = await repos.scores.findByUsers(userIds)  // 一次查询所有

// 在应用层按 userId 分组
const scoresByUser = new Map<string, Score[]>()
for (const score of allScores) {
  const arr = scoresByUser.get(score.userId) ?? []
  arr.push(score)
  scoresByUser.set(score.userId, arr)
}

for (const user of users) {
  user.scores = scoresByUser.get(user.id) ?? []
}
```

#### 批量查询方法实现

```typescript
// workers/api/src/db/repositories/score-repo.ts
export class ScoreRepository {
  // ...

  /**
   * 批量查询多个用户的分数（避免 N+1）
   */
  async findByUsers(userIds: string[], limit = 10): Promise<Score[]> {
    if (userIds.length === 0) return []

    const placeholders = userIds.map(() => '?').join(',')
    const { results } = await this.db
      .prepare(
        `SELECT * FROM scores
         WHERE user_id IN (${placeholders})
         ORDER BY played_at DESC
         LIMIT ?`
      )
      .bind(...userIds, limit * userIds.length)
      .all<Score>()

    return results
  }
}
```

### 6.3 合理使用索引

#### 6.3.1 索引创建原则

- 在 `WHERE`、`JOIN`、`ORDER BY`、`GROUP BY` 频繁使用的列上创建索引
- 在外键列上创建索引（加速 JOIN）
- 避免在低基数列上创建索引（如 `is_active` 只有 0/1 两个值）
- 避免过度索引（每个索引增加写入开销）

#### 6.3.2 BrainVerse 索引清单

初始迁移中已创建的索引：

```sql
-- users 表
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- sessions 表
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- games 表
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

-- scores 表
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_played ON scores(played_at DESC);

-- brain_age_results 表
CREATE INDEX IF NOT EXISTS idx_brain_age_user ON brain_age_results(user_id);

-- achievements 表
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_achievements_unique ON achievements(user_id, achievement_id);

-- challenges 表
CREATE INDEX IF NOT EXISTS idx_challenges_creator ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_target ON challenges(target_id, status);

-- articles 表
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- article_translations 表
CREATE INDEX IF NOT EXISTS idx_article_trans_article ON article_translations(article_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_article_trans_locale ON article_translations(article_id, locale);

-- seo_metadata 表
CREATE INDEX IF NOT EXISTS idx_seo_entity ON seo_metadata(entity_type, entity_id, locale);
```

#### 6.3.3 复合索引顺序

复合索引遵循"最左前缀"原则，将区分度高的列放在前面：

```sql
-- ✅ 正确：user_id 区分度高在前，status 在后
CREATE INDEX idx_challenges_target ON challenges(target_id, status);

-- 查询可以利用此索引：
-- WHERE target_id = ? AND status = ?  ✅ 使用索引
-- WHERE target_id = ?                 ✅ 使用索引（最左前缀）
-- WHERE status = ?                    ❌ 无法使用索引
```

### 6.4 使用 KV 缓存热点数据

D1 读配额有限（5M/天），热点数据应通过 KV 缓存卸载读流量。

#### 6.4.1 缓存策略

| 数据类型 | 缓存策略 | TTL | 失效时机 |
|---|---|---|---|
| **排行榜** | KV 缓存 | 5 分钟 | 定时刷新 |
| **Feature Flags** | KV 缓存 | 1 分钟 | Admin 修改时主动失效 |
| **游戏配置** | KV 缓存 | 1 小时 | 配置变更时主动失效 |
| **文章内容** | KV 缓存 | 10 分钟 | 文章更新时主动失效 |
| **用户 Session** | KV 存储（不缓存） | Session 过期时间 | 登出时删除 |
| **用户个人数据** | 不缓存 | - | 实时查询 D1 |

#### 6.4.2 缓存实现示例

```typescript
// workers/api/src/db/repositories/score-repo.ts
import type { D1Database, KVNamespace } from '@cloudflare/workers-types'

export class ScoreRepository {
  constructor(
    private readonly db: D1Database,
    private readonly cache?: KVNamespace
  ) {}

  /**
   * 获取排行榜（带 KV 缓存）
   */
  async findLeaderboard(gameId: string, limit = 10): Promise<Score[]> {
    const cacheKey = `leaderboard:${gameId}:${limit}`

    // 1. 先查 KV 缓存
    if (this.cache) {
      const cached = await this.cache.get(cacheKey, 'json')
      if (cached) {
        return cached as Score[]
      }
    }

    // 2. 缓存未命中，查询 D1
    const { results } = await this.db
      .prepare(
        `SELECT s.*, u.nickname
         FROM scores s
         JOIN users u ON s.user_id = u.id
         WHERE s.game_id = ?
         ORDER BY s.score DESC
         LIMIT ?`
      )
      .bind(gameId, limit)
      .all<Score>()

    // 3. 写入 KV 缓存（TTL 5 分钟）
    if (this.cache) {
      await this.cache.put(cacheKey, JSON.stringify(results), {
        expirationTtl: 300,
      })
    }

    return results
  }

  /**
   * 提交新分数时失效排行榜缓存
   */
  async create(data: NewScore): Promise<Score> {
    // ... 创建逻辑 ...

    // 失效该游戏的排行榜缓存
    if (this.cache) {
      await this.invalidateLeaderboardCache(data.gameId)
    }

    return score
  }

  private async invalidateLeaderboardCache(gameId: string): Promise<void> {
    if (!this.cache) return
    // KV 无批量删除前缀 API（免费计划），删除已知 key
    await this.cache.delete(`leaderboard:${gameId}:10`)
    await this.cache.delete(`leaderboard:${gameId}:50`)
    await this.cache.delete(`leaderboard:${gameId}:100`)
  }
}
```

### 6.5 查询性能优化

#### 6.5.1 只查询需要的列

```typescript
// ❌ 避免：SELECT *（传输不必要的数据）
const users = await db.prepare('SELECT * FROM users').all()

// ✅ 正确：只查需要的列
const users = await db
  .prepare('SELECT id, nickname, avatar_url FROM users')
  .all()
```

#### 6.5.2 使用 LIMIT

```typescript
// ✅ 始终使用 LIMIT，避免返回过多数据
const recentScores = await db
  .prepare('SELECT * FROM scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 20')
  .bind(userId)
  .all()
```

#### 6.5.3 分页查询

```typescript
async findByUserPaginated(
  userId: string,
  page: number,
  pageSize: number
): Promise<{ data: Score[]; total: number }> {
  const offset = (page - 1) * pageSize

  const [scoresResult, countResult] = await Promise.all([
    this.db
      .prepare(
        `SELECT * FROM scores
         WHERE user_id = ?
         ORDER BY played_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(userId, pageSize, offset)
      .all<Score>(),
    this.db
      .prepare('SELECT COUNT(*) as total FROM scores WHERE user_id = ?')
      .bind(userId)
      .first<{ total: number }>(),
  ])

  return {
    data: scoresResult.results,
    total: countResult?.total ?? 0,
  }
}
```

#### 6.5.4 批量操作使用事务

```typescript
async createMany(scores: NewScore[]): Promise<void> {
  const stmt = this.db.prepare(
    `INSERT INTO scores (id, user_id, game_id, score, difficulty, correct_count, wrong_count, avg_reaction_ms, rounds_played, played_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  // D1 支持 batch 批量执行（单事务）
  await this.db.batch(
    scores.map(s => stmt.bind(
      s.id ?? generateId(),
      s.userId,
      s.gameId,
      s.score,
      s.difficulty ?? 'medium',
      s.correctCount ?? 0,
      s.wrongCount ?? 0,
      s.avgReactionMs ?? null,
      s.roundsPlayed ?? 1,
      s.playedAt
    ))
  )
}
```

### 6.6 避免 D1 不支持的特性

- ❌ 不支持 `RETURNING *`（SQLite 3.35+ 支持但 D1 兼容版本可能不支持，建议插入后单独查询）
- ❌ 不支持存储过程
- ❌ 不支持触发器
- ❌ 不支持视图（建议在应用层实现）
- ⚠️ `ALTER TABLE` 限制：不支持 `DROP COLUMN`（旧版 SQLite），需通过"重建表"模式

---

## 7. 备份策略

### 7.1 备份策略概述

BrainVerse 采用多层备份策略，确保数据安全：

| 备份类型 | 频率 | 保留期 | 存储位置 | 用途 |
|---|---|---|---|---|
| **D1 自动备份** | 持续（PITR） | 30 天 | Cloudflare 内置 | 时间点恢复 |
| **手动全量导出** | 每日 | 30 天 | R2 | 灾难恢复 |
| **内容数据归档** | 每周 | 90 天 | R2 | 文章内容历史版本 |
| **迁移前备份** | 每次迁移前 | 永久 | R2 + GitHub | 迁移回滚 |

### 7.2 D1 自动备份（PITR）

Cloudflare D1 内置时间点恢复（Point-in-Time Recovery），可恢复到过去 30 天内的任意时间点。

```bash
cd workers/api

# 查看可用备份
pnpm dlx wrangler d1 backup list brainverse-db --remote

# 从备份恢复（谨慎操作，会覆盖当前数据）
pnpm dlx wrangler d1 backup restore brainverse-db <backup-id> --remote
```

> **注意**：PITR 恢复会创建新数据库实例，需要更新 `wrangler.toml` 中的 `database_id` 并重新部署 Workers。

### 7.3 手动全量导出（每日）

使用 `wrangler d1 export` 导出整个数据库为 SQL 文件，存储到 R2。

#### 7.3.1 手动导出

```bash
cd workers/api

# 导出远程数据库到本地文件
pnpm dlx wrangler d1 export brainverse-db --remote --output backup-$(date +%Y-%m-%d).sql

# 上传到 R2
pnpm dlx wrangler r2 object put brainverse-storage/backups/$(date +%Y-%m-%d).sql \
  --file backup-$(date +%Y-%m-%d).sql
```

#### 7.3.2 自动化定时备份

通过 GitHub Actions 实现每日自动备份，配置见 [deployment.md](./deployment.md) 第 8.3 节。

备份脚本逻辑：
1. UTC 02:00（北京时间 10:00）触发
2. `wrangler d1 export` 导出远程数据库
3. `wrangler r2 object put` 上传到 R2 `backups/` 目录
4. 文件名含日期（如 `2026-06-25.sql`）
5. 通过 R2 生命周期规则自动删除 30 天前的备份

#### 7.3.3 R2 生命周期规则

在 Cloudflare Dashboard → R2 → brainverse-storage → Settings → Lifecycle rules 中配置：

| 规则 | 前缀 | 操作 | 天数 |
|---|---|---|---|
| 备份保留 | `backups/` | Delete | 30 天后删除 |
| 内容归档 | `archive/` | Delete | 90 天后删除 |

### 7.4 内容数据归档（每周）

文章内容是 BrainVerse 的核心资产，需独立归档。

```bash
cd workers/api

# 导出文章相关数据
pnpm dlx wrangler d1 execute brainverse-db --remote \
  --command "SELECT * FROM articles" --output articles.json

pnpm dlx wrangler d1 execute brainverse-db --remote \
  --command "SELECT * FROM article_translations" --output article_translations.json

pnpm dlx wrangler d1 execute brainverse-db --remote \
  --command "SELECT * FROM seo_metadata WHERE entity_type = 'article'" --output seo_metadata.json

# 打包并上传到 R2
tar -czf content-archive-$(date +%Y-%m-%d).tar.gz articles.json article_translations.json seo_metadata.json

pnpm dlx wrangler r2 object put brainverse-storage/archive/content-$(date +%Y-%m-%d).tar.gz \
  --file content-archive-$(date +%Y-%m-%d).tar.gz
```

### 7.5 迁移前备份

每次应用生产迁移前，必须执行全量备份：

```bash
cd workers/api

# 1. 迁移前备份
pnpm dlx wrangler d1 export brainverse-db --remote \
  --output pre-migration-$(date +%Y-%m-%d-%H%M).sql

# 2. 上传到 R2（永久保留）
pnpm dlx wrangler r2 object put \
  brainverse-storage/backups/migrations/pre-migration-$(date +%Y-%m-%d-%H%M).sql \
  --file pre-migration-$(date +%Y-%m-%d-%H%M).sql

# 3. 同时提交到 Git（可选，作为版本记录）
mkdir -p workers/api/backups
cp pre-migration-*.sql workers/api/backups/
git add workers/api/backups/
git commit -m "chore(db): backup before migration 0006"
```

### 7.6 恢复流程

#### 7.6.1 从 SQL 文件恢复

```bash
cd workers/api

# 1. 创建新数据库（或在测试环境恢复）
pnpm dlx wrangler d1 create brainverse-restore

# 2. 应用备份 SQL
pnpm dlx wrangler d1 execute brainverse-restore --remote \
  --file backup-2026-06-25.sql

# 3. 更新 wrangler.toml 指向新数据库（如需切换）
# 4. 部署 Workers
```

#### 7.6.2 从 R2 下载备份

```bash
cd workers/api

# 从 R2 下载备份文件
pnpm dlx wrangler r2 object get brainverse-storage/backups/2026-06-25.sql \
  --file backup-2026-06-25.sql
```

### 7.7 备份验证

定期验证备份可用性（建议每月一次）：

1. 从 R2 下载最近一份备份
2. 在测试环境恢复
3. 验证数据完整性（记录数、关键字段）
4. 记录验证结果

> **重要**：未经验证的备份等于没有备份。备份策略的有效性需通过恢复测试验证。

---

## 8. 数据库表清单

BrainVerse 初始迁移创建以下表（详细 schema 见迁移文件）：

### 8.1 基础表（0001_init.sql）

| 表名 | 用途 | 关键列 |
|---|---|---|
| `users` | 用户账户 | id, email, password_hash, nickname, locale, role |
| `sessions` | 用户会话 | id, user_id, token, expires_at |
| `games` | 游戏配置 | id, slug, dimension, name_key, description_key |
| `scores` | 游戏分数 | id, user_id, game_id, score, difficulty, played_at |
| `brain_age_results` | Brain Age 测试结果 | id, user_id, brain_age, dimension_scores, test_date |

### 8.2 Growth 表（0002_growth.sql）

| 表名 | 用途 | 关键列 |
|---|---|---|
| `achievements` | 用户成就 | id, user_id, achievement_id, unlocked_at |
| `streaks` | 连续训练记录 | id, user_id, current_streak, longest_streak, last_active_date |
| `brain_pets` | 脑力宠物 | id, user_id, pet_type, pet_name, stage, xp, level |
| `challenges` | 用户挑战 | id, creator_id, target_id, game_id, target_score, status |

### 8.3 Content 表（0003_content.sql）

| 表名 | 用途 | 关键列 |
|---|---|---|
| `articles` | 文章主表 | id, slug, category, published, featured |
| `article_translations` | 文章翻译 | id, article_id, locale, title, content, faq |
| `seo_metadata` | SEO 元数据 | id, entity_type, entity_id, locale, title, json_ld |

### 8.4 Admin 表（0004_admin.sql）

| 表名 | 用途 | 关键列 |
|---|---|---|
| `feature_flags` | 功能开关 | id, key, label, description, enabled |
| `admin_users` | 管理员用户 | id, user_id, role, permissions |

---

## 9. 相关文档

- [development.md](./development.md) — 开发环境搭建（含本地 D1 配置）
- [deployment.md](./deployment.md) — 部署指南（含迁移应用与备份自动化）
- [testing.md](./testing.md) — 测试策略（含 D1 Mock）
- [Cloudflare D1 官方文档](https://developers.cloudflare.com/d1/)
- [Wrangler D1 命令参考](https://developers.cloudflare.com/d1/wrangler-commands/)
- [SQLite 语法参考](https://www.sqlite.org/lang.html)

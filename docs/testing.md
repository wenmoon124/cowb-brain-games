# 测试策略指南

本文档详细说明 BrainVerse 项目（cowb.cc）的测试策略，涵盖测试策略概述、Vitest 配置、覆盖率要求、测试文件组织、测试命令以及 Mock 策略。

> **核心原则**：测试是代码质量的保障，不是负担。所有代码变更必须包含相应测试，PR 合并前必须通过全部测试。

---

## 1. 测试策略概述

BrainVerse 采用分层测试策略，针对 monorepo 的不同层级采用不同的测试类型与工具，平衡测试覆盖度与执行效率。

### 1.1 测试金字塔

```
                    ┌───────────┐
                    │    E2E    │  ← 少量（关键用户流程）
                    │   Tests   │
                    └─────┬─────┘
                          │
              ┌───────────┴───────────┐
              │   Integration Tests    │  ← 中等（API 端到端）
              │   (Workers API)        │
              └───────────┬───────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │        Component Tests             │  ← 中等（React 组件）
        │        (apps/web)                  │
        └─────────────────┬─────────────────┘
                          │
┌─────────────────────────┴─────────────────┐
│              Unit Tests                    │  ← 大量（业务逻辑）
│  (packages/core, brain-engine, ...)        │
└─────────────────────────────────────────────┘
```

### 1.2 测试类型与适用范围

| 测试类型 | 适用范围 | 工具 | 运行环境 | 目的 |
|---|---|---|---|---|
| **Unit Tests（单元测试）** | `packages/*` 所有包 | Vitest | Node.js | 验证独立函数/类的逻辑正确性 |
| **Integration Tests（集成测试）** | `workers/api` 路由 | Vitest + @cloudflare/vitest-pool-workers | Miniflare | 验证 API 端到端流程（含 D1/KV/R2） |
| **Component Tests（组件测试）** | `apps/web` React 组件 | Vitest + jsdom + Testing Library | jsdom | 验证组件渲染与交互 |
| **E2E Tests（端到端测试）** | 关键用户流程 | Playwright（未来引入） | 浏览器 | 验证完整用户旅程 |

### 1.3 测试优先级

1. **核心业务逻辑**优先：`packages/brain-engine`（Brain Age 计算、评分公式）、`packages/game-engine`（游戏逻辑、自适应难度）
2. **数据完整性**优先：`workers/api` 的 Repository 层（CRUD 正确性）、认证流程
3. **用户体验关键路径**优先：游戏流程、Brain Age 评估、Dashboard 数据展示
4. **SEO 与 i18n**优先：元数据生成、翻译完整性

### 1.4 测试编写原则

- **AAA 模式**：Arrange（准备）→ Act（执行）→ Assert（断言）
- **单一职责**：每个测试只验证一个行为
- **独立可重复**：测试之间无依赖，可任意顺序执行
- **快速反馈**：单元测试单次执行 < 10 秒
- **命名清晰**：测试名描述被测行为与预期结果
- **避免测试实现细节**：测试公共 API 行为，而非内部实现

---

## 2. Vitest 配置

BrainVerse 使用 [Vitest](https://vitest.dev/) 作为统一测试框架，覆盖所有测试类型。

### 2.1 根目录配置

根目录 `vitest.config.ts` 配置 workspace 级别的通用选项：

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: true,                    // 启用全局 API（describe、it、expect）
    environment: 'node',              // 默认环境（packages/*）
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.next', '.wrangler', '.mf'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        '.next/**',
        '.wrangler/**',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        'apps/web/**/__tests__/**',  // 测试辅助文件
      ],
    },
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@brainverse/shared': path.resolve(__dirname, 'packages/shared/src'),
      '@brainverse/core': path.resolve(__dirname, 'packages/core/src'),
      '@brainverse/brain-engine': path.resolve(__dirname, 'packages/brain-engine/src'),
      '@brainverse/game-engine': path.resolve(__dirname, 'packages/game-engine/src'),
      '@brainverse/growth-engine': path.resolve(__dirname, 'packages/growth-engine/src'),
      '@brainverse/content-engine': path.resolve(__dirname, 'packages/content-engine/src'),
      '@brainverse/ui': path.resolve(__dirname, 'packages/ui/src'),
    },
  },
})
```

### 2.2 根 setup 文件

```typescript
// vitest.setup.ts
import { afterEach, vi } from 'vitest'

// 每个测试后清理 mock
afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})
```

### 2.3 Workers API 测试配置（@cloudflare/vitest-pool-workers）

Workers API 测试需要模拟 Cloudflare 运行时环境，使用 `@cloudflare/vitest-pool-workers` 在 Miniflare 中运行测试。

```typescript
// workers/api/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          d1Databases: ['DB'],
          kvNamespaces: ['SESSIONS', 'CACHE'],
          r2Buckets: ['STORAGE'],
        },
      },
    },
    include: ['src/**/*.test.ts'],
    environment: 'miniflare',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

#### Workers 测试 setup 文件

```typescript
// workers/api/src/test/setup.ts
import { env, SELF } from 'cloudflare:test'
import { beforeAll, beforeEach } from 'vitest'

// 测试环境可访问 env（包含 D1、KV、R2 绑定）和 SELF（Workers 入口）
beforeAll(async () => {
  // 应用迁移到测试 D1
  // 可通过执行迁移 SQL 文件实现
})

beforeEach(async () => {
  // 每个测试前清理数据库
  await env.DB.exec('DELETE FROM scores;')
  await env.DB.exec('DELETE FROM sessions;')
  await env.DB.exec('DELETE FROM users;')
  // 清理 KV
  for (const key of await env.SESSIONS.list()) {
    await env.SESSIONS.delete(key.name)
  }
})
```

#### Workers 测试示例

```typescript
// workers/api/src/routes/health.test.ts
import { describe, it, expect } from 'vitest'
import { env, SELF } from 'cloudflare:test'

describe('GET /health', () => {
  it('should return status ok', async () => {
    const response = await SELF.fetch('https://api.cowb.cc/health')
    expect(response.status).toBe(200)

    const body = await response.json<{ status: string; timestamp: string }>()
    expect(body.status).toBe('ok')
    expect(body.timestamp).toBeTruthy()
  })
})

describe('POST /api/scores', () => {
  it('should create a score for authenticated user', async () => {
    // 1. 创建测试用户与 session
    await env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, nickname, locale, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind('user-1', 'test@cowb.cc', 'hash', 'Tester', 'en', 'user', '2026-01-01', '2026-01-01').run()

    // 2. 调用 API（带 session cookie）
    const response = await SELF.fetch('https://api.cowb.cc/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'session=test-session-token',
      },
      body: JSON.stringify({
        gameId: 'game-1',
        score: 1000,
        difficulty: 'medium',
        correctCount: 8,
        wrongCount: 2,
        avgReactionMs: 450,
        roundsPlayed: 10,
      }),
    })

    expect(response.status).toBe(201)
    const body = await response.json<{ data: { id: string; score: number } }>()
    expect(body.data.score).toBe(1000)

    // 3. 验证数据库写入
    const dbRecord = await env.DB.prepare('SELECT * FROM scores WHERE id = ?')
      .bind(body.data.id)
      .first<{ score: number; user_id: string }>()
    expect(dbRecord?.score).toBe(1000)
    expect(dbRecord?.user_id).toBe('user-1')
  })
})
```

### 2.4 组件测试配置（jsdom）

`apps/web` 的 React 组件测试使用 jsdom 环境。

```typescript
// apps/web/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,  // 处理 CSS import
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@brainverse/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@brainverse/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
})
```

#### 组件测试 setup

```typescript
// apps/web/src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个测试后清理 DOM
afterEach(() => {
  cleanup()
})

// Mock next/navigation（如需要）
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-intl 或 next-i18n-router
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))
```

#### 组件测试示例

```typescript
// apps/web/src/components/ui/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Click</Button>)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>
    )

    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should apply variant classes', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-primary')
  })
})
```

---

## 3. 覆盖率要求

### 3.1 覆盖率门槛

BrainVerse 对不同模块设定差异化覆盖率门槛，核心业务逻辑要求更高覆盖率：

| 模块 | 行覆盖率 | 分支覆盖率 | 函数覆盖率 | 说明 |
|---|---|---|---|---|
| `packages/core` | 80% | 75% | 80% | 核心领域模型，必须高覆盖 |
| `packages/brain-engine` | 80% | 75% | 80% | Brain Age 等核心计算，受保护系统 |
| `packages/game-engine` | 80% | 75% | 80% | 游戏逻辑核心 |
| `packages/growth-engine` | 70% | 65% | 70% | 成长系统逻辑 |
| `packages/content-engine` | 70% | 65% | 70% | 内容引擎 |
| `packages/shared` | 70% | 65% | 70% | 共享工具 |
| `packages/ui` | 60% | 55% | 60% | UI 组件（视觉测试为主） |
| `workers/api` | 70% | 65% | 70% | API 路由与 Repository |
| `apps/web` | 60% | 55% | 60% | 前端页面与组件 |

### 3.2 覆盖率配置

在 CI 中强制覆盖率门槛：

```yaml
# .github/workflows/test.yml（CI 配置片段）
- name: Run tests with coverage
  run: pnpm test:coverage

- name: Check coverage thresholds
  run: |
    pnpm --filter @brainverse/brain-engine test:coverage -- --coverage.thresholds.lines=80
    pnpm --filter @brainverse/game-engine test:coverage -- --coverage.thresholds.lines=80
    pnpm --filter @brainverse/core test:coverage -- --coverage.thresholds.lines=80
```

或在 `vitest.config.ts` 中配置：

```typescript
// packages/brain-engine/vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
    },
  },
})
```

### 3.3 覆盖率报告

运行 `pnpm test:coverage` 后，覆盖率报告生成在 `coverage/` 目录：

- `coverage/index.html` — 可视化报告（浏览器打开）
- `coverage/lcov.info` — CI 集成用（如 Coveralls、Codecov）
- `coverage/coverage-final.json` — 机器可读格式

### 3.4 覆盖率注意事项

> **重要**：高覆盖率不等于高质量。覆盖率仅衡量"代码被测试执行过"，不衡量"测试是否验证了正确行为"。

- ❌ 不要为追求覆盖率写无意义的断言
- ❌ 不要只测试 happy path，必须覆盖边界与错误场景
- ✅ 关注分支覆盖（branch coverage）而非仅行覆盖
- ✅ 重点关注核心逻辑的覆盖率（brain-engine、game-engine）
- ✅ 在 PR 中审查新增代码的覆盖率，确保新代码有测试

---

## 4. 测试文件组织

### 4.1 就近放置原则

BrainVerse 采用**测试文件与源文件同目录**的组织方式（co-location）：

```
packages/game-engine/src/
├── score-engine.ts          ← 源文件
├── score-engine.test.ts     ← 测试文件（同名 + .test）
├── adaptive-difficulty.ts
├── adaptive-difficulty.test.ts
├── base-game.ts
├── base-game.test.ts
└── index.ts                 ← 导出文件，通常不测试
```

### 4.2 命名规范

| 源文件 | 测试文件 |
|---|---|
| `score-engine.ts` | `score-engine.test.ts` |
| `BrainAgeCalculator.ts` | `BrainAgeCalculator.test.ts` |
| `user-repo.ts` | `user-repo.test.ts` |
| `Button.tsx` | `Button.test.tsx` |
| `useGameSession.ts` | `useGameSession.test.ts` |

> **规则**：测试文件名 = 源文件名 + `.test` + 原扩展名。

### 4.3 测试目录结构（特殊情况）

对于测试辅助文件（fixtures、helpers、mocks），使用 `__tests__` 目录：

```
apps/web/src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── ...
│   └── __tests__/
│       ├── fixtures.ts       ← 测试数据 fixtures
│       └── helpers.tsx       ← 渲染辅助函数
└── lib/
    ├── utils.ts
    └── utils.test.ts
```

### 4.4 测试文件结构

单个测试文件内部组织遵循以下结构：

```typescript
// score-engine.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ScoreEngine } from './score-engine'
import type { GameRound } from './types'

describe('ScoreEngine', () => {
  let engine: ScoreEngine

  beforeEach(() => {
    engine = new ScoreEngine()
  })

  describe('calculateScore', () => {
    it('should return correct score for perfect round', () => {
      // Arrange
      const rounds: GameRound[] = [
        { correct: true, reactionMs: 300, difficulty: 1 },
      ]
      // Act
      const result = engine.calculateScore(rounds)
      // Assert
      expect(result).toBe(100)
    })

    it('should return zero score for wrong answer', () => {
      const rounds: GameRound[] = [
        { correct: false, reactionMs: 300, difficulty: 1 },
      ]
      const result = engine.calculateScore(rounds)
      expect(result).toBe(0)
    })

    it('should apply difficulty multiplier', () => {
      const easyRounds = [{ correct: true, reactionMs: 300, difficulty: 1 }]
      const hardRounds = [{ correct: true, reactionMs: 300, difficulty: 3 }]

      const easyScore = engine.calculateScore(easyRounds)
      const hardScore = engine.calculateScore(hardRounds)

      expect(hardScore).toBeGreaterThan(easyScore)
    })

    it('should throw error for empty rounds', () => {
      expect(() => engine.calculateScore([])).toThrow('Rounds cannot be empty')
    })
  })

  describe('calculateAccuracy', () => {
    // ... accuracy 相关测试
  })
})
```

### 4.5 describe / it 组织原则

- 每个 `describe` 块对应一个类或函数
- 嵌套 `describe` 按方法或行为分组
- `it` 描述应读作完整句子："should [expected behavior] when [condition]"
- 使用 `beforeEach` 共享 setup，避免在每个 `it` 中重复

---

## 5. 测试命令

### 5.1 根目录命令

```bash
# 运行所有 workspace 的测试
pnpm test

# 运行所有测试并生成覆盖率报告
pnpm test:coverage

# 以 watch 模式运行（开发时实时反馈）
pnpm test:watch

# 运行特定 workspace 的测试
pnpm --filter @brainverse/brain-engine test
pnpm --filter @brainverse/api test
pnpm --filter @brainverse/web test
```

### 5.2 Vitest 原生命令

```bash
# 运行匹配文件名的测试
pnpm test -- score-engine

# 运行匹配 describe/it 名称的测试
pnpm test -- -t "should return correct score"

# 仅运行变更相关的测试
pnpm test:watch -- --changed

# UI 模式（可视化测试面板）
pnpm test:ui
```

### 5.3 各 workspace 测试命令

各 workspace 的 `package.json` 定义本地测试命令：

```json
// packages/brain-engine/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

```json
// workers/api/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 5.4 CI 中的测试命令

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test:coverage
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```

### 5.5 命令速查表

| 命令 | 用途 | 使用场景 |
|---|---|---|
| `pnpm test` | 运行所有测试 | 提交前 / CI |
| `pnpm test:coverage` | 测试 + 覆盖率 | CI / 定期检查 |
| `pnpm test:watch` | watch 模式 | 开发时实时反馈 |
| `pnpm --filter <pkg> test` | 单包测试 | 调试特定包 |
| `pnpm test -- <pattern>` | 匹配测试 | 调试特定测试 |

---

## 6. Mock 策略

BrainVerse 针对不同的外部依赖采用不同的 Mock 策略，确保测试既快速又真实。

### 6.1 Mock 策略总览

| 依赖 | Mock 方式 | 工具 | 适用测试类型 |
|---|---|---|---|
| **D1 Database** | Miniflare 模拟 | @cloudflare/vitest-pool-workers | Workers 集成测试 |
| **KV Namespace** | Miniflare 模拟 | @cloudflare/vitest-pool-workers | Workers 集成测试 |
| **R2 Bucket** | 本地文件系统模拟 | Miniflare | Workers 集成测试 |
| **外部 API** | Vitest mock | vitest `vi.mock` | 单元测试 |
| **next/navigation** | Vitest mock | vitest `vi.mock` | 组件测试 |
| **next-intl** | Vitest mock | vitest `vi.mock` | 组件测试 |
| **Date / Math.random** | Vitest mock | vitest `vi.useFakeTimers` | 单元测试 |

### 6.2 Mock D1（Miniflare）

Workers API 集成测试通过 `@cloudflare/vitest-pool-workers` 使用 Miniflare 模拟 D1，提供真实的 SQLite 行为，无需手动 mock。

#### 6.2.1 测试中访问 D1

```typescript
// workers/api/src/db/repositories/user-repo.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { env } from 'cloudflare:test'
import { UserRepository } from './user-repo'

describe('UserRepository', () => {
  let repo: UserRepository

  beforeEach(async () => {
    repo = new UserRepository(env.DB)
    // 清理测试数据
    await env.DB.exec('DELETE FROM users;')
  })

  it('should create and find user by id', async () => {
    const user = await repo.create({
      email: 'test@cowb.cc',
      passwordHash: 'hashed-password',
      nickname: 'Tester',
    })

    const found = await repo.findById(user.id)
    expect(found).not.toBeNull()
    expect(found?.email).toBe('test@cowb.cc')
    expect(found?.nickname).toBe('Tester')
  })

  it('should find user by email', async () => {
    await repo.create({
      email: 'unique@cowb.cc',
      passwordHash: 'hash',
      nickname: 'Unique',
    })

    const found = await repo.findByEmail('unique@cowb.cc')
    expect(found).not.toBeNull()
    expect(found?.nickname).toBe('Unique')
  })

  it('should return null for non-existent user', async () => {
    const found = await repo.findById('non-existent-id')
    expect(found).toBeNull()
  })
})
```

#### 6.2.2 应用迁移到测试 D1

测试 D1 需要先应用迁移创建表结构。在 setup 中执行：

```typescript
// workers/api/src/test/setup.ts
import { env } from 'cloudflare:test'
import { beforeAll } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

beforeAll(async () => {
  // 读取并执行所有迁移文件
  const migrationsDir = join(__dirname, '../../../migrations')
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf-8')
    // D1 的 exec 可执行多条 SQL
    await env.DB.exec(sql)
  }
})
```

### 6.3 Mock KV（Miniflare）

KV 同样通过 Miniflare 模拟，提供真实的 KV 行为：

```typescript
// workers/api/src/middleware/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { env } from 'cloudflare:test'

describe('Auth middleware', () => {
  beforeEach(async () => {
    // 清理 KV
    const list = await env.SESSIONS.list()
    for (const key of list.keys) {
      await env.SESSIONS.delete(key.name)
    }
  })

  it('should validate session from KV', async () => {
    // 在 KV 中写入测试 session
    await env.SESSIONS.put('session:valid-token', JSON.stringify({
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }))

    // 调用需要认证的 API
    const response = await SELF.fetch('https://api.cowb.cc/api/scores/my', {
      headers: { Cookie: 'session=valid-token' },
    })

    expect(response.status).toBe(200)
  })

  it('should reject expired session', async () => {
    await env.SESSIONS.put('session:expired-token', JSON.stringify({
      userId: 'user-1',
      expiresAt: new Date(Date.now() - 86400000).toISOString(), // 已过期
    }))

    const response = await SELF.fetch('https://api.cowb.cc/api/scores/my', {
      headers: { Cookie: 'session=expired-token' },
    })

    expect(response.status).toBe(401)
  })
})
```

### 6.4 Mock R2（Miniflare 本地文件系统）

R2 通过 Miniflare 模拟，底层使用本地文件系统存储：

```typescript
// workers/api/src/routes/upload.test.ts
import { describe, it, expect } from 'vitest'
import { env } from 'cloudflare:test'

describe('POST /api/upload', () => {
  it('should upload file to R2', async () => {
    const response = await SELF.fetch('https://api.cowb.cc/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'image/png' },
      body: Buffer.from('fake-png-data'),
    })

    expect(response.status).toBe(201)
    const body = await response.json<{ url: string }>()

    // 验证 R2 中存在文件
    const key = body.url.split('/').pop()
    const object = await env.STORAGE.get(`avatars/${key}`)
    expect(object).not.toBeNull()

    const text = await object!.text()
    expect(text).toBe('fake-png-data')
  })
})
```

### 6.5 单元测试中的 Mock（Vitest）

对于纯单元测试（不依赖 Cloudflare 运行时），使用 Vitest 的 `vi.mock` 替换外部依赖：

#### 6.5.1 Mock 模块

```typescript
// packages/growth-engine/src/streaks.test.ts
import { describe, it, expect, vi } from 'vitest'
import { calculateStreak } from './streaks'

// Mock 日期相关函数
vi.mock('./date-utils', () => ({
  getTodayString: () => '2026-06-25',
  getDaysBetween: vi.fn((start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime()
    return Math.floor(diff / 86400000)
  }),
}))

describe('calculateStreak', () => {
  it('should increment streak for consecutive day', () => {
    const result = calculateStreak({
      currentStreak: 5,
      lastActiveDate: '2026-06-24',
    })
    expect(result.currentStreak).toBe(6)
  })

  it('should reset streak when gap > 1 day', () => {
    const result = calculateStreak({
      currentStreak: 5,
      lastActiveDate: '2026-06-22',
    })
    expect(result.currentStreak).toBe(1)
  })
})
```

#### 6.5.2 Mock 时间

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Time-dependent logic', () => {
  beforeEach(() => {
    // 固定时间为 2026-06-25 10:00:00 UTC
    vi.useFakeTimers({
      now: new Date('2026-06-25T10:00:00.000Z'),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should use fixed time', () => {
    const now = new Date()
    expect(now.toISOString()).toBe('2026-06-25T10:00:00.000Z')
  })
})
```

#### 6.5.3 Mock Math.random

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shuffleArray } from './utils'

describe('shuffleArray', () => {
  beforeEach(() => {
    // 固定随机数序列，使 shuffle 结果可预测
    vi.spyOn(Math, 'random')
      .mockReturnValue(0.5)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7)
  })

  it('should produce predictable order with mocked random', () => {
    const result = shuffleArray([1, 2, 3])
    expect(result).toEqual([1, 2, 3]) // 取决于 mock 值
  })
})
```

### 6.6 组件测试中的 Mock

#### 6.6.1 Mock i18n

```typescript
// apps/web/src/components/layout/navbar.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'nav.home': 'Home',
      'nav.games': 'Games',
      'nav.dashboard': 'Dashboard',
    }
    return translations[key] ?? key
  },
  useLocale: () => 'en',
}))

import { Navbar } from './navbar'

describe('Navbar', () => {
  it('should render navigation links with translated text', () => {
    render(<Navbar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Games')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
```

#### 6.6.2 Mock API 调用

```typescript
// apps/web/src/components/dashboard/dashboard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { Dashboard } from './dashboard'

describe('Dashboard', () => {
  it('should display user stats after loading', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          brainAge: 28,
          totalScore: 12500,
          streak: 7,
        },
      }),
    })

    render(<Dashboard />)

    // 初始显示 loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('28')).toBeInTheDocument()
      expect(screen.getByText('12,500')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
    })
  })
})
```

### 6.7 Mock 使用原则

1. **优先真实依赖**：能用真实依赖（如 Miniflare 的 D1）就不用 mock，更接近生产行为
2. **Mock 外部边界**：mock 外部 API、第三方服务，避免测试受外部服务可用性影响
3. **Mock 应简单**：mock 实现应简单明了，避免 mock 本身需要测试
4. **恢复 mock**：每个测试后恢复 mock（`vi.restoreAllMocks()`），避免污染其他测试
5. **避免过度 mock**：不要 mock 被测系统本身的内部实现，否则测试无意义

---

## 7. 测试最佳实践

### 7.1 测试数据管理

#### 7.1.1 使用 Factory 函数

避免在每个测试中重复构造测试数据，使用 factory 函数：

```typescript
// workers/api/src/test/factories.ts
import type { NewUser, NewScore } from '../db/types'

export function createUser(overrides: Partial<NewUser> = {}): NewUser {
  return {
    email: `user-${Date.now()}@cowb.cc`,
    passwordHash: 'mock-hash',
    nickname: 'Test User',
    locale: 'en',
    role: 'user',
    ...overrides,
  }
}

export function createScore(overrides: Partial<NewScore> = {}): NewScore {
  return {
    userId: 'user-1',
    gameId: 'game-1',
    score: 1000,
    difficulty: 'medium',
    correctCount: 8,
    wrongCount: 2,
    avgReactionMs: 450,
    roundsPlayed: 10,
    playedAt: new Date().toISOString(),
    ...overrides,
  }
}
```

使用：

```typescript
it('should create score', async () => {
  const score = await repos.scores.create(
    createScore({ score: 5000, difficulty: 'hard' })
  )
  expect(score.score).toBe(5000)
})
```

#### 7.1.2 测试数据清理

每个测试前清理数据库，确保测试独立：

```typescript
beforeEach(async () => {
  // 按外键依赖顺序清理
  await env.DB.exec('DELETE FROM scores;')
  await env.DB.exec('DELETE FROM sessions;')
  await env.DB.exec('DELETE FROM users;')
})
```

### 7.2 测试命名

测试名应清晰描述被测行为，使用 "should [behavior] when [condition]" 格式：

```typescript
// ✅ 好的命名
it('should return 401 when session token is missing', () => {})
it('should return 429 when rate limit exceeded', () => {})
it('should calculate brain age based on dimension scores', () => {})

// ❌ 差的命名
it('test1', () => {})
it('works', () => {})
it('test auth', () => {})
```

### 7.3 边界条件测试

每个函数至少测试以下场景：

- **正常输入**（happy path）
- **边界值**（最小值、最大值、零值、空值）
- **异常输入**（null、undefined、错误类型）
- **错误场景**（预期抛出异常）

```typescript
describe('calculateBrainAge', () => {
  it('should calculate age for normal scores', () => {
    expect(calculateBrainAge({ memory: 80, attention: 75, reaction: 70 }))
      .toBeLessThan(50)
  })

  it('should return low age for perfect scores', () => {
    expect(calculateBrainAge({ memory: 100, attention: 100, reaction: 100 }))
      .toBeLessThan(25)
  })

  it('should return high age for low scores', () => {
    expect(calculateBrainAge({ memory: 20, attention: 20, reaction: 20 }))
      .toBeGreaterThan(70)
  })

  it('should throw error for scores out of range', () => {
    expect(() => calculateBrainAge({ memory: 150, attention: 80, reaction: 80 }))
      .toThrow('Score must be between 0 and 100')
  })

  it('should throw error for missing dimension', () => {
    expect(() => calculateBrainAge({ memory: 80, attention: 75 } as any))
      .toThrow('Missing dimension: reaction')
  })
})
```

### 7.4 避免测试反模式

```typescript
// ❌ 反模式：无断言
it('should not crash', () => {
  calculateScore(rounds)
  // 没有断言，即使结果错误测试也会通过
})

// ❌ 反模式：测试实现细节
it('should call internal helper', () => {
  const spy = vi.spyOn(engine as any, 'privateMethod')
  engine.calculateScore(rounds)
  expect(spy).toHaveBeenCalled()
  // 测试私有方法调用，重构会破坏测试
})

// ❌ 反模式：一个测试验证过多
it('should work correctly', () => {
  const result = engine.calculateScore(rounds)
  expect(result).toBe(100)
  expect(engine.getAccuracy()).toBe(0.8)
  expect(engine.getReactionTime()).toBe(450)
  expect(engine.getLevel()).toBe(3)
  // 一个测试验证多个不相关行为，失败时难定位
})

// ✅ 正确：每个测试单一行为
it('should return correct score', () => {
  expect(engine.calculateScore(rounds)).toBe(100)
})

it('should return correct accuracy', () => {
  engine.calculateScore(rounds)
  expect(engine.getAccuracy()).toBe(0.8)
})
```

---

## 8. 相关文档

- [development.md](./development.md) — 开发环境搭建（含测试命令）
- [deployment.md](./deployment.md) — 部署指南（含 CI 测试配置）
- [database.md](./database.md) — 数据库指南（Repository 测试）
- [Vitest 官方文档](https://vitest.dev/)
- [@cloudflare/vitest-pool-workers](https://developers.cloudflare.com/workers/testing/vitest-integration/)
- [Testing Library 文档](https://testing-library.com/)

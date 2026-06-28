# CowB.cc 故障排除指南

## Cloudflare 脚本错误解决方案

### 问题描述

访问 cowb.cc 时，浏览器控制台可能出现以下错误：

```
GET https://cowb.cc/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js net::ERR_CONNECTION_CLOSED
GET https://cowb.cc/cdn-cgi/challenge-platform/scripts/jsd/main.js net::ERR_CONNECTION_CLOSED
GET https://cowb.cc/cdn-cgi/speculation net::ERR_CONNECTION_CLOSED
```

### 原因说明

这些错误是由 Cloudflare 自动注入的脚本引起的，**无法通过代码修改解决**。这些脚本包括：

1. **Rocket Loader** - Cloudflare 的性能优化工具，延迟加载 JavaScript
2. **Challenge Platform** - Cloudflare 的安全挑战平台（用于防机器人）
3. **Speculation Rules** - 浏览器预加载优化

这些错误通常发生在：
- 网络连接不稳定
- Cloudflare 配置问题
- 某些浏览器扩展拦截了 Cloudflare 脚本

### 解决方案

#### 方案 1：在 Cloudflare Dashboard 中禁用 Rocket Loader（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择你的域名 `cowb.cc`
3. 进入 **Speed** > **Optimization**
4. 找到 **Rocket Loader** 选项
5. 将其设置为 **Off**
6. 点击 **Save**

#### 方案 2：禁用 Speculation Rules

1. 在 Cloudflare Dashboard 中
2. 进入 **Speed** > **Optimization**
3. 找到 **Early Hints** 或 **Speculation Rules**
4. 将其禁用

#### 方案 3：调整安全级别

1. 在 Cloudflare Dashboard 中
2. 进入 **Security** > **Settings**
3. 将 **Security Level** 调整为 **Medium** 或 **Low**
4. 这可以减少 Challenge Platform 的触发

#### 方案 4：清除浏览器缓存

1. 清除浏览器缓存和 Cookie
2. 禁用可能干扰的浏览器扩展（如广告拦截器）
3. 尝试使用无痕模式访问

#### 方案 5：检查网络连接

1. 确保网络连接稳定
2. 尝试切换网络（如从 Wi-Fi 切换到移动数据）
3. 检查防火墙或代理设置

### 验证修复

修复后，使用以下步骤验证：

1. 打开浏览器开发者工具（F12）
2. 切换到 **Console** 标签
3. 刷新页面
4. 确认没有 `ERR_CONNECTION_CLOSED` 错误

### 注意事项

- 这些错误**不会影响网站功能**，只是控制台警告
- 禁用 Rocket Loader 可能会略微影响页面加载速度
- 如果问题持续，请联系 Cloudflare 支持

---

## 其他常见问题

### 登录状态不同步

**问题**：登录后页面跳转但仍显示未登录状态

**解决方案**：
1. 清除浏览器 localStorage：`localStorage.clear()`
2. 确保浏览器允许 localStorage 存储
3. 检查是否有浏览器扩展阻止了存储

### 注册后跳转错误

**问题**：注册后跳转到 Dashboard 而不是脑龄评估页面

**解决方案**：
已在代码中修复，注册成功后会自动跳转到 `/brain-age` 页面

### 用户名登录不支持

**问题**：登录页面只支持邮箱登录

**解决方案**：
已在代码中添加用户名登录支持，现在可以使用用户名+密码或邮箱+密码登录

---

## 联系支持

如果以上解决方案无法解决您的问题，请：

1. 提交 GitHub Issue：[cowb-cc/issues](https://github.com/your-repo/issues)
2. 通过联系页面提交反馈：https://cowb.cc/contact
3. 提供以下信息：
   - 浏览器版本
   - 操作系统
   - 错误截图
   - 控制台错误日志

---

**文档更新时间**：2026-06-28

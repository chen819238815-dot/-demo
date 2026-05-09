# 经营分析中心 · 自助分析 · Figma 原型稿

> 版本：v1.0  |  17 frames  |  设计基准：1440 × 900  |  最后更新：2026-05-08

本目录是「经营分析中心 · 自助分析」产品的完整 Figma 原型稿资料包。
它包含：高保真原型 HTML + Figma Tokens Studio 兼容的设计 token + 完整设计系统规范 + 全部屏幕规格 + 核心用户流程图。

---

## 目录

| 文件 | 用途 | 推荐打开方式 |
| --- | --- | --- |
| `prototype.html` | **单文件高保真原型**：所有 17 个 Frame 拼接在一张画布上，含 zoom / 屏幕导航 | 浏览器直接打开 / `html.to.design` 导入 Figma |
| `design-tokens.json` | Figma Tokens Studio 可直接导入的设计 token | Figma → Plugins → Tokens Studio → 设置 → 导入 |
| `design-system.md` | 设计系统规范：色板 / 字体 / 间距 / 阴影 / 组件规范 | 阅读 / 在 Figma 中创建组件库时按此实现 |
| `screens.md` | 全部屏幕规格：尺寸 / 布局 / 文本 / 组件 / 交互 | 在 Figma 中搭建每个 Frame 时对照 |
| `user-flows.md` | 7 条核心用户流程（Mermaid） | 在 FigJam / Notion / Lark 中渲染 |
| `README.md` | 本文件 | — |

---

## 快速预览

> 推荐 1：直接看高保真原型

```bash
# 任意以下之一
open figma-prototype/prototype.html         # macOS
xdg-open figma-prototype/prototype.html     # Linux
start figma-prototype\prototype.html        # Windows
```

或在已经运行的 Vite preview 上访问：

```
http://127.0.0.1:8080/figma-prototype/prototype.html   # 注意 Vite 默认不映射，需 mount 到 public 或单独 file:// 打开
```

> 推荐 2：直接 file:// 打开看全部 17 张画板

打开后，左侧导航可在 17 个 Frame 之间快速跳转；右上角有 50% / 75% / 100% / 125% 缩放控制。

---

## 演示路径（与仓库内 React 应用一致）

本地启动 `npm run dev` 或 `npm run build && npm start` 后，可在浏览器访问：

| 场景 | 路径 |
| --- | --- |
| **自助仪表盘列表**（卡片：**仪表盘名称在顶部**；中部为 **最多 4 张图表预览，2×2 栅格**；底部为看板数 / 数据源 / 操作） | `http://127.0.0.1:5173/analysis`（dev 默认端口）或 `http://127.0.0.1:8080/analysis`（`vite preview` / Zeabur 常见端口） |
| 同上 · 「仪表盘模板」Tab | `/analysis`，切换 Tab |
| 单仪表盘详情（看板切换、筛选、导出） | `/analysis/dashboards/<id>`，例：`/analysis/dashboards/dash-mine-1` |
| 新建仪表盘（三步向导） | `/analysis/dashboards/new` |
| 单页 Figma 风格原型（非路由应用） | `http://127.0.0.1:8080/prototype.html`（需已执行 `build` 且 `dist` 中含该文件）或直接用浏览器打开 `figma-prototype/prototype.html` |

> **A1 列表卡片结构（当前实现）**：`dashboard-card-head`（名称 + 系统/店铺/已同步角标 + 描述）→ `preview-multi`（`preview-grid` 内 1～4 个 `preview-tile`，每格 `ChartView … compact`）→ `info`（看板/数据源统计、菜单、协作者、更新时间）。

---

## Frame 总览

### 列表页

- **A1** 自助仪表盘列表 · 我的仪表盘 — `/analysis`，含完整左侧菜单。**卡片布局**：顶部为仪表盘名称与角标、下方为描述；中部为 **2×2 图表预览**（最多 4 个图表，`ChartView` 紧凑模式）；底部为看板/数据源与操作区。
- **A2** 自助仪表盘列表 · 仪表盘模板 — 8 张模板卡（图 2 风格）。
- **A3** 卡片操作菜单 — 编辑 / 复制 / 协同 / 分享 / 权限 / 同步到店铺 / 删除。

### 仪表盘构建（三步式）

- **B1** 步骤 1 · 基本信息 — 名称 / 描述 / 归属 / 封面色。
- **B2** 步骤 2 · 数据源（列表态）— 已添加数据源表格，支持继续 + 添加。
- **B2-a** 数据源 Modal · 模板创建 — 三选一 method-card + 模板列表 + 字段预览。
- **B2-b** 数据源 Modal · 已有报表。
- **B2-c** 数据源 Modal · 直接创建（指标 / 维度池 + 已选字段）。
- **B3** 步骤 3 · 看板 — 多看板 Tabs，4 列栅格，KPI / 折线 / 柱 / 表 / 占位。
- **B3-a** 图表编辑 Modal — 图表类型选择 + 字段配置 + 尺寸 + 预览。

### 仪表盘详情

- **C1** 仪表盘详情 — 含「统计时间 / 选择店铺 / 选择渠道」固定筛选条 + 数据源摘要 + 看板 Tabs + 图表网格（含真实 SVG 图表）。
- **C2** 数据源明细 Modal — 多 Tab、可排序表格、自定义列、导出。
- **C3** 选择店铺 弹层 — 类型筛选 / 多选 / 类型 mini tag。
- **C4** 导出菜单 — PNG / Excel / PDF。

### 协同 / 分享 / 权限

- **D1** 分享 Modal · 链接 — 公开开关、链接复制、权限、有效期。
- **D2** 协同 Modal — 邀请成员 + 权限 + 留言。
- **D3** 权限 Drawer — 公开开关、按角色 / 个人开放，含成员行权限编辑。

### 自助报表

- **E1** 自助报表列表 — 双列 filter-bar + 报表表格 + 列设置 / 批量下载。
- **E2** 模板选择 Modal — 左侧分类 + 右侧 4 列 template-card。

### 占位

- **F1** 通用菜单页占位（如「营业概况」「商品概况」「财务报表」等）。

---

## 在 Figma 中"复刻"原型稿的推荐流程

> 推荐顺序：导入 token → 导入页面（HTML）→ 抽取组件 → 串联交互 → 评审

### 第 1 步 · 导入 design tokens（10 分钟）

1. Figma 主菜单 → `Plugins` → 安装 [`Tokens Studio for Figma`](https://www.figma.com/community/plugin/843461159747178978)。
2. 打开 Tokens Studio → `Settings` → `Tools` → `Load from JSON`。
3. 选择 `design-tokens.json`。
4. 在 `Tokens` 面板将 `global` token set 设为 `enabled`。
5. 点击 `Apply to selection / All` 让 token 转换为 Figma 的 Color Style + Text Style + Variables。

完成后，所有色板（`color/brand/primary` 等）、文本样式、阴影、间距 token 都会出现在 Figma 文件中。

### 第 2 步 · 导入页面（5 分钟）

**方式 A：使用 `html.to.design`（推荐）**

1. 安装 [`html.to.design`](https://www.figma.com/community/plugin/1159123024924461424) 插件。
2. 打开 `prototype.html` 在浏览器获取本地路径或部署到任意可公开访问的链接（如 GitHub Pages / Vercel）。
3. 在 Figma 中运行插件，粘贴 URL（或导入 HTML 文件），插件会把整张画布转为可编辑 Frame。

**方式 B：使用 `Builder.io`**

1. 安装 [`Builder.io · Figma to Code & Code to Figma`](https://www.figma.com/community/plugin/1346071011603408786) 插件。
2. 在插件内贴入 `prototype.html` 内容或本地路径，自动生成 Figma layers。

**方式 C：手动按 `screens.md` 搭建**

仅在以上方式效果不理想时使用。`screens.md` 中已经给出每张 Frame 的精确尺寸、文本、栅格、组件层级。

### 第 3 步 · 抽取 Components（核心，约 1 小时）

按 `design-system.md` 的命名建议在 Figma 中创建组件：

```
Atom/
  ├── Button (Primary/Default/Text/Danger × sm/md/lg × default/hover/active/disabled)
  ├── Input
  ├── Tag
  ├── Field-Chip (Metric/Dimension)
  ├── Avatar
  └── Badge
Molecule/
  ├── Brand-Logo
  ├── Topbar-Search
  ├── Menu-Group
  ├── Menu-Cell (double / solo, default / hover / active)
  ├── Submenu-Cell
  ├── AI-Launcher
  ├── Filter-Bar
  ├── Stat-Time
  └── Shop-Picker (含 trigger / popover)
Organism/
  ├── Page-Header
  ├── Section-Card
  ├── Dashboard-Card (default / hover)
  ├── Template-Card
  ├── Chart-Tile (default / editable)
  ├── Boards-Tabs
  ├── Method-Card (default / active)
  ├── Selectable-Row
  ├── Fields-Tray
  ├── Modal
  ├── Drawer
  └── Empty-State
Chart/
  ├── Line / Area / Bar / Pie / Funnel / Scatter / Gauge / KPI / Table
```

> 抽取顺序建议：从最高频组件开始（Button → Input → Field-Chip → Card → Menu-Cell → Chart-Tile → Modal）。

### 第 4 步 · 在每个 Frame 中替换为 Component 实例

把第 2 步导入或手画好的页面里的"static layer"替换为第 3 步创建的 Component 实例，从而实现"改一处，全 17 张画板同步"。

### 第 5 步 · 串联 Prototype 交互

按 `user-flows.md` 中的 7 条核心流程在 Figma 的 `Prototype` Tab 中连接：

| 触发元素 | 跳转目标 | 交互 |
| --- | --- | --- |
| A1 卡片 → click | C1 仪表盘详情 | Smart Animate 200ms |
| A1 「+ 新建仪表盘」 → click | B1 | Move in 右滑 |
| B1 「下一步」 → click | B2 | Smart Animate |
| B2 「+ 添加数据源」 → click | B2-a Modal | Dissolve 150ms |
| B2-a method-card → click | B2-b / B2-c | Smart Animate |
| B2 「下一步」 → click | B3 | Smart Animate |
| B3 「+ 新建图表」 → click | B3-a | Dissolve |
| C1 数据源 tag → click | C2 | Dissolve |
| C1 「选择店铺」 → click | C3 popover | Dissolve |
| C1 「导出 ▾」 → click | C4 dropdown | Dissolve |
| C1 「分享」 → click | D1 | Dissolve |
| C1 「协同」 → click | D2 | Dissolve |
| 卡片菜单 → 权限设置 | D3 | Slide in (right) |
| Side-menu 「自助报表」 | E1 | Smart Animate |
| E1 「+ 从模板创建」 → click | E2 | Dissolve |

### 第 6 步 · 命名 + 整理

- 文件命名：`经营分析中心 / 自助分析 - v1.0`
- Page 分页建议：
  - `Page 1 - 设计系统`（Atom / Molecule / Organism）
  - `Page 2 - 列表页`（A1 / A2 / A3）
  - `Page 3 - 仪表盘构建`（B1 / B2 / B2-a / B2-b / B2-c / B3 / B3-a）
  - `Page 4 - 仪表盘详情`（C1 / C2 / C3 / C4）
  - `Page 5 - 协同分享权限`（D1 / D2 / D3）
  - `Page 6 - 自助报表`（E1 / E2）
  - `Page 7 - 占位页`（F1）
  - `Page 8 - 用户流程图`（参照 `user-flows.md` 用 FigJam 画）

---

## 与代码对齐

本原型稿与已有 React 代码 1:1 对齐，主要参考文件：

- 设计系统：`src/index.css`
- 菜单结构：`src/layouts/MainLayout.tsx`
- 数据模型 & mock：`src/store/dashboard.tsx`
- 仪表盘列表：`src/pages/Analysis.tsx`
- 仪表盘构建：`src/pages/DashboardBuilder.tsx` + `src/components/DataSourceModal.tsx` + `src/components/ChartEditModal.tsx`
- 仪表盘详情：`src/pages/DashboardView.tsx` + `src/components/DashboardFilters.tsx` + `src/components/DataSourceDetailModal.tsx`
- 自助报表：`src/pages/SelfQuery.tsx` + `src/components/TemplateModal.tsx`
- 协同 / 分享 / 权限：`src/components/CollaborateModal.tsx` + `src/components/ShareModal.tsx` + `src/components/PermissionDrawer.tsx`

如需保持设计与代码不漂移：

- 颜色 / 字体 / 阴影：仅修改 `design-tokens.json` + `src/index.css` 中的 CSS 变量。
- 文案：以 `screens.md` 为准，代码侧调整时同步本文件。

---

## 备注

- 原型稿中的图表均为 SVG 占位，真实数据由 React + ECharts 在 `src/components/ChartView.tsx` 渲染。
- emoji（如 🔔 📊 📋）仅在原型稿中作示意；产品上线 UI 应使用 Ant Design / Lucide 图标。
- 占位页 F1 当前在产品中作为「baseMenus」群组所有菜单项的统一占位，未来可逐项替换为真实模块。

---

## 协作

如果你在 Figma 中拓展了原型稿，记得把新增 Frame 的 ID（如 `G1`、`H1`）补回 `screens.md` 的索引表，并在 `prototype.html` 中追加对应的 `<section id="...">` 区块，保持四份资料同步。

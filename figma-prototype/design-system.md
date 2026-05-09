# 设计系统规范 · 经营分析中心

> 与 `src/index.css` 中真实实现 1:1 对齐。本文件为在 Figma 中搭建组件库（Component / Variants / Auto Layout）的唯一来源。

---

## 1. 设计画布

| 项 | 值 | 说明 |
| --- | --- | --- |
| 设计宽度 | **1440 px** | 主设计稿基准 |
| 最小宽度 | 1280 px | 内容区可正常展示 |
| 最大宽度 | 1920 px | 不另做大屏适配 |
| 行高基准 | 1.5 | 正文 |
| 图标库 | Ant Design Icons | 与代码保持一致；备选 Lucide |
| 字体 | PingFang SC / Microsoft YaHei | 中文优先 fallback 链 |

---

## 2. 颜色规范

### 2.1 品牌主色

| Token | HEX | 使用场景 | AA 对比度 |
| --- | --- | --- | --- |
| `brand.primary` | `#4F7CFF` | 主按钮、激活态、链接、品牌渐变起点 | 4.7 ✓ |
| `brand.purple` | `#6E5CFF` | 渐变终点 | 5.6 ✓ |
| `brand.purpleAlt` | `#A259FF` | 菜单分组指示条、AI 强调 | 4.5 ✓ |
| `brand.gradient` | `linear-gradient(135°, #4F7CFF → #6E5CFF)` | 主按钮、Brand Logo、AI 入口、菜单 hover 背景 | — |
| `brand.primary50` | `#F0F5FF` | 浅蓝 hover/active 底色 | — |

### 2.2 中性色（文字 / 背景 / 描边）

| Token | HEX | 使用场景 |
| --- | --- | --- |
| `neutral.title` | `#1F2329` | 一级标题、主要文字 |
| `neutral.body` | `#4E5969` | 正文、次要文字 |
| `neutral.muted` | `#86909C` | 占位、辅助说明、空数据 |
| `neutral.disabled` | `#BFBFBF` | 禁用、键盘提示 |
| `neutral.border` | `#EEF0F3` | 默认描边、卡片边框 |
| `neutral.borderStrong` | `#D4DCEC` | hover 描边 |
| `neutral.borderLine` | `#F1F3F6` | 分隔线 |
| `neutral.bgPage` | `#F5F7FA` | 页面背景 |
| `neutral.bgCard` | `#FFFFFF` | 卡片底色 |
| `neutral.bgSection` | `#FAFBFC` | 表头、二级容器背景 |
| `neutral.bgSoft` | `#F0F2F6` | Tabs 容器底 |

### 2.3 语义色

| Token | HEX | 用途 |
| --- | --- | --- |
| `success` | `#00B42A` | 执行成功、增长 |
| `successBg / Border` | `#F6FFED` / `#D9F7BE` | 标签底 / 边 |
| `warning` | `#FF7D00` | 警示、待办、橙色头像 |
| `warningBg / Border` | `#FFF7E6` / `#FFE7BA` | 标签 |
| `error` | `#F53F3F` | 删除、表单错误 |
| `errorAlt` | `#FF4D4F` | Badge 红点 |

### 2.4 标签色（指标 / 维度 / 店铺）

| Token | HEX | 说明 |
| --- | --- | --- |
| `tag.metric` | `#4F7CFF` on `#F0F5FF` | 指标 chip（蓝） |
| `tag.dimension` | `#00B42A` on `#F6FFED` | 维度 chip（绿） |
| `tag.shopRetail` | `#4F7CFF` | 门店类型 |
| `tag.shopMall` | `#00B42A` | 商城类型 |
| `tag.shopLive` | `#FF7D00` | 直播类型 |

### 2.5 图表配色（建议顺序）

`#4F7CFF → #6E5CFF → #00B42A → #FF7D00 → #F759AB → #13C2C2 → #F53F3F → #FADB14`

---

## 3. 字体规范

### 3.1 字体栈

```
PingFang SC, Microsoft YaHei, -apple-system, BlinkMacSystemFont,
'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
```

### 3.2 文本样式（建议在 Figma 创建为 Text Style）

| 名称 | Size / Weight / Line | 用途 |
| --- | --- | --- |
| **Heading / H1** | 20 / 600 / 1.2 | 页面标题（如「自助仪表盘」） |
| **Heading / H2** | 16 / 600 / 1.2 | 顶栏品牌名、Modal 标题 |
| **Heading / H3** | 15 / 600 / 1.5 | Section card 标题 |
| **Body / Card Title** | 14 / 600 / 1.5 | 仪表盘卡片名、Drawer 标题 |
| **Body / Tile Title** | 13.5 / 500 / 1.5 | 图表 tile 标题 |
| **Body / Default** | 13 / 400 / 1.6 | 正文 |
| **Body / Small** | 12.5 / 400 / 1.5 | 表格列、说明文字 |
| **Caption** | 12 / 400 / 1.5 | 卡片描述、meta 信息 |
| **Caption / 11** | 11 / 400 / 1.5 | Tag、preview 标题 |
| **Menu / Group Title** | 11.5 / 500 / 1.5（letter-spacing 0.4） | 菜单分组标题 |
| **Menu / Item** | 12.5 / 400 / 1.5 | 菜单项 |
| **Menu / Solo Item** | 13 / 500 / 1.5 | 自助分析 / 自助报表 |
| **KPI / Number** | 32 / 600 / 1.2 | KPI 卡数字 |
| **KPI / Number Sub** | 24 / 600 / 1.2 | 中等 KPI |

---

## 4. 间距 / 栅格

### 4.1 间距 Tokens（Figma Auto Layout 直接套用）

`0 · 2 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 24 · 32 · 40 · 48 · 56`

### 4.2 全局栅格

- 顶栏高度：**56 px**，左右 padding 24 px
- 左侧菜单宽：**232 px**
- 内容区 padding：`20px 24px 32px`
- 看板栅格：`grid-template-columns: repeat(4, 1fr)`，gap `12 px`
  - `tile-w-1` = 1/4 宽，`tile-w-2` = 1/2，`tile-w-3` = 3/4，`tile-w-4` = 全宽
- Section card 间距：`margin-bottom: 16px`
- 菜单分组间距：分组间 `border-top + margin-top: 4px + padding-top: 8px`

---

## 5. 圆角

| Token | 值 | 用途 |
| --- | --- | --- |
| `radius.xs` | 4 | 小标签、表头细节 |
| `radius.sm` | 6 | **按钮、输入框（默认）** |
| `radius.md` | 8 | Tabs 容器、AI 入口、Modal、Drawer |
| `radius.lg` | 10 | **卡片默认（dashboard-card / section-card / chart-tile）** |
| `radius.xl` | 12 | Field chip 椭圆 |
| `radius.pill` | 999 | Badge、搜索框 (18px) |
| `radius.tag` | 10 | Tag、shop chip |

---

## 6. 描边 / 阴影

### 6.1 描边

- 默认：`1px solid #EEF0F3`
- 悬停：`1px solid #D4DCEC`
- 主色高亮：`1px solid #4F7CFF`
- 虚线（empty state）：`1px dashed #D4DCEC`
- 激活指示条（菜单）：`width: 3px; background: #4F7CFF; border-radius: 0 2px 2px 0`

### 6.2 阴影（Drop Shadow）

| 名称 | x · y · blur · spread · color | 用途 |
| --- | --- | --- | --- |
| Shadow / Header | 0 · 1 · 0 · 0 · `rgba(0,0,0,0.02)` | 顶栏底部 |
| Shadow / Card | 0 · 1 · 3 · 0 · `rgba(0,0,0,0.06)` | 卡片默认 |
| Shadow / Card-hover | 0 · 10 · 24 · 0 · `rgba(15,23,42,0.08)` | 仪表盘卡 hover |
| Shadow / Tile-hover | 0 · 6 · 16 · 0 · `rgba(15,23,42,0.06)` | chart tile hover |
| Shadow / Primary | 0 · 2 · 6 · 0 · `rgba(79,124,255,0.30)` | 主按钮、Logo |
| Shadow / Primary-hover | 0 · 4 · 12 · 0 · `rgba(79,124,255,0.40)` | 主按钮 hover |
| Shadow / Popover | 0 · 10 · 32 · 0 · `rgba(15,23,42,0.12)` | 店铺弹层、下拉菜单 |
| Shadow / Focus-ring | 0 · 0 · 0 · 2 · `rgba(79,124,255,0.15)` | 输入框聚焦 |

---

## 7. 组件库（按 Figma Component 命名给出）

> 命名规范：`类别 / 组件 / 变体[/ 状态]`，用 Variants 管理。

### 7.1 Foundation

- **Color / Brand / Primary**
- **Color / Neutral / Title**
- **Text Style / H1 ~ Caption**
- **Effect / Shadow / Card**

### 7.2 Atoms

#### `Atom / Button`
- 变体：`type=Primary | Default | Text | Link | Danger`，`size=sm(28) / md(32) / lg(40)`，`state=default / hover / active / disabled`
- 主按钮：`#4F7CFF → #6E5CFF` 渐变 / 白字 / radius 6 / shadow Primary
- 默认按钮：白底 / `#D9D9D9` 1px 描边 / `#1F2329` 文字 / hover 描边变 `#4F7CFF`
- Text 按钮：透明底 / `#4F7CFF` 文字
- 内边距：sm `0 12`，md `0 16`，lg `0 20`，icon-only 时四向相同

#### `Atom / Input`
- 变体：`size=sm/md/lg`，`state=default/hover/focus/error/disabled`，`with-prefix=true/false`
- 默认：白底，`1px solid #D9D9D9`，radius 6
- focus：`1px solid #4F7CFF` + Focus ring shadow

#### `Atom / Tag`
- 变体：`tone=Primary / Success / Warning / Purple`，`solid=true/false`
- 大小：高度 20 / 圆角 10 / 字号 11 / padding `2 8`

#### `Atom / Field-Chip`
- 变体：`kind=Metric / Dimension / Default`，`removable=true/false`
- 高度 22 / 圆角 12 / 字号 12 / padding `3 8`，前置 ◇ 形小图标，可右侧带 × 关闭

#### `Atom / Avatar`
- 变体：`size=24/32/40`，`color=Brand/Amber/Purple/Green`
- 圆形，文字白色，`font-weight: 600`

#### `Atom / Badge`
- 红点 8×8 或带数字（min-width 16, height 14, padding `0 5`，bg `#FF4D4F`）

#### `Atom / Icon`
- 12 / 14 / 18 三种尺寸，色随父级文字色

### 7.3 Molecules

#### `Molecule / Topbar-Search`
- 容器：圆角 18px / `#F5F7FA` 底 / 高度 28 / padding `5 12` / min-width 240
- 内：搜索图标（12 灰）+ 占位文字「搜索仪表盘 / 模板...」+ 右侧 `⌘K` kbd

#### `Molecule / Brand-Logo`
- 28×28 圆角 8 渐变方块 + 16/600 文字「经营分析中心」

#### `Molecule / Menu-Group`
- 标题（11.5 / 500 / 0.4 letter-spacing）+ 左侧 3×11 渐变指示条
- 内含：双列网格（gap 2，padding 7×10 menu-cell）或单列

#### `Molecule / Menu-Cell`
- 变体：`layout=double / solo`，`state=default / hover / active`
- 默认 padding `7 10` / radius 6 / font 12.5
- active：`linear-gradient(90°, rgba(79,124,255,0.10), rgba(79,124,255,0.04))` + 蓝字 + 左侧 3px 蓝条

#### `Molecule / Submenu-Cell`（仪表盘二级）
- padding-left 18 / 高度 28 / 蓝点（4×4）+ 标签

#### `Molecule / AI-Launcher`
- margin 8 / padding `9 12` / radius 8 / 渐变蓝紫底 / 白字 / 右侧 + 按钮

#### `Molecule / Filter-Bar`
- 双列布局（grid 1fr 1fr，gap 14×24）
- 行：右对齐 70px label + 控件
- 底部 actions 行（重置 / 查询）

#### `Molecule / Stat-Time`（仪表盘头部固定）
- 左：「统计时间」+ ⓘ 提示
- 右：粒度切换（实时/日/周/月/自定义）+ DatePicker + 快捷按钮（今日/昨日/近 7 天/近 30 天）

#### `Molecule / Shop-Picker`（仪表盘头部固定）
- 触发器：min-width 320，max-width 460，高度 32，圆角 6
- 内含 chip 区（已选店铺：蓝/绿/橙类型 mini tag + 名称）+ 右侧分隔 + clear ×
- 弹层：宽 480、阴影 popover、内含搜索 + 列表 + 底部「全选 / 已选 N 家 / 清空」

### 7.4 Organisms

#### `Organism / Page-Header`
- 左：H1 + 副标题（13/86909C）
- 右：Action 按钮组（导出 ▾ · 协同 · 分享 · 主按钮）

#### `Organism / Section-Card`
- 容器：白底 / radius 10 / 1px `#EEF0F3` 描边 / mb 16
- Section-Head：padding `14 20` / 底部 `#F1F3F6` 1px 分隔
- Section-Body：padding `18 20`

#### `Organism / Dashboard-Card`
- 卡片 240×240（建议）
- preview 区 144 高 + `linear-gradient(135°, #F0F5FF, #F9F0FF)` 底
- preview-chart 内嵌：白底 / radius 8 / inset 12，含标题（11/500）+ mini 柱状预览
- info 区 padding `12 14 14`
- name + desc + meta 行（avatar stack + 时间）

#### `Organism / Template-Card`
- 4 列；卡片 padding `16 16 14`，hover 描边变 `#4F7CFF`
- 包含名（14/600）/ 简介（最多 3 行 12.5）/ 维度行 / 指标行（前 40px label）/ 底部「使用模板 →」按钮

#### `Organism / Chart-Tile`
- 默认 / 编辑态变体；编辑态显示拖拽手柄、宽度切换（1/2/3/4）、复制/删除/编辑
- head：tile-name（13.5/500）+ 操作 icon 组（hover 显示）
- body：min-height 200
- 网格列宽：`tile-w-1 ~ 4`

#### `Organism / Boards-Tabs`
- 看板 Tabs（`Builder-Tab` 复用）：12 18 padding，激活态 2px 蓝下划线，左右各预留 18

#### `Organism / Method-Card`（数据源三选一）
- 3 列，16 padding；选中态 `linear-gradient(135°, rgba(79,124,255,0.08), rgba(110,92,255,0.04))`
- 36×36 图标方块（默认浅底；选中渐变蓝紫）
- 右上角 16×16 圆形勾选指示（active 时显示 ✓）

#### `Organism / Selectable-Row`
- 选项 row（模板/报表选择）：30×30 图标方块 + 名 + 描述 + active 浅蓝底

#### `Organism / Fields-Tray`
- 双栏 240/1fr：左为字段池，右为已选；高 360
- field-row：`6 8` padding，hover 浅灰，selected 浅蓝

#### `Organism / Modal`
- 容器：白底 / radius 8 / 阴影 Popover
- header：18 24 padding / 16/600 标题 / × 关闭
- body：24 padding / 内容
- footer：18 24 padding / 顶部 1px `#F1F3F6` 分隔 / 右对齐 取消 + 主按钮

#### `Organism / Drawer`（权限设置）
- 右侧抽屉，宽 480 / 高 100% / 阴影 Popover
- header / body / footer 同 Modal 布局

#### `Organism / Empty-State`
- 居中图标（36px muted）+ 标题（14/500）+ 描述（12/86909C）+ 主按钮

### 7.5 Charts（建议作为 Symbol，仅占位即可）

- `Chart / Line`
- `Chart / Area`
- `Chart / Bar`
- `Chart / Pie`
- `Chart / Funnel`
- `Chart / Scatter`
- `Chart / Gauge`
- `Chart / KPI`（数字 32/600 + 标签 12/86909C + ↑ ↓ 增长）
- `Chart / Table`

---

## 8. 状态规范

| 状态 | 描边 | 背景 | 阴影 |
| --- | --- | --- | --- |
| default | `#EEF0F3` | `#FFFFFF` | Card |
| hover | `#D4DCEC` | `#FFFFFF` 或 `#FAFBFC` | Tile-hover |
| active / selected | `#4F7CFF` | `#F0F5FF` 或 渐变浅蓝紫 | — |
| focus | `#4F7CFF` | — | Focus-ring |
| disabled | `#EEF0F3` | `#FAFBFC` | — |
| error | `#F53F3F` | — | — |

---

## 9. 动效规范

| 名称 | 时长 / 缓动 | 用途 |
| --- | --- | --- |
| micro | 0.15s ease | 字段选中、文字色切换 |
| base | 0.2s ease | hover、按钮、菜单 |
| pop-in | 0.15s ease | popover、下拉 |
| lift | 0.2s ease + translateY(-3px) | 仪表盘卡片 hover |
| primary-lift | 0.2s ease + translateY(-1px) | 主按钮 hover |

> 在 Figma 中以 Smart Animate 表达，时长设置为 200ms。

---

## 10. 命名约定

- 色 token：`color/{class}/{shade}`
- 文字 style：`heading/h1`、`body/default`、`caption`
- 组件实例：`Atom/Button`、`Molecule/Filter-Bar`、`Organism/Section-Card`
- 画板（Frame）：`A1 - 自助仪表盘列表`、`A2 - 我的仪表盘`、`B1 - 仪表盘构建·步骤1`、依此类推

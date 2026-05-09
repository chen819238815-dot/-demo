# 经营分析页面组件库

基于有赞 Zan Design 设计规范的前端 React 组件库，用于构建经营分析、数据看板类页面。

## 特性

- 完整的 TypeScript 类型定义
- 支持组件间联动（BI 平台风格）
- 丰富的交互效果（点击、切换、展开等）
- 响应式设计
- 严格遵循 Zan Design 设计规范
- 基于 8 点网格法的间距系统

## Zan Design 规范

本组件库严格遵循有赞 Zan Design 设计规范：

### 设计 Token

| 类别 | 变量 | 值 |
|------|------|-----|
| **品牌色** | `--zan-primary` | #155BD4 |
| **成功色** | `--zan-success` | #11AD26 |
| **警告色** | `--zan-warning` | #ED6A18 |
| **错误色** | `--zan-error` | #D41F15 |
| **主文字** | `--zan-text-primary` | #333333 |
| **副文字** | `--zan-text-secondary` | #666666 |
| **边框色** | `--zan-border` | #E0E0E0 |
| **页面背景** | `--zan-bg-page` | #F7F7F7 |
| **卡片背景** | `--zan-bg-white` | #FFFFFF |

### 间距规范（8 点网格法）

| 变量 | 值 | 用途 |
|------|-----|------|
| `--zan-space-xs` | 4px | 紧凑间距 |
| `--zan-space-sm` | 8px | 小间距 |
| `--zan-space-md` | 16px | 标准间距 |
| `--zan-space-lg` | 24px | 大间距 |
| `--zan-space-xl` | 32px | 区块间距 |

### 圆角规范

| 变量 | 值 | 用途 |
|------|-----|------|
| `--zan-radius-sm` | 2px | 按钮 |
| `--zan-radius-md` | 4px | 卡片、弹框 |

### 阴影层级

| 变量 | 值 | 用途 |
|------|-----|------|
| `--zan-shadow-s1` | 0 2px 8px rgba(0,0,0,0.1) | 输入框焦点 |
| `--zan-shadow-s2` | 0 2px 16px rgba(0,0,0,0.1) | 下拉菜单 |
| `--zan-shadow-s3` | 0 2px 24px rgba(0,0,0,0.1) | 弹窗 |

## 使用方式

### 方式一：Zan Design 规范版（推荐）

```tsx
import './styles/zan-components.css';
import ZanDesignExample from './example/ZanDesignExample';

function App() {
  return <ZanDesignExample />;
}
```

### 方式二：自定义样式版

```tsx
import './styles/components.css';
import CompleteExample from './example/CompleteExample';

function App() {
  return <CompleteExample />;
}
```

## 组件清单

### 基础组件

#### 1. 店铺选择组件 (StoreSelector)

支持三种选择模式：
- **全部店铺**：默认选中所有店铺
- **直接选分店**：下拉多选店铺，已选置顶，打烊店铺置底
- **批量选择**：支持搜索、筛选、分页、批量操作

```tsx
import { StoreSelector } from './components/StoreSelector';

const stores = [
  { id: '1', name: '北京朝阳门店', code: 'BJ001', type: 'store', channel: 'offline', isOpen: true },
  { id: '2', name: '天猫旗舰店', code: 'TM001', type: 'online', channel: 'online', isOpen: true },
];

<StoreSelector
  stores={stores}
  selectedStores={selectedStores}
  onChange={setSelectedStores}
  recentSelections={[['1', '2'], []]}
/>
```

#### 2. 统计时间组件 (TimeSelector)

支持五种时间维度，内置丰富的快捷选项：
- **实时**：显示当前时间，支持刷新
- **日**：单日选择，快捷选项（今天、昨天、前天）
- **周**：单周选择，快捷选项（本周、上周）
- **月**：单月选择，快捷选项（本月、上个月）
- **自定义**：日期范围选择，更多快捷选项

```tsx
import { TimeSelector } from './components/TimeSelector';

<TimeSelector
  value={{ type: 'day', startDate: '2026-04-07' }}
  onChange={(value) => console.log(value)}
/>
```

#### 3. 单级指标卡 (MetricCard)

展示单个指标的名称、数值、同比、环比。

```tsx
import { MetricCard } from './components/MetricCard';

<MetricCard
  title="营业收入(元)"
  value="15,426.63"
  yoyChange={10}    // 同比 +10%
  momChange={20}    // 环比 +20%
  isActive={true}   // 高亮状态
  onClick={() => {}}
/>
```

#### 4. 二级指标卡 (SecondaryMetricCard)

展示多个二级指标，通常用于展示一级指标的构成。

```tsx
import { SecondaryMetricCard } from './components/SecondaryMetricCard';

<SecondaryMetricCard
  metrics={[
    { id: '1', title: '支付订单数', value: '15,000', yoyChange: 10, momChange: 20 },
    { id: '2', title: '均单价', value: '111', yoyChange: 10, momChange: 20 },
  ]}
  parentMetric="营业收入"
/>
```

#### 5. 趋势图组件 (TrendChart)

支持单指标展示和时间对比模式，支持平均值线、日/小时粒度切换。

```tsx
import { TrendChart } from './components/TrendChart';

// 单指标模式
<TrendChart
  title="营业收入趋势"
  data={[
    { date: '04-01', value: 850 },
    { date: '04-02', value: 620 },
  ]}
/>

// 对比模式
<TrendChart
  title="营业收入趋势"
  data={[
    { date: '04-01', value: 850 },
    { date: '04-02', value: 620 },
  ]}
  compareData={[
    { date: '04-01', value: 750 },
    { date: '04-02', value: 580 },
  ]}
  showAverage={true}
  showCompare={true}
/>
```

#### 6. 数据表格组件 (DataTable)

支持维度展开、占比进度条、同环比展示、合计行。

```tsx
import { DataTable } from './components/DataTable';

<DataTable
  title="营业收入渠道分析"
  rows={[
    {
      id: '1',
      dimension: '门店渠道',
      value: 123456,
      percentage: 40,
      yoyChange: 80.8,
      momChange: -12.2,
      children: [
        { id: '1-1', dimension: '北京朝阳店', value: 45000, percentage: 15, yoyChange: 75.5, momChange: -8.5 },
      ],
    },
  ]}
  valueLabel="营业收入(元)"
  showPercentage={true}
  showYoy={true}
  showMom={true}
  expandable={true}
/>
```

#### 7. AI 智能解读面板 (AIInsightPanel)

展示 AI 生成的数据解读内容。

```tsx
import { AIInsightPanel } from './components/AIInsightPanel';

<AIInsightPanel
  insights={[
    {
      type: 'info',
      title: '营业收入增长显著',
      content: '本月营业收入同比增长 10%，主要得益于门店渠道的稳步增长...',
    },
    {
      type: 'warning',
      title: '环比增速放缓',
      content: '环比增速从上月的 35% 降至本月的 20%，增速有所放缓...',
    },
  ]}
/>
```

### 组合组件

#### 8. 指标卡+趋势图组合 (MetricWithTrend)

将单级指标卡和趋势图组合，支持点击切换指标、公式关系展示。

```tsx
import { MetricWithTrend } from './components/MetricWithTrend';

<MetricWithTrend
  metrics={[
    {
      id: 'revenue',
      title: '营业收入',
      value: '154,266.63',
      unit: '元',
      yoyChange: 10,
      momChange: 20,
      trendData: [...],
    },
    {
      id: 'orders',
      title: '订单数',
      value: '1,234',
      unit: '单',
      yoyChange: 15,
      momChange: -5,
      trendData: [...],
    },
  ]}
  title="核心经营指标"
/>
```

#### 9. 二级指标+趋势图组合 (SecondaryMetricsWithTrend)

将二级指标卡和趋势图组合，支持点击二级指标展示对应趋势。

```tsx
import { SecondaryMetricsWithTrend } from './components/SecondaryMetricsWithTrend';

<SecondaryMetricsWithTrend
  primaryMetric={{
    title: '营业收入',
    value: '15,426.63',
    yoyChange: 10,
    momChange: 20,
  }}
  secondaryMetrics={[
    {
      id: 'turnover',
      title: '营业额',
      value: '30,853.26',
      yoyChange: 12,
      momChange: 18,
      trendData: [...],
    },
    {
      id: 'discount',
      title: '优惠金额',
      value: '15,426.63',
      yoyChange: 25,
      momChange: 8,
      trendData: [...],
    },
  ]}
  formula="营业收入 = 营业额 - 优惠金额"
/>
```

### 全局控制组件

#### 10. 全局筛选控制栏 (GlobalFilterBar)

组合店铺选择器和时间选择器，提供全局筛选功能。

```tsx
import { GlobalFilterBar } from './components/GlobalFilterBar';
import { BIDashboardProvider } from './components/BIDashboardContext';

<BIDashboardProvider>
  <GlobalFilterBar
    stores={storeList}
    onRefresh={() => console.log('刷新数据')}
  />
</BIDashboardProvider>
```

#### 11. Context 状态管理 (BIDashboardContext)

提供全局状态管理，支持组件间联动。

```tsx
import { BIDashboardProvider, useBIDashboard } from './components/BIDashboardContext';

// 在应用根组件包裹 Provider
<BIDashboardProvider>
  <YourApp />
</BIDashboardProvider>

// 在子组件中使用
const { selectedStores, timeRange, selectedMetricId, setSelectedStores } = useBIDashboard();
```

**Context 提供的状态：**
- `selectedStores: string[]` - 选中的店铺ID列表
- `timeRange: TimeRange` - 时间范围
- `selectedMetricId: string | null` - 选中的一级指标ID
- `selectedSecondaryMetricId: string | null` - 选中的二级指标ID
- `setSelectedStores: (stores: string[]) => void` - 设置选中店铺
- `setTimeRange: (range: TimeRange) => void` - 设置时间范围
- `selectMetric: (id: string | null) => void` - 选择一级指标
- `selectSecondaryMetric: (id: string | null) => void` - 选择二级指标
- `refreshData: () => void` - 刷新数据

## 快速开始

### 1. 安装依赖

```bash
npm install react react-dom
# 或
yarn add react react-dom
```

### 2. 引入样式

```tsx
import './styles/components.css';
```

### 3. 使用组件

```tsx
import React from 'react';
import { BIDashboardProvider } from './components/BIDashboardContext';
import { GlobalFilterBar } from './components/GlobalFilterBar';
import { MetricWithTrend } from './components/MetricWithTrend';
import { DataTable } from './components/DataTable';

function App() {
  return (
    <BIDashboardProvider>
      <div className="biz-analysis-container">
        <h1>经营分析看板</h1>
        <GlobalFilterBar stores={stores} />
        <MetricWithTrend metrics={metrics} />
        <DataTable rows={tableData} />
      </div>
    </BIDashboardProvider>
  );
}
```

## 完整示例

查看 `example/CompleteExample.tsx` 了解完整的页面组装方式和组件联动效果。

```tsx
import CompleteExample from './example/CompleteExample';

function App() {
  return <CompleteExample />;
}
```

## 设计规范

### 颜色系统

| 变量 | 色值 | 用途 |
|------|------|------|
| `--primary-color` | #155BD4 | 主色调、按钮、链接 |
| `--primary-hover` | #1149AA | 主色悬停 |
| `--success-color` | #11AD26 | 上涨、成功状态 |
| `--error-color` | #D41F15 | 下跌、错误状态 |
| `--warning-color` | #ED6A18 | 警告、AI面板背景 |
| `--text-primary` | #333333 | 主要文字 |
| `--text-secondary` | #666666 | 次要文字 |
| `--text-tertiary` | #999999 | 辅助文字 |
| `--border-color` | #E0E0E0 | 边框 |
| `--bg-secondary` | #F7F8FA | 背景色 |

### 字体规范

| 变量 | 大小 | 用途 |
|------|------|------|
| `--font-size-xs` | 12px | 标签、辅助文字 |
| `--font-size-sm` | 13px | 次要内容 |
| `--font-size-base` | 14px | 正文 |
| `--font-size-lg` | 16px | 小标题 |
| `--font-size-xl` | 20px | 区块标题 |
| `--font-size-2xl` | 24px | 页面标题 |
| `--font-size-3xl` | 32px | 核心指标数值 |

### 间距系统

| 变量 | 值 | 用途 |
|------|-----|------|
| `--spacing-xs` | 4px | 紧凑间距 |
| `--spacing-sm` | 8px | 小间距 |
| `--spacing-md` | 12px | 中间距 |
| `--spacing-lg` | 16px | 大间距 |
| `--spacing-xl` | 20px | 区块间距 |
| `--spacing-2xl` | 24px | 大区块间距 |

## 文件结构

```
经营分析组件库/
├── components/
│   ├── StoreSelector.tsx              # 店铺选择组件
│   ├── TimeSelector.tsx               # 统计时间组件
│   ├── MetricCard.tsx                 # 单级指标卡
│   ├── SecondaryMetricCard.tsx        # 二级指标卡
│   ├── TrendChart.tsx                 # 趋势图组件
│   ├── DataTable.tsx                  # 数据表格组件
│   ├── AIInsightPanel.tsx             # AI智能解读面板
│   ├── MetricWithTrend.tsx            # 指标卡+趋势图组合
│   ├── SecondaryMetricsWithTrend.tsx  # 二级指标+趋势图组合
│   ├── GlobalStoreSelector.tsx        # 全局店铺选择器
│   ├── GlobalTimeSelector.tsx         # 全局时间选择器
│   ├── GlobalFilterBar.tsx            # 全局筛选控制栏
│   └── BIDashboardContext.tsx         # 全局状态管理
├── styles/
│   └── components.css                 # 组件样式
├── example/
│   ├── DashboardExample.tsx           # 基础示例
│   └── CompleteExample.tsx            # 完整示例（含联动）
├── demo.html                          # 静态演示页面
└── README.md                          # 使用文档
```

## 浏览器支持

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## License

MIT

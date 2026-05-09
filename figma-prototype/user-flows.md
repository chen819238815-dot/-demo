# 用户流程图 · 经营分析中心 · 自助分析

> 用 Mermaid 画 7 条核心流程，可直接粘贴到 Notion / Lark / FigJam（FigJam 支持 Mermaid 导入）。

## 信息架构

```mermaid
graph LR
  Root[经营分析中心] --> A[概况]
  Root --> B[商品交易]
  Root --> C[客户分析]
  Root --> D[营销分析]
  Root --> E[流量分析]
  Root --> F[更多]
  Root --> G[自助分析]

  G --> G1[自助报表 /self-query]
  G --> G2[自助仪表盘 /analysis]
  G2 --> G2a[新建仪表盘 /analysis/dashboards/new]
  G2 --> G2b[仪表盘详情 /analysis/dashboards/:id]
  G2 --> G2c[仪表盘编辑 /analysis/dashboards/:id/edit]
```

---

## 流程 1 · 通过模板创建仪表盘

```mermaid
flowchart TD
  Start([进入 /analysis]) --> Tab{Tab 切换}
  Tab -- 仪表盘模板 --> List[模板卡片网格]
  List --> Hover[hover 卡片]
  Hover --> Use[点击「使用模板」]
  Use --> Confirm[二次确认 Modal]
  Confirm -- 确认 --> Copy[复制为「我的」]
  Copy --> Toast([Toast: 已加入「我的仪表盘」])
  Toast --> View[/analysis/dashboards/:id/]
  View --> End([完成])
```

---

## 流程 2 · 从零创建仪表盘（三步式）

```mermaid
flowchart LR
  S0([新建仪表盘]) --> S1[步骤1·基本信息]
  S1 --> S1v{校验名称}
  S1v -- 失败 --> S1
  S1v -- 通过 --> S2[步骤2·数据源]
  S2 --> AddDS[+ 添加数据源]
  AddDS --> Method{创建方式}
  Method -- 模板 --> M1[选择模板]
  Method -- 已有报表 --> M2[选择报表]
  Method -- 直接创建 --> M3[拖拽指标维度]
  M1 --> SaveDS[保存数据源]
  M2 --> SaveDS
  M3 --> SaveDS
  SaveDS --> S2
  S2 --> S2v{已有数据源 ≥ 1}
  S2v -- 否 --> AddDS
  S2v -- 是 --> S3[步骤3·看板]
  S3 --> AddBoard[+ 新建看板]
  S3 --> AddChart[+ 新建图表]
  AddChart --> ChartCfg[选类型 / 数据源 / 字段 / 尺寸]
  ChartCfg --> SaveChart[保存]
  SaveChart --> S3
  S3 --> Finish[完成]
  Finish --> Detail[/analysis/dashboards/:id/]
```

---

## 流程 3 · 仪表盘查看与筛选

```mermaid
flowchart TD
  Open([进入仪表盘详情]) --> Filters[查看顶部固定筛选]
  Filters --> T[统计时间]
  T --> TG{粒度}
  TG -- 实时 --> R1[每 30s 自动刷新]
  TG -- 日/周/月 --> R2[选择日期范围]
  TG -- 自定义 --> R3[DatePicker 范围]
  Filters --> Shop[选择店铺]
  Shop --> ShopPop[弹层 · 搜索 / 类型筛选 / 多选]
  ShopPop --> Apply[确定 → 看板刷新]
  Filters --> Chan[选择渠道]
  Chan --> Apply
  Apply --> Boards[切换看板 Tab]
  Boards --> Tile[查看 / 下钻图表]
  Tile --> DSDetail[数据源 tag → 明细 Modal]
```

---

## 流程 4 · 编辑已有仪表盘的图表

```mermaid
flowchart LR
  V([仪表盘详情]) --> EditMode[点击右上「编辑」]
  EditMode --> B[/analysis/dashboards/:id/edit/]
  B --> Tile[hover 图表 tile]
  Tile --> Tools{操作}
  Tools -- 拖拽 --> Reorder[调整顺序]
  Tools -- 调宽 --> Resize[1/2/3/4 切换]
  Tools -- 编辑 --> Modal[图表编辑 Modal]
  Tools -- 复制 --> Copy[复制 tile]
  Tools -- 删除 --> Confirm[确认删除]
  Modal --> Save[保存]
  Save --> Tile
  Reorder --> Tile
  Resize --> Tile
  Tile --> Done[Ctrl+S / 完成]
  Done --> V
```

---

## 流程 5 · 分享 / 协同 / 权限

```mermaid
flowchart TB
  Owner([仪表盘所有者]) --> Action{操作}
  Action -- 分享 --> Share[分享 Modal]
  Share --> S1[Tab=链接]
  Share --> S2[Tab=二维码]
  Share --> S3[Tab=邮件订阅]
  S1 --> CopyLink[复制公共链接]
  S2 --> DownloadQR[下载 QR]
  S3 --> Subscribe[设置频率/收件人]

  Action -- 协同 --> Co[协同 Modal]
  Co --> Invite[选择成员 + 留言]
  Invite --> SendInvite[发送邀请]

  Action -- 权限 --> Perm[权限 Drawer]
  Perm --> Public{开放访问?}
  Public -- 开 --> AnyRole[任何人可访问]
  Public -- 关 --> Filtered[按角色 / 个人 控制]
```

---

## 流程 6 · 同步到店铺仪表盘模板

```mermaid
flowchart LR
  Mine([我的仪表盘]) --> Trigger[卡片菜单：同步到店铺模板]
  Trigger --> Confirm[确认 Modal: 模板将对店铺所有成员可见]
  Confirm -- 取消 --> Mine
  Confirm -- 确认 --> Sync[标记 syncedToShop=true]
  Sync --> Toast([Toast: 已同步到店铺模板])
  Sync --> ShopTab[模板 Tab · 店铺模板]
  ShopTab --> Other([其他成员可使用])
```

---

## 流程 7 · 自助报表 → 转为仪表盘数据源

```mermaid
flowchart TD
  Q([进入 /self-query]) --> New{新建}
  New -- 空白 --> Blank[空白报表]
  New -- 模板 --> TplModal[模板 Modal]
  TplModal --> PickTpl[选择业务模板]
  PickTpl --> EditFields[编辑字段 / 过滤条件]
  Blank --> EditFields
  EditFields --> RunQuery[执行查询]
  RunQuery --> View[查看结果表]
  View --> Action{操作}
  Action -- 下载 --> Download[Excel/CSV]
  Action -- 创建仪表盘 --> ToBuilder[/analysis/dashboards/new<br/>预填数据源 = 该报表/]
  Action -- 重命名 --> Rename
  Action -- 重新生成 --> RunQuery
```

---

## 状态转换 · 仪表盘生命周期

```mermaid
stateDiagram-v2
  [*] --> Draft : 新建
  Draft --> Active : 至少 1 个数据源 + 1 个看板
  Active --> Edited : 编辑
  Edited --> Active : 保存
  Active --> Shared : 开启公开分享
  Active --> Synced : 同步到店铺模板
  Synced --> Active : 取消同步
  Shared --> Active : 关闭分享
  Active --> Archived : 软删除
  Archived --> [*] : 永久删除
```

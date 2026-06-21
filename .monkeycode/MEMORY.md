# 用户指令记忆

本文件记录了用户的指令、偏好和教导，用于在未来的交互中提供参考。

## 格式

### 用户指令条目
用户指令条目应遵循以下格式：

[用户指令摘要]
- Date: [YYYY-MM-DD]
- Context: [提及的场景或时间]
- Instructions:
  - [用户教导或指示的内容，逐行描述]

### 项目知识条目
Agent 在任务执行过程中发现的条目应遵循以下格式：

[项目知识摘要]
- Date: [YYYY-MM-DD]
- Context: Agent 在执行 [具体任务描述] 时发现
- Category: [运维部署|构建方法|测试方法|排错调试|工作流协作|环境配置]
- Instructions:
  - [具体的知识点，逐行描述]

## 去重策略
- 添加新条目前，检查是否存在相似或相同的指令
- 若发现重复，跳过新条目或与已有条目合并
- 合并时，更新上下文或日期信息
- 这有助于避免冗余条目，保持记忆文件整洁

## 条目

[上下文压缩前归档]
- Date: 2026-06-09
- Context: 用户要求每次压缩上下文之前归档现有上下文
- Instructions:
  - 每次进行上下文压缩前，先把当前已有上下文归档到项目可访问的位置，再继续压缩或交接。

[模板设计 skill 调用规则]
- Date: 2026-06-13
- Context: 用户要求在提到“设计模板”时，自动从项目记忆汇总并调用相关 skill；覆盖横屏与竖屏视频模板设计
- Instructions:
  - 当用户提到“设计模板”时，优先按“视频模板设计”场景处理，而不是仅按网页设计处理。
  - 模板设计场景同时覆盖横屏与竖屏，不得默认收窄为单一竖屏场景。
  - 执行前先从项目记忆汇总相关 skill，再选择最贴合当前任务的 skill 组合。
  - 模板设计常用 skill 清单如下：`imagegen-frontend-web`、`imagegen-frontend-mobile`、`image-to-code`、`design-taste-frontend`、`gpt-taste`、`high-end-visual-design`、`minimalist-ui`、`industrial-brutalist-ui`、`brandkit`、`redesign-existing-projects`、`full-output-enforcement`、`stitch-design-taste`。
  - 选型规则：横屏模板优先参考 `imagegen-frontend-web`；竖屏模板优先参考 `imagegen-frontend-mobile`；需要先出视觉稿再落代码时优先组合 `image-to-code` 与 `design-taste-frontend`；需要强化风格时按方向叠加 `gpt-taste`、`high-end-visual-design`、`minimalist-ui`、`industrial-brutalist-ui`；需要系列化视觉母体时使用 `brandkit`；需要在现有模板上升级时使用 `redesign-existing-projects`；需要完整长输出时使用 `full-output-enforcement`；需要沉淀设计系统规则时使用 `stitch-design-taste`。

[前端改动后自动刷新预览服务]
- Date: 2026-06-17
- Context: 用户要求只要有变动就直接刷新重启服务，无需每次单独提醒
- Instructions:
  - 当 Web 前端代码或构建产物发生变动后，自动刷新当前预览服务进程。
  - 执行刷新前先检查是否存在活跃渲染任务，避免中断正在进行的渲染。
  - 完成刷新后直接告知新的运行状态，无需等待用户再次要求重启服务。

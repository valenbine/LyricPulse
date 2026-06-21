# 需求实施计划

- [x] 1. 扩展核心模板配置模型
  - [x] 1.1 在 `packages/core` 中新增自定义模板类型和 Zod schema，覆盖 Requirement 1、2、3、4、5、6
  - [x] 1.2 扩展 `LyricVideoConfig`，允许项目配置携带已解析的自定义模板设置，覆盖 Requirement 4.3、6.1、6.2
  - [x]* 1.3 为模板 schema 和设置合并规则编写单元测试，覆盖 Correctness Properties

- [x] 2. 实现服务端模板存储和 API
  - [x] 2.1 创建本地模板 JSON 存储模块，支持列表、读取、创建、更新，覆盖 Requirement 1.1、1.4、4.1、4.2
  - [x] 2.2 添加模板 API 路由，支持 `GET /api/templates`、`POST /api/templates`、`PUT /api/templates/:id`、`POST /api/templates/import`、`GET /api/templates/:id/export`，覆盖 Requirement 4、5
  - [x] 2.3 在项目渲染配置中保存自定义模板快照，覆盖 Requirement 4.3、4.4、6.5
  - [x]* 2.4 为模板 API 添加集成测试，覆盖导入导出和校验失败路径

- [x] 3. 接入视频模板设置解析
  - [x] 3.1 在 `packages/video` 中实现模板设置 resolver，合并默认值和自定义设置，覆盖 Requirement 2.5、6.1、6.4
  - [x] 3.2 让 `HeroSplit` 读取自定义布局、字号、字体、可见性和封面/频谱配置，覆盖 Requirement 2、3、6
  - [x]* 3.3 添加 `HeroSplit` 自定义设置渲染 smoke 测试

- [x] 4. 实现 Web 模板管理和参数编辑
  - [x] 4.1 添加模板 API client，覆盖 Requirement 4.2、5.1、5.2
  - [x] 4.2 在 Studio 控制台添加自定义模板区域，支持从 `首屏分栏` 创建、保存、导入、导出，覆盖 Requirement 1、4、5
  - [x] 4.3 添加数字 Inspector，支持歌词对象 x、y、width、height、fontSize、fontFamily，覆盖 Requirement 2、3
  - [x] 4.4 将自定义模板设置传入实时预览和渲染请求，覆盖 Requirement 6
  - [x]* 4.5 添加 Web 组件测试覆盖保存和数字字段更新

- [x] 5. 检查点 - 确保所有测试通过
  - 确保所有测试通过,如有疑问请询问用户

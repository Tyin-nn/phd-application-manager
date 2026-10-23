# PhD Application Manager

一个本地运行的博士申请管理面板，用于集中管理项目列表、材料进度、推荐信分配、文书草稿和申请时间线。

## 功能

- **申请总览**：按国家、地区、档次、申请阶段筛选；支持平铺/按地区分组。
- **世界地图导览**：离线矢量世界地图，按城市聚合项目；支持地区分站导览、marker 提示和侧栏项目详情。
- **材料清单**：每个项目独立的材料进度，内置 CV、SOP、推荐信、成绩单等模板项。
- **推荐信管理**：推荐人列表、项目分配矩阵、每所学校所需的推荐信进度。
- **文书资料库**：Markdown 编辑器、版本记录、面试问题练习。
- **数据备份**：一键导出/导入 JSON；数据默认保存在浏览器 `localStorage`。
- **响应式布局**：桌面与移动端均可使用。

## 快速开始

无需安装依赖，直接打开 `index.html` 即可。若浏览器限制本地文件访问，可启动一个静态服务器：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

地图使用本地化的 [jsVectorMap](https://github.com/themustafaomar/jsvectormap) 世界地图数据，不依赖在线瓦片，断网也能显示。

## 目录结构

```
.
├── index.html
├── css/style.css
├── js/
│   ├── seed.js              # 示例项目数据
│   ├── state.js             # localStorage 状态与迁移
│   ├── pages/               # 各页面
│   ├── components/          # 卡片、导航、弹窗等
│   └── vendor/jsvectormap/  # 离线地图库与 MIT 许可证
├── application_materials/   # 通用申请文书模板与示例草稿
└── README.md
```

## 自定义

- 在页面中直接添加/编辑项目，数据会写入浏览器本地存储。
- 或修改 `js/seed.js` 中的示例项目；修改后如需重新载入示例数据，提升 `js/state.js` 的 `DATA_VERSION`，或在浏览器控制台执行 `AppState.reset()`。
- 旧的 `localStorage` 数据会在版本升级时自动迁移，已存在的项目不会被覆盖。

## 隐私说明

本仓库是公开的脱敏版本：

- `supervisor/`、`ApplyingPHD.xlsx` 等包含个人研究网络与申请跟踪的文件未包含在仓库中。
- `application_materials/drafts/` 中的个人草稿仅保留在本地，已通过 `.gitignore` 排除，不会进入仓库。
- `js/seed.js` 使用示例项目数据；其中项目信息来自公开的招生页面。
- 应用运行时的数据只保存在你自己的浏览器中，不会上传到任何服务器。

## 第三方

- [jsVectorMap](https://github.com/themustafaomar/jsvectormap) — MIT License，许可证见 `js/vendor/jsvectormap/LICENSE`。

## License

MIT

# 项目文档索引

## 📚 完整文档清单

### 核心功能文档

#### 🎯 [SILENT_LIVENESS_QUICK_REFERENCE.md](./SILENT_LIVENESS_QUICK_REFERENCE.md)
快速参考卡片，包含：
- 30 秒快速开始
- 核心参数表
- 常用配置模板
- 快速排查指南
- 完整示例代码

**适合人群**：需要快速上手的开发者

---

#### 📖 [SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md)
详细使用指南，包含：
- 功能概述和特性
- 使用方法和参数说明
- 工作流程详解
- 检测阈值说明
- 错误处理和最佳实践
- 完整示例代码

**适合人群**：需要深入理解功能的开发者

---

#### 🔧 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
集成指南和最佳实践，包含：
- 基础使用示例
- 与现有模式并存
- 高级配置方案
- 服务器集成指南
- 性能优化技巧
- 调试技巧

**适合人群**：需要在项目中集成新功能的开发者

---

#### 🔍 [API_REFERENCE.md](./API_REFERENCE.md)
完整 API 文档，包含：
- 检测模式和动作枚举
- Props 接口详解
- 所有事件详细说明
- 数据类型定义
- 配置示例
- 工作流程图
- 浏览器兼容性

**适合人群**：需要查阅 API 的开发者

---

#### 📋 [SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md](./SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md)
实现总结和技术文档，包含：
- 核心特性总结
- 实现细节解析
- 工作流程详解
- 性能指标
- 改进方向
- 测试建议

**适合人群**：需要了解实现细节的技术人员

---

### 其他功能文档

#### 📝 [LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)
活体检测动作类型说明
- BLINK（眨眼）
- SHAKE（摇头）
- MOUTH_OPEN（张嘴）
- NOD（点头）
- 各种组合方案

---

#### 🎯 [FRONTAL_ALGORITHM.md](./FRONTAL_ALGORITHM.md)
正脸检测算法优化文档
- 算法演进过程
- 线性惩罚算法详解
- 参数调优指南

---

## 🗺️ 快速导航

### 我想...

#### ...快速开始使用 SILENT_LIVENESS
👉 [SILENT_LIVENESS_QUICK_REFERENCE.md](./SILENT_LIVENESS_QUICK_REFERENCE.md)

#### ...了解 SILENT_LIVENESS 的所有功能
👉 [SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md)

#### ...在我的项目中集成 SILENT_LIVENESS
👉 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

#### ...查阅完整 API 文档
👉 [API_REFERENCE.md](./API_REFERENCE.md)

#### ...了解实现细节和工作原理
👉 [SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md](./SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md)

#### ...学习活体检测的各种动作类型
👉 [LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)

#### ...优化正脸检测算法
👉 [FRONTAL_ALGORITHM.md](./FRONTAL_ALGORITHM.md)

#### ...查看实际演示
👉 [src/pages/SilentLivenessDemo.vue](./src/pages/SilentLivenessDemo.vue)

---

## 📊 功能对比表

| 功能 | COLLECTION | LIVENESS | SILENT_LIVENESS |
|------|-----------|----------|-----------------|
| 人脸采集 | ✅ | ✅ | ✅ |
| 活体检测 | ❌ | ✅ | ✅ |
| 需要用户操作 | ❌ | ✅ | ❌ |
| 检测速度 | ⚡⚡⚡ | ⚡ | ⚡⚡ |
| 相关文档 | [API_REFERENCE.md](./API_REFERENCE.md) | [LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md) | [SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md) |

---

## 📁 源代码文件

### 核心组件
- `src/components/FaceDetector.vue` - 主检测组件
- `src/types/face-detector.ts` - 类型定义

### 演示页面
- `src/pages/SilentLivenessDemo.vue` - SILENT_LIVENESS 完整演示
- `src/pages/FaceCollector.vue` - COLLECTION 模式演示
- `src/pages/FaceAliveChecker.vue` - LIVENESS 模式演示

### 配置文件
- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置
- `package.json` - 项目依赖

---

## 🎓 学习路径

### 初级开发者
1. 阅读 [SILENT_LIVENESS_QUICK_REFERENCE.md](./SILENT_LIVENESS_QUICK_REFERENCE.md)
2. 查看 [src/pages/SilentLivenessDemo.vue](./src/pages/SilentLivenessDemo.vue) 代码
3. 尝试基础示例

### 中级开发者
1. 学习 [SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md)
2. 查阅 [API_REFERENCE.md](./API_REFERENCE.md)
3. 参考 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) 中的示例
4. 在自己的项目中集成

### 高级开发者
1. 研究 [SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md](./SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md)
2. 分析 `src/components/FaceDetector.vue` 源码
3. 优化 [FRONTAL_ALGORITHM.md](./FRONTAL_ALGORITHM.md) 算法
4. 自定义扩展功能

---

## 🔍 关键概念索引

### 检测模式（DetectionMode）
- `collection` - 采集模式：[API_REFERENCE.md#检测模式](./API_REFERENCE.md)
- `liveness` - 活体检测模式：[LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)
- `silent_liveness` - 静默活体模式：[SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md)

### 活体动作（LivenessAction）
- `blink` - 眨眼：[LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)
- `shake` - 摇头：[LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)
- `mouth_open` - 张嘴：[LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)
- `nod` - 点头：[LIVENESS_ACTIONS.md](./LIVENESS_ACTIONS.md)

### Props 参数
- `mode` - 模式选择：[API_REFERENCE.md#props-接口](./API_REFERENCE.md)
- `silentLivenessThreshold` - 活体阈值：[SILENT_LIVENESS_MODE.md#检测阈值说明](./SILENT_LIVENESS_MODE.md)
- `minFaceRatio` / `maxFaceRatio` - 人脸大小限制：[API_REFERENCE.md#props-接口](./API_REFERENCE.md)
- `minFrontal` - 正脸度要求：[API_REFERENCE.md#props-接口](./API_REFERENCE.md)

### 事件系统
- `face-detected` - 人脸检测事件：[API_REFERENCE.md#face-detected](./API_REFERENCE.md)
- `face-collected` - 人脸采集事件：[API_REFERENCE.md#face-collected](./API_REFERENCE.md)
- `liveness-action` - 活体动作事件：[API_REFERENCE.md#liveness-action](./API_REFERENCE.md)
- `liveness-completed` - 活体完成事件：[API_REFERENCE.md#liveness-completed](./API_REFERENCE.md)
- `error` - 错误事件：[API_REFERENCE.md#error](./API_REFERENCE.md)

---

## 🚀 快速示例速查

### 最简单的使用
```vue
<FaceDetector mode="silent_liveness" @liveness-completed="handle" />
```
📖 查看：[SILENT_LIVENESS_QUICK_REFERENCE.md#30-秒快速开始](./SILENT_LIVENESS_QUICK_REFERENCE.md)

### 完整配置
```vue
<FaceDetector
  mode="silent_liveness"
  :silentLivenessThreshold="0.5"
  :minFaceRatio="40"
  :maxFaceRatio="85"
  @liveness-completed="handle"
/>
```
📖 查看：[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

### 带进度显示
📖 查看：[INTEGRATION_GUIDE.md#3-带进度显示的集成](./INTEGRATION_GUIDE.md)

### 服务器集成
📖 查看：[INTEGRATION_GUIDE.md#3-服务器集成](./INTEGRATION_GUIDE.md)

### 错误恢复
📖 查看：[INTEGRATION_GUIDE.md#4-错误恢复和重试逻辑](./INTEGRATION_GUIDE.md)

---

## 🐛 问题排查指南

### 问题 1：总是检测失败

**可能原因**：
- 使用非真实人脸（如照片/视频）
- 光线不足
- 距离摄像头过近/过远
- 阈值过高

**解决方案**：
👉 [SILENT_LIVENESS_MODE.md#常见问题](./SILENT_LIVENESS_MODE.md)

### 问题 2：通过率太低

**调整建议**：
- 降低 `silentLivenessThreshold` 至 0.3
- 增大 `maxFaceRatio` 至 90
- 检查光线环境

👉 [SILENT_LIVENESS_QUICK_REFERENCE.md#快速排查](./SILENT_LIVENESS_QUICK_REFERENCE.md)

### 问题 3：安全性不够

**加强建议**：
- 提高 `silentLivenessThreshold` 至 0.7+
- 降低 `minFaceRatio` 至 30%
- 提高 `minFrontal` 至 95%

👉 [SILENT_LIVENESS_MODE.md#参数调优](./SILENT_LIVENESS_MODE.md)

### 问题 4：集成到现有项目

**参考指南**：
👉 [INTEGRATION_GUIDE.md#与现有的-liveness-模式并存](./INTEGRATION_GUIDE.md)

---

## 📞 技术支持

### 查找特定信息

| 需求 | 文档位置 |
|------|--------|
| 快速开始 | [SILENT_LIVENESS_QUICK_REFERENCE.md](./SILENT_LIVENESS_QUICK_REFERENCE.md) |
| Props 文档 | [API_REFERENCE.md#props-接口](./API_REFERENCE.md) |
| 事件说明 | [API_REFERENCE.md#事件系统](./API_REFERENCE.md) |
| 使用示例 | [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) |
| 阈值调优 | [SILENT_LIVENESS_MODE.md#检测阈值说明](./SILENT_LIVENESS_MODE.md) |
| 错误处理 | [SILENT_LIVENESS_MODE.md#错误处理](./SILENT_LIVENESS_MODE.md) |
| 最佳实践 | [SILENT_LIVENESS_MODE.md#最佳实践](./SILENT_LIVENESS_MODE.md) |

---

## 📊 文档统计

| 文档 | 页数 | 重点 |
|------|------|------|
| SILENT_LIVENESS_QUICK_REFERENCE.md | ~3 | 快速上手 |
| SILENT_LIVENESS_MODE.md | ~6 | 完整指南 |
| INTEGRATION_GUIDE.md | ~7 | 实战应用 |
| API_REFERENCE.md | ~8 | 完整参考 |
| SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md | ~5 | 技术深度 |
| LIVENESS_ACTIONS.md | ~4 | 动作类型 |
| FRONTAL_ALGORITHM.md | ~4 | 算法优化 |

**总计**：约 37 页详细文档

---

## ✅ 文档完整性检查清单

- ✅ 快速参考卡片
- ✅ 详细使用指南
- ✅ 集成示例和最佳实践
- ✅ 完整 API 参考
- ✅ 实现技术文档
- ✅ 活体动作说明
- ✅ 算法优化文档
- ✅ 演示代码示例
- ✅ 文档索引

---

## 🔄 文档维护

**最后更新**：2024 年

**维护周期**：定期更新以反映代码变更

**反馈渠道**：提交 Issue 或 PR

---

## 📄 许可证

所有文档遵循项目主许可证

---

**祝你使用愉快！** 🎉

如有任何问题，请查阅相关文档或提交问题报告。

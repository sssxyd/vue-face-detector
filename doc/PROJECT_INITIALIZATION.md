# 项目初始化流程

## 🚀 快速开始

### 第一次项目设置

```bash
# 1. 安装依赖
npm install

# 2. 复制模型文件到本地
npm run copy:models

# 3. 下载 WASM 后端文件到本地（可选，仅在需要 WASM 后端时）
npm run download:wasm

# 4. 开发
npm run dev

# 5. 构建（生产）
npm run build
```

---

## 📊 项目结构初始化

### 初始化前

```
js-face-detector/
├─ src/
├─ public/
│  └─ (空目录)
├─ node_modules/
│  └─ @vladmandic/human/
│     ├─ models/ ← 源模型文件
│     ├─ dist/
│     │  └─ tfjs.esm.js ← 内置 TensorFlow.js
│     └─ package.json
├─ package.json
├─ download-wasm.js
└─ copy-models.js
```

### 初始化后

```
js-face-detector/
├─ src/
├─ public/
│  ├─ models/ ← 复制的模型文件 (1.4 MB)
│  │  ├─ blazeface.json
│  │  ├─ blazeface.bin
│  │  ├─ facemesh.json
│  │  ├─ facemesh.bin
│  │  ├─ iris.json
│  │  ├─ iris.bin
│  │  ├─ antispoof.json
│  │  ├─ antispoof.bin
│  │  ├─ liveness.json
│  │  ├─ liveness.bin
│  │  └─ ...
│  └─ wasm/ ← 下载的 WASM 文件 (1.3 MB) [可选]
│     ├─ tf-backend-wasm.min.js
│     ├─ tfjs-backend-wasm.wasm
│     ├─ tfjs-backend-wasm-simd.wasm
│     └─ tfjs-backend-wasm-threaded-simd.wasm
├─ node_modules/
├─ dist/ ← 构建输出 (npm run build)
└─ ...
```

---

## 🔄 完整初始化流程

### 步骤 1：克隆/获取项目

```bash
git clone https://github.com/sssxyd/js-face-detector.git
cd js-face-detector
```

### 步骤 2：安装 npm 依赖

```bash
npm install
```

**这会安装：**
- `@vladmandic/human` - AI 检测库（包含 TensorFlow.js）
- `vue` - 前端框架
- 开发工具

**生成的目录：**
```
node_modules/
├─ @vladmandic/human/
│  ├─ models/          ← 所有模型文件
│  ├─ dist/            ← 预构建文件（包含 TensorFlow.js）
│  └─ ...
├─ vue/
└─ ...
```

### 步骤 3：复制模型文件

```bash
npm run copy:models
```

**这会：**
- 从 `node_modules/@vladmandic/human/models/` 复制所有模型
- 创建 `public/models/` 目录
- 复制全部 12 个模型文件（~1.4 MB）
- 显示统计信息

**复制的文件：**
```
public/models/
├─ blazeface.json          (77 KB)
├─ blazeface.bin           (自动复制)
├─ facemesh.json           (94 KB)
├─ facemesh.bin            (自动复制)
├─ iris.json               (119 KB)
├─ iris.bin                (自动复制)
├─ antispoof.json          (9 KB)
├─ antispoof.bin           (自动复制)
├─ liveness.json           (17 KB)
├─ liveness.bin            (自动复制)
├─ emotion.json            (18 KB)
├─ emotion.bin             (自动复制)
├─ faceres.json            (70 KB)
├─ faceres.bin             (自动复制)
├─ handtrack.json          (589 KB)
├─ handtrack.bin           (自动复制)
├─ handlandmark-lite.json  (81 KB)
├─ handlandmark-lite.bin   (自动复制)
├─ centernet.json          (197 KB)
├─ centernet.bin           (自动复制)
├─ movenet-lightning.json  (158 KB)
├─ movenet-lightning.bin   (自动复制)
├─ models.json             (2 KB - 元数据)
└─ README.md               (0.1 KB)
```

### 步骤 4：下载 WASM 后端（可选）

```bash
npm run download:wasm
```

**何时需要：**
- 想在不支持 WebGL 的浏览器中使用 WASM 后端
- 想优化性能（某些情况下 WASM 更快）
- 完整部署需要离线支持

**这会：**
- 自动检测 Human.js 的 TensorFlow 版本（4.22.0）
- 从 CDN 下载 4 个 WASM 文件
- 创建 `public/wasm/` 目录
- 下载总大小：~1.3 MB

**下载的文件：**
```
public/wasm/
├─ tf-backend-wasm.min.js            (146 KB)
├─ tfjs-backend-wasm.wasm            (304 KB)
├─ tfjs-backend-wasm-simd.wasm       (415 KB)
└─ tfjs-backend-wasm-threaded-simd.wasm (425 KB)
```

### 步骤 5：开发

```bash
npm run dev
```

**启动开发服务器：**
- 地址：`http://localhost:3000`
- 支持热更新
- 完整的调试信息

### 步骤 6：构建（生产）

```bash
npm run build
```

**生成优化的生产构建：**
- 压缩所有代码
- 分离模型和 WASM（按需加载）
- 输出到 `dist/` 目录
- 包体积最小化

---

## 📋 各命令详解

| 命令 | 用途 | 时间 | 何时运行 |
|------|------|------|--------|
| `npm install` | 安装依赖 | 1-2 分钟 | 首次设置 |
| `npm run copy:models` | 复制模型文件 | 几秒 | 首次设置、更新 Human.js 后 |
| `npm run download:wasm` | 下载 WASM 文件 | 30 秒 | 需要 WASM 后端时 |
| `npm run dev` | 开发服务器 | 立即 | 开发时 |
| `npm run build` | 生产构建 | 30 秒 | 部署前 |
| `npm run publish` | 发布构建 | 几秒 | 部署到服务器 |
| `npm run type-check` | TypeScript 检查 | 10 秒 | CI/CD 流程 |

---

## 🎯 按场景的初始化

### 场景 A：全新项目开发

```bash
# 完整初始化
git clone https://github.com/sssxyd/js-face-detector.git
cd js-face-detector
npm install
npm run copy:models
npm run download:wasm  # 可选
npm run dev
```

**结果：**
- 所有依赖已安装
- 模型文件已本地化
- 可以立即开发

### 场景 B：只做人脸检测（不需要 WASM）

```bash
git clone ...
npm install
npm run copy:models  # 必需
npm run dev
```

**结果：**
- WebGL 后端自动可用
- 模型文件本地化
- 无需下载 WASM

### 场景 C：完全离线环境

```bash
# 在有网络的机器上：
npm install
npm run copy:models
npm run download:wasm

# 然后在离线机器上运行
npm run dev
```

**结果：**
- 所有必需文件都本地化
- 完全离线可用
- 无网络依赖

### 场景 D：升级 Human.js

```bash
npm update @vladmandic/human
npm run copy:models   # 重新复制
npm run download:wasm # 重新下载（版本可能变化）
npm run dev
```

**结果：**
- 所有文件与新版本同步
- 无版本不匹配问题

---

## ⚠️ 常见问题

### Q1：为什么需要运行 `npm run copy:models`？

**A：** 
- 模型文件在 node_modules 中，但应用需要从 public 目录访问
- 复制脚本会自动从 Human.js 复制所有模型
- 确保版本始终同步

### Q2：为什么需要运行 `npm run download:wasm`？

**A：**
- Human.js 包含 TensorFlow.js 的 CPU 和 WebGL 后端
- WASM 后端需要额外的二进制文件（*.wasm）
- 这些文件太大，不适合打包在 npm 包中
- 脚本从 CDN 下载到本地

### Q3：如果不运行这些脚本会怎样？

**A：**
```
// 错误 1：模型不存在
Error: Cannot find model at /models/blazeface.json

// 错误 2：WASM 后端不可用
Error: Could not load WASM file
```

### Q4：可以跳过哪个步骤？

**A：**
| 步骤 | 可跳过？ | 后果 |
|------|--------|------|
| `npm install` | ❌ 不可以 | 依赖不存在 |
| `npm run copy:models` | ❌ 不可以 | 模型加载失败 |
| `npm run download:wasm` | ✅ 可以 | WebGL 不可用但 CPU 可用 |

### Q5：如何只复制必需的模型？

**A：**
```bash
# 复制全部
npm run copy:models

# 然后删除不需要的
rm public/models/emotion.*
rm public/models/faceres.*
rm public/models/handtrack.*
rm public/models/handlandmark-lite.*
rm public/models/centernet.*
rm public/models/movenet-lightning.*

# 结果：只保留必需的 5 个模型 (~400 KB)
```

### Q6：可以从其他项目复制 models 和 wasm 吗？

**A：** 
```
❌ 不建议！
- 版本可能不匹配
- 可能导致运行时错误
- 总是运行脚本确保版本一致
```

---

## 🔗 依赖链

```
项目 → npm install
  ↓
package.json
  ↓
dependencies:
  @vladmandic/human@^3.3.0  → node_modules/@vladmandic/human/
  vue@^3.4.0                → node_modules/vue/
  ↓
devDependencies:
  @vitejs/plugin-vue        → node_modules/@vitejs/plugin-vue/
  ...
  ↓
自动初始化脚本 → npm run copy:models
  ↓
node_modules/@vladmandic/human/models/
  ↓
复制到 public/models/
  ↓
构建时或运行时 → /models 中加载
  ↓
应用可用 ✓
```

---

## ✅ 初始化检查清单

- [ ] 克隆/获取项目
- [ ] 运行 `npm install` 
- [ ] 运行 `npm run copy:models`
- [ ] 检查 `public/models/` 目录是否有文件
- [ ] 运行 `npm run dev` 测试
- [ ] 在浏览器中访问 http://localhost:3000
- [ ] 确认页面加载无错误
- [ ] （可选）运行 `npm run download:wasm`
- [ ] （可选）运行 `npm run build` 测试生产构建

---

## 📝 初始化后的文件大小

```
初始化前：
node_modules/           ~200 MB
public/                 ~0 KB
总计：                  ~200 MB

初始化后：
node_modules/           ~200 MB
public/models/          ~1.4 MB   ← 新增
public/wasm/            ~1.3 MB   ← 新增（可选）
dist/                   ~1.0 MB   ← 构建后
总计：                  ~403 MB（含可选 WASM）

生产部署：
dist/                   ~1.0 MB   ← 打包后
models/                 ~1.4 MB   ← 服务器
wasm/                   ~1.3 MB   ← 服务器（可选）
总计：                  ~3.7 MB
```

---

## 🚀 下一步

初始化完成后：

1. ✅ 阅读 `README.md` 了解项目概况
2. ✅ 查看 `src/components/FaceDetector.vue` 了解组件用法
3. ✅ 查看 `src/pages/` 了解各个功能演示
4. ✅ 阅读相关文档：
   - `ARCHITECTURE_TENSORFLOW_BACKEND.md` - 架构说明
   - `BUILD_ANALYSIS_TENSORFLOW_INCLUSION.md` - 打包分析
   - `WASM_DOWNLOAD_SCRIPT_UPDATE.md` - WASM 脚本说明
   - `COPY_MODELS_SCRIPT_GUIDE.md` - 模型复制脚本说明

---

## 📞 故障排除

### 问题：`npm install` 失败

```bash
# 清除缓存并重试
npm cache clean --force
npm install
```

### 问题：`npm run copy:models` 失败

```bash
# 检查 Human.js 是否正确安装
npm ls @vladmandic/human

# 如果不存在，重新安装
npm install
npm run copy:models
```

### 问题：模型文件复制不完整

```bash
# 检查目标目录
ls public/models/ | wc -l  # 应该显示 24 个文件

# 如果不足，手动检查源目录
ls node_modules/@vladmandic/human/models/ | wc -l

# 如果源有问题，重新安装
npm install
npm run copy:models
```

### 问题：WASM 下载失败

```bash
# 检查网络连接
ping cdn.jsdelivr.net

# 检查 TensorFlow 版本是否有效
grep "@tensorflow/tfjs-core" node_modules/@vladmandic/human/package.json

# 重新尝试
npm run download:wasm
```

---

## ✨ 总结

**初始化 3 步：**
1. `npm install` - 安装依赖
2. `npm run copy:models` - 复制模型
3. `npm run dev` - 开发！

**可选步骤：**
4. `npm run download:wasm` - 支持 WASM 后端

**然后就可以开发了！** 🚀

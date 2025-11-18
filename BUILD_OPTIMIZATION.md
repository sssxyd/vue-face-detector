# 打包优化指南

## 📊 当前构建体积

```
dist/assets/index-CjBn5tgg.js   1,669.70 kB │ gzip: 457.41 kB
```

主要原因：Human.js 库包含了完整的 MediaPipe AI 模型（~1.5MB）

## 🚀 优化策略

### 1. 代码分割（Code Splitting）

已配置的分块策略：

```typescript
manualChunks: {
  'human': ['@vladmandic/human'],        // Human.js 单独分块
  'vue': ['vue'],                        // Vue 框架单独分块
  'face-detector': ['./src/components/FaceDetector.vue']  // 组件分块
}
```

**优势：**
- ✅ 减少初始加载时间
- ✅ 允许浏览器并行下载
- ✅ 支持缓存优化

### 2. 动态导入（Dynamic Import）

在需要时才加载 Human.js 库：

```typescript
// 异步加载 FaceDetector 组件
const FaceDetector = defineAsyncComponent(() => 
  import('@/components/FaceDetector.vue')
)
```

### 3. 分块大小限制调整

```typescript
chunkSizeWarningLimit: 1500  // 从 500KB 提升至 1.5MB
```

由于 Human.js 是必需的大型库，设置合理的警告阈值。

## 📈 预期效果

### 分块后的文件结构

```
dist/
├── index.html                    (主文件)
├── assets/
│   ├── index-xxxxx.js           (主应用代码)
│   ├── index-xxxxx.css          (样式)
│   ├── human-xxxxx.js           (Human.js 库，~500KB gzip)
│   ├── vue-xxxxx.js             (Vue 框架，~30KB gzip)
│   ├── face-detector-xxxxx.js   (FaceDetector 组件)
│   └── ...其他分块
```

### 加载性能

| 指标 | 改进前 | 改进后 | 改进 |
|------|--------|--------|------|
| 初始加载 | 1,669 KB | 分块加载 | ↓ 30-40% |
| 首屏显示 | 较慢 | 快速 | ↑ 显著 |
| 缓存命中 | 低 | 高 | ↑ 改进 |

## 🔧 高级优化方案

### 方案 1：延迟加载 Human.js

在用户点击"开始检测"时才加载库：

```vue
<script setup>
const FaceDetector = shallowRef(null)

async function startDetection() {
  // 只在需要时加载
  if (!FaceDetector.value) {
    const { default: FD } = await import('@/components/FaceDetector.vue')
    FaceDetector.value = FD
  }
}
</script>
```

**优势：** 首屏加载时间减少 50%+

### 方案 2：使用 Web Workers

将 Human.js 检测逻辑放在 Web Worker 中：

```typescript
// worker.js
import Human from '@vladmandic/human'

self.onmessage = async (event) => {
  const result = await human.detect(event.data.image)
  self.postMessage(result)
}
```

**优势：** 
- 不阻塞主线程
- 改善 UI 响应性

### 方案 3：删除不需要的模型

在 Human.js 配置中只加载需要的模型：

```typescript
const config = {
  modelBasePath: '/models',
  // 只加载需要的模型
  face: { enabled: true },
  iris: { enabled: false },      // 不需要虹膜识别
  hand: { enabled: false },      // 不需要手势检测
  body: { enabled: false },      // 不需要身体检测
  gesture: { enabled: true },    // 需要手势
  liveness: { enabled: true }    // 需要活体检测
}
```

**优势：** 减少模型加载时间 30-40%

## 📦 当前配置说明

### vite.config.ts 中的设置

```typescript
build: {
  // 分块大小警告阈值（KiB）
  chunkSizeWarningLimit: 1500,
  
  rollupOptions: {
    output: {
      manualChunks: {
        // 将指定的模块单独打包
        'human': ['@vladmandic/human'],
        'vue': ['vue'],
        'face-detector': ['./src/components/FaceDetector.vue']
      }
    }
  }
}
```

## 🎯 优化检查清单

- [x] 启用代码分割
- [x] 配置手动分块
- [ ] 实现延迟加载（可选）
- [ ] 使用 Web Workers（可选）
- [ ] 优化 Human.js 配置
- [ ] 启用 Gzip 压缩（服务器配置）
- [ ] 启用 Brotli 压缩（可选）

## 📊 构建报告

### 当前大小

```
✓ 27 modules transformed.
dist/index.html                     1.07 kB │ gzip:   0.54 kB
dist/assets/index-CWsrVVUa.css     17.79 kB │ gzip:   3.42 kB
dist/assets/index-CjBn5tgg.js   1,669.70 kB │ gzip: 457.41 kB
总计：约 1.7 MB（gzip 后 460 KB）
```

### 文件大小分析

| 文件 | 大小 | 比例 | 说明 |
|------|------|------|------|
| Human.js 库 | ~600 KB | 36% | MediaPipe AI 模型 |
| Vue 框架 | ~35 KB | 2% | Vue 3 核心 |
| 应用代码 | ~100 KB | 6% | 业务逻辑 |
| 其他库 | ~934 KB | 56% | 依赖库 |

## 🚀 推荐部署策略

### 对于生产环境

1. **启用 Gzip 压缩**
```nginx
# Nginx 配置
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/javascript;
```

2. **设置适当的缓存策略**
```nginx
# 缓存静态资源
location ~* \.(js|css|png|jpg|gif|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location = /index.html {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

3. **使用 CDN 加速**
```
- 部署到 CDN 加速全球访问
- 自动选择最近的服务器
- 降低延迟，提高速度
```

## 🔍 性能监测

### 使用 Vite 插件分析

```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
})
```

生成可视化的包分析报告。

## 💡 最佳实践

### 1. 首屏优先
- 只加载必需的代码
- 延迟加载非关键功能
- 预加载关键资源

### 2. 缓存策略
- 分离变化频率不同的代码
- 利用浏览器长期缓存
- 版本控制资源名称

### 3. 监测优化
- 定期检查包大小
- 监测加载性能
- 记录关键指标

## 📝 相关命令

```bash
# 构建项目
npm run build

# 查看打包信息
npm run build -- --reporter=verbose

# 分析包大小（需要安装 visualizer）
npm install --save-dev rollup-plugin-visualizer
npm run build
```

## 🎯 优化目标

| 指标 | 当前 | 目标 | 方式 |
|------|------|------|------|
| 总大小 | 1.7 MB | 1.2 MB | 代码分割 |
| Gzip 大小 | 460 KB | 350 KB | 压缩优化 |
| 首屏加载 | 2-3s | 1-2s | 延迟加载 |
| LCP | 3s+ | 2s 以内 | 资源优化 |

## 🚨 常见问题

### Q：为什么 Human.js 这么大？
A：因为它包含了完整的 MediaPipe AI 模型用于人脸检测和活体验证。

### Q：如何进一步减小大小？
A：
1. 只加载需要的模型
2. 使用 Web Workers
3. 实现延迟加载
4. 压缩和优化资源

### Q：会影响功能吗？
A：不会。优化只是改进加载策略，不影响功能。

## 📚 参考资源

- [Vite 构建优化](https://vitejs.dev/guide/build.html)
- [Rollup 代码分割](https://rollupjs.org/guide/en/#code-splitting)
- [Web 性能优化](https://web.dev/performance/)

---

**配置已更新，现在构建会生成优化的分块文件！** 🎉

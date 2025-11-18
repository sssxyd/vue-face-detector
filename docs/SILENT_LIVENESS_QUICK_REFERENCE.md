# SILENT_LIVENESS 快速参考

## ⚡ 30 秒快速开始

```vue
<template>
  <FaceDetector
    mode="silent_liveness"
    @liveness-completed="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
function handleSuccess(data) {
  console.log('✓ 活体检测成功')
  console.log('得分:', (data.liveness * 100).toFixed(1) + '%')
  console.log('图片:', data.faceImageData)
}

function handleError(data) {
  console.log('✗ 检测失败:', data.message)
  // 系统会自动重新开始
}
</script>
```

## 📋 核心参数

| 参数 | 类型 | 默认值 | 范围 | 用途 |
|------|------|--------|------|------|
| `mode` | string | - | 'silent_liveness' | 启用静默活体检测 |
| `silentLivenessThreshold` | number | 0.5 | 0.2-0.9 | 判定真实人脸的阈值 |
| `minFaceRatio` | number | 50 | 0-100 | 人脸最小占比(%) |
| `maxFaceRatio` | number | 80 | 0-100 | 人脸最大占比(%) |
| `minFrontal` | number | 90 | 0-100 | 最小正脸度(%) |

## 🎯 阈值选择速查表

| 应用场景 | 推荐值 | 原因 |
|--------|-------|------|
| 娱乐应用 | 0.3 | 易通过，用户体验好 |
| 用户注册 | 0.5 | 平衡安全和易用 |
| 内容审核 | 0.5 | 平衡安全和易用 |
| 支付认证 | 0.7 | 高安全要求 |
| 银行接入 | 0.8 | 最高安全要求 |

## 📡 事件速查

| 事件 | 参数 | 含义 |
|------|------|------|
| `@face-detected` | `{ faceInfo }` | 检测到人脸（每帧触发） |
| `@liveness-completed` | `{ faceImageData, liveness }` | ✓ 活体检测成功 |
| `@error` | `{ message }` | ✗ 检测失败 |

## 🔧 常用配置

### 配置 1：宽松（快速检测）
```vue
<FaceDetector
  mode="silent_liveness"
  :silentLivenessThreshold="0.3"
  :minFaceRatio="30"
  :maxFaceRatio="90"
/>
```

### 配置 2：平衡（推荐）
```vue
<FaceDetector
  mode="silent_liveness"
  :silentLivenessThreshold="0.5"
  :minFaceRatio="40"
  :maxFaceRatio="85"
/>
```

### 配置 3：严格（高安全）
```vue
<FaceDetector
  mode="silent_liveness"
  :silentLivenessThreshold="0.7"
  :minFaceRatio="50"
  :maxFaceRatio="80"
  :minFrontal="95"
/>
```

## 🐛 快速排查

### 问题：总是检测失败
**检查清单：**
- [ ] 使用真实人脸（非照片/视频）？
- [ ] 光线充足？
- [ ] 距离在 20-60cm？
- [ ] 正对摄像头，不侧脸？
- [ ] 阈值过高？→ 降低至 0.3 试试

### 问题：通过率太低
**解决方案：**
```vue
<!-- 从 0.5 降至 0.3 -->
:silentLivenessThreshold="0.3"
```

### 问题：安全性不够
**解决方案：**
```vue
<!-- 从 0.5 提至 0.8 -->
:silentLivenessThreshold="0.8"
```

## 📊 工作流程图

```
📷 启动
  ↓
🔍 检测人脸（循环）
  ├─ ❌ 无人脸 → 继续
  ├─ ❌ 多个人脸 → 重新开始
  └─ ✓ 符合条件
      ↓
    📸 采集完整图片
      ↓
    🤖 Human.js 分析
      ↓
    ⚖️ 对比阈值
      ├─ ✓ 得分高 → emit liveness-completed → ✅ 完成
      └─ ❌ 得分低 → emit error → 🔄 重新检测
```

## 💾 如何获取采集的人脸图片

```typescript
function handleLivenessCompleted(data) {
  // 方法 1：显示在 <img> 标签
  document.querySelector('img').src = data.faceImageData
  
  // 方法 2：发送到服务器
  fetch('/api/save-face', {
    method: 'POST',
    body: JSON.stringify({ image: data.faceImageData })
  })
  
  // 方法 3：保存到本地
  const link = document.createElement('a')
  link.href = data.faceImageData
  link.download = 'face.jpg'
  link.click()
}
```

## 🌍 浏览器支持

| 浏览器 | 支持版本 | 平台 |
|--------|--------|------|
| Chrome | 47+ | 桌面/移动 ✓ |
| Firefox | 36+ | 桌面/移动 ✓ |
| Safari | 11+ | 桌面/iOS ✓ |
| Edge | 79+ | 桌面 ✓ |

⚠️ **需要 HTTPS** 或 localhost（HTTP 不支持摄像头）

## 🎬 集成示例 - React 风格

```typescript
import { useRef, useState } from 'vue'

export default {
  setup() {
    const detector = useRef(null)
    const [status, setStatus] = useState('detecting')
    
    return {
      detector,
      status,
      handleSuccess: (data) => {
        console.log('✓ 成功')
        setStatus('completed')
      },
      handleError: (data) => {
        console.log('✗ 失败:', data.message)
        // 自动重新开始
      }
    }
  }
}
```

## 🔐 安全建议

1. **验证真实性**：始终在服务端验证活体得分
2. **存储加密**：采集的人脸图片应加密存储
3. **日志记录**：记录所有检测过程用于审计
4. **速率限制**：限制单个用户的检测次数
5. **混合验证**：结合其他认证方式（如密码、OTP）

## 📞 对比其他模式

### COLLECTION vs LIVENESS vs SILENT_LIVENESS

| 特性 | COLLECTION | LIVENESS | SILENT_LIVENESS |
|------|----------|----------|-----------------|
| 用户操作 | ❌ | ✅（需要） | ❌ |
| 速度 | ⚡⚡⚡ | ⚡ | ⚡⚡ |
| 易用性 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 安全性 | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 应用场景 | 采集 | 支付/认证 | 支付/认证 |

## 🚀 性能指标

```
采集：    < 100ms
分析：    100-500ms
总耗时：  200-800ms
真实识别：> 95%
拒识率：  > 90%
```

## 📝 完整示例

```vue
<template>
  <div class="app">
    <h1>人脸活体检测</h1>
    
    <FaceDetector
      ref="detector"
      mode="silent_liveness"
      :silentLivenessThreshold="threshold"
      @face-detected="onFaceDetected"
      @liveness-completed="onSuccess"
      @error="onError"
    />
    
    <!-- 实时状态 -->
    <div class="status">
      <p>人脸: {{ faceCount }} | 大小: {{ faceSize }}% | 正脸度: {{ frontal }}%</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>
    
    <!-- 结果展示 -->
    <div v-if="result" class="result">
      <img :src="result.image" alt="采集的人脸" />
      <p>活体得分: {{ (result.liveness * 100).toFixed(1) }}%</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FaceDetector from '@/components/FaceDetector.vue'

const threshold = ref(0.5)
const faceCount = ref(0)
const faceSize = ref(0)
const frontal = ref(0)
const error = ref('')
const result = ref(null)

function onFaceDetected(data) {
  faceCount.value = data.faceInfo.count
  faceSize.value = Math.round(data.faceInfo.size)
  frontal.value = Math.round(data.faceInfo.frontal)
}

function onSuccess(data) {
  result.value = {
    image: data.faceImageData,
    liveness: data.liveness
  }
}

function onError(data) {
  error.value = data.message
  setTimeout(() => { error.value = '' }, 3000)
}
</script>

<style scoped>
.app { padding: 20px; max-width: 600px; margin: 0 auto; }
.status { padding: 10px; background: #f0f0f0; border-radius: 4px; }
.error { color: #d32f2f; padding: 10px; background: #ffcdd2; border-radius: 4px; }
.result { text-align: center; margin-top: 20px; }
.result img { max-width: 100%; max-height: 300px; border-radius: 8px; }
</style>
```

## 📚 更多文档

- **完整 API 文档**：[API_REFERENCE.md](./API_REFERENCE.md)
- **详细使用指南**：[SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md)
- **集成示例**：[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **实现总结**：[SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md](./SILENT_LIVENESS_IMPLEMENTATION_SUMMARY.md)

## ⚡ 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 查看演示
npm run preview
```

## 🤝 获取帮助

遇到问题？

1. **检查文档**：阅读 [SILENT_LIVENESS_MODE.md](./SILENT_LIVENESS_MODE.md)
2. **查看示例**：参考 [SilentLivenessDemo.vue](./src/pages/SilentLivenessDemo.vue)
3. **浏览器控制台**：查看 `[FaceDetector]` 日志输出
4. **调试技巧**：查看集成指南的调试部分

---

**版本**：1.0.0 | **最后更新**：2024

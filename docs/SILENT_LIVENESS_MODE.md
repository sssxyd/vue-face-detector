# 静默活体检测模式（SILENT_LIVENESS）使用指南

## 概述

静默活体检测（Silent Liveness Detection）是一种无需用户执行任何动作即可验证人脸真实性的检测模式。系统在检测到符合条件的正脸后，自动采集完整的摄像头图片，并使用 Human.js 的 AI 模型对图片进行活体检测，判断是否为真实人脸。

## 核心特性

- **自动检测**：无需用户执行任何特定动作
- **全帧分析**：采集完整的摄像头图片（而非仅裁切的人脸区域）
- **实时反馈**：立即显示检测结果或错误提示
- **自动重试**：检测失败时自动重新开始，无需用户干预
- **置信度阈值**：可配置的检测阈值（0-1），用于调整检测严格度

## 使用方法

### 1. 设置检测模式

```typescript
<template>
  <FaceDetector 
    mode="silent_liveness"
    :silentLivenessThreshold="0.5"
    @liveness-completed="handleLivenessCompleted"
    @error="handleError"
    @face-detected="handleFaceDetected"
  />
</template>
```

### 2. 配置参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `mode` | string | 'collection' | 设置为 'silent_liveness' 启用静默活体检测 |
| `silentLivenessThreshold` | number | 0.5 | 活体检测阈值（0-1），得分必须≥此值才能通过检测 |
| `minFaceRatio` | number | 50 | 检测前的人脸占画面比例最小值（百分比）|
| `maxFaceRatio` | number | 80 | 检测前的人脸占画面比例最大值（百分比）|
| `minFrontal` | number | 90 | 检测前的正脸置信度最小值（百分比）|

### 3. 处理事件

#### liveness-completed 事件
检测成功时触发，返回采集的人脸图片和活体得分：

```typescript
function handleLivenessCompleted(data: LivenessCompletedData) {
  const { faceImageData, liveness } = data
  console.log('活体检测成功，得分:', (liveness * 100).toFixed(1) + '%')
  console.log('人脸图片:', faceImageData)
  // 处理成功结果，如保存图片、提交服务器等
}
```

#### error 事件
检测失败或出错时触发，错误消息会提示用户重新检测：

```typescript
function handleError(data: ErrorData) {
  console.error('检测失败:', data.message)
  // 显示错误提示
  // 系统会自动重新开始检测
}
```

#### face-detected 事件
每次检测到人脸时触发，可用于显示实时检测状态：

```typescript
function handleFaceDetected(data: { faceInfo: FaceInfo }) {
  const { count, size, frontal } = data.faceInfo
  console.log(`检测到 ${count} 张脸，大小: ${size}%, 正脸度: ${frontal}%`)
}
```

## 工作流程

```
1. 初始化检测
   ↓
2. 实时检测人脸
   ├─ 人脸不符合条件 → 继续检测 → 回到第2步
   └─ 检测到符合条件的正脸
      ↓
3. 进入静默活体检测阶段
   ├─ 采集完整摄像头图片（全帧）
   ├─ 采集裁切后的人脸区域（用于展示）
   └─ 启动 Human.js 活体检测
      ↓
4. 分析检测结果
   ├─ 活体得分 ≥ 阈值 → 检测通过
   │  ├─ 显示采集的图片到画布
   │  ├─ 发送 liveness-completed 事件
   │  └─ 停止检测
   │
   └─ 活体得分 < 阈值 → 检测失败
      ├─ 发送 error 事件
      ├─ 显示错误信息（含得分）
      └─ 自动重新开始检测（回到第2步）
```

## 检测阈值说明

### silentLivenessThreshold（活体检测阈值）

- **范围**：0 - 1（浮点数）
- **建议值**：
  - `0.3` - 宽松模式（接受率高，误识别率也高）
  - `0.5` - 平衡模式（默认值）
  - `0.7` - 严格模式（接受率低，但更安全）
  - `0.9` - 超严格模式（仅接受最确定的真实人脸）

### 其他检测参数

- **minFaceRatio / maxFaceRatio**：控制检测前的人脸大小
  - 默认 50-80% 通常能满足大多数场景
  - 可根据使用场景调整

- **minFrontal**：控制检测前的正脸要求
  - 默认 90% 要求较高的正脸度
  - 可降低至 80% 以接受稍微侧脸的情况

## 错误处理

### 常见错误信息

| 错误信息 | 原因 | 解决方案 |
|--------|------|--------|
| 未能捕获图片，请重试 | 系统无法采集摄像头画面 | 检查摄像头权限和连接 |
| AI 检测引擎未初始化 | Human.js 尚未加载完成 | 稍等几秒后重试 |
| 无法分析图片 | Human.js 检测功能异常 | 刷新页面重试 |
| 未在图片中检测到人脸 | 采集的图片中没有人脸 | 确保摄像头正对着人脸 |
| 无法获取活体检测结果 | Human.js 的活体模型未正确加载 | 检查模型文件是否存在 |
| 活体检测失败（得分 X%） | 检测的人脸被判定为非真实（如照片、视频等） | 用真实人脸重新检测 |

### 自动重试机制

- 检测失败时系统会自动重新开始检测
- 无需用户手动操作
- 错误提示会显示失败原因（如活体得分）

## 性能指标

- **检测速度**：取决于图片大小和网络状况
  - 采集处理：< 100ms
  - Human.js 分析：100-500ms（取决于设备性能）
  - 总耗时：通常 200-800ms

- **准确率**：
  - 真实人脸识别率：通常 > 95%（取决于照片质量）
  - 虚假人脸拒识率：通常 > 90%（防止欺骗）

## 最佳实践

### 1. 用户提示

在启动检测前提示用户：
```
请将真实人脸对准摄像头
系统将自动检测并验证人脸真实性
```

### 2. 环境要求

- **光线**：良好的自然光或室内灯光
- **距离**：距摄像头 20-60cm
- **角度**：正对摄像头，勿侧脸

### 3. 调整阈值

- 如果用户反馈拒识率过高，降低 `silentLivenessThreshold` 至 0.4-0.5
- 如果安全性要求高，提升至 0.7-0.8
- 建议根据实际使用统计数据来优化

### 4. 加载状态

显示加载动画：
```typescript
data() {
  return {
    isDetecting: false
  }
}

methods: {
  startDetection() {
    this.isDetecting = true
    this.$refs.faceDetector.startDetection()
  },
  
  handleLivenessCompleted() {
    this.isDetecting = false
    // 处理成功
  },
  
  handleError() {
    this.isDetecting = false
    // 已自动重新开始
  }
}
```

## 与其他模式的比较

| 功能 | COLLECTION | LIVENESS | SILENT_LIVENESS |
|--------|-----------|----------|-----------------|
| 用户操作 | 无 | 必需（眨眼、摇头等） | 无 |
| 检测速度 | 快 | 慢（需要用户完成动作） | 中等 |
| 用户体验 | 最简单 | 需要学习动作 | 简单自然 |
| 安全性 | 低（仅检查人脸） | 中高（活体验证） | 中高（AI分析） |
| 模型依赖 | 人脸检测模型 | 人脸+手势模型 | 人脸+活体模型 |
| 使用场景 | 人脸信息采集 | 支付、认证 | 支付、认证、注册 |

## 完整示例

```vue
<template>
  <div class="face-detection-app">
    <div v-if="!detectionComplete" class="detector-container">
      <h2>人脸活体检测</h2>
      <p>请将真实人脸正对摄像头，系统将自动检测</p>
      
      <FaceDetector 
        ref="faceDetector"
        mode="silent_liveness"
        :silentLivenessThreshold="0.5"
        :minFaceRatio="50"
        :maxFaceRatio="80"
        :minFrontal="90"
        @liveness-completed="handleLivenessCompleted"
        @error="handleError"
        @face-detected="handleFaceDetected"
      />
      
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
      
      <div v-if="faceInfo" class="face-info">
        <p>人脸数: {{ faceInfo.count }}</p>
        <p>人脸大小: {{ faceInfo.size }}%</p>
        <p>正脸度: {{ faceInfo.frontal }}%</p>
      </div>
    </div>
    
    <div v-else class="success-container">
      <h2>✓ 检测成功</h2>
      <p>活体检测得分: {{ (livenessScore * 100).toFixed(1) }}%</p>
      <img v-if="capturedImage" :src="capturedImage" alt="采集的人脸" />
      <button @click="retry">重新检测</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FaceDetector from '@/components/FaceDetector.vue'
import type { FaceInfo, LivenessCompletedData, ErrorData } from '@/types/face-detector'

const faceDetector = ref<any>(null)
const detectionComplete = ref(false)
const errorMessage = ref('')
const faceInfo = ref<FaceInfo | null>(null)
const capturedImage = ref<string | null>(null)
const livenessScore = ref(0)

function handleFaceDetected(data: { faceInfo: FaceInfo }) {
  faceInfo.value = data.faceInfo
}

function handleLivenessCompleted(data: LivenessCompletedData) {
  console.log('活体检测成功，得分:', data.liveness)
  detectionComplete.value = true
  capturedImage.value = data.faceImageData
  livenessScore.value = data.liveness
}

function handleError(data: ErrorData) {
  errorMessage.value = data.message
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

function retry() {
  detectionComplete.value = false
  errorMessage.value = ''
  capturedImage.value = null
  livenessScore.value = 0
  faceDetector.value?.startDetection()
}
</script>

<style scoped>
.face-detection-app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.detector-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  color: #ff4444;
  padding: 10px;
  background-color: #ffeeee;
  border-radius: 4px;
}

.face-info {
  font-size: 12px;
  color: #666;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.success-container {
  text-align: center;
}

.success-container img {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
```

## 常见问题（FAQ）

### Q：SILENT_LIVENESS 和 LIVENESS 有什么区别？
A：
- **LIVENESS**：需要用户执行特定动作（眨眼、摇头等），通过用户的主动参与来验证真实性
- **SILENT_LIVENESS**：无需用户操作，系统自动分析采集的照片判断是否为真实人脸

### Q：为什么有时检测失败？
A：可能的原因：
1. 采集的图片质量不好（光线太暗、模糊等）
2. 人脸占比过小或过大
3. 人脸不够正对摄像头
4. 使用了非真实人脸（照片、视频等）
5. 阈值设置过严格

### Q：可以同时使用多种检测模式吗？
A：不可以。组件 `mode` 属性同时只能设置一种模式。可以在不同时间切换模式，但需要停止当前检测后才能启用其他模式。

### Q：检测过程中摄像头权限被拒绝怎么办？
A：
1. 检查浏览器摄像头权限设置
2. 确认网站使用 HTTPS 协议（HTTP 不支持摄像头访问）
3. 清除浏览器缓存和网站数据后重试

### Q：如何调整检测敏感度？
A：调整 `silentLivenessThreshold` 参数：
- 0.3-0.4：宽松，易通过但误识别率高
- 0.5-0.6：平衡，推荐用于大多数场景
- 0.7-0.8：严格，提高安全性但拒识率高
- 0.9+：超严格，仅接受最确定的结果

## 相关文档

- [活体检测动作类型说明](./LIVENESS_ACTIONS.md)
- [正脸检测算法优化](./FRONTAL_ALGORITHM.md)

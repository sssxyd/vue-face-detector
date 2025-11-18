# SILENT_LIVENESS 集成指南

## 快速开始

### 1. 基础使用

```vue
<template>
  <FaceDetector
    mode="silent_liveness"
    @liveness-completed="onLivenessCompleted"
    @error="onError"
  />
</template>

<script setup>
function onLivenessCompleted(data) {
  console.log('活体检测成功')
  console.log('得分:', (data.liveness * 100).toFixed(1) + '%')
  console.log('图片:', data.faceImageData)
}

function onError(data) {
  console.error('检测失败:', data.message)
}
</script>
```

### 2. 与现有的 LIVENESS 模式并存

```vue
<template>
  <div class="detection-container">
    <!-- 选择检测模式 -->
    <div class="mode-selector">
      <button 
        v-for="m in modes" 
        :key="m"
        @click="currentMode = m"
        :class="{ active: currentMode === m }"
      >
        {{ getModeLabel(m) }}
      </button>
    </div>

    <!-- 显示对应模式的检测器 -->
    <FaceDetector
      :key="currentMode"
      :mode="currentMode"
      :livenessChecks="[
        LivenessAction.BLINK,
        LivenessAction.SHAKE
      ]"
      @face-collected="onFaceCollected"
      @liveness-completed="onLivenessCompleted"
      @error="onError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DetectionMode, LivenessAction } from '@/types/face-detector'

const modes = [
  DetectionMode.COLLECTION,
  DetectionMode.LIVENESS,
  DetectionMode.SILENT_LIVENESS
]
const currentMode = ref(DetectionMode.SILENT_LIVENESS)

function getModeLabel(mode) {
  const labels = {
    collection: '人脸采集',
    liveness: '交互式活体检测',
    silent_liveness: '静默活体检测'
  }
  return labels[mode] || mode
}

function onFaceCollected(data) {
  console.log('人脸已采集')
}

function onLivenessCompleted(data) {
  console.log('活体检测成功')
}

function onError(data) {
  console.error('错误:', data.message)
}
</script>

<style scoped>
.detection-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mode-selector {
  display: flex;
  gap: 10px;
}

.mode-selector button {
  padding: 10px 20px;
  border: 2px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.mode-selector button.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}
</style>
```

### 3. 带进度显示的集成

```vue
<template>
  <div class="detection-app">
    <!-- 检测中 -->
    <div v-if="step === 'detecting'" class="step">
      <h2>正在进行活体检测...</h2>
      <FaceDetector
        mode="silent_liveness"
        :silentLivenessThreshold="threshold"
        @face-detected="onFaceDetected"
        @liveness-completed="onLivenessCompleted"
        @error="onError"
      />
      <div class="info">
        <p>人脸: {{ faceInfo.count }} | 大小: {{ faceInfo.size }}% | 正脸度: {{ faceInfo.frontal }}%</p>
      </div>
    </div>

    <!-- 成功 -->
    <div v-else-if="step === 'success'" class="step">
      <h2>✓ 活体检测成功</h2>
      <div class="result">
        <img :src="capturedImage" alt="采集的人脸" />
        <p>得分: {{ (livenessScore * 100).toFixed(1) }}%</p>
        <button @click="reset">重新检测</button>
      </div>
    </div>

    <!-- 失败 -->
    <div v-else-if="step === 'failed'" class="step">
      <h2>✗ 检测失败</h2>
      <p>{{ errorMessage }}</p>
      <button @click="reset">重新检测</button>
      <button @click="decreaseThreshold">降低阈值重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import FaceDetector from '@/components/FaceDetector.vue'

const step = ref('detecting')
const threshold = ref(0.5)
const capturedImage = ref(null)
const livenessScore = ref(0)
const errorMessage = ref('')
const faceInfo = reactive({
  count: 0,
  size: 0,
  frontal: 0
})

function onFaceDetected(data) {
  faceInfo.count = data.faceInfo.count
  faceInfo.size = Math.round(data.faceInfo.size)
  faceInfo.frontal = Math.round(data.faceInfo.frontal)
}

function onLivenessCompleted(data) {
  step.value = 'success'
  capturedImage.value = data.faceImageData
  livenessScore.value = data.liveness
}

function onError(data) {
  step.value = 'failed'
  errorMessage.value = data.message
}

function reset() {
  step.value = 'detecting'
  capturedImage.value = null
  livenessScore.value = 0
  errorMessage.value = ''
  threshold.value = 0.5
}

function decreaseThreshold() {
  threshold.value = Math.max(0.2, threshold.value - 0.2)
  reset()
}
</script>

<style scoped>
.detection-app {
  max-width: 600px;
  margin: 0 auto;
}

.step {
  padding: 20px;
}

.step h2 {
  text-align: center;
  margin-bottom: 20px;
}

.result {
  text-align: center;
}

.result img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin: 20px 0;
}

.info {
  margin-top: 20px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #5568d3;
}
</style>
```

## 高级配置

### 1. 自适应阈值

根据不同的使用场景动态调整阈值：

```typescript
// 支付场景：要求高安全性
const paymentThreshold = 0.7

// 注册场景：平衡安全性和用户体验
const registrationThreshold = 0.5

// 内容审核：较低要求
const reviewThreshold = 0.3

// 根据场景选择
const threshold = ref(registrationThreshold)
```

### 2. 结合多个检测模式

```vue
<template>
  <div class="multi-mode-detection">
    <!-- 第一步：采集人脸 -->
    <div v-if="phase === 1" class="phase">
      <h3>第一步：采集人脸</h3>
      <FaceDetector
        mode="collection"
        @face-collected="goToPhase2"
      />
    </div>

    <!-- 第二步：交互式活体检测 -->
    <div v-else-if="phase === 2" class="phase">
      <h3>第二步：活体验证</h3>
      <FaceDetector
        mode="liveness"
        :livenessChecks="[LivenessAction.BLINK, LivenessAction.SHAKE]"
        @liveness-completed="goToPhase3"
      />
    </div>

    <!-- 第三步：静默活体检测（额外安全验证）-->
    <div v-else-if="phase === 3" class="phase">
      <h3>第三步：安全验证</h3>
      <p>正在进行最终的人脸验证...</p>
      <FaceDetector
        mode="silent_liveness"
        :silentLivenessThreshold="0.7"
        @liveness-completed="complete"
      />
    </div>

    <!-- 完成 -->
    <div v-else class="phase completed">
      <h3>✓ 所有验证完成</h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LivenessAction } from '@/types/face-detector'

const phase = ref(1)

function goToPhase2() {
  phase.value = 2
}

function goToPhase3() {
  phase.value = 3
}

function complete() {
  phase.value = 4
}
</script>
```

### 3. 服务器集成

```vue
<template>
  <div class="server-integration">
    <FaceDetector
      mode="silent_liveness"
      @liveness-completed="submitToServer"
      @error="handleError"
    />
    <p v-if="uploading">上传中...</p>
    <p v-if="uploaded">✓ 上传成功</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploading = ref(false)
const uploaded = ref(false)

async function submitToServer(data) {
  uploading.value = true
  try {
    const response = await fetch('/api/face-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        faceImage: data.faceImageData,
        livenessScore: data.liveness,
        timestamp: new Date().toISOString()
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('验证结果:', result)
      uploaded.value = true
    } else {
      throw new Error('服务器返回错误: ' + response.status)
    }
  } catch (error) {
    console.error('上传失败:', error)
    handleError({ message: '上传失败，请稍后重试' })
  } finally {
    uploading.value = false
  }
}

function handleError(data) {
  console.error('检测失败:', data.message)
  // 显示错误提示
}

function getAuthToken() {
  // 从 localStorage 或其他存储获取认证令牌
  return localStorage.getItem('authToken')
}
</script>
```

### 4. 错误恢复和重试逻辑

```vue
<template>
  <div class="error-recovery">
    <FaceDetector
      mode="silent_liveness"
      :silentLivenessThreshold="currentThreshold"
      @liveness-completed="onSuccess"
      @error="onError"
    />
    
    <div v-if="retryInfo" class="retry-info">
      <p>检测失败 ({{ retryCount }}/3)</p>
      <p>{{ retryInfo }}</p>
      <button v-if="retryCount < 3" @click="retryWithLowerThreshold">
        降低标准重试 ({{ (currentThreshold - 0.2).toFixed(2) }})
      </button>
      <button v-else @click="giveUp">
        放弃此步骤
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentThreshold = ref(0.5)
const retryCount = ref(0)
const retryInfo = ref('')

function onError(data) {
  retryCount.value++
  retryInfo.value = data.message

  if (retryCount.value >= 3) {
    retryInfo.value += ' (已达到最大重试次数)'
  }
}

function onSuccess(data) {
  console.log('成功')
  retryCount.value = 0
  retryInfo.value = ''
}

function retryWithLowerThreshold() {
  currentThreshold.value -= 0.2
  retryInfo.value = ''
  // 组件会自动使用新的阈值重新检测
}

function giveUp() {
  console.log('用户放弃验证')
  // 处理放弃逻辑
}
</script>

<style scoped>
.retry-info {
  margin-top: 20px;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
}

.retry-info button {
  margin-right: 10px;
  background: #ffc107;
  color: #333;
}
</style>
```

## 与服务端的最佳实践

### 1. 图片处理

```typescript
// 前端：发送 Base64 图片
const imageData = data.faceImageData  // "data:image/jpeg;base64,..."

// 后端（Python Flask）：接收并保存
import base64
from PIL import Image
from io import BytesIO

def receive_face_image(image_data):
    # 移除 data URI 前缀
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    # 解码 Base64
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    
    # 保存或处理
    image.save(f'faces/{user_id}_{timestamp}.jpg')
    return True
```

### 2. 活体得分处理

```typescript
// 前端：发送得分
const livenessScore = data.liveness  // 0.75

// 后端：验证得分
function verify_liveness_score(score, threshold=0.5):
    if score < threshold:
        return {
            'success': False,
            'reason': f'Liveness score {score} below threshold {threshold}'
        }
    return {'success': True}
```

### 3. 审计日志

```typescript
// 记录检测过程中的所有事件
function logDetectionEvent(event) {
  const log = {
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    eventType: event.type,  // 'face_detected', 'liveness_completed', 'error'
    data: event.data,
    threshold: currentThreshold,
    duration: calculateDuration()
  }
  
  // 发送到审计系统
  fetch('/api/audit-log', {
    method: 'POST',
    body: JSON.stringify(log)
  })
}
```

## 性能优化

### 1. 减少重新渲染

```vue
<script setup>
import { shallowRef } from 'vue'

// 使用 shallowRef 以减少不必要的深度响应性
const detectionState = shallowRef({
  completed: false,
  livenessScore: 0
})

function handleLivenessCompleted(data) {
  // 只创建新对象以触发更新，避免深度响应
  detectionState.value = {
    completed: true,
    livenessScore: data.liveness
  }
}
</script>
```

### 2. 懒加载组件

```vue
<template>
  <div>
    <button @click="showDetector">启动人脸检测</button>
    <Suspense v-if="show">
      <FaceDetector mode="silent_liveness" />
    </Suspense>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function showDetector() {
  show.value = true
}
</script>
```

## 调试技巧

### 1. 启用详细日志

```typescript
// 在检测组件前启用日志
const enableDetectionLogs = true

if (enableDetectionLogs) {
  const originalLog = console.log
  console.log = function(...args) {
    if (args[0]?.includes?.('[FaceDetector]')) {
      originalLog.apply(console, args)
    }
  }
}
```

### 2. 导出检测数据用于分析

```typescript
function exportDetectionData() {
  const data = {
    timestamp: new Date().toISOString(),
    detections: allDetectionData,
    threshold: currentThreshold,
    successRate: calculateSuccessRate()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `detection-data-${Date.now()}.json`
  a.click()
}
```

## 相关文档

- [API 参考](./API_REFERENCE.md)
- [静默活体检测模式详解](./SILENT_LIVENESS_MODE.md)
- [活体检测动作类型](./LIVENESS_ACTIONS.md)
- [正脸检测算法优化](./FRONTAL_ALGORITHM.md)

## 常见问题

**Q：如何判断检测成功还是失败？**

A：监听 `liveness-completed` 事件表示成功，监听 `error` 事件表示失败。

**Q：可以并行运行多个检测器吗？**

A：不建议。同一时间只应该有一个检测器运行，以避免摄像头冲突。

**Q：如何处理检测超时？**

A：通过设置 `silentLivenessThreshold` 使用更宽松的标准，或在客户端实现超时控制。

**Q：如何实现人脸对比识别？**

A：需要在服务端使用专门的人脸识别库（如 face_recognition、OpenFace 等）对采集的图片进行对比。

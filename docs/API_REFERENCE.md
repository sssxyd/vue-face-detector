# FaceDetector API 参考

## 概述

`FaceDetector` 是一个高性能的 Vue 3 人脸检测和活体验证组件，支持多种检测模式、实时视频处理和灵活的事件系统。

## 检测模式（DetectionMode）

```typescript
enum DetectionMode {
  // 采集模式：检测到合格人脸后自动停止并返回图片
  COLLECTION = 'collection',
  
  // 活体检测模式：需要用户执行指定的活体动作（眨眼、摇头等）
  LIVENESS = 'liveness',
  
  // 静默活体检测模式：采集后自动进行活体检测，无需用户执行动作
  SILENT_LIVENESS = 'silent_liveness'
}
```

## 活体检测动作（LivenessAction）

```typescript
enum LivenessAction {
  // 眨眼 - 检测用户是否眨眼
  BLINK = 'blink',
  
  // 摇头 - 检测用户是否左右摇头（facing center → facing left → facing center）
  SHAKE = 'shake',
  
  // 张嘴 - 检测用户是否张开嘴巴（开度 > 20%）
  MOUTH_OPEN = 'mouth_open',
  
  // 点头 - 检测用户是否上下点头（up → down → up）
  NOD = 'nod'
}
```

## Props 接口（FaceDetectorProps）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `mode` | `DetectionMode \| string` | `'collection'` | 工作模式：`'collection'`、`'liveness'` 或 `'silent_liveness'` |
| `livenessChecks` | `(LivenessAction \| string)[]` | `[LivenessAction.BLINK, LivenessAction.SHAKE]` | 活体检测项目数组（仅用于 LIVENESS 模式） |
| `minFaceRatio` | `number` | `50` | 人脸占画面比例的最小值（百分比，0-100） |
| `maxFaceRatio` | `number` | `80` | 人脸占画面比例的最大值（百分比，0-100） |
| `minFrontal` | `number` | `90` | 正脸置信度的最小值（百分比，0-100） |
| `silentLivenessThreshold` | `number` | `0.5` | 静默活体检测的阈值（0-1，用于判定是否为真实人脸） |

### Props 使用示例

```vue
<FaceDetector
  mode="silent_liveness"
  :livenessChecks="[LivenessAction.BLINK, LivenessAction.SHAKE]"
  :minFaceRatio="40"
  :maxFaceRatio="85"
  :minFrontal="88"
  :silentLivenessThreshold="0.5"
/>
```

## 事件系统

### face-detected
当检测到人脸时触发，每帧都可能触发。

```typescript
emit('face-detected', {
  faceInfo: {
    count: number      // 检测到的人脸数量
    size: number       // 人脸占画面的比例（0-100）
    frontal: number    // 正脸置信度（0-100）
  }
})
```

**示例：**
```vue
<FaceDetector @face-detected="handleFaceDetected" />

<script setup>
function handleFaceDetected(data) {
  console.log(`检测到 ${data.faceInfo.count} 张脸`)
  console.log(`人脸大小: ${data.faceInfo.size}%`)
  console.log(`正脸度: ${data.faceInfo.frontal}%`)
}
</script>
```

### face-collected
在 COLLECTION 模式下，检测到符合条件的人脸时触发。

```typescript
emit('face-collected', {
  faceImageData: string | null  // 裁切后的人脸区域，Base64 JPEG 格式
})
```

**示例：**
```vue
<FaceDetector 
  mode="collection"
  @face-collected="handleFaceCollected" 
/>

<script setup>
function handleFaceCollected(data) {
  const img = new Image()
  img.src = data.faceImageData
  document.body.appendChild(img)
}
</script>
```

### liveness-action
在 LIVENESS 模式下，检测到活体动作时触发。

```typescript
emit('liveness-action', {
  action: string  // 动作类型：'blink'、'shake'、'mouth_open'、'nod'
  status: string  // 动作状态：'detected' 或 'completed'
})
```

**示例：**
```vue
<FaceDetector 
  mode="liveness"
  @liveness-action="handleLivenessAction" 
/>

<script setup>
function handleLivenessAction(data) {
  if (data.action === 'blink') {
    console.log('检测到眨眼')
  }
}
</script>
```

### liveness-completed
活体检测完成时触发（所有动作均验证成功，或 SILENT_LIVENESS 模式验证通过）。

```typescript
emit('liveness-completed', {
  faceImageData: string | null  // 采集的人脸图片，Base64 格式
  liveness: number              // 活体检测得分（0-1）
})
```

**示例：**
```vue
<FaceDetector 
  mode="silent_liveness"
  @liveness-completed="handleLivenessCompleted" 
/>

<script setup>
function handleLivenessCompleted(data) {
  console.log(`活体检测成功，得分: ${(data.liveness * 100).toFixed(1)}%`)
  // 保存人脸图片或提交服务器
}
</script>
```

### error
检测过程中出错时触发。

```typescript
emit('error', {
  message: string  // 错误描述信息
})
```

**示例：**
```vue
<FaceDetector @error="handleError" />

<script setup>
function handleError(data) {
  console.error('检测错误:', data.message)
  // 显示错误提示给用户
}
</script>
```

## 方法

### startDetection()
启动人脸检测。需要用户授予摄像头权限。

```typescript
// 使用模板引用调用
<FaceDetector ref="detector" />

<script setup>
const detector = ref()

function start() {
  detector.value.startDetection()
}
</script>
```

**返回值：** 无

**抛出异常：**
- 摄像头无法访问
- 浏览器不支持 MediaStream API

### stopDetection()
停止人脸检测并释放摄像头资源。

```typescript
detector.value.stopDetection()
```

**返回值：** 无

**注意：** 调用此方法后，需要重新调用 `startDetection()` 才能继续检测。

## 数据类型

### FaceInfo
```typescript
interface FaceInfo {
  count: number    // 检测到的人脸数量（0 表示未检测到）
  size: number     // 人脸占画面的百分比（0-100）
  frontal: number  // 正脸置信度百分比（0-100）
}
```

### FaceCollectedData
```typescript
interface FaceCollectedData {
  faceImageData: string | null  // Base64 格式的 JPEG 图片，null 表示采集失败
}
```

### LivenessCompletedData
```typescript
interface LivenessCompletedData {
  faceImageData: string | null  // Base64 格式的 JPEG 图片
  liveness: number              // 活体检测得分（0-1），表示真实人脸的置信度
}
```

### LivenessActionData
```typescript
interface LivenessActionData {
  action: string  // 动作类型：'blink'、'shake'、'mouth_open'、'nod'
  status: string  // 动作状态：'detected'（检测到）或 'completed'（验证完成）
}
```

### ErrorData
```typescript
interface ErrorData {
  message: string  // 错误详细描述
}
```

## 配置示例

### 1. 简单的人脸采集

```vue
<template>
  <FaceDetector
    mode="collection"
    :minFaceRatio="45"
    :maxFaceRatio="80"
    @face-collected="saveFace"
  />
</template>

<script setup>
function saveFace(data) {
  // 将采集的人脸图片发送到服务器
  fetch('/api/upload-face', {
    method: 'POST',
    body: JSON.stringify({ image: data.faceImageData })
  })
}
</script>
```

### 2. 交互式活体检测

```vue
<template>
  <FaceDetector
    mode="liveness"
    :livenessChecks="[
      LivenessAction.BLINK,
      LivenessAction.SHAKE,
      LivenessAction.MOUTH_OPEN
    ]"
    @liveness-action="showProgress"
    @liveness-completed="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
import { LivenessAction } from '@/types/face-detector'

function showProgress(data) {
  console.log(`${data.action}: ${data.status}`)
}

function handleSuccess(data) {
  console.log('活体检测成功')
}

function handleError(data) {
  console.error('错误:', data.message)
}
</script>
```

### 3. 静默活体检测（带阈值调整）

```vue
<template>
  <FaceDetector
    mode="silent_liveness"
    :silentLivenessThreshold="threshold"
    :minFaceRatio="40"
    :maxFaceRatio="85"
    @liveness-completed="handleSuccess"
    @error="handleError"
  />
  
  <div>
    <label>
      检测阈值：
      <input v-model.number="threshold" type="range" min="0.2" max="0.9" step="0.1" />
      {{ threshold }}
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const threshold = ref(0.5)

function handleSuccess(data) {
  console.log(`活体得分: ${(data.liveness * 100).toFixed(1)}%`)
}

function handleError(data) {
  console.error('检测失败:', data.message)
}
</script>
```

## 工作流程图

### COLLECTION 模式
```
初始化检测
    ↓
循环检测人脸
    ├─ 符合条件 → 采集图片 → 发送 face-collected → 停止
    └─ 不符合条件 → 继续检测
```

### LIVENESS 模式
```
初始化检测
    ↓
循环检测人脸
    ├─ 符合条件 → 进入活体验证
    │   ├─ 循环检测动作
    │   ├─ 每次检测到动作 → 发送 liveness-action
    │   ├─ 所有动作完成 → 发送 liveness-completed → 停止
    │   └─ 动作超时 → 发送 error → 重新开始
    └─ 不符合条件 → 继续检测
```

### SILENT_LIVENESS 模式
```
初始化检测
    ↓
循环检测人脸
    ├─ 符合条件 → 采集图片
    │   ├─ 进行 Human.js 活体检测
    │   ├─ 得分 ≥ 阈值 → 发送 liveness-completed → 停止
    │   └─ 得分 < 阈值 → 发送 error → 重新检测
    └─ 不符合条件 → 继续检测
```

## 性能考虑

### 检测速度
- **COLLECTION 模式**：200-400ms/帧（仅检测人脸）
- **LIVENESS 模式**：300-600ms/帧（检测人脸+手势）
- **SILENT_LIVENESS 模式**：200-800ms（一次检测）

### 内存占用
- 基础库：~10MB（Human.js）
- 运行时：~20-50MB（取决于视频分辨率和缓冲）

### 网络要求
- 首次加载：必须下载模型文件（~50-200MB）
- 之后运行：可离线运行，无需网络

## 浏览器兼容性

| 浏览器 | 最低版本 | 备注 |
|--------|--------|------|
| Chrome | 47+ | 完全支持 |
| Firefox | 36+ | 完全支持 |
| Safari | 11+ | 完全支持 |
| Edge | 79+ | 完全支持 |
| 移动浏览器 | iOS 12+ / Android 5+ | 支持，需要 HTTPS |

## 常见问题

### Q：如何切换摄像头？
A：目前组件不支持动态切换摄像头。需要通过修改组件的内部实现来添加此功能。

### Q：是否支持后置摄像头？
A：支持。组件会自动使用系统默认的摄像头，可以通过在手机上手动切换。

### Q：如何提高检测精度？
A：
1. 调整 `minFaceRatio` 和 `maxFaceRatio` 参数
2. 提高 `minFrontal` 阈值
3. 在 SILENT_LIVENESS 模式下增加 `silentLivenessThreshold` 值

### Q：检测失败时自动重试吗？
A：
- **COLLECTION / LIVENESS**：不自动重试，需要用户手动调用 `startDetection()`
- **SILENT_LIVENESS**：自动重试，无需用户干预

### Q：采集的图片格式是什么？
A：Base64 编码的 JPEG 格式（质量 90%）。可以直接用于 `<img>` 标签或发送到服务器。

## 许可证

与主项目保持一致。

## 相关文档

- [静默活体检测模式详解](./SILENT_LIVENESS_MODE.md)
- [活体检测动作类型](./LIVENESS_ACTIONS.md)
- [正脸检测算法优化](./FRONTAL_ALGORITHM.md)

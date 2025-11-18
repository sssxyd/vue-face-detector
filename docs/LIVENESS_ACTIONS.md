# 活体检测动作说明

## 支持的活体检测动作

### 1. BLINK - 眨眼
- **动作**：眨一次眼睛
- **检测方式**：识别 gesture 中的 "blink" 动作
- **难度**：简单

### 2. SHAKE - 摇头
- **动作**：左右摇头（或右左摇头）
- **检测方式**：识别 "facing center" -> "facing left" -> "facing center" 或 "facing center" -> "facing right" -> "facing center" 的序列
- **难度**：中等

### 3. MOUTH_OPEN - 张嘴
- **动作**：张开嘴巴
- **检测方式**：识别嘴巴打开百分比 > 20%
- **难度**：简单

### 4. NOD - 点头
- **动作**：上下点头（或下上点头）
- **检测方式**：识别 "head up" -> "head down" -> "head up" 的序列
- **难度**：中等

## 使用示例

### 示例 1：单个动作检测（眨眼）
```javascript
<FaceDetector 
  mode="liveness" 
  :livenessChecks="[LivenessAction.BLINK]"
/>
```

### 示例 2：多个动作检测组合
```javascript
<FaceDetector 
  mode="liveness" 
  :livenessChecks="[
    LivenessAction.BLINK,      // 先眨眼
    LivenessAction.MOUTH_OPEN, // 再张嘴
    LivenessAction.NOD         // 最后点头
  ]"
/>
```

### 示例 3：完整活体检测流程
```javascript
<FaceDetector 
  mode="liveness" 
  :livenessChecks="[
    LivenessAction.BLINK,
    LivenessAction.SHAKE,
    LivenessAction.MOUTH_OPEN,
    LivenessAction.NOD
  ]"
  @liveness-action="handleLivenessAction"
  @liveness-completed="handleLivenessCompleted"
  @error="handleError"
/>
```

## 事件回调说明

### face-detected
检测到人脸时触发，包含人脸信息：
- `count`: 检测到的人脸数量
- `size`: 人脸占画面的百分比
- `frontal`: 正脸度评分（0-100）

### liveness-action
完成一个活体动作时触发，包含：
- `action`: 完成的动作类型（blink/shake/mouth_open/nod）
- `status`: 状态（completed）

### liveness-completed
所有活体检测动作完成时触发，包含：
- `faceImageData`: Base64 格式的人脸图片

### error
检测过程中出错时触发，包含：
- `message`: 错误信息

## 配置参数说明

| 参数 | 默认值 | 说明 |
|------|--------|------|
| mode | 'collection' | 检测模式：'collection'(采集) 或 'liveness'(活体检测) |
| livenessChecks | [BLINK, SHAKE] | 活体检测项目数组 |
| minFaceRatio | 50 | 人脸占画面最小百分比（%） |
| maxFaceRatio | 80 | 人脸占画面最大百分比（%） |
| minFrontal | 90 | 最小正脸度评分（0-100） |

## 检测参数调优

### 张嘴检测
- 当前阈值：嘴巴打开 > 20%
- 修改位置：`FaceDetector.vue` 中 `MOUTH_OPEN` 的检测代码
- 可调整参数：修改 `> 20` 的数值

### 点头/摇头检测
- 检测规则：完成一个完整的 up->down->up 或 left->center->left 序列
- 灵敏度：序列越短越灵敏，越长越稳定
- 可调整参数：修改 `nodHeadSequence.length >= 3` 或 `shakeFacingSequence.length >= 3` 的数值

## 组合策略建议

### 安全等级：低
```javascript
[LivenessAction.BLINK]
```

### 安全等级：中
```javascript
[LivenessAction.BLINK, LivenessAction.MOUTH_OPEN]
```

### 安全等级：高
```javascript
[LivenessAction.BLINK, LivenessAction.SHAKE, LivenessAction.MOUTH_OPEN, LivenessAction.NOD]
```

### 安全等级：超高
```javascript
[
  LivenessAction.BLINK,
  LivenessAction.SHAKE,
  LivenessAction.MOUTH_OPEN,
  LivenessAction.NOD,
  LivenessAction.BLINK,  // 再次眨眼
  LivenessAction.SHAKE   // 再次摇头
]
```

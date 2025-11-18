<!-- 
静默活体检测模式完整示例
演示如何集成和使用 SILENT_LIVENESS 模式进行自动人脸活体检测
-->

<template>
  <div class="silent-liveness-demo">
    <!-- 页面标题 -->
    <header class="demo-header">
      <h1>静默活体检测（Silent Liveness Detection）</h1>
      <p class="subtitle">自动检测真实人脸，无需任何用户操作</p>
    </header>

    <!-- 主要内容区域 -->
    <main class="demo-main">
      <!-- 检测进行中的界面 -->
      <div v-if="!detectionState.completed && !detectionState.failed" class="detection-phase">
        <!-- 人脸检测组件 -->
        <div class="detector-wrapper">
          <FaceDetector
            ref="faceDetectorRef"
            mode="silent_liveness"
            :minFaceRatio="40"
            :maxFaceRatio="85"
            :minFrontal="88"
            :silentLivenessThreshold="detectionState.threshold"
            @face-detected="handleFaceDetected"
            @liveness-completed="handleLivenessCompleted"
            @error="handleDetectionError"
          />
        </div>

        <!-- 实时检测状态信息 -->
        <aside class="detection-info">
          <div class="info-section">
            <h3>检测状态</h3>
            <div class="status-grid">
              <div class="status-item">
                <span class="label">检测到的人脸数：</span>
                <span class="value">{{ detectionState.faceCount }}</span>
              </div>
              <div class="status-item">
                <span class="label">人脸大小：</span>
                <span class="value">{{ detectionState.faceSize }}%</span>
              </div>
              <div class="status-item">
                <span class="label">正脸置信度：</span>
                <span class="value">{{ detectionState.frontalScore }}%</span>
              </div>
            </div>
          </div>

          <!-- 参数调整面板 -->
          <div class="info-section">
            <h3>参数调整</h3>
            <div class="control-group">
              <label for="thresholdSlider">活体检测阈值</label>
              <div class="slider-container">
                <input
                  id="thresholdSlider"
                  v-model.number="detectionState.threshold"
                  type="range"
                  min="0.2"
                  max="0.9"
                  step="0.05"
                  class="slider"
                />
                <span class="slider-value">{{ detectionState.threshold.toFixed(2) }}</span>
              </div>
              <p class="param-hint">
                <span v-if="detectionState.threshold < 0.4" class="hint-loose">
                  宽松模式 - 接受率高，但误识别率也较高
                </span>
                <span v-else-if="detectionState.threshold < 0.6" class="hint-balanced">
                  平衡模式 - 推荐用于大多数场景
                </span>
                <span v-else class="hint-strict">
                  严格模式 - 接受率低，但更加安全
                </span>
              </p>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="detectionState.errorMessage" class="info-section error-section">
            <h3>⚠️ 错误信息</h3>
            <p class="error-text">{{ detectionState.errorMessage }}</p>
            <p class="error-hint">系统将在 3 秒后自动重新开始检测...</p>
          </div>

          <!-- 使用提示 -->
          <div class="info-section tips-section">
            <h3>💡 检测提示</h3>
            <ul class="tips-list">
              <li>保持光线充足，避免逆光</li>
              <li>正对摄像头，不要侧脸</li>
              <li>距离摄像头约 20-60cm</li>
              <li>确保使用真实人脸，而非照片或视频</li>
            </ul>
          </div>
        </aside>
      </div>

      <!-- 检测成功的界面 -->
      <div v-else-if="detectionState.completed && !detectionState.failed" class="success-phase">
        <div class="success-container">
          <div class="success-icon">✓</div>
          <h2>活体检测成功</h2>
          <p class="success-score">
            活体检测得分：<span class="score">{{ (detectionState.livenessScore * 100).toFixed(1) }}%</span>
          </p>

          <!-- 采集的人脸图片 -->
          <div v-if="detectionState.capturedImage" class="captured-image-container">
            <h3>采集的人脸</h3>
            <img :src="detectionState.capturedImage" alt="采集的人脸" class="captured-image" />
          </div>

          <!-- 成功后的操作按钮 -->
          <div class="action-buttons">
            <button @click="downloadCapturedImage" class="btn btn-primary">
              📥 下载采集图片
            </button>
            <button @click="retryDetection" class="btn btn-secondary">
              🔄 重新检测
            </button>
          </div>

          <!-- 检测信息总结 -->
          <div class="summary-section">
            <h3>检测信息总结</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="label">检测模式：</span>
                <span class="value">静默活体检测</span>
              </div>
              <div class="summary-item">
                <span class="label">检测时间：</span>
                <span class="value">{{ detectionState.detectionTime }}ms</span>
              </div>
              <div class="summary-item">
                <span class="label">采集图片尺寸：</span>
                <span class="value">{{ detectionState.imageDimensions }}</span>
              </div>
              <div class="summary-item">
                <span class="label">检测阈值：</span>
                <span class="value">{{ detectionState.threshold.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 检测失败的界面 -->
      <div v-else-if="detectionState.failed" class="failure-phase">
        <div class="failure-container">
          <div class="failure-icon">✗</div>
          <h2>活体检测失败</h2>
          <p class="failure-reason">{{ detectionState.failureReason }}</p>

          <div class="failure-suggestions">
            <h3>可能的原因：</h3>
            <ul>
              <li>检测到的是照片或屏幕上的人脸，而非真实人脸</li>
              <li>图片质量不佳（模糊、光线差等）</li>
              <li>摄像头或 AI 模型配置有问题</li>
            </ul>

            <h3>建议：</h3>
            <ul>
              <li>确保在良好的光线环境下重试</li>
              <li>尽量让人脸正对摄像头</li>
              <li>移动到距离摄像头 20-60cm 的位置</li>
              <li>降低检测阈值（当前：{{ detectionState.threshold.toFixed(2) }}），尝试使用更宽松的标准</li>
            </ul>
          </div>

          <!-- 失败后的操作按钮 -->
          <div class="action-buttons">
            <button @click="retryDetection" class="btn btn-primary">
              🔄 重新检测
            </button>
            <button @click="adjustThresholdAndRetry" class="btn btn-secondary">
              ⚙️ 降低阈值并重试（0.3）
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚说明 -->
    <footer class="demo-footer">
      <p>
        静默活体检测使用 Human.js AI 模型自动验证人脸真实性。
        <a href="./SILENT_LIVENESS_MODE.md" target="_blank">查看详细文档 →</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import FaceDetector from '../components/FaceDetector.vue'
import type { FaceInfo, LivenessCompletedData, ErrorData } from '../types/face-detector'

// 组件引用
const faceDetectorRef = ref<any>(null)

// 检测状态管理
const detectionState = reactive({
  // 检测进度
  completed: false,
  failed: false,

  // 实时检测数据
  faceCount: 0,
  faceSize: 0,
  frontalScore: 0,

  // 检测结果数据
  capturedImage: null as string | null,
  livenessScore: 0,
  detectionTime: 0,
  imageDimensions: '',

  // 错误和提示信息
  errorMessage: '',
  failureReason: '',
  threshold: 90,

  // 内部时间戳
  startTime: 0,
  retryCount: 0
})

let errorTimeoutId: ReturnType<typeof setTimeout> | null = null

// ===== 事件处理函数 =====

/**
 * 处理人脸检测事件
 * 更新实时检测状态信息
 */
function handleFaceDetected(data: { faceInfo: FaceInfo }) {
  const { count, size, frontal } = data.faceInfo
  detectionState.faceCount = count
  detectionState.faceSize = Math.round(size)
  detectionState.frontalScore = Math.round(frontal)
}

/**
 * 处理活体检测完成事件
 * 显示成功结果
 */
function handleLivenessCompleted(data: LivenessCompletedData) {
  const endTime = Date.now()
  detectionState.completed = true
  detectionState.failed = false
  detectionState.capturedImage = data.faceImageData
  detectionState.livenessScore = data.liveness
  detectionState.detectionTime = endTime - detectionState.startTime
  
  // 计算图片尺寸
  if (data.faceImageData) {
    try {
      const img = new Image()
      img.onload = () => {
        detectionState.imageDimensions = `${img.width} × ${img.height}`
      }
      img.src = data.faceImageData
    } catch (e) {
      detectionState.imageDimensions = '未知'
    }
  }

  console.log('[Demo] Liveness detection completed with score:', data.liveness)
}

/**
 * 处理检测错误
 * 显示错误信息并支持自动重试
 */
function handleDetectionError(data: ErrorData) {
  detectionState.errorMessage = data.message
  detectionState.retryCount++
  
  console.error('[Demo] Detection error:', data.message)

  // 3 秒后清除错误信息并继续检测
  if (errorTimeoutId) {
    clearTimeout(errorTimeoutId)
  }
  errorTimeoutId = setTimeout(() => {
    detectionState.errorMessage = ''
  }, 3000)
}

/**
 * 重新开始检测
 */
function retryDetection() {
  // 重置状态
  detectionState.completed = false
  detectionState.failed = false
  detectionState.errorMessage = ''
  detectionState.failureReason = ''
  detectionState.capturedImage = null
  detectionState.livenessScore = 0
  detectionState.detectionTime = 0
  detectionState.imageDimensions = ''
  detectionState.faceCount = 0
  detectionState.faceSize = 0
  detectionState.frontalScore = 0
  detectionState.retryCount = 0

  // 启动检测
  startDetection()
}

/**
 * 调整阈值并重试
 * 用于在检测失败时使用更宽松的标准重新检测
 */
function adjustThresholdAndRetry() {
  detectionState.threshold = 0.3
  retryDetection()
}

/**
 * 下载采集的人脸图片
 */
function downloadCapturedImage() {
  if (!detectionState.capturedImage) return

  try {
    const link = document.createElement('a')
    link.href = detectionState.capturedImage
    link.download = `face_${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log('[Demo] Image downloaded successfully')
  } catch (e) {
    console.error('[Demo] Failed to download image:', e)
    alert('下载失败，请稍后重试')
  }
}

/**
 * 启动检测
 */
function startDetection() {
  detectionState.startTime = Date.now()
  if (faceDetectorRef.value) {
    faceDetectorRef.value.startDetection()
  }
}

// ===== 生命周期 =====

onMounted(() => {
  // 组件挂载后自动启动检测
  startDetection()
})
</script>

<style scoped>
/* ===== 整体布局 ===== */
.silent-liveness-demo {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 页面头部 */
.demo-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #333;
}

.demo-header .subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 主要内容区域 */
.demo-main {
  flex: 1;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 检测进行中的布局 */
.detection-phase {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

.detector-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* 检测信息侧边栏 */
.detection-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 状态网格 */
.status-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-item .label {
  color: #666;
}

.status-item .value {
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}

/* 控制组件 */
.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.slider-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.4);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
}

.slider-value {
  font-weight: 600;
  color: #667eea;
  font-size: 13px;
  min-width: 30px;
  text-align: right;
}

.param-hint {
  margin: 8px 0 0 0;
  font-size: 11px;
  line-height: 1.4;
}

.hint-loose {
  color: #f59e0b;
}

.hint-balanced {
  color: #10b981;
}

.hint-strict {
  color: #ef4444;
}

/* 错误提示 */
.error-section {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
}

.error-section h3 {
  color: #ef4444;
}

.error-text {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #991b1b;
  line-height: 1.5;
}

.error-hint {
  margin: 0;
  font-size: 11px;
  color: #b91c1c;
  font-style: italic;
}

/* 提示列表 */
.tips-section {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
}

.tips-section h3 {
  color: #0284c7;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: #1e40af;
  line-height: 1.6;
}

.tips-list li {
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.tips-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  font-weight: bold;
  color: #0284c7;
}

/* 成功阶段 */
.success-phase,
.failure-phase {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.success-container,
.failure-container {
  max-width: 600px;
  margin: 0 auto;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease-out;
}

.failure-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #ef4444;
  animation: shake 0.5s ease-out;
}

.success-phase h2,
.failure-phase h2 {
  font-size: 28px;
  margin: 0 0 16px 0;
  color: #333;
}

.success-phase h2 {
  color: #10b981;
}

.failure-phase h2 {
  color: #ef4444;
}

.success-score {
  font-size: 18px;
  color: #666;
  margin: 0 0 24px 0;
}

.score {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

/* 采集的图片 */
.captured-image-container {
  margin: 32px 0;
}

.captured-image-container h3 {
  font-size: 16px;
  margin: 0 0 16px 0;
  color: #333;
}

.captured-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #333;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn:active {
  transform: translateY(0);
}

/* 信息总结 */
.summary-section {
  text-align: left;
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
}

.summary-section h3 {
  font-size: 14px;
  margin: 0 0 12px 0;
  color: #333;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 13px;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-item .label {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.summary-item .value {
  color: #333;
  font-weight: 600;
}

/* 失败提示 */
.failure-reason {
  font-size: 16px;
  color: #ef4444;
  margin: 0 0 24px 0;
}

.failure-suggestions {
  text-align: left;
  background: #fef2f2;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.failure-suggestions h3 {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #991b1b;
  font-weight: 600;
}

.failure-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #7f1d1d;
  line-height: 1.6;
}

.failure-suggestions li {
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.failure-suggestions li::before {
  content: '•';
  position: absolute;
  left: 0;
}

.failure-suggestions ul:last-child {
  margin: 0;
}

/* 页脚 */
.demo-footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #666;
}

.demo-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.demo-footer a:hover {
  text-decoration: underline;
}

/* 动画 */
@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detection-phase {
    grid-template-columns: 1fr;
  }

  .detection-info {
    order: -1;
  }

  .demo-header h1 {
    font-size: 24px;
  }

  .demo-header .subtitle {
    font-size: 14px;
  }

  .demo-main {
    padding: 20px 16px;
  }

  .success-phase,
  .failure-phase {
    padding: 24px 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    min-width: auto;
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>

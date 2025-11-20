#!/usr/bin/env node

/**
 * 下载 TensorFlow.js WASM 文件到本地
 * 
 * 使用方法：
 *   npm run download:wasm
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// 配置
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DIR = path.join(__dirname, 'public', 'wasm');

/**
 * 从 node_modules 中的 Human.js package.json 读取 TensorFlow 版本
 */
function getTensorFlowVersion() {
  try {
    const humanPackagePath = path.join(
      __dirname,
      'node_modules',
      '@vladmandic',
      'human',
      'package.json'
    );

    if (!fs.existsSync(humanPackagePath)) {
      throw new Error(
        '@vladmandic/human 未找到。请运行 npm install 安装依赖。'
      );
    }

    const humanPackage = JSON.parse(fs.readFileSync(humanPackagePath, 'utf-8'));
    
    // 从 devDependencies 中查找 TensorFlow 版本
    const devDeps = humanPackage.devDependencies || {};
    const tfCoreVersion = devDeps['@tensorflow/tfjs-core'];
    const tfWasmVersion = devDeps['@tensorflow/tfjs-backend-wasm'];

    if (!tfCoreVersion || !tfWasmVersion) {
      throw new Error(
        '无法从 @vladmandic/human 的 devDependencies 中找到 TensorFlow 版本。'
      );
    }

    // 提取版本号（移除 ^ 或 ~ 等前缀）
    const version = tfCoreVersion.replace(/^[\^~>=<]*/, '');

    console.log(`📦 检测到 TensorFlow.js 版本: ${version}`);
    console.log(`   - @tensorflow/tfjs-core: ${tfCoreVersion}`);
    console.log(`   - @tensorflow/tfjs-backend-wasm: ${tfWasmVersion}`);

    return version;
  } catch (error) {
    console.error(`❌ 读取 TensorFlow 版本失败: ${error.message}`);
    process.exit(1);
  }
}

const WASM_VERSION = getTensorFlowVersion();
const CDN_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${WASM_VERSION}/dist`;

// 需要下载的文件列表
const FILES_TO_DOWNLOAD = [
  'tf-backend-wasm.min.js',
  'tfjs-backend-wasm.wasm',
  'tfjs-backend-wasm-simd.wasm',
  'tfjs-backend-wasm-threaded-simd.wasm',
];

/**
 * 创建目录
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ 创建目录: ${dirPath}`);
  }
}

/**
 * 下载文件
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        fs.unlink(destPath, () => {});
        downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
        process.stdout.write(`\r  下载进度: ${percent}%`);
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`\r✓ 下载完成: ${path.basename(destPath)}`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * 获取文件大小
 */
function getFileSizeKB(bytes) {
  return (bytes / 1024).toFixed(2);
}

/**
 * 主函数
 */
async function main() {
  console.log('='.repeat(60));
  console.log('TensorFlow.js WASM 文件下载器');
  console.log('='.repeat(60));
  
  // 自动检测版本
  console.log('\n[0/3] 检测依赖版本...\n');
  
  console.log(`\n📍 源 CDN: cdn.jsdelivr.net`);
  console.log(`🔗 CDN URL: ${CDN_URL}`);
  console.log(`📁 目标目录: ${LOCAL_DIR}`);
  console.log(`\n需要下载的文件：`);
  FILES_TO_DOWNLOAD.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });

  try {
    // 1. 创建目录
    console.log('\n[1/3] 准备目录...');
    ensureDirectory(LOCAL_DIR);

    // 2. 下载文件 (串行下载)
    console.log('\n[2/3] 下载文件...\n');
    for (const filename of FILES_TO_DOWNLOAD) {
      const url = `${CDN_URL}/${filename}`;
      const destPath = path.join(LOCAL_DIR, filename);
      
      console.log(`\n  下载: ${filename}`);
      try {
        await downloadFile(url, destPath);
      } catch (err) {
        console.error(`  ✗ 下载失败: ${err.message}`);
        throw err;
      }
    }

    // 3. 验证文件
    console.log('\n\n[3/3] 验证文件...\n');
    let totalSize = 0;
    FILES_TO_DOWNLOAD.forEach((filename) => {
      const filePath = path.join(LOCAL_DIR, filename);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`  ✓ ${filename} (${getFileSizeKB(stats.size)} KB)`);
        totalSize += stats.size;
      } else {
        console.log(`  ✗ ${filename} - 未找到`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`✅ 下载完成！总大小: ${getFileSizeKB(totalSize)} KB`);
    console.log('='.repeat(60));

    console.log('\n📝 现在可以在配置中使用本地 WASM 文件：\n');
    console.log('```typescript');
    console.log('const config = {');
    console.log('  backend: "wasm",');
    console.log('  modelBasePath: "/models",');
    console.log('  wasmPath: "/wasm/"  // ← 使用本地文件');
    console.log('}');
    console.log('```\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  }
}

main();

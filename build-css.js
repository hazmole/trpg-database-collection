import { bundle } from 'lightningcss';
import fs from 'fs';
import path from 'path';

// ==========================================
// 1. 在這裡管理你的子專案，未來新增專案只要在陣列加字就好！
// ==========================================
const projects = [
  'amadeus',
  'kamigakari'
];

// 設定瀏覽器相容目標
// 這裡用 Lightning CSS 的 targets 格式，131072 代表 0.25% 
const targets = { chrome: 95 << 16, safari: 15 << 16, firefox: 95 << 16 }; 

async function buildAll() {
  console.log('🚀 開始編譯與壓縮原生 CSS...');

  for (const project of projects) {
    const htmlPath = path.join(project, 'index.html');
    const inputPath = path.join(project, 'css', 'main.css');
    const outputDir = path.join(project, 'css');
    const outputPath = path.join(outputDir, 'main.min.css');

    // 檢查原始碼檔案是否存在，避免噴錯
    if (!fs.existsSync(htmlPath)) {
      console.warn(`⚠️ 找不到專案 ${project} 的入口檔案: ${htmlPath}，跳過。`);
      continue;
    }
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ 找不到專案 ${project} 的入口檔案: ${inputPath}，跳過。`);
      continue;
    }

    try {
      // 呼叫 Lightning CSS 核心 API 進行打包與壓縮
      const { code } = bundle({
        filename: inputPath,
        minify: true,       // 開啟壓縮
        sourceMap: false,   // 線上正式版不需要 sourceMap
        targets: targets    // 自動補瀏覽器前綴
      });

      // 將編譯好的二進位碼寫入目標檔案
      fs.writeFileSync(outputPath, code);
      console.log(`✅  ${project} -> ${outputPath} (打包成功)`);
      
    } catch (error) {
      console.error(`❌  ${project} 打包失敗:`);
      if (error.loc) {
        console.error(`📍 錯誤位置: ${error.loc.filename} 的第 ${error.loc.line} 行，第 ${error.loc.column} 個字元`);
      }
      console.error(`💬 錯誤原因: ${error.message}`);
      if (error.source) {
        console.error(`\n🔎 衝突的程式碼附近：\n${error.source}`);
      }
      
      console.error('\n-----------------------------------------');
      process.exit(1); // 讓 GitHub Action 知道出錯了並中斷
    }

    // 處理 html 檔案路徑
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    htmlContent = htmlContent.replace(/main\.css/g, 'main.min.css');
    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
    console.log(`🎯 已自動將 ${htmlPath} 轉換為正式版 CSS 路徑`);
  }
  
  console.log('🎉 所有 CSS 打包完成！');
}

buildAll();
import https from "https";
import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

// 设置保存图片的目录
const imageSaveDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/img/contributors/');
console.log('imageSaveDir', imageSaveDir)
if (!existsSync(imageSaveDir)) {
  mkdirSync(imageSaveDir);
}

function downloadImage(url, filePath) {
  https.get(url, (res) => {
    // 检查响应状态码是否为200
    if (res.statusCode !== 200) {
        console.error(`请求失败，状态码: ${res.statusCode}`);
        return;
    }
    const writeStream = createWriteStream(filePath);
    res.pipe(writeStream);
    writeStream.on('finish', () => {
        writeStream.close();
        console.log(`下载完成，文件保存在: ${filePath}`);
    });
  }).on('error', (e) => {
      console.error(`出现错误: ${e.message}`);
  });
}

const getAvatar = async(contributors) => {
  console.log('🎸contributor头像图片下载开始，可能会有延迟，如出现卡顿，请重新尝试')
  try {
    for (const contrub of contributors) {
      const filename = `${contrub.login}.jpg`; // 使用 URL 的最后一部分作为文件名
      const filePath = join(imageSaveDir, filename);
      await downloadImage(contrub.avatar_url, filePath);
    }
  } catch (err) {
    console.error('An error occurred during image download:', err);
  }
}

export default getAvatar;
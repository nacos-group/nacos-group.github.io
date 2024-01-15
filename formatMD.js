// 调整博客md文件的front-matter中的date字段
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from 'url';
import stringify from 'json-stringify-safe'

const curFilename = fileURLToPath(import.meta.url);
const curDirname = path.dirname(curFilename);

// 替换 src/content/blog 为你的实际路径
const BLOG_DIR = path.resolve(curDirname, 'src/content/blog');

// 读取并更新 Markdown 文件的 front matter 中的 date 字段
function updateDateInMarkdownFiles(dir) {
  // 读取目录中的所有文件和子目录
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      // 递归处理子目录
      updateDateInMarkdownFiles(filePath);
    } else if (path.extname(file) === '.md') {
      // 读取 Markdown 文件
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(content);

      if (parsed.data.date && typeof parsed.data.date !== 'string') {
        // 更新 date 字段为字符串形式
        parsed.data.date = parsed.data.date.toISOString().split('T')[0];

        // 将更新后的 front matter 和内容写回文件
        const newContent = matter.stringify(parsed.content, parsed.data, { engines: { yaml: { stringify: customStringify } } });
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Updated date in: ${filePath}`);

      }
    }
  });
}

function customStringify(obj) {
    let yaml = '';
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value) && key === 'keywords') {
        // 将数组转换为内联格式
        yaml += `${key}: [${value.map((v) => `${v}`).join(', ')}]\n`;
      } else if (key === 'date') {
          yaml += `${key}: "${value}"\n`;
      } else {
        // 对于其他字段，使用安全的 JSON stringify 方法
        yaml += `${key}: ${value}\n`;
      }
    }
    return yaml.trim();
  }

// 执行更新操作
updateDateInMarkdownFiles(BLOG_DIR);

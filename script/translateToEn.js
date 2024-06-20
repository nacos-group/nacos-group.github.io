import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "dotenv";
import { request } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });

const isTranslate = true;

const askAI = async (content) => {
    const url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
    const header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+  process.env.QWEN_TOKEN
    }
    const body = {
        "model": "qwen-max",
        "input":{
                "messages": [
                    {
                        "role": "system",
                        "content": "你是SEO领域的专家，擅长总结文章并输出有利于SEO的关键词。你还是一个翻译专家，擅长以开源微服务为技术背景做中/英文之间的翻译。"
                    },
                    {
                        "role": "user",
                    "content": `请阅读以下markdown格式的文章，并严格按照下面的格式输出回答，方便后续进行正则匹配和内容截取（关键词、描述信息 ${isTranslate && "、翻译后的英文文章"}，这些小标题一个字都不允许变），同时请注意关键词与描述信息需要为中文内容：
                        
                    1. 关键词: "总结的中文关键词，要求格式为数组，多个关键词用英文逗号分隔，不超过5个"，
                    2. 描述信息: "总结的内容，语言为中文，大概在150-160字之间，不要超过200字"
                   ${isTranslate && `
                   3. 翻译后的英文文章："翻译之后的英文文章，需要与我给你的格式完全相同，即需要有front-matter。不需要为markdown格式，为字符串格式即可"`}
                   
                    请根据以下原文进行生成返回内容：
                    ${content}
                    `
                    }
                ]
            
        },
        "parameters": {
            "result_format": "message"
        }
    }
    try {
        let res = await request(url, "POST", header, body);
        return res.output.choices[0].message.content
    } catch (error) {
        console.error(error);
    }
    
}

const blogPath = path.resolve(__dirname, '../src/content/docs/latest/zh-cn');

const files = await fs.readdir(blogPath);
for (const file of files) {
    if(file.endsWith('.md')) {
        const filePath = path.resolve(blogPath, file);
        fs.readFile(filePath, 'utf8')
            .then(async data => {
                let res = await askAI(data);
                console.log(res)
                const keywordsRegex = /关键词:\s*"([^"]*)"/;
                const regDescrip = /描述信息:\s*"([^"]*)"/;
                const regContent = /翻译后的英文文章：\s*"([\s\S]*)"/;

                const keywordsMatch = res.match(keywordsRegex);
                const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
                // console.log("关键词:", keywords);

                const descripMatch = res.match(regDescrip);
                const description = descripMatch ? descripMatch[1].trim() : '';
                // console.log("描述信息:", description);

                const contentMatch = res.match(regContent);
                const content = contentMatch ? contentMatch[1].trim() : '';
                // console.log("翻译后的英文文章:\n", content);
                await replaceZhContent( filePath, data, keywords, description );
                isTranslate && await generateEnFile( filePath, content )
  })
    }
}
// const filename = "activity-preview-nacos.md"
// fs.readFile(path.resolve(__dirname, '../src/content/blog/activity-preview-nacos.md'), 'utf8')
//     .then(async data => {
//         // let res = await askAI(data);
//         // console.log(res)
//         const keywordsRegex = /关键词:\s*"([^"]*)"/;
//         const regDescrip = /描述信息:\s*"([^"]*)"/;
//         const regContent = /翻译后的英文文章：\s*"([\s\S]*)"/;

//         // const keywordsMatch = res.match(keywordsRegex);
//         // const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
//         // console.log("关键词:", keywords);

//         // const descripMatch = res.match(regDescrip);
//         // const description = descripMatch ? descripMatch[1].trim() : '';
//         // console.log("描述信息:", description);

//         // const contentMatch = res.match(regContent);
//         // const content = contentMatch ? contentMatch[1].trim() : '';
//         // console.log("翻译后的英文文章:\n", content);

//         const keywords = "Nacos 0.1.0, Review活动, 社区交流, GitHub issue, 贡献流程, 小礼品奖励";
//         const description = "文章概述了Nacos 0.1.0版本的Review活动设计，包括任务列表如官网与文档审查、功能测试、提供建议等，参与方式涉及加入社区微信群与提交GitHub issue，奖励机制鼓励突出贡献者，并强调沟通透明与建议采纳原则。";
//         const content = `
//         ---
// title: Nacos 0.1.0 Version Review Event Design
// keywords: [Nacos 0.1.0, Review event, community engagement, GitHub issue, contribution process, reward]
// description: This article outlines the design of the Nacos 0.1.0 version review event, featuring tasks such as reviewing official website and documentation, testing functionalities, and providing suggestions. It details participation methods including joining the community WeChat group and submitting GitHub issues, with a reward mechanism to incentivize notable contributors, emphasizing transparent communication and the principle of suggestion adoption.
// date: \"2018-11-15\"
// category: activity-preview
// ---

// # Nacos 0.1.0 Version Review Event Design

// ## I. Activity Task List

// - Review official content, identify bugs, and suggest improvements for both Chinese and English websites.
// - Read through the Chinese and English documentation, find errors, and propose enhancements, especially focusing on poor English translations.
// - Test the code compilation, Nacos server startup/shutdown流程, and suggest improvements.
// - Attempt to configure and launch multi-node Nacos cluster mode, offering improvement advice.
// - Utilize the Nacos Java SDK and provide feedback for enhancements.
// - Try the Nacos Open API and suggest improvements.
// - Follow the 'How to Contribute to Nacos Documentation TODO' guide, test the contribution process, and give feedback.
// - Submit requirements, development plans, ideas, and requests for Nacos.

// ## II. Participation Methods

// - Scan the WeChat QR code of 'Super Brother' to join the 'Nacos Community Chat Group'.
// - Choose one or more tasks from Section I.
// - Report issues or bugs found following the 'Issue Reporting Process' in Section III, assigning them to @github user[xuechaos](https://github.com/xuechaos).

// ## III. Issue Reporting Process

// * Process details TODO

// ## IV. Reward Mechanism

// * Customized small gifts are being prepared for contributors who make outstanding contributions, with consideration for shipping to those who stand out during the process.
// * The gifts, though modest, aim to express gratitude for your assistance.

// ## V. Additional Notes

// * Not every suggestion will necessarily be adopted, but we will endeavor to communicate our considerations if your suggestion is not implemented.
// * Prefer using email lists or reporting issues over reporting problems in the WeChat group to document and facilitate our communication process.`
//         replaceZhContent(path.resolve(__dirname, '../src/content/blog/activity-preview-nacos.md'),data, keywords, description);
//         // generateEnFile(filename, content )
//     })
  
const replaceZhContent = async (filePath, data, keywords, description) => {
    const keywordsRegex = /keywords: \[\s*([^"]*)\]\n/s;
    const regDescrip = /description:\s*([^\n]*)\n/;
    const oriKeywordMatch = data.match(keywordsRegex);
    const originKeywords = oriKeywordMatch ? oriKeywordMatch[0].trim() : '';
    const oriDescripMatch = data.match(regDescrip);
    const originDescrip = oriDescripMatch ? oriDescripMatch[0].trim() : '';

    const newData = data.replace(originKeywords,`keywords: [${keywords}]`).replace(originDescrip, `description: ${description}`);

    try {
        await fs.writeFile(filePath, newData, 'utf8');
        console.log(`${filePath} 已被更新完成`);
    } catch (err) {
        console.error(err);
    }
}

const generateEnFile = async (filename, content) => {
    const enFilename = filename.replace('zh-cn', 'en');
    try {
        await fs.writeFile(enFilename, content, 'utf8');
        console.log(`${enFilename} 已被生成`);
    } catch (err) {
        console.log("err",err)
    }
}
    





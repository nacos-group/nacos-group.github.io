import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

dotenv.config();

const curFilename = fileURLToPath(import.meta.url);
const curDirname = path.dirname(curFilename);


const request = async (url) => {
    const res = await fetch(url, { headers: { 'X-Auth-Token': process.env.YUQUE_TOKEN } });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (data.error) {
        throw new Error(data.error)
    } else {
        return data;
    }
};

const toc = await request('https://www.yuque.com/api/v2/repos/1645741/toc')

const bookToc = toc.data;

let sidebar = []


const slugList = [
    'kbyo6n', 'pb40qx', 'iez8a4', 'un9fgs', 'szf3gh', 'agxdnq', 'ktwggk', 'sufa23', 'ki4dgp', 'ynstox', 'knk2h0', 'qrkw0g', 'dl5k6n',
]

/**
 * @description: 生成电子书SideBar侧边栏
 * @param {*} tocItem 
 * @param {*} lock 
 * @returns 
 */
function generateSlugSidebar(tocItem, lock) {
    let itemToc = {
        label: tocItem.title,
        translations: {
            en: ''
        },
        items: []
    }
    if (tocItem.slug !== '#') {
        itemToc.link = `docs/ebook/${tocItem.slug}/`;
        if (lock) {
            itemToc = {
                ...itemToc,
                attrs: {
                    lock: true
                }
            }
        }
    }
    return itemToc
}

/**
 * @description: 生成电子书内容
 * @param {*} tocItem 
 */
const generateEbookContent = async (tocItem) => {
    let lock = undefined
    if (tocItem.slug !== '#') {
        slugList.includes(tocItem.slug) ? lock = false : lock = true;
    }
    if (tocItem.depth == '1') {
        sidebar.push(generateSlugSidebar(tocItem, lock))
    }
    if (tocItem.depth == '2') {
        sidebar[sidebar.length - 1].items.push(generateSlugSidebar(tocItem, lock))
    }
    if (tocItem.depth == '3') {
        // 取最后一个对象
        const lastItem = sidebar[sidebar.length - 1];
        // 取最后一个对象的items中的最后一个item
        const lastSecItem = lastItem.items[lastItem.items.length - 1];
        lastSecItem.items.push(
            generateSlugSidebar(tocItem, lock)
        )
    }

    if (tocItem.slug) {
        const bookDir = path.resolve(curDirname, 'src/content/docs/ebook/zh-cn');
        fs.mkdir(bookDir, { recursive: true });
        const getMdContent = (body, frontMatter={}) => `---
title: ${frontMatter.title || "Nacos Eook"}
keywords: [ Nacos ]
description: ${frontMatter.description || "Nacos Eook"}
---
${body}`

        if (slugList.includes(tocItem.slug)) {
            const bookItem = await request(`https://www.yuque.com/api/v2/repos/nacos/ebook/docs/${tocItem.slug}`);
            const body = bookItem.data.body;
            if (body) {
                fs.writeFile(path.resolve(bookDir, `${tocItem.slug}.mdx`), getMdContent(body, bookItem.data), 'utf8')
            }
        } else if(tocItem.slug !== '#') {
            fs.writeFile(path.resolve(bookDir, `${tocItem.slug}`), getMdContent(`
import Lock from "@components/common/EbookLock.astro";

<Lock />`), 'utf8')
        }
    }
}

for (const tocItem of bookToc) {
    await generateEbookContent(tocItem);
}

fs.writeFile(path.resolve(curDirname, 'src/content/docs/ebook/_sidebar.json'), JSON.stringify(sidebar), 'utf8')
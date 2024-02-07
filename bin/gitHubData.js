import fs from "fs/promises";
import path from "path";
import https from 'https'
import { fileURLToPath } from 'url';
import getAvatar from "./getAvatar.js";

const request = async (url, headers={}) => {
    const res = await fetch(url, {headers});
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (data.error) {
        throw new Error(data.error)
    } else {
        return data;
    }
};

let res = await request("https://api.github.com/repos/alibaba/nacos/contributors?per_page=24")

let contributors = res.map(v => {
    return {
        login: v.login,
        avatar_url: v.avatar_url,
        html_url: v.html_url
    }
})

getAvatar(contributors);

const curFilename = fileURLToPath(import.meta.url);
const curDirname = path.dirname(curFilename);
const runtimePath = path.join(curDirname, '../src/components/contributors/gitHubData.json');
await fs.writeFile(runtimePath, JSON.stringify(contributors));


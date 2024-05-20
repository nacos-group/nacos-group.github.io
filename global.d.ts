// global.d.ts 文件中
interface Window {
    gUid: string;
    CNPilot?: any;
}

// 或者
interface GlobalThis {
    gUid: string;
}


/**
 * 配置请求
 */
// 导入模块
import qs from 'qs';

/** 封装fetch请求 */
function request(url: string, storageName: string, params: any = null, method: string = 'GET') {
    return new Promise(async (resolve, reject) => {
        if (storageName && localStorage && localStorage.getItem(storageName)) {
            resolve(JSON.parse(localStorage.getItem(storageName) || ''))
            return
        }
        // 配置的参数
        let config = {}
        // 判断请求类型
        if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
            if (params) {
                url += "?" + qs.stringify(params);
            }
        }
        else if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
            config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            if (params) {
                config = {
                    ...config,
                    body: JSON.stringify(params),
                };
            }
        }

        try {
            const response = await fetch(url, {
                mode: 'cors',
                ...config,
            });

            response.json().then(res => {
                if (!response.ok) {
                    return reject(res)
                }
                if (storageName && localStorage) {
                    localStorage.setItem(storageName, JSON.stringify(res))
                }
                resolve(res);
            }).catch(error => {
                error.message === "Unexpected end of JSON input" ? resolve({}) : reject(error);
            });
        } catch (error) {
            console.dir(error);
            reject(error);
        }
    });
}


// 导出配置好的对象
export default request;

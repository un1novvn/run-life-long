const fs = require('fs');
const path = require('path');
const https = require('https');

// 登录 URL
const loginUrl = "https://apicn.coros.com/coros/user/login";
// 数据查询 URL 模板
const queryUrlBase = "https://apicn.coros.com/coros/data/sport/query";

// 请求头
const headers = {
    "host": "apicn.coros.com",
    "yfheader": JSON.stringify({
        "appVersion": 844459290722304,
        "clientType": 1,
        "language": "zh-Hans-CN",
        "mobileName": "MI MAX 2,Xiaomi,Xiaomi",
        "releaseType": 1,
        "systemDisplayId": "cherish_oxygen-userdebug 12 SQ3A.220705.003.A1 1658344814 release-keys",
        "systemVersion": "12",
        "timezone": 32,
        "userId": 447260452899012608,
        "userSettingScope": "CAEQARgBIAEoATABOAE=",
        "versionCode": "308130700"
    }),
    "yfflag": "",
    "app-state": "0",
    "x-app-req-env": "release-2024V5-fix",
    "content-type": "application/json",
    "user-agent": "okhttp/4.11.0"
};

// 确保 coros-data 目录存在
const dataDir = path.join(__dirname, 'coros-data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// 登录函数
function login() {
    const account = process.env.COROS_ACCOUNT;
    const pwd = process.env.COROS_PWD;

    if (!account || !pwd) {
        console.error("Error: COROS_ACCOUNT and COROS_PWD environment variables must be set.");
        process.exit(1);
    }

    const payload = JSON.stringify({
        "account": account,
        "accountType": 2,
        "appKey": "2490514846039213",
        "clientType": 1,
        "hasHrCalibrated": 0,
        "kbValidity": 0,
        "pwd": pwd,
        "region": "|Asia/Shanghai|CN",
        "skipValidation": false
    });

    const urlObj = new URL(loginUrl);
    const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
            ...headers,
            'request-time': Date.now().toString(),
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = [];
            
            res.on('data', (chunk) => {
                data.push(chunk);
            });

            res.on('end', () => {
                const buffer = Buffer.concat(data);
                try {
                    const json = JSON.parse(buffer.toString());
                    // 假设 accessToken 在 data.accessToken
                    // 根据经验，API 可能返回 { code: "0000", message: "...", data: { accessToken: "..." } }
                    if (json && json.data && json.data.accessToken) {
                        console.log("Login successful, accessToken obtained.");
                        resolve(json.data.accessToken);
                    } else {
                        console.error("Login failed or accessToken not found in response:", buffer.toString());
                        reject(new Error("Login failed"));
                    }
                } catch (e) {
                    console.error("Failed to parse login response:", e);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Login request failed: ${e.message}`);
            reject(e);
        });

        req.write(payload);
        req.end();
    });
}

function req(date, accessToken) {
    const filename = path.join(dataDir, `${date}.json`);
    
    // 修改：即使文件存在也覆盖
    // if (fs.existsSync(filename)) { ... }

    const payload = JSON.stringify({
        "month": parseInt(date),
        "sportList": [{"sportType": 65535}],
        "direction": 2
    });

    const queryUrl = `${queryUrlBase}?accessToken=${accessToken}`;
    const urlObj = new URL(queryUrl);
    
    const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
            ...headers,
            'request-time': Date.now().toString(),
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = [];
            
            res.on('data', (chunk) => {
                data.push(chunk);
            });

            res.on('end', () => {
                const buffer = Buffer.concat(data);
                
                // 简单检查响应是否看起来像 JSON 错误
                try {
                    const preview = buffer.toString().slice(0, 100);
                    if (preview.includes('"code"') && !preview.includes('"code":"0000"') && !preview.includes('"code": "0000"')) {
                         console.warn(`Warning: Response for ${date} might indicate error: ${preview}...`);
                    }
                } catch (e) {}

                fs.writeFileSync(filename, buffer);
                console.log('write ok:', filename);
                
                setTimeout(resolve, 5000);
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request for ${date}: ${e.message}`);
            reject(e);
        });

        req.write(payload);
        req.end();
    });
}

async function main() {
    try {
        // 1. 登录获取 Token
        const accessToken = await login();

        // 2. 计算当前月份
        const now = new Date();
        const year = now.getFullYear();
        const month1 = (now.getMonth() + 1).toString().padStart(2, '0');
        const month2 = (now.getMonth()).toString().padStart(2, '0');
        const currentMonth = `${year}${month1}`;
        const lastMonth = `${year}${month2}`;

        console.log(`Fetching data for current month: ${currentMonth}`);
        
        // 3. 获取数据（覆盖）
        await req(currentMonth, accessToken);
        await req(lastMonth, accessToken);

    } catch (error) {
        console.error("Main process failed:", error);
        process.exit(1);
    }
}

main().catch(console.error);

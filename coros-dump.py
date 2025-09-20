import requests
import json

# 请求的 URL
url = "https://apicn.coros.com/coros/data/sport/query?accessToken=BITC7Z3L3LCM4PQ41SYV3UL0DY4NH1PP"

# 请求头
headers = {
    "host": "apicn.coros.com",
    "yfheader": json.dumps({
        "appVersion": 844459290722304,
        "clientType": 1,
        "language": "zh-Hans-CN",
        "mobileName": "MI MAX 2,Xiaomi,Xiaomi",
        "releaseType": 1,
        "systemDisplayId": "cherish_oxygen-userdebug 12 SQ3A.220705.003.A1 1658344814 release-keys",
        "systemVersion": "12",
        "timezone": 32,
        "userId": 447260452899012608,
        "userSettingScope": "CAEQARgBIAEoATABOAE="
    }),
    "yfflag": "",
    "app-state": "0",
    "x-app-req-env": "release-2024V5-fix",
    "request-time": "1752506572473",
    "content-type": "application/json",
    "accept-encoding": "gzip",
    "user-agent": "okhttp/4.11.0"
}
import os
def req(date: str):
    filename = f'coros-data/{date}.json'
    if os.path.exists(filename):
        return
    payload = {
        "month": int(date),
        "sportList": [{"sportType": 65535}],
        # "isIncludeImageData": True,
        # "size": 31,
        "direction": 2
    }
    f = open(filename,'w', encoding='utf-8')
    response = requests.post(url, headers=headers, json=payload)
    f.write(response.text)

    print('write ok:', filename)

    time.sleep(5)

import time

for year in range(2022, 2026):

    for month in range(1, 13):

        if year == 2025 and month == 10:
            exit()
        if year == 2022 and month < 10:
            continue

        month = str(month).zfill(2)
        date = f'{year}{month}'
        req(date)


# 请求体

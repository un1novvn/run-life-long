

项目主要代码由 cline + deepseek 完成, 人工只做了少量修改

# How to build

```bash
npm run build
```
# How to deploy to github pages

set your github pages repository

```json
"scripts": {
    "dev": "vite",
    "build": "node process-coros-data.js && tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && npx gh-pages -d dist -b main -r https://github.com/un1novvn/running-data-pages.git"
}
```

deploy

```bash
npm run deploy
```









部署在阿里云函数上的代码。

先创建层, 全部 npm 依赖都放到层中。

然后添加环境变量：

```json

{
    "COROS_ACCOUNT": "",
    "COROS_PWD": "",
    "GIT_AUTHOR_EMAIL": "helloworld260@163.com",
    "GIT_AUTHOR_NAME": "un1novvn",
    "GIT_SSH_COMMAND": "ssh -i /code/id_rsa -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no",
    "LD_LIBRARY_PATH": "/code:/code/lib:/usr/lib:/opt/lib:/usr/local/lib",
    "NODE_PATH": "/opt/nodejs/node_modules",
    "PATH": "/var/fc/lang/nodejs20/bin:/usr/local/bin/apache-maven/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/ruby/bin:/opt/bin:/code:/code/bin:/opt/nodejs/node_modules/.bin"
}

```

启动脚本:

```
  "scripts": {
    "dev": "vite",
    "build": "node coros-dump.js && node process-coros-data.js && tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && npx gh-pages -d dist --cname running.unk.org.cn -b main -r git@github.com:un1novvn/running-data-pages.git",
    "set_git_config": "git config --global user.name \"un1novvn\" && git config --global user.email \"helloworld260@163.com\" && chmod 600 /code/id_rsa",
    "start": "npm run set_git_config && ln -s /opt/nodejs/node_modules node_modules && npm run deploy && node ./index.js"
  },
```

ln -s /opt/nodejs/node_modules node_modules 这行命令的作用是为了 让 tsc 命令不报错。估计是包查找的问题， 尝试过修改查找路径为 /opt/nodejs/node_modules 不成功。用软连接最方便




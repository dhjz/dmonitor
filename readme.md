## 服务器监控软件  轻量redis客户端
### 开发语言
- 前端: vue3 + vite + element-plus
- 后端: go
- go主依赖: github.com/shirou/gopsutil, github.com/redis/go-redis/v9
- `service`目录为后端代码, `web`目录为前端代码
- 使用go:embed 打包前端资源到exe中, 避免分离运行
### 功能介绍
- 单页面监控服务器信息, 支持linux, windows
- 体积小, 打包后5M
- 支持查看服务器CPU、内存和占用信息
- 支持查看服务器基本信息，操作系统架构等
- 支持查看服务器磁盘及占用信息

- 支持自定义redis连接列表, 本地缓存, 服务端不存储
- 支持筛选redis不同DB库查询所有key信息
- 支持查看redis指定key的值以及过期信息
- 支持查看redis版本信息及运行模式

- windows端支持托盘打开网页和退出程序
### 打包安装
- 双击build.bat 可以打包window和linux运行文件, 双击生成的dist/dmonitor.exe, 即可运行
- 前段项目`yarn install` -> `yarn build`, 将生成后的文件放入dmonitor.exe同级目录下的webapp文件夹即可
- 打开页面`http://localhost:40001/` 访问页面
- dwatch.exe -p 40001 可以指定端口
### 其他说明
- 页面效果图见`appimg`目录
- ![alt 监控图](https://gcore.jsdelivr.net/gh/dhjz/dmonitor@master/appimg/app.jpg)

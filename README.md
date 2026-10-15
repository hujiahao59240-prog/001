# NEON SNAKE · 贪吃蛇

纯静态中文贪吃蛇，电脑与手机均可游玩，无运行时第三方依赖。

## 本地运行

需要 Python 3。在仓库根目录运行 `python -m http.server 8000`，然后在本机浏览器访问服务器。也可以安装 Node 后使用 `npm start`。

## 玩法

- 点击开始，方向键或 WASD 转向；手机可滑动棋盘或使用方向按钮。
- 吃一个光点加 10 分。撞墙或撞到身体结束，填满棋盘获胜。
- 空格或暂停按钮暂停/继续，切到后台自动暂停。重新开始立即开启新一局。
- 本机最高分保存在浏览器；禁用存储时仍可游玩。

## 测试

Node 18+：`npm test`，无需安装依赖。

浏览器验收需要 Playwright，可在仓库外安装：

```sh
npm install --prefix /tmp/snake-browser --cache /tmp/snake-npm-cache playwright
PLAYWRIGHT_BROWSERS_PATH=/tmp/snake-browsers node /tmp/snake-browser/node_modules/playwright/cli.js install chromium
# 另一个终端先启动上面的静态服务器
PLAYWRIGHT_MODULE=/tmp/snake-browser/node_modules/playwright/index.mjs PLAYWRIGHT_BROWSERS_PATH=/tmp/snake-browsers node tests/browser.test.mjs
```

若已有 Chromium，可设置 `CHROMIUM_PATH` 指向其可执行文件。自动化验收包含移动、计分、暂停/继续、键盘、重开计时器、后台暂停、最高分保存、存储禁用、320px 布局、方向按钮和滑动。

## 部署

根目录的 `index.html`、`styles.css`、`game.js`、`app.js` 与 `.nojekyll` 可部署到任意静态托管服务。资源全部使用相对路径，支持 GitHub Pages 子路径。

GitHub Pages：仓库 Settings → Pages → Build and deployment，选择 Deploy from a branch、`gh-pages` 分支、`/ (root)`，保存。首次部署需等待构建完成；以 Pages 设置页显示的网站地址为准。

本地规则测试与浏览器验收通过不代表公网部署完成。只有线上页面及资源经过实际访问确认后才能视为上线成功。

## 当前交付状态

游戏地址：https://hujiahao59240-prog.github.io/001/

12 项规则测试及桌面/手机浏览器验收通过。GitHub Pages 部署任务 [38726550647](https://github.com/hujiahao59240-prog/001/actions/runs/38726550647) 已成功，游戏版本为 `4f43a16`。当前开发环境的网络代理拒绝直接访问该站点，因此公网页面尚未从此环境完成直接验收。

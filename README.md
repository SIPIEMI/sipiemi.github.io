# 硬件工程师 SI / PI / EMI 手册

网站地址：<https://sipiemi.github.io>

本仓库是一个 GitHub Pages 网站，使用 [Jekyll](https://jekyllrb.com/) 和 [Just the Docs](https://just-the-docs.com/) 主题。推送到 `main` 分支后，GitHub 会自动重新生成网站，通常一两分钟内生效。

## 文件结构

| 文件 | 内容 |
|:-----|:-----|
| `index.md` | 首页，包括更新记录 |
| `si.md` | 信号完整性 |
| `pi.md` | 电源完整性 |
| `emi.md` | 电磁干扰 |
| `404.md` | 页面不存在时显示的页面 |
| `_config.yml` | 网站标题、主题版本、搜索、提示框样式等设置 |
| `_includes/js/custom.js` | 让站内搜索支持中文 |

## 修改页面

在 GitHub 网页上直接打开对应的 `.md` 文件，点铅笔图标编辑即可。网站每一页底部也有“在 GitHub 上编辑此页”的链接。

每个页面开头的 `---` 之间是页面设置：

```yaml
---
title: 电源完整性 PI   # 左侧导航栏里显示的名字
nav_order: 3           # 在导航栏里的顺序
permalink: /pi/        # 网址
---
```

## 新增子页面

某一部分内容变多时，可以拆成子页面。以给 PI 增加“去耦电容”子页面为例：

1. 在 `pi.md` 的页面设置里加一行 `has_children: true`。
2. 新建 `pi/decoupling.md`：

   ```yaml
   ---
   title: 去耦电容
   parent: 电源完整性 PI   # 必须和 pi.md 的 title 完全一致
   nav_order: 1
   ---
   ```

## 提示框

页面里的“公式”“算例”“经验”“注意”“说明”框，写法是在段落前加一行样式标记：

```markdown
{: .formula }
> Z<sub>target</sub> = V<sub>DD</sub> × 允许纹波比例 / ΔI

{: .example }
这里写算例。
```

可用的样式有 `formula`、`example`、`tip`、`warning`、`note`，颜色和标题在 `_config.yml` 的 `callouts` 里设置。

## 本地预览（可选）

需要安装 Ruby 和 Bundler：

```sh
bundle install
bundle exec jekyll serve
```

然后在浏览器打开 <http://localhost:4000>。

# 示意图绘制规范：内嵌 SVG

本文总结本站示意图的画法和风格，范例是 [Dk/Df 多频点提取](https://sipiemi.github.io/si/dk-df-extraction/#量哪些尺寸) 页面“量哪些尺寸”一节的图 1（差分带状线截面与切片量测尺寸）。以后新增截面图、叠层图、结构示意图，都按这里的做法画，全站风格就能保持一致。

本文件只供维护者参考，已在 `_config.yml` 中排除，不会发布到网站上。

## 1. 为什么直接在 Markdown 里写 SVG

- **是文本**：和正文写在同一个 `.md` 文件里，可以搜索、比较差异、逐行修改，不用另存图片文件。
- **是矢量**：任何缩放比例下都清晰，打印也清晰。
- **没有依赖**：不引用外部文件、字体和脚本，GitHub Pages 直接渲染，也不受国内访问 CDN 的影响。
- **颜色跟随正文**：全部用 `currentColor`，图的颜色就是正文文字的颜色（本站当前的浅色配色下为 #5c5962）。本站目前没有深色模式；以后如果换成深色配色，图会自动跟着变，不用改图。

## 2. 风格要点

1. **一张图只回答一个问题。** 图 1 只回答“切片要量哪些尺寸”，所以只画了参考平面、介质、两根走线和 6 个尺寸，没有过孔、阻焊和玻纤。
2. **单色，用透明度分层次。** 不用彩色。背景、铜、导体、辅助线的区别全部靠同一种颜色的不同透明度和线型来表达（见第 4 节）。
3. **示意，不按比例。** 薄的东西适当画厚，保证看得清：图 1 中铜厚与上介质厚度之比为 24 : 116 ≈ 0.21，而示例几何的实际比值是 17 µm : 125 µm ≈ 0.14。形状特征要保留，例如走线画成梯形，靠芯板一侧的下线宽更宽。
4. **用对比表达差异。** 左边的 P 线画成光滑的，右边的 N 线画成粗糙的，一张图同时表达“截面尺寸”和“铜面粗糙度”两件事，不用再画第二张图。
5. **图内文字少而短。** 图内只放“符号 + 名称”的短标签（如“W1 上线宽”），解释和注意事项全部写进图注。
6. **符号与正文一致。** 图中的 W1、W2、T、H1、H2、S，与图下表格和正文用的符号完全相同。
7. **尺寸线不用箭头。** 用一条直线加两端与它垂直的短线（端点标记：水平尺寸两端是短竖线，垂直尺寸两端是短横线）。不需要定义 `<marker>`，各浏览器的显示也一致。

## 3. 画布与结构

### 外层结构

```html
<figure>
<svg viewBox="0 0 640 316" role="img" aria-label="一句完整描述图的内容" style="max-width:640px;width:100%;height:auto" font-family="sans-serif" font-size="14">
……图形元素……
</svg>
<figcaption>图 1　……</figcaption>
</figure>
```

- **宽度固定为 640 个单位**：`viewBox` 的宽度用 640，高度按内容定。`style="max-width:640px;width:100%;height:auto"` 让图在桌面上显示为 640px，在窄屏上按比例缩小，宽高比不变。
- **字体写在根元素上**：`font-family` 和 `font-size` 写在 `<svg>` 上，所有 `<text>` 都继承，不用逐个设置。
- **无障碍**：`role="img"` 加上 `aria-label`，用一句话完整描述图的内容（读屏软件会朗读它）。
- **不用 CSS 类和 `<style>`**：所有样式都写成元素属性，复制到哪里都能原样显示。

### 坐标规划

先在 640 宽的画布上按水平条带规划好每一层的纵坐标，左右各留 40 个单位的边距（图形画在 x = 40–600 之间）。图 1 的规划如下：

| 纵坐标 y | 内容 |
|:---------|:-----|
| 36 | 文字“上参考平面（地）”（基线） |
| 44–56 | 上参考平面（厚 12） |
| 56–276 | 介质区；y = 196 处虚线为半固化片与芯板的分界 |
| 147 | 文字“W1 上线宽” |
| 160 | W1 尺寸线 |
| 172–196 | 走线（厚 24）；下表面落在分界线 y = 196 上 |
| 214 | W2、S 尺寸线 |
| 237 | 文字“W2 下线宽”“S 线间距” |
| 276–288 | 下参考平面 |
| 306 | 文字“下参考平面（地）”；viewBox 高度取 316 |

横向：P 线上边 220–290、下边 210–300；N 线上边 370–440、下边 360–450；H1、H2 尺寸线放在 x = 160（走线左侧的空白处）；T 尺寸线放在 x = 476（N 线右侧）。

所有坐标都取整数，并尽量取 2、4、5 的倍数，以后修改时容易对齐。

### 绘制顺序

SVG 后画的元素会盖住先画的，所以按“从背景到前景”的顺序写：

1. 介质背景（大矩形）
2. 参考平面（铜）
3. 层间分界线
4. 导体截面
5. 尺寸线、端点标记和引线（合并在一个实线 `<path>` 里）
6. 延伸线（一个虚线 `<path>`）
7. 文字

## 4. 配色与线型

全部使用 `currentColor`，用透明度区分层次：

| 元素 | 写法 | 效果 |
|:-----|:-----|:-----|
| 介质背景 | `fill="currentColor" fill-opacity="0.07"` | 很浅的底色，只用来划出介质区 |
| 参考平面（铜） | `fill="currentColor" fill-opacity="0.5"` | 中灰色实心条 |
| 导体截面 | `fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"` | 浅灰色填充加深色轮廓，是画面的视觉中心 |
| 层间分界线 | `stroke="currentColor" stroke-opacity="0.6" stroke-dasharray="6 4"` | 长虚线，表示材料分界而不是实体 |
| 尺寸线 | `fill="none" stroke="currentColor" stroke-width="1.2"` | 细实线 |
| 延伸线 | `fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-dasharray="3 3"` | 短虚线，把尺寸端点引到被测的边 |
| 文字 | `fill="currentColor"`；需要强调时加 `font-weight="bold"` | 与正文同色 |

规律：**越是“实物”越实、越深；越是“辅助”越虚、越浅。** 铜和导体用填充，分界线和延伸线用虚线，尺寸线用细实线。

## 5. 常用图元

### 梯形走线

```html
<polygon points="220,172 290,172 300,196 210,196" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/>
```

四个点按“左上 → 右上 → 右下 → 左下”的顺序。上边比下边窄，表示蚀刻形成的梯形。

### 粗糙表面

粗糙铜面用锯齿折线表示：上表面每 5 个单位起伏 2 个单位，下表面起伏 3 个单位，侧壁保持直线。点数较多，用脚本生成：

```python
def zigzag(x_start, x_end, y, amp, step=5):
    """从 x_start 到 x_end 生成锯齿点：偶数点在 y 上，奇数点在 y + amp 上。"""
    # 跨度必须是 2 × step 的整数倍，两个端点才都落在 y 上，与侧壁相接
    assert abs(x_end - x_start) % (2 * step) == 0, "x_end - x_start 必须是 2*step 的整数倍"
    d = step if x_end >= x_start else -step
    xs = range(x_start, x_end + d, d)
    return " ".join("%d,%d" % (x, y + (amp if i % 2 else 0)) for i, x in enumerate(xs))

top = zigzag(370, 440, 172, -2)     # 上表面，从左到右，向上起伏 2
bottom = zigzag(450, 360, 196, 3)   # 下表面，从右到左，向下起伏 3
print(top + " " + bottom)           # 粘贴到 <polygon points="..."> 中
```

上面这段代码生成的点，与图 1 中 N 线的 `points` 完全相同。多边形按顺时针绕一圈：上表面从左到右，再沿右侧壁下到右下角，下表面从右到左，最后由左侧壁自动闭合。

### 尺寸线

一个尺寸 = 一条主线 + 两端各一条长 12 的短线（主线两侧各伸出 6）：

```html
<!-- 水平尺寸 W1：主线在 y = 160，从 x = 220 到 290 -->
<path d="M220 160H290M220 154V166M290 154V166" fill="none" stroke="currentColor" stroke-width="1.2"/>
<!-- 垂直尺寸 H1：主线在 x = 160，从 y = 56 到 172 -->
<path d="M160 56V172M154 56H166M154 172H166" fill="none" stroke="currentColor" stroke-width="1.2"/>
<!-- 连续尺寸 W2 + S：共用中间的端点标记 x = 300 -->
<path d="M210 214H360M210 208V220M300 208V220M360 208V220" fill="none" stroke="currentColor" stroke-width="1.2"/>
```

- 只用绝对坐标命令 `M`（移到）、`H`（水平线到）、`V`（垂直线到）、`L`（直线到），读起来就是坐标表。
- 一张图中所有实线的尺寸线、引线最后合并成**一个** `<path>`，统一设置线宽。各段的 `d` 直接首尾相接即可（每个 `M` 都开始新的一段），如图 1 的 `M220 160H290M220 154V166M290 154V166`；中间加不加空格效果一样。

### 延伸线和引线

- **延伸线**：尺寸线离被测边较远、端点标记够不着被测边时，用短虚线连过去。图 1 中 `M166 172H220` 把 H1 的下端点（y = 172）连到 P 线上表面的左端（220, 172），`M440 172H470` 把 N 线上表面的右端（440, 172）连到 T 的上端点。W1、W2、S 的尺寸线只比走线高 12 或低 18，端点标记与走线的角上下对齐，不画延伸线。
- **引线**：给不方便直接标注的特征加说明时，从特征画一条斜线到空白处再写字。图 1 中 `M420 199L500 232` 从 N 线下表面引到文字“粗糙铜面”。

## 6. 文字标注

- **标签格式**：“符号 + 空格 + 中文名”，如“W1 上线宽”“T 铜厚”。层的名称（“半固化片（压合后）”“芯板”）不带符号。
- **水平尺寸**：文字居中（`text-anchor="middle"`，x 取尺寸线中点），放在线上方时基线比线高 13，放在线下方时基线比线低 23（多出的部分是文字本身的高度）。
- **垂直尺寸**：文字基线取尺寸线中点再加 5。左边有空白时，文字放在尺寸线左侧、右对齐（`text-anchor="end"`，x 比尺寸线小 10），如 H1、H2（尺寸线 x = 160，文字 x = 150）；尺寸线左边紧挨着导体时，文字放在右侧、左对齐（不写 `text-anchor`，x 比尺寸线大 12），如 T（尺寸线 x = 476，文字 x = 488）。
- **基线修正**：SVG 中 `<text>` 的 y 是文字基线，不是中线。要让 14 号字在垂直方向上居中对齐某个位置，y 要加约 5（约为字号的 0.35 倍）。
- **区域名称**：写在区域内部的角上，右对齐，距离右边界 8（x = 592）。
- **参考平面名称**：写在平面外侧，左对齐（x = 40）。上平面的文字基线比平面上沿高 8；下平面的文字基线比平面下沿低 18；viewBox 的高度取下方文字基线再加 10。
- **导体上的文字**：只放一两个字的粗体标识（如 P、N），长文字不要压在填充区上。
- **不要让文字与线交叉。** 放不下时，宁可把文字移出去再加引线。

## 7. 图注

```html
<figcaption>图 1　差分带状线截面与切片量测尺寸。走线由芯板上的铜箔蚀刻而成……</figcaption>
```

- 以“图 N”开头，后接一个全角空格（　）。编号在页面内按出现顺序排列。
- 第一句说明图画的是什么，然后逐个解释图中的符号，最后写注意事项。
- 图内放不下的说明都写在这里。不要在图的底部放小号注释：12 号字在 390px 宽的手机上只有约 6.8px，几乎看不清。

## 8. 嵌入 Markdown 的注意事项

本站用 Jekyll 和 kramdown 生成页面，嵌入时注意以下几点：

- `<figure>` 块的**前后各留一个空行**，块内**不留空行**。本站的 kramdown 遇到 `<figure>` 会一直读到 `</figure>`，块内有空行图也不会坏；但 CommonMark 系的渲染器（GitHub 网页上的 .md 预览、VS Code 预览等）在空行处就结束 HTML 块，把后面的内容当作 Markdown 解析，预览里图就坏了。为了在各处都显示正常，仍按这条写。
- 块内的内容不会按 Markdown 处理。图注里需要上下标时写 HTML，如 `W<sub>2</sub>`。
- 文字中的 `&`、`<` 要写成 `&amp;`、`&lt;`。
- 不能出现 `{{` 和 `{%`，Jekyll 会把它们当作 Liquid 模板语法的开头，找不到结尾就报错（单独的 `}}`、`%}` 不受影响）。
- 不引用外部图片、字体和脚本。

## 9. 检查清单

- [ ] XML 合法：所有标签都闭合，可以用 `python3 -c "import sys, xml.etree.ElementTree as ET; ET.parse(sys.argv[1]); print('OK')" figure.html` 检查（把 `<figure>` 块单独存成 UTF-8 文件，输出 OK 即通过；`&nbsp;` 这类 HTML 实体在 XML 里没有定义，会被报错，直接写字符即可）
- [ ] `<figure>` 块内没有空行，块前后各有一个空行
- [ ] 图中的符号与正文、表格一致
- [ ] 桌面宽度下文字清楚、互不重叠，文字没有压在线上
- [ ] 手机宽度（约 390px）下打开看一遍。viewBox 宽 640、字号 14 时，手机上的字只有约 7–8px，所以图内文字要尽量少；需要在手机上看清的图，可以把字号加到 16–18（手机上约 9–10px），或把 viewBox 缩窄到 480 左右并把 `max-width` 同时改成 480px（手机上约 10.6px；这是第 3 节“宽度固定为 640”的例外）
- [ ] `aria-label` 和图注都已填写，图注以“图 N　”开头
- [ ] 没有用到 `currentColor` 以外的颜色

## 10. 模板

下面是一个单端带状线截面的最小模板，包含背景、两个参考平面、分界线、梯形走线、五个尺寸（W1、W2、T、H1、H2）和标签。新画截面图时可以从它改起。

```html
<figure>
<svg viewBox="0 0 640 296" role="img" aria-label="单端带状线截面示意图：上下参考平面之间有一根梯形走线，标注上线宽 W1、下线宽 W2、铜厚 T、上介质厚度 H1 和下介质厚度 H2" style="max-width:640px;width:100%;height:auto" font-family="sans-serif" font-size="14">
<rect x="40" y="56" width="560" height="200" fill="currentColor" fill-opacity="0.07"/>
<path d="M40 44H600V56H40ZM40 256H600V268H40Z" fill="currentColor" fill-opacity="0.5"/>
<line x1="40" y1="184" x2="600" y2="184" stroke="currentColor" stroke-opacity="0.6" stroke-dasharray="6 4"/>
<polygon points="285,160 355,160 365,184 275,184" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/>
<path d="M285 148H355M285 142V154M355 142V154M275 202H365M275 196V208M365 196V208M200 56V160M194 56H206M194 160H206M200 184V256M194 184H206M194 256H206M400 160V184M394 160H406M394 184H406" fill="none" stroke="currentColor" stroke-width="1.2"/>
<path d="M206 160H285M355 160H394" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-dasharray="3 3"/>
<text x="40" y="36" fill="currentColor">上参考平面（地）</text>
<text x="40" y="286" fill="currentColor">下参考平面（地）</text>
<text x="592" y="84" text-anchor="end" fill="currentColor">半固化片</text>
<text x="592" y="242" text-anchor="end" fill="currentColor">芯板</text>
<text x="320" y="135" text-anchor="middle" fill="currentColor">W1 上线宽</text>
<text x="320" y="225" text-anchor="middle" fill="currentColor">W2 下线宽</text>
<text x="190" y="113" text-anchor="end" fill="currentColor">H1 上介质厚度</text>
<text x="190" y="225" text-anchor="end" fill="currentColor">H2 下介质厚度</text>
<text x="412" y="177" fill="currentColor">T 铜厚</text>
</svg>
<figcaption>图 1　单端带状线截面。W1、W2 为走线的上、下线宽，T 为铜厚；H1 为走线顶面到上参考平面的介质厚度，H2 为走线底面到下参考平面的介质厚度。</figcaption>
</figure>
```

## 附录：图 1 源码

以下是 Dk/Df 页面中图 1 的完整源码，可以对照上文各节阅读。

```html
<figure>
<svg viewBox="0 0 640 316" role="img" aria-label="差分带状线截面示意图：上下参考平面之间有一对梯形走线，标注切片量测的上线宽 W1、下线宽 W2、铜厚 T、上介质厚度 H1、下介质厚度 H2 和线间距 S，并示意粗糙铜面" style="max-width:640px;width:100%;height:auto" font-family="sans-serif" font-size="14">
<rect x="40" y="56" width="560" height="220" fill="currentColor" fill-opacity="0.07"/>
<path d="M40 44H600V56H40ZM40 276H600V288H40Z" fill="currentColor" fill-opacity="0.5"/>
<line x1="40" y1="196" x2="600" y2="196" stroke="currentColor" stroke-opacity="0.6" stroke-dasharray="6 4"/>
<polygon points="220,172 290,172 300,196 210,196" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/>
<polygon points="370,172 375,170 380,172 385,170 390,172 395,170 400,172 405,170 410,172 415,170 420,172 425,170 430,172 435,170 440,172 450,196 445,199 440,196 435,199 430,196 425,199 420,196 415,199 410,196 405,199 400,196 395,199 390,196 385,199 380,196 375,199 370,196 365,199 360,196" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/>
<path d="M220 160H290M220 154V166M290 154V166M210 214H360M210 208V220M300 208V220M360 208V220M160 56V172M154 56H166M154 172H166M160 196V276M154 196H166M154 276H166M476 172V196M470 172H482M470 196H482M420 199L500 232" fill="none" stroke="currentColor" stroke-width="1.2"/>
<path d="M166 172H220M440 172H470" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-dasharray="3 3"/>
<text x="40" y="36" fill="currentColor">上参考平面（地）</text>
<text x="40" y="306" fill="currentColor">下参考平面（地）</text>
<text x="592" y="84" text-anchor="end" fill="currentColor">半固化片（压合后）</text>
<text x="592" y="262" text-anchor="end" fill="currentColor">芯板</text>
<text x="255" y="189" text-anchor="middle" fill="currentColor" font-weight="bold">P</text>
<text x="405" y="189" text-anchor="middle" fill="currentColor" font-weight="bold">N</text>
<text x="255" y="147" text-anchor="middle" fill="currentColor">W1 上线宽</text>
<text x="255" y="237" text-anchor="middle" fill="currentColor">W2 下线宽</text>
<text x="330" y="237" text-anchor="middle" fill="currentColor">S 线间距</text>
<text x="150" y="119" text-anchor="end" fill="currentColor">H1 上介质厚度</text>
<text x="150" y="241" text-anchor="end" fill="currentColor">H2 下介质厚度</text>
<text x="488" y="189" fill="currentColor">T 铜厚</text>
<text x="504" y="238" fill="currentColor">粗糙铜面</text>
</svg>
<figcaption>图 1　差分带状线截面与切片量测尺寸。走线由芯板上的铜箔蚀刻而成，靠芯板一侧的下线宽 W2 较宽。H1 为走线顶面到上参考平面的介质厚度，H2 为走线底面到下参考平面的介质厚度，S 取底边间距（必要时也记录顶边间距）。右侧走线示意粗糙铜面：走线底面（芯板侧，铜箔处理面）、顶面和侧壁（棕化或替代处理面）以及两个参考平面的粗糙度各不相同；铜瘤小于光学分辨率，需用 SEM 量测，或按所用铜箔的规格取值。</figcaption>
</figure>
```

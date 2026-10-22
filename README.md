# 你的第一个网站 · 使用说明

这个文件夹就是你的网站。一共三个文件，没有别的东西，也不需要安装任何软件。

```
my-site/
├─ index.html   ← 网页的内容（文字、图片、链接）
├─ style.css    ← 网页的样子（颜色、大小、排版）
└─ README.md    ← 就是这份说明
```

---

## 第一步：先看看它长什么样

**双击 `index.html`**，浏览器会直接打开它。

就这样，不用服务器、不用命令行、不用联网。

---

## 第二步：把它改成你自己的

用记事本或者 VS Code 打开 `index.html`，里面凡是写着「改这里」的地方，都是让你改的。

### 改名字

找到这一行：

```html
<h1>你的名字</h1>
```

把「你的名字」改成你的名字。保存，刷新浏览器，就变了。

### 改一句话介绍

```html
<p class="tagline">人工智能专业 · 大三在读 · 对深度学习和小工具感兴趣</p>
```

### 换头像

现在是个蓝色圆圈加 "AI" 两个字。想换成照片的话：

1. 把照片放到这个文件夹里，命名成 `avatar.jpg`
2. 把 `index.html` 里这一行：

```html
<div class="avatar">AI</div>
```

换成：

```html
<img class="avatar" src="avatar.jpg" alt="头像">
```

3. 在 `style.css` 里找到 `.avatar` 那一块，加上一句 `object-fit: cover;`

### 加一个项目

找到 `<!-- 一个项目 = 一张卡片 -->`，把一整块 `<article>...</article>` 复制一份，改里面的标题和介绍。想加几个就复制几份。

### 改颜色

打开 `style.css`，最上面有这几行：

```css
--accent: #2f6fed;   /* 主题色 */
```

把 `#2f6fed` 换成别的颜色代码，全站的按钮和链接都会跟着变。

常用的颜色代码：`#e11d48`（红）、`#059669`（绿）、`#7c3aed`（紫）、`#ea580c`（橙）。

---

## 第三步：让全世界都能访问

现在只有你自己能看到。免费发布的方法：

### 方法一：GitHub Pages（推荐）

1. 去 [github.com](https://github.com) 注册账号
2. 点右上角 **+** → **New repository**
3. 仓库名填 `my-site`（或者 `你的用户名.github.io`，这样网址更短）
4. 选 **Public**，点 **Create repository**
5. 点 **uploading an existing file**，把 `index.html` 和 `style.css` 拖进去，提交
6. 进入仓库的 **Settings** → 左边找 **Pages**
7. Source 选 **Deploy from a branch**，分支选 **main**，点 **Save**
8. 等一两分钟，页面顶部会出现你的网址，形如：
   `https://你的用户名.github.io/my-site/`

### 方法二：Gitee Pages（国内速度快）

步骤和 GitHub 类似，但需要实名认证，而且 Pages 功能要手动申请开通。适合主要给国内的人看。

### 注意

GitHub 在国内**时快时慢**，这是正常的。如果打开很慢，用方法二，或者等一会儿再试。

---

## 常见问题

**Q：改了没反应？**
A：保存文件后，在浏览器里按 `Ctrl + F5` 强制刷新。

**Q：图片不显示？**
A：检查图片文件名大小写是否和代码里一致，还有图片是不是真的在这个文件夹里。

**Q：中文乱码？**
A：`index.html` 开头有 `<meta charset="UTF-8">`，保存文件时选 UTF-8 编码。

**Q：想加第二个页面（比如「关于」单独一页）？**
A：复制一份 `index.html`，改名成 `about.html`，改内容，然后在主页加个链接 `<a href="about.html">关于</a>`。

**Q：手机上看着乱？**
A：`style.css` 最下面有 `@media (max-width: 600px)` 那一段，就是专门调手机显示的。

---

## 你接下来该学什么

按这个顺序，别跳：

1. **HTML** —— 标签的意思，一天就够
2. **CSS** —— 重点学 **Flexbox 布局**，三天
3. **JavaScript** —— 先学「点按钮改文字」，一周

**别急着学 React、Vue。** 等你能不查资料改这个网站了，再考虑框架。

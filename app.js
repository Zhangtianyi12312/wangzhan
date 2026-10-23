/* ==========================================================
   导航页逻辑：两级视图（分类首页 / 分类详情）+ 搜索
   路由走 hash，刷新和后退都能用
   ========================================================== */

const app = document.getElementById("app");
const qInput = document.getElementById("q");
const totalEl = document.getElementById("total");
const brandLink = document.querySelector(".brand");

/* 每个分类的重音色（取自参考色板） */
const CAT_COLORS = {
  "AI 工具": "var(--violet)",
  "学习与课程": "var(--teal)",
  "编程开发": "var(--blue)",
  "资源下载": "var(--amber)",
  "生活服务": "var(--coral)",
  "游戏": "var(--slate)",
};

/* 分类的一句话说明 */
const CAT_DESC = {
  "AI 工具": "对话、API、中转站",
  "学习与课程": "课程、文献、查资料",
  "编程开发": "代码、文档、搜报错",
  "资源下载": "网盘、素材、图标",
  "生活服务": "邮箱、翻译、天气",
  "游戏": "商店、攻略、社区",
};

let query = "";

/* ---------- 工具 ---------- */
function iconOf(name) {
  const c = name.trim()[0] || "?";
  return /[a-z]/i.test(c) ? c.toUpperCase() : c;
}

function colorOf(cat) {
  return CAT_COLORS[cat] || "var(--slate)";
}

function matchItem(item, cat, q) {
  const s = q.toLowerCase();
  const alias = (item.alias || []).join(" ").toLowerCase();
  return (
    item.name.toLowerCase().includes(s) ||
    (item.desc || "").toLowerCase().includes(s) ||
    cat.toLowerCase().includes(s) ||
    alias.includes(s) ||
    item.url.toLowerCase().includes(s)
  );
}

/* ---------- 路由 ---------- */
function getRoute() {
  const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  if (!raw) return { type: "home" };
  const found = SITE_DATA.find((g) => g.cat === raw);
  return found ? { type: "cat", cat: raw } : { type: "home" };
}

/* ---------- 卡片 ---------- */
function siteCard(item, cat) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = item.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.style.setProperty("--c", colorOf(cat));

  const icon = document.createElement("span");
  icon.className = "icon";
  icon.textContent = iconOf(item.name);
  icon.style.color = colorOf(cat);

  const body = document.createElement("div");
  body.className = "card-body";

  const name = document.createElement("div");
  name.className = "card-name";
  name.textContent = item.name;

  const desc = document.createElement("div");
  desc.className = "card-desc";
  desc.textContent = item.desc || item.url;

  body.append(name, desc);
  a.append(icon, body);
  return a;
}

/* ---------- 首页：六个分类块 ---------- */
function renderHome() {
  const home = document.createElement("div");
  home.className = "home view-enter";

  const intro = document.createElement("div");
  intro.className = "home-intro";
  intro.innerHTML = `<h2>选一个方向</h2><p>六组常用站点，点进去看</p>`;
  home.appendChild(intro);

  const grid = document.createElement("div");
  grid.className = "tiles";

  for (const group of SITE_DATA) {
    const color = colorOf(group.cat);

    const tile = document.createElement("a");
    tile.className = "tile";
    tile.href = "#" + encodeURIComponent(group.cat);
    tile.style.setProperty("--c", color);

    const head = document.createElement("div");
    head.className = "tile-head";

    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = group.cat;

    const count = document.createElement("span");
    count.className = "tile-count";
    count.textContent = group.items.length;

    head.append(name, count);

    const desc = document.createElement("p");
    desc.className = "tile-desc";
    desc.textContent = CAT_DESC[group.cat] || "";

    const samples = document.createElement("p");
    samples.className = "tile-samples";
    samples.textContent = group.items
      .slice(0, 3)
      .map((i) => i.name)
      .join(" · ");

    const arrow = document.createElement("span");
    arrow.className = "tile-arrow";
    arrow.textContent = "→";

    tile.append(head, desc, samples, arrow);
    grid.appendChild(tile);
  }

  home.appendChild(grid);
  app.replaceChildren(home);
}

/* ---------- 分类详情 ---------- */
function renderCategory(cat) {
  const group = SITE_DATA.find((g) => g.cat === cat);
  if (!group) return renderHome();

  const color = colorOf(cat);
  const view = document.createElement("div");
  view.className = "cat-view view-enter";
  view.style.setProperty("--c", color);

  /* 顶部：返回 + 标题 */
  const head = document.createElement("div");
  head.className = "view-head";

  const back = document.createElement("button");
  back.className = "back-btn";
  back.type = "button";
  back.innerHTML = '<span aria-hidden="true">←</span> 全部';
  back.addEventListener("click", () => (location.hash = ""));

  const titleWrap = document.createElement("div");
  titleWrap.className = "view-title-wrap";

  const title = document.createElement("h2");
  title.className = "view-title";
  title.textContent = cat;

  const sub = document.createElement("span");
  sub.className = "view-sub";
  sub.textContent = `${group.items.length} 个站点 · ${CAT_DESC[cat] || ""}`;

  titleWrap.append(title, sub);
  head.append(back, titleWrap);

  /* 站点网格 */
  const grid = document.createElement("div");
  grid.className = "grid";
  for (const item of group.items) grid.appendChild(siteCard(item, cat));

  /* 底部：上一组 / 下一组 */
  const idx = SITE_DATA.indexOf(group);
  const prev = SITE_DATA[(idx - 1 + SITE_DATA.length) % SITE_DATA.length];
  const next = SITE_DATA[(idx + 1) % SITE_DATA.length];

  const nav = document.createElement("div");
  nav.className = "cat-nav";

  const prevBtn = document.createElement("a");
  prevBtn.className = "nav-btn";
  prevBtn.href = "#" + encodeURIComponent(prev.cat);
  prevBtn.style.setProperty("--c", colorOf(prev.cat));
  prevBtn.innerHTML = `<small>上一组</small><strong>${prev.cat}</strong>`;

  const nextBtn = document.createElement("a");
  nextBtn.className = "nav-btn next";
  nextBtn.href = "#" + encodeURIComponent(next.cat);
  nextBtn.style.setProperty("--c", colorOf(next.cat));
  nextBtn.innerHTML = `<small>下一组</small><strong>${next.cat}</strong>`;

  nav.append(prevBtn, nextBtn);

  view.append(head, grid, nav);
  app.replaceChildren(view);
}

/* ---------- 搜索结果 ---------- */
function renderSearch(q) {
  const view = document.createElement("div");
  view.className = "search-view view-enter";

  const found = [];
  for (const group of SITE_DATA) {
    for (const item of group.items) {
      if (matchItem(item, group.cat, q)) {
        found.push({ item, cat: group.cat });
      }
    }
  }

  const head = document.createElement("div");
  head.className = "view-head";
  head.innerHTML = `<div class="view-title-wrap">
      <h2 class="view-title">搜索「${q}」</h2>
      <span class="view-sub">${found.length} 个结果</span>
    </div>`;

  view.appendChild(head);

  if (!found.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = `没有找到「${q}」相关的站点`;
    view.appendChild(empty);
  } else {
    const grid = document.createElement("div");
    grid.className = "grid";
    for (const { item, cat } of found) grid.appendChild(siteCard(item, cat));
    view.appendChild(grid);
  }

  app.replaceChildren(view);
}

/* ---------- 渲染入口 ---------- */
function render() {
  if (query) return renderSearch(query);
  const route = getRoute();
  if (route.type === "cat") renderCategory(route.cat);
  else renderHome();
}

/* ---------- 交互 ---------- */
qInput.addEventListener("input", (e) => {
  query = e.target.value.trim();
  render();
});

document.addEventListener("keydown", (e) => {
  const typing = document.activeElement === qInput;

  if (e.key === "/" && !typing) {
    e.preventDefault();
    qInput.focus();
    return;
  }

  if (e.key === "Escape") {
    if (typing && qInput.value) {
      qInput.value = "";
      query = "";
      render();
    } else if (getRoute().type === "cat") {
      location.hash = "";
    }
  }
});

window.addEventListener("hashchange", render);

brandLink.addEventListener("click", (e) => {
  e.preventDefault();
  location.hash = "";
});

/* ---------- 启动 ---------- */
totalEl.textContent = SITE_DATA.reduce((s, g) => s + g.items.length, 0);
render();

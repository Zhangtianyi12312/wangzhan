/* ==========================================================
   背景粒子（手写 canvas，零依赖）
   ----------------------------------------------------------
   物理规则：
     1. 每个粒子有随机游走，永远保持轻微漂移
     2. 粒子之间有短程斥力 → 不会粘成一团
     3. 出界是「绕回另一侧」，不是反弹 → 不会堆在边缘
     4. 鼠标靠近 → 被吸引，但太近时反向推开 + 切向力，
        形成一圈绕着光标转的环，而不是聚成一个点
     5. 鼠标离开 / 点击卡片 → 快速向外爆散，之后继续自由游动
   ========================================================== */
(function initParticles() {
  const host = document.getElementById("tsparticles");
  if (!host) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    host.remove();
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  host.appendChild(canvas);

  /* ---------- 参数（想调手感改这里） ---------- */
  // 明暗两套配色：暗色下粒子要提亮，不然看不见
  const PALETTE = {
    light: {
      colors: ["124,133,152", "154,163,175", "109,93,252"],
      link: "124,133,152",
    },
    dark: {
      colors: ["175,185,200", "140,150,168", "150,136,255"],
      link: "150,160,180",
    },
  };

  let theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const pal = () => PALETTE[theme];

  const LINK_DIST = 60;       // 粒子间连线距离
  const LINK_ALPHA = 0.30;    // 粒子间连线最大透明度
  const MOUSE_RADIUS = 210;   // 鼠标影响半径
  const RING_R = 88;          // 绕光标旋转的目标半径
  const SPRING = 0.0012;      // 半径弹簧强度（把粒子拉回环上）
  const SWIRL = 0.008;        // 切向力，让粒子绕着光标转
  const REPULSE = 1.4;        // 悬停卡片时的推开力度
  const WANDER = 0.1;         // 随机游走
  const DAMPING = 0.985;      // 阻尼（越接近 1 越顺滑）
  const MAX_SPEED = 1.8;      // 常态速度上限
  const BURST_SPEED = 4;      // 爆散瞬间允许的最大速度
  const BURST_MS = 900;       // 爆散后多久恢复常态限速
  const GAP = 46;             // 粒子之间保持的最小距离（斥力范围）
  const MAX_GRAB = 6;        // 光标最多连几根线

  let burstUntil = 0;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let particles = [];

  const mouse = { x: 0, y: 0, active: false, mode: "idle" };

  const isSmall = () => window.innerWidth <= 700;

  function density() {
    const area = W * H;
    return Math.min(240, Math.round(area / (isSmall() ? 12000 : 6200)));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = host.clientWidth || window.innerWidth;
    H = host.clientHeight || window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = density();
    if (particles.length > target) particles.length = target;
    while (particles.length < target) particles.push(makeParticle());
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: 1 + Math.random() * 1.6,
      c: pal().colors[(Math.random() * pal().colors.length) | 0],
      a: 0.22 + Math.random() * 0.28,
    };
  }

  /* 从某点向外爆散 */
  function burst(power) {
    const cx = mouse.active ? mouse.x : W / 2;
    const cy = mouse.active ? mouse.y : H / 2;
    burstUntil = performance.now() + BURST_MS;

    for (const p of particles) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = power * (0.55 + Math.random() * 0.9);
      p.vx += (dx / d) * k;
      p.vy += (dy / d) * k;
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    /* ---------- 1. 粒子之间的短程斥力 ---------- */
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        if (Math.abs(dx) > GAP || Math.abs(dy) > GAP) continue;

        const d2 = dx * dx + dy * dy;
        if (d2 > GAP * GAP || d2 < 0.0001) continue;

        const d = Math.sqrt(d2);
        const f = (1 - d / GAP) * 0.45;
        const nx = dx / d;
        const ny = dy / d;

        a.vx += nx * f;
        a.vy += ny * f;
        b.vx -= nx * f;
        b.vy -= ny * f;
      }
    }

    /* ---------- 2. 运动 + 鼠标作用 ---------- */
    for (const p of particles) {
      // 随机游走：让每个粒子都「无目的」地飘
      p.vx += (Math.random() - 0.5) * WANDER;
      p.vy += (Math.random() - 0.5) * WANDER;

      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const nx = dx / d;
        const ny = dy / d;

        if (mouse.mode === "repulse") {
          // 悬停卡片：快速推开
          if (d < MOUSE_RADIUS) {
            const f = (1 - d / MOUSE_RADIUS) * REPULSE;
            p.vx -= nx * f;
            p.vy -= ny * f;
          }
        } else if (d < MOUSE_RADIUS) {
          // 目标是一个「环」：远了往回拉，近了往外推
          const err = d - RING_R;
          const nx2 = dx / d;
          const ny2 = dy / d;

          p.vx += nx2 * err * SPRING;
          p.vy += ny2 * err * SPRING;

          // 切向：绕圈
          p.vx += -ny2 * SWIRL;
          p.vy += nx2 * SWIRL;
        }
      }

      // 阻尼
      p.vx *= DAMPING;
      p.vy *= DAMPING;

      // 速度上限：爆散后的一小段时间允许更快，之后回到常态
      const sp = Math.hypot(p.vx, p.vy);
      const cap = performance.now() < burstUntil ? BURST_SPEED : MAX_SPEED;
      if (sp > cap) {
        p.vx = (p.vx / sp) * cap;
        p.vy = (p.vy / sp) * cap;
      }

      p.x += p.vx;
      p.y += p.vy;

      // 出界绕回另一侧：不会堆在边上
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
    }

    /* ---------- 3. 粒子之间的连线 ---------- */
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) continue;

        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;

        const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * LINK_ALPHA;
        ctx.strokeStyle = "rgba(" + pal().link + "," + alpha.toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    /* ---------- 4. 画点：靠近光标时变大变亮（光晕，不连线） ---------- */
    for (const p of particles) {
      let r = p.r;
      let a = p.a;

      if (mouse.active && mouse.mode === "idle") {
        const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (d < MOUSE_RADIUS) {
          const k = 1 - d / MOUSE_RADIUS; // 0 → 1，越近越大
          r = p.r * (1 + k * 1.1);
          a = Math.min(0.95, p.a + k * 0.45);
        }
      }

      ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  /* ---------- 事件 ---------- */
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  document.addEventListener("mouseleave", () => {
    mouse.active = false;
    burst(7);
  });

  window.addEventListener("blur", () => {
    mouse.active = false;
    burst(7);
  });

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button")) mouse.mode = "repulse";
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button")) mouse.mode = "idle";
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) burst(6);
  });

  window.addEventListener("resize", resize);

  // 切换明暗时换配色
  window.addEventListener("themechange", (e) => {
    theme = e.detail.theme === "dark" ? "dark" : "light";
    const colors = pal().colors;
    for (const p of particles) {
      p.c = colors[(Math.random() * colors.length) | 0];
    }
  });

  window.__bgParticles = { mouse: mouse, get list() { return particles; } };

  resize();
  requestAnimationFrame(step);
})();






/* ==========================================================
   明暗主题切换
   - 默认跟随系统
   - 手动切换后记住选择（localStorage）
   - 切换时广播 themechange 事件，粒子层据此换色
   ========================================================== */
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("themeBtn");
  const KEY = "nav-theme";

  const saved = localStorage.getItem(KEY);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (systemDark ? "dark" : "light");

  function apply(theme, notify) {
    root.dataset.theme = theme;

    if (notify) {
      window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme: theme } })
      );
    }
  }

  apply(initial, false);

  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(KEY, next);
      apply(next, true);
    });
  }

  // 没手动选过时，跟随系统变化
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (localStorage.getItem(KEY)) return;
    apply(e.matches ? "dark" : "light", true);
  });
})();

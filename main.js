(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startHeroAnim() {
    document.querySelector(".hero")?.classList.add("hero-anim");
  }

  function tryPlayHeroVideo() {
    const v = document.querySelector(".hero .video-inner video");
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p !== undefined && typeof p.catch === "function") p.catch(() => {});
  }

  /* Intro splash */
  const intro = document.getElementById("intro-overlay");
  const INTRO_MS = 1600;

  function hideIntro() {
    if (!intro) return;
    intro.classList.add("is-done");
    document.body.style.overflow = "";
    startHeroAnim();
    requestAnimationFrame(() => {
      requestAnimationFrame(tryPlayHeroVideo);
    });
  }

  if (reduceMotion) {
    startHeroAnim();
    if (intro) intro.classList.add("is-done");
    tryPlayHeroVideo();
  } else if (intro) {
    document.body.style.overflow = "hidden";
    window.setTimeout(hideIntro, INTRO_MS);
  } else {
    startHeroAnim();
    tryPlayHeroVideo();
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Subtle parallax on mesh (mouse) */
  const mesh = document.querySelector(".bg-mesh");
  if (mesh && !reduceMotion && window.matchMedia("(min-width: 900px)").matches) {
    let raf = 0;
    document.addEventListener(
      "mousemove",
      (e) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          mesh.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
        });
      },
      { passive: true }
    );
  }

  /* Header shadow on scroll */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.style.boxShadow =
        window.scrollY > 24 ? "0 8px 32px rgba(0,0,0,0.35)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Reading progress bar */
  if (!reduceMotion) {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    const onScrollProgress = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    window.addEventListener("scroll", onScrollProgress, { passive: true });
    window.addEventListener("resize", onScrollProgress, { passive: true });
    onScrollProgress();
  }
})();

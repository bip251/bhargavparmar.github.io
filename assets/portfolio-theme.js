(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.querySelector(".progress");

  function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, value))})`;
    if (!reduceMotion) {
      const y = Math.min(900, window.scrollY);
      document.documentElement.style.setProperty("--sy-one", `${(y * 0.12).toFixed(1)}px`);
      document.documentElement.style.setProperty("--sy-two", `${(y * -0.08).toFixed(1)}px`);
      document.documentElement.style.setProperty("--sy-three", `${(y * 0.06).toFixed(1)}px`);
    }
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

  if (!reduceMotion) {
    let raf = 0;
    window.addEventListener("pointermove", (event) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
        const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
        document.documentElement.style.setProperty("--mx", x);
        document.documentElement.style.setProperty("--my", y);
        raf = 0;
      });
    }, { passive: true });

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-py * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(px * 5).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }
}());

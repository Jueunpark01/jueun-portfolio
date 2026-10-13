(function () {
  "use strict";

  const header = document.querySelector("[data-site-header]");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      navigation.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

  document.querySelectorAll(".reveal").forEach((element) => {
    if (reduceMotion) element.classList.add("is-visible");
    else revealObserver.observe(element);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible || !header) return;

    const section = visible.target;
    header.classList.toggle("is-dark", section.dataset.theme === "dark");
    header.classList.toggle("on-intro", section.id === "intro");
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${section.id}`));
  }, { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -55%" });

  sections.forEach((section) => sectionObserver.observe(section));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();

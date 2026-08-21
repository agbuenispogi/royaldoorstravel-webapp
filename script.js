// Full-screen door preloader — locks scroll while closed, then removes
// itself from the DOM once the open animation has finished so it can't
// block clicks or show up in the tab order.
const prefersReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const preloader = document.getElementById("preloader");
if (preloader) {
  // matches the CSS delay + animation length for each motion preference, plus a small buffer
  const openDurationMs = prefersReducedMotionQuery.matches ? 950 : 2500;
  document.documentElement.style.overflow = "hidden";
  window.setTimeout(() => {
    preloader.classList.add("preloader-done");
    document.documentElement.style.overflow = "";
  }, openDurationMs);
}

// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Package tabs (Domestic / International)
const tabButtons = document.querySelectorAll(".package-tabs button");
const packageGrid = document.getElementById("package-grid");
if (tabButtons.length && packageGrid) {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      const region = btn.dataset.tab;
      packageGrid.dataset.view = region;
      packageGrid.querySelectorAll(".ticket").forEach((ticket) => {
        ticket.style.display = ticket.dataset.region === region ? "" : "none";
      });
    });
  });
}

// Hero parallax — the cover photo drifts slower than the page scroll.
const heroPhoto = document.getElementById("hero-photo");
if (heroPhoto && !prefersReducedMotionQuery.matches) {
  let ticking = false;
  const updateParallax = () => {
    const y = Math.min(window.scrollY * 0.15, 110);
    heroPhoto.style.transform = `translateY(${y}px) scale(1.05)`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// Inquiry form — no backend endpoint wired up yet (see project notes), so this
// just confirms receipt locally. Swap in a real form service action before launch.
const inquiryForm = document.getElementById("inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = inquiryForm.querySelector("button[type=submit]");
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Thanks — we'll reply soon!";
    submitBtn.disabled = true;
    window.setTimeout(() => {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
      inquiryForm.reset();
    }, 3500);
  });
}

// Certification gallery lightbox
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const openLightbox = (src, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("is-open");
  };
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card.dataset.lightbox, card.dataset.caption || "");
    });
  });
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
}

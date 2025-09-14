const roles = [
  "Fullstack Developer",
  "Mobile Developer",
  "Web Developer",
  "AI Developer",
];
let index = 0;
let charIndex = 0;
let currentRole = "";
let isDeleting = false;
const typingSpeed = 100;
const erasingSpeed = 60;
const delayBetween = 1500;

const typingText = document.getElementById("typing-text");

function typeEffect() {
  if (index >= roles.length) {
    index = 0;
  }

  currentRole = roles[index];

  if (!isDeleting && charIndex < currentRole.length) {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    setTimeout(typeEffect, typingSpeed);
  } else if (isDeleting && charIndex > 0) {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(typeEffect, erasingSpeed);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeEffect, delayBetween);
    } else {
      isDeleting = false;
      index++;
      setTimeout(typeEffect, typingSpeed);
    }
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking on a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobileToggle.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileToggle.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Active navigation link highlighting
function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // Initial call
}

// Navbar background on scroll
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  // Pastikan inline style dihapus agar CSS glass berlaku
  navbar.style.removeProperty("background");

  const onScroll = () => {
    const isScrolled = window.scrollY > 50;
    navbar.classList.toggle("is-scrolled", isScrolled);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Smooth background parallax on scroll
function initBackgroundParallax() {
  let ticking = false;

  function updateBackground() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;

    // Subtle background movement
    document.body.style.setProperty(
      "--bg-translate",
      `translate3d(0, ${rate}px, 0)`
    );

    // Dynamic opacity based on scroll
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / maxScroll;
    const overlayOpacity = Math.min(0.1, scrollPercent * 0.05);

    document.body.style.setProperty("--overlay-opacity", overlayOpacity);

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateBackground);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
}

// Tabs (Portfolio)
function initTabs() {
  const tabs = document.querySelectorAll(".tabs .tab");
  const panels = document.querySelectorAll(".tab-content");
  if (!tabs.length || !panels.length) return;

  const activate = (name) => {
    tabs.forEach((t) => {
      const isActive = t.dataset.tab === name;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((p) => {
      p.classList.toggle("active", p.id === name);
      p.hidden = p.id !== name;
    });
  };

  tabs.forEach((t) =>
    t.addEventListener("click", () => activate(t.dataset.tab))
  );

  const urlTab = new URLSearchParams(window.location.search).get("tab");
  activate(urlTab || "projects");
}

// Certificate modal (preview image)
function initCertificateModal() {
  const modal = document.getElementById("image-modal");
  if (!modal) return;

  const imgEl = modal.querySelector(".modal-image");
  const closeBtn = modal.querySelector(".modal-close");
  const certImages = document.querySelectorAll(
    "#certificates .certificate img"
  );

  const open = (src, alt = "Certificate") => {
    imgEl.src = src;
    imgEl.alt = alt;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    imgEl.src = "";
    imgEl.alt = "";
  };

  certImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const full = img.dataset.full || img.src; // bisa pakai data-full bila tersedia
      open(full, img.alt || "Certificate");
    });
  });

  // click di overlay utk close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  // tombol close
  if (closeBtn) closeBtn.addEventListener("click", close);
  // ESC utk close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) close();
  });
}

/* Load More untuk projects & certificates */
function initLoadMore() {
  const setupLoadMore = ({
    panelSelector,
    containerSelector,
    itemSelector,
    buttonSelector,
    initial = 6,
    step = 6,
  }) => {
    const panel = document.querySelector(panelSelector);
    if (!panel) return;

    const container = panel.querySelector(containerSelector);
    const items = Array.from(panel.querySelectorAll(itemSelector));
    const button = panel.querySelector(buttonSelector);
    if (!container || !button || !items.length) return;

    // Jika item <= initial, sembunyikan tombol
    if (items.length <= initial) {
      button.style.display = "none";
      return;
    }

    const collapseToInitial = () => {
      items.forEach((el, i) => el.classList.toggle("is-hidden", i >= initial));
      button.textContent = "Show more";
      button.dataset.state = "collapsed";
      button.style.display = "";
    };

    // Set kondisi awal
    collapseToInitial();

    button.addEventListener("click", () => {
      const state = button.dataset.state || "collapsed";

      if (state === "collapsed") {
        // Tampilkan batch berikutnya
        const hidden = items.filter((el) => el.classList.contains("is-hidden"));
        hidden.slice(0, step).forEach((el) => el.classList.remove("is-hidden"));

        // Jika sudah tidak ada yang tersembunyi, ubah tombol ke "Show less"
        const stillHidden = items.some((el) =>
          el.classList.contains("is-hidden")
        );
        if (!stillHidden) {
          button.textContent = "Show less";
          button.dataset.state = "expanded";
        }
      } else {
        // Kembali ke 6 item awal
        collapseToInitial();
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  setupLoadMore({
    panelSelector: "#projects",
    containerSelector: ".card-grid",
    itemSelector: ".card",
    buttonSelector: ".load-more-btn",
    initial: 6,
    step: 6,
  });

  setupLoadMore({
    panelSelector: "#certificates",
    containerSelector: ".card-grid",
    itemSelector: ".certificate",
    buttonSelector: ".load-more-btn",
    initial: 6,
    step: 6,
  });
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", function () {
  if (typingText) typeEffect();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavigation();
  initNavbarScroll();
  initBackgroundParallax();
  initTabs();
  initCertificateModal();
  initLoadMore();
});

// Optimize performance with requestAnimationFrame for scroll events
let ticking = false;

function optimizedResize() {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Handle resize logic here if needed
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("resize", optimizedResize);

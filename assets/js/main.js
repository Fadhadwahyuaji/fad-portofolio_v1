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

let projectsData = [];

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
        const targetPosition = targetSection.offsetTop - navbarHeight + 50;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const mobileToggle = document.getElementById("mobile-toggle");
        const navLinksElement = document.querySelector(".nav-links");
        if (mobileToggle && navLinksElement) {
          mobileToggle.classList.remove("active");
          navLinksElement.classList.remove("active");
          document.body.classList.remove("menu-open");
        }
      }
    });
  });
}

// Active navigation link highlighting
function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 50;

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

// Certificate modal (preview image) - Updated untuk dynamic content
function initCertificateModal() {
  const modal = document.getElementById("image-modal");
  if (!modal) return;

  const imgEl = modal.querySelector(".modal-image");
  const closeBtn = modal.querySelector(".modal-close");

  const open = (src, alt = "Certificate") => {
    imgEl.src = src;
    imgEl.alt = alt;
    modal.classList.add("active");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    imgEl.src = "";
    imgEl.alt = "";
  };

  // Re-bind untuk semua certificate images (termasuk yang dinamis)
  const bindCertificateImages = () => {
    const certImages = document.querySelectorAll(
      "#certificates .certificate img"
    );

    console.log("Binding certificate images:", certImages.length); // Debug log

    certImages.forEach((img) => {
      img.style.cursor = "zoom-in";

      // Remove existing listeners to prevent duplicates
      if (img._certClickHandler) {
        img.removeEventListener("click", img._certClickHandler);
      }

      // Add new listener
      img._certClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const full = img.dataset.full || img.src;
        console.log("Opening certificate modal:", full); // Debug log
        open(full, img.alt || "Certificate");
      };

      img.addEventListener("click", img._certClickHandler);
    });
  };

  // Initial bind
  bindCertificateImages();

  // Expose function globally untuk re-bind
  window.rebindCertificateModal = bindCertificateImages;

  // Click overlay to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // Close button
  if (closeBtn) closeBtn.addEventListener("click", close);

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) close();
  });
}

// Load More functionality - Updated untuk certificates
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
    const button = panel.querySelector(buttonSelector);
    if (!container || !button) return;

    const updateItems = () => {
      const items = Array.from(panel.querySelectorAll(itemSelector));

      // Hide button if items <= initial
      if (items.length <= initial) {
        button.style.display = "none";
        return;
      }

      const collapseToInitial = () => {
        items.forEach((el, i) => {
          el.style.display = i >= initial ? "none" : "";
        });
        button.textContent = button.dataset.showMoreText || "Show more";
        button.dataset.state = "collapsed";
        button.style.display = "";
      };

      // Set initial state
      collapseToInitial();

      // Remove existing listener
      button.onclick = null;

      button.addEventListener("click", () => {
        const state = button.dataset.state || "collapsed";

        if (state === "collapsed") {
          // Show next batch
          let visibleCount = 0;
          items.forEach((el) => {
            if (el.style.display !== "none") visibleCount++;
          });

          for (
            let i = visibleCount;
            i < Math.min(visibleCount + step, items.length);
            i++
          ) {
            items[i].style.display = "";
          }

          // Check if all items are visible
          const allVisible = items.every((el) => el.style.display !== "none");
          if (allVisible) {
            button.textContent = button.dataset.showLessText || "Show less";
            button.dataset.state = "expanded";
          }

          // Re-bind certificate modal untuk item baru yang muncul
          if (
            panelSelector === "#certificates" &&
            window.rebindCertificateModal
          ) {
            setTimeout(() => {
              window.rebindCertificateModal();
            }, 50);
          }
        } else {
          // Collapse to initial
          collapseToInitial();
          container.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    };

    // Update items initially and on re-render
    updateItems();

    // Re-run setup when certificates are updated
    if (panelSelector === "#certificates") {
      const observer = new MutationObserver(() => {
        updateItems();
      });
      observer.observe(container, { childList: true });
    }
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
    containerSelector: ".certificate-grid",
    itemSelector: ".certificate",
    buttonSelector: ".load-more-btn",
    initial: 8,
    step: 8,
  });
}

// Load project data from JSON
async function loadProjectsData() {
  try {
    const response = await fetch("assets/src/portfolio.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    projectsData = data.projects;

    if (!projectsData || !Array.isArray(projectsData)) {
      throw new Error("Invalid project data format");
    }

    generateProjectCards();
    return Promise.resolve();
  } catch (error) {
    console.error("Error loading project data:", error);

    // Fallback data if JSON fails
    projectsData = [
      {
        id: "1",
        title: "Fallback Project",
        description:
          "This is a fallback project when JSON fails to load. This project demonstrates error handling and fallback mechanisms.",
        shortDescription: "Fallback project for error handling",
        image: "assets/assets/images/Senjanis/senajnis.png",
        gallery: ["assets/assets/images/Senjanis/senajnis.png"],
        techStack: ["HTML", "CSS", "JavaScript"],
        features: [
          "Basic functionality",
          "Responsive design",
          "Error handling",
        ],
        demoUrl: null,
        githubUrl: "#",
        status: "Completed",
        category: "Web Development",
        startDate: "2024-01-01",
        endDate: "2024-01-15",
        isFeatured: false,
      },
    ];
    generateProjectCards();
    return Promise.resolve();
  }
}

// Generate project cards dynamically
function generateProjectCards() {
  const projectsContainer = document.querySelector("#projects .card-grid");
  if (!projectsContainer || !projectsData.length) return;

  // Clear existing cards
  projectsContainer.innerHTML = "";

  // Sort projects by ID descending (project terbaru di atas)
  const sortedProjects = [...projectsData].sort((a, b) => {
    const idA = parseInt(a.id) || 0;
    const idB = parseInt(b.id) || 0;
    return idB - idA; // Descending order (ID besar ke kecil)
  });

  sortedProjects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsContainer.appendChild(projectCard);
  });

  // Attach modal listeners after cards are created
  attachProjectModalListeners();
}

// Create individual project card
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("data-project-id", project.id);

  const shortDesc =
    project.shortDescription ||
    (project.description.length > 120
      ? project.description.substring(0, 120) + "..."
      : project.description);

  card.innerHTML = `
    <div class="card-media">
      <img src="${project.image}" alt="${project.title}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3>${project.title}</h3>
      <p>${shortDesc}</p>
      <div class="card-buttons">
        <a href="${project.demoUrl || "#"}" class="live-demo" ${
    !project.demoUrl ? 'style="opacity: 0.5; pointer-events: none;"' : ""
  } target="_blank" rel="noopener">
          Live Demo
        </a>
        <button class="details btn-link" data-project-id="${project.id}">
          Details →
        </button>
      </div>
    </div>
  `;

  return card;
}

// Attach project modal listeners
function attachProjectModalListeners() {
  const detailsButtons = document.querySelectorAll(".details");

  detailsButtons.forEach((btn) => {
    // Remove existing listeners to prevent duplicates
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    // Add new listener
    newBtn.addEventListener("click", handleDetailsClick);
  });
}

function handleDetailsClick(e) {
  e.preventDefault();
  const projectId = e.target.getAttribute("data-project-id");

  if (!projectId) {
    console.error("Project ID not found");
    return;
  }

  // Redirect ke halaman detail project
  window.location.href = `project_detail.html?id=${projectId}`;
}

// Mobile Menu Toggle
function initMobileMenu() {
  // Create mobile toggle if it doesn't exist
  let mobileToggle = document.getElementById("mobile-toggle");
  if (!mobileToggle) {
    const navContainer = document.querySelector(".nav-container");
    if (navContainer) {
      mobileToggle = document.createElement("div");
      mobileToggle.id = "mobile-toggle";
      mobileToggle.className = "mobile-toggle";
      mobileToggle.setAttribute("aria-label", "Toggle mobile menu");
      mobileToggle.setAttribute("role", "button");
      mobileToggle.setAttribute("tabindex", "0");
      mobileToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
      navContainer.appendChild(mobileToggle);
    }
  }

  const navLinks =
    document.getElementById("nav-links") ||
    document.querySelector(".nav-links");

  if (mobileToggle && navLinks) {
    // Add ID to nav-links if it doesn't exist
    if (!navLinks.id) {
      navLinks.id = "nav-links";
    }

    const toggleMenu = (e) => {
      e.stopPropagation();
      const isActive = mobileToggle.classList.contains("active");

      mobileToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.classList.toggle("menu-open");

      // Update ARIA attributes
      mobileToggle.setAttribute("aria-expanded", (!isActive).toString());
    };

    // Click and keyboard events for toggle
    mobileToggle.addEventListener("click", toggleMenu);
    mobileToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu(e);
      }
    });

    // Close menu when clicking on a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobileToggle.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileToggle.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  let isVisible = false;

  const toggleVisibility = () => {
    const shouldShow = window.pageYOffset > 300;

    if (shouldShow && !isVisible) {
      backToTopBtn.classList.add("visible");
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      backToTopBtn.classList.remove("visible");
      isVisible = false;
    }
  };

  // Throttled scroll event
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        toggleVisibility();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Hero buttons functionality
function initHeroButtons() {
  const projectsBtn = document.querySelector(".hero-buttons .btn-primary");
  const contactBtn = document.querySelector(".hero-buttons .btn-secondary");

  if (projectsBtn) {
    projectsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const portfolioSection = document.getElementById("portfolio");
      if (portfolioSection) {
        const navbar = document.querySelector(".navbar");
        const offset = navbar ? navbar.offsetHeight - 80 : 10;
        const targetPosition = portfolioSection.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const navbar = document.querySelector(".navbar");
        const offset = navbar ? navbar.offsetHeight - 80 : 10;
        const targetPosition = contactSection.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  }
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const formData = new FormData(contactForm);

    // Get form values
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Add loading state
    submitBtn.classList.add("loading");
    btnText.textContent = "Sending";
    submitBtn.disabled = true;

    try {
      // Create mailto link
      const subject = `Portfolio Contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoLink = `mailto:fadhadwahyuaji@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      setTimeout(() => {
        btnText.textContent = "Message Sent!";
        submitBtn.style.background =
          "linear-gradient(135deg, #22c55e, #16a34a)";

        // Reset form
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          btnText.textContent = "Send Message";
          submitBtn.style.background = "";
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error state
      btnText.textContent = "Error - Try Again";
      submitBtn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";

      setTimeout(() => {
        btnText.textContent = "Send Message";
        submitBtn.style.background = "";
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// Render profile (hero, social, contact) dari JSON
function renderProfile() {
  const profile = appData?.profile;
  if (!profile) return;

  // Hero name
  const nameSpan = document.querySelector(".hero-title .title-prefix");
  if (nameSpan && profile.name) nameSpan.textContent = profile.name;

  // Hero description
  const descEl = document.querySelector(".hero-description");
  if (descEl && profile.description) descEl.textContent = profile.description;

  // Hero image
  const heroImg = document.querySelector(".hero-image img");
  if (heroImg && profile.image) {
    heroImg.src = profile.image;
    heroImg.alt = profile.name || "Profile picture";
  }

  // Hero tech stack (chips)
  const heroTechWrap = document.querySelector(".hero-content .tech-stack");
  if (heroTechWrap && Array.isArray(profile.techStack)) {
    heroTechWrap.innerHTML = "";
    profile.techStack.forEach((tech) => {
      const span = document.createElement("span");
      span.className = "tech-item";
      span.textContent = tech;
      heroTechWrap.appendChild(span);
    });
  }

  // Social links (hero)
  const social = profile.socialLinks || {};
  const heroLinks = document.querySelectorAll(".social-links a");
  if (heroLinks[0] && social.github) heroLinks[0].href = social.github;
  if (heroLinks[1] && social.linkedin) heroLinks[1].href = social.linkedin;
  if (heroLinks[2] && social.instagram) heroLinks[2].href = social.instagram;

  // Contact card links
  const linkedinLink = document.querySelector(".contact-link.linkedin");
  if (linkedinLink && social.linkedin) {
    linkedinLink.href = social.linkedin;
    const valueEl = linkedinLink.querySelector(".contact-value");
    if (valueEl) {
      try {
        valueEl.textContent =
          new URL(social.linkedin).pathname.replaceAll("/", "") || "LinkedIn";
      } catch {
        valueEl.textContent = social.linkedin;
      }
    }
  }

  const emailLink = document.querySelector(".contact-link.email");
  if (emailLink && profile.email) {
    emailLink.href = `mailto:${profile.email}`;
    const valueEl = emailLink.querySelector(".contact-value");
    if (valueEl) valueEl.textContent = profile.email;
  }

  const igLink = document.querySelector(".contact-link.instagram");
  if (igLink && social.instagram) {
    igLink.href = social.instagram;
    const valueEl = igLink.querySelector(".contact-value");
    if (valueEl) {
      try {
        valueEl.textContent =
          "@" + new URL(social.instagram).pathname.replaceAll("/", "");
      } catch {
        valueEl.textContent = social.instagram;
      }
    }
  }
}

// Render certificates dari JSON
function renderCertificates() {
  const grid = document.querySelector("#certificates .certificate-grid");
  if (!grid) return;

  const certs = Array.isArray(appData?.certificates)
    ? appData.certificates
    : [];
  grid.innerHTML = "";

  certs.forEach((cert) => {
    const item = document.createElement("div");
    item.className = "certificate";
    item.innerHTML = `<img src="${cert.image}" alt="${
      cert.title || "Certificate"
    }" loading="lazy" data-full="${cert.image}">`;
    grid.appendChild(item);
  });

  // Re-bind modal listeners setelah certificates di-render
  setTimeout(() => {
    if (window.rebindCertificateModal) {
      window.rebindCertificateModal();
    }
  }, 100);
}

// Render Tech Stack tab dari JSON
function renderTechStackTab() {
  const grid = document.querySelector("#techstack .techstack-grid");
  if (!grid) return;

  const stack = Array.isArray(appData?.techStack) ? appData.techStack : [];
  grid.innerHTML = "";

  stack.forEach((tech) => {
    const card = document.createElement("div");
    card.className = "card-techstack";
    card.innerHTML = `
      <div class="stack-icon">
        <img src="${tech.icon}" alt="${tech.name}" />
      </div>
      <span>${tech.name}</span>
    `;
    grid.appendChild(card);
  });
}

// Load semua data dari JSON lalu render UI
async function loadAppData() {
  try {
    const url = `assets/src/portfolio.json?t=${Date.now()}`; // cache buster
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    appData = data || {};
    projectsData = Array.isArray(data.projects) ? data.projects : [];

    // Render semua bagian UI
    renderProfile();
    generateProjectCards();
    renderCertificates(); // Ini akan otomatis re-bind modal
    renderTechStackTab();

    return Promise.resolve();
  } catch (error) {
    console.error("Error loading app data:", error);

    // Fallback minimal untuk projects
    projectsData = [
      {
        id: "1",
        title: "Fallback Project",
        description: "This is a fallback project when JSON fails to load.",
        shortDescription: "Fallback project for error handling",
        image: "assets/assets/images/Senjanis/senajnis.png",
        gallery: ["assets/assets/images/Senjanis/senajnis.png"],
        techStack: ["HTML", "CSS", "JavaScript"],
        features: [
          "Basic functionality",
          "Responsive design",
          "Error handling",
        ],
        demoUrl: null,
        githubUrl: "#",
        status: "Completed",
        category: "Web Development",
        startDate: "2024-01-01",
        endDate: "2024-01-15",
        isFeatured: false,
      },
    ];

    generateProjectCards();
    return Promise.resolve();
  }
}

// Initialize all functions
async function initializeApp() {
  try {
    // Initialize typing effect
    if (typingText) typeEffect();

    // Initialize core navigation
    initMobileMenu();
    initSmoothScroll();
    initActiveNavigation();
    initNavbarScroll();
    initBackgroundParallax();

    // Initialize UI components
    initTabs();
    initCertificateModal();
    initBackToTop();
    initHeroButtons();
    initContactForm(); // Add this line

    // Load project data and initialize related components
    await loadProjectsData();
    // Load semua data dan render UI
    await loadAppData();

    setTimeout(() => {
      initLoadMore();
    }, 300);

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// Performance optimization for resize events
let resizeTicking = false;
function optimizedResize() {
  if (!resizeTicking) {
    requestAnimationFrame(() => {
      // Handle resize logic here if needed
      // Currently no specific resize logic required
      resizeTicking = false;
    });
    resizeTicking = true;
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", initializeApp);
window.addEventListener("resize", optimizedResize);

// Error handling for uncaught errors
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

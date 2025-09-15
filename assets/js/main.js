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
        const targetPosition = targetSection.offsetTop - navbarHeight - 20;

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
    const scrollPosition = window.scrollY + 150;

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

  certImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const full = img.dataset.full || img.src;
      open(full, img.alt || "Certificate");
    });
  });

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

// Load More functionality
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

    // Hide button if items <= initial
    if (items.length <= initial) {
      button.style.display = "none";
      return;
    }

    const collapseToInitial = () => {
      items.forEach((el, i) => {
        el.style.display = i >= initial ? "none" : "";
      });
      button.textContent = "Show more";
      button.dataset.state = "collapsed";
      button.style.display = "";
    };

    // Set initial state
    collapseToInitial();

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
          button.textContent = "Show less";
          button.dataset.state = "expanded";
        }
      } else {
        // Collapse to initial
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

  projectsData.forEach((project) => {
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

// Handle details button click
function handleDetailsClick(e) {
  e.preventDefault();
  const projectId = e.target.getAttribute("data-project-id");

  if (!projectId) {
    console.error("No project ID found on button");
    return;
  }

  console.log("Details button clicked, project ID:", projectId);
  openProjectModal(projectId);
}

// Initialize project modal
function initProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".modal-close");

  // Function to format date range
  function formatDateRange(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const options = { year: "numeric", month: "short" };
      return `${start.toLocaleDateString(
        "en-US",
        options
      )} - ${end.toLocaleDateString("en-US", options)}`;
    } catch (error) {
      console.error("Error formatting dates:", error);
      return "Date not available";
    }
  }

  // Function to open modal with project data
  window.openProjectModal = function (projectId) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project) {
      console.error("Project not found:", projectId);
      return;
    }

    console.log("Opening modal for project:", project.title);

    // Populate modal content safely
    const titleEl = modal.querySelector(".project-title");
    const descEl = modal.querySelector(".project-description");
    const categoryEl = modal.querySelector(".project-category");
    const durationEl = modal.querySelector(".project-duration");
    const statusBadge = modal.querySelector(".status-badge");
    const mainImage = modal.querySelector(".project-main-image");
    const thumbnailsContainer = modal.querySelector(".gallery-thumbnails");

    if (titleEl) titleEl.textContent = project.title;
    if (descEl) descEl.textContent = project.description;
    if (categoryEl) categoryEl.textContent = project.category;
    if (durationEl) {
      durationEl.textContent = formatDateRange(
        project.startDate,
        project.endDate
      );
    }

    // Status badge
    if (statusBadge) {
      statusBadge.textContent = project.status;
      statusBadge.className = `status-badge ${project.status
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
    }

    // Main image
    if (mainImage) {
      mainImage.src = project.image;
      mainImage.alt = project.title;
    }

    // Gallery thumbnails
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = "";
      if (project.gallery && project.gallery.length > 0) {
        project.gallery.forEach((imgSrc, index) => {
          const thumbnail = document.createElement("div");
          thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
          thumbnail.innerHTML = `<img src="${imgSrc}" alt="${
            project.title
          } - Image ${index + 1}" loading="lazy">`;

          thumbnail.addEventListener("click", () => {
            if (mainImage) {
              mainImage.src = imgSrc;
              thumbnailsContainer
                .querySelectorAll(".thumbnail")
                .forEach((t) => t.classList.remove("active"));
              thumbnail.classList.add("active");
            }
          });

          thumbnailsContainer.appendChild(thumbnail);
        });
      }
    }

    // Tech stack
    const techStackContainer = modal.querySelector(".tech-stack-list");
    if (techStackContainer && project.techStack) {
      techStackContainer.innerHTML = "";
      project.techStack.forEach((tech) => {
        const techItem = document.createElement("span");
        techItem.className = "tech-stack-item";
        techItem.textContent = tech;
        techStackContainer.appendChild(techItem);
      });
    }

    // Features
    const featuresList = modal.querySelector(".features-list");
    if (featuresList && project.features) {
      featuresList.innerHTML = "";
      project.features.forEach((feature) => {
        const featureItem = document.createElement("li");
        featureItem.textContent = feature;
        featuresList.appendChild(featureItem);
      });
    }

    // Action buttons
    const demoBtn = modal.querySelector(".project-demo");
    const githubBtn = modal.querySelector(".project-github");

    if (demoBtn) {
      if (project.demoUrl) {
        demoBtn.href = project.demoUrl;
        demoBtn.style.display = "flex";
        demoBtn.setAttribute("target", "_blank");
        demoBtn.setAttribute("rel", "noopener");
      } else {
        demoBtn.style.display = "none";
      }
    }

    if (githubBtn) {
      if (project.githubUrl && project.githubUrl !== "#") {
        githubBtn.href = project.githubUrl;
        githubBtn.style.display = "flex";
        githubBtn.setAttribute("target", "_blank");
        githubBtn.setAttribute("rel", "noopener");
      } else {
        githubBtn.style.display = "none";
      }
    }

    // Show modal
    modal.classList.add("active");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  // Function to close modal
  function closeProjectModal() {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  // Event listeners for closing modal
  if (closeBtn) {
    closeBtn.addEventListener("click", closeProjectModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeProjectModal();
    }
  });
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
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
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
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
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
    initProjectModal();
    initLoadMore();

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

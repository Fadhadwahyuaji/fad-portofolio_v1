let projectData = null;
let allProjects = [];

// Get project ID from URL
function getProjectIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Load project data
async function loadProjectData() {
  try {
    const response = await fetch("assets/src/portfolio.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allProjects = data.projects || [];

    const projectId = getProjectIdFromUrl();
    if (!projectId) {
      throw new Error("No project ID provided");
    }

    projectData = allProjects.find((p) => p.id === projectId);
    if (!projectData) {
      throw new Error("Project not found");
    }

    return projectData;
  } catch (error) {
    console.error("Error loading project data:", error);
    showError(error.message);
    return null;
  }
}

// Format date range
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
    return "Date not available";
  }
}

// Populate project content
function populateProjectContent() {
  if (!projectData) return;

  // Update page title
  document.title = `${projectData.title} - Portfolio`;

  // Breadcrumb
  document.getElementById("breadcrumb-title").textContent = projectData.title;

  // Project info
  document.getElementById("project-title").textContent = projectData.title;
  document.getElementById("project-description").textContent =
    projectData.description;
  document.getElementById("project-category").textContent =
    projectData.category;
  document.getElementById("project-duration").textContent = formatDateRange(
    projectData.startDate,
    projectData.endDate
  );

  // Status badge
  const statusBadge = document.getElementById("project-status");
  statusBadge.textContent = projectData.status;
  statusBadge.className = `status-badge ${projectData.status
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  // Main image
  const mainImage = document.getElementById("main-project-image");
  mainImage.src = projectData.image;
  mainImage.alt = projectData.title;

  // Gallery thumbnails
  populateGallery();

  // Action buttons
  populateActionButtons();

  // Tech stack
  populateTechStack();

  // Features
  populateFeatures();
}

// Populate gallery
function populateGallery() {
  const gallery =
    projectData.gallery && projectData.gallery.length > 0
      ? projectData.gallery
      : [projectData.image];

  const thumbnailsContainer = document.getElementById("gallery-thumbnails");
  thumbnailsContainer.innerHTML = "";

  gallery.forEach((imageSrc, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.dataset.src = imageSrc;
    thumbnail.innerHTML = `<img src="${imageSrc}" alt="${
      projectData.title
    } - Image ${index + 1}" loading="lazy">`;

    thumbnail.addEventListener("click", () =>
      switchMainImage(imageSrc, thumbnail)
    );
    thumbnailsContainer.appendChild(thumbnail);
  });
}

// Switch main image
function switchMainImage(src, clickedThumbnail) {
  const mainImage = document.getElementById("main-project-image");
  mainImage.src = src;

  // Update active thumbnail
  document
    .querySelectorAll(".thumbnail")
    .forEach((thumb) => thumb.classList.remove("active"));
  clickedThumbnail.classList.add("active");
}

// Populate action buttons
function populateActionButtons() {
  const actionsContainer = document.getElementById("project-actions");
  actionsContainer.innerHTML = "";

  if (projectData.demoUrl) {
    const demoBtn = document.createElement("a");
    demoBtn.href = projectData.demoUrl;
    demoBtn.className = "btn-primary";
    demoBtn.target = "_blank";
    demoBtn.rel = "noopener";
    demoBtn.innerHTML = "<span>Live Demo</span> <span>↗</span>";
    actionsContainer.appendChild(demoBtn);
  }

  if (projectData.githubUrl && projectData.githubUrl !== "#") {
    const githubBtn = document.createElement("a");
    githubBtn.href = projectData.githubUrl;
    githubBtn.className = "btn-secondary";
    githubBtn.target = "_blank";
    githubBtn.rel = "noopener";
    githubBtn.innerHTML = "<span>GitHub</span> <span>→</span>";
    actionsContainer.appendChild(githubBtn);
  }
}

// Populate tech stack
function populateTechStack() {
  const techStackContainer = document.getElementById("tech-stack-list");
  techStackContainer.innerHTML = "";

  if (projectData.techStack && projectData.techStack.length > 0) {
    projectData.techStack.forEach((tech) => {
      const techItem = document.createElement("span");
      techItem.className = "tech-stack-item";
      techItem.textContent = tech;
      techStackContainer.appendChild(techItem);
    });
  } else {
    techStackContainer.innerHTML =
      '<span class="tech-stack-item">Not specified</span>';
  }
}

// Populate features
function populateFeatures() {
  const featuresContainer = document.getElementById("features-list");
  featuresContainer.innerHTML = "";

  if (projectData.features && projectData.features.length > 0) {
    projectData.features.forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      featuresContainer.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Features not specified";
    featuresContainer.appendChild(li);
  }
}

// Initialize image zoom
function initImageZoom() {
  const mainImageContainer = document.querySelector(".main-image-container");
  const zoomOverlay = document.getElementById("image-zoom-overlay");
  const zoomImage = document.getElementById("zoom-image");
  const zoomClose = document.getElementById("zoom-close");

  mainImageContainer.addEventListener("click", () => {
    const mainImage = document.getElementById("main-project-image");
    zoomImage.src = mainImage.src;
    zoomImage.alt = mainImage.alt;
    zoomOverlay.classList.add("active");
    document.body.classList.add("modal-open");
  });

  // Close zoom
  const closeZoom = () => {
    zoomOverlay.classList.remove("active");
    document.body.classList.remove("modal-open");
    zoomImage.src = "";
  };

  zoomClose.addEventListener("click", closeZoom);
  zoomOverlay.addEventListener("click", (e) => {
    if (e.target === zoomOverlay) closeZoom();
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && zoomOverlay.classList.contains("active")) {
      closeZoom();
    }
  });
}

// Initialize back to top
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

  window.addEventListener("scroll", toggleVisibility);

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Show error message
function showError(message) {
  const loadingState = document.getElementById("loading-state");
  loadingState.innerHTML = `
        <div style="text-align: center; color: var(--text-primary);">
            <h2>⚠️ Error Loading Project</h2>
            <p style="margin: 1rem 0; color: var(--text-secondary);">${message}</p>
            <a href="index.html#portfolio" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; padding: 1rem 2rem; margin-top: 1rem;">
                <span>← Back to Portfolio</span>
            </a>
        </div>
    `;
}

// Hide loading state
function hideLoadingState() {
  const loadingState = document.getElementById("loading-state");
  const projectContent = document.getElementById("project-content");

  loadingState.style.display = "none";
  projectContent.style.display = "block";

  // Smooth animation
  projectContent.style.opacity = "0";
  projectContent.style.transform = "translateY(20px)";

  requestAnimationFrame(() => {
    projectContent.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    projectContent.style.opacity = "1";
    projectContent.style.transform = "translateY(0)";
  });
}

// Initialize smooth scroll for navigation
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbar = document.querySelector(".navbar");
        const offset = navbar ? navbar.offsetHeight + 20 : 20;
        const targetPosition = targetElement.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Initialize app
async function initializeApp() {
  try {
    // Load project data
    await loadProjectData();

    if (projectData) {
      // Populate content
      populateProjectContent();

      // Initialize features
      initImageZoom();
      initBackToTop();
      initSmoothScroll();

      // Hide loading state
      setTimeout(hideLoadingState, 500);
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    showError("Failed to load project details");
  }
}

// Start app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);

// Handle browser back/forward
window.addEventListener("popstate", () => {
  const newProjectId = getProjectIdFromUrl();
  if (newProjectId !== projectData?.id) {
    window.location.reload();
  }
});

let projectData = null;
let allProjects = [];

let currentImageIndex = 0;
let galleryImages = [];

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

  // Store gallery images for modal navigation
  galleryImages = gallery;

  const thumbnailsContainer = document.getElementById("gallery-thumbnails");
  thumbnailsContainer.innerHTML = "";

  gallery.forEach((imageSrc, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.dataset.src = imageSrc;
    thumbnail.dataset.index = index;
    thumbnail.innerHTML = `<img src="${imageSrc}" alt="${
      projectData.title
    } - Image ${index + 1}" loading="lazy">`;

    thumbnail.addEventListener("click", () =>
      switchMainImage(imageSrc, thumbnail, index)
    );
    thumbnailsContainer.appendChild(thumbnail);
  });

  // Add scroll management for many thumbnails
  if (gallery.length > 6) {
    addThumbnailScrollManagement(thumbnailsContainer);
  }
}

function addThumbnailScrollManagement(container) {
  let isScrolling = false;

  // Add smooth scroll behavior
  container.style.scrollBehavior = "smooth";

  // Auto-scroll to active thumbnail when changed
  const scrollToActiveThumbnail = () => {
    const activeThumbnail = container.querySelector(".thumbnail.active");
    if (activeThumbnail && !isScrolling) {
      isScrolling = true;

      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();

      // Check if thumbnail is not fully visible
      if (
        thumbnailRect.left < containerRect.left ||
        thumbnailRect.right > containerRect.right
      ) {
        const scrollLeft =
          activeThumbnail.offsetLeft -
          container.offsetWidth / 2 +
          activeThumbnail.offsetWidth / 2;

        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        isScrolling = false;
      }, 300);
    }
  };

  // Add mutation observer to watch for active thumbnail changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        if (mutation.target.classList.contains("active")) {
          setTimeout(scrollToActiveThumbnail, 100);
        }
      }
    });
  });

  // Observe all thumbnails
  container.querySelectorAll(".thumbnail").forEach((thumbnail) => {
    observer.observe(thumbnail, { attributes: true });
  });

  // Add scroll indicators if needed
  if (container.scrollWidth > container.clientWidth) {
    addScrollIndicators(container);
  }
}

// Add visual scroll indicators
function addScrollIndicators(container) {
  const gallery = container.parentElement;

  // Create scroll indicators
  const leftIndicator = document.createElement("div");
  leftIndicator.className = "scroll-indicator scroll-indicator-left";
  leftIndicator.innerHTML = "‹";

  const rightIndicator = document.createElement("div");
  rightIndicator.className = "scroll-indicator scroll-indicator-right";
  rightIndicator.innerHTML = "›";

  // Add indicator styles
  const indicatorStyles = `
    .scroll-indicator {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      z-index: 10;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      pointer-events: auto;
    }
    
    .scroll-indicator:hover {
      opacity: 1;
      background: rgba(0, 255, 136, 0.8);
    }
    
    .scroll-indicator-left {
      left: -12px;
    }
    
    .scroll-indicator-right {
      right: -12px;
    }
    
    .project-gallery {
      position: relative;
    }
    
    @media (max-width: 768px) {
      .scroll-indicator {
        display: none;
      }
    }
  `;

  // Add styles to head if not already added
  if (!document.getElementById("thumbnail-scroll-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "thumbnail-scroll-styles";
    styleSheet.textContent = indicatorStyles;
    document.head.appendChild(styleSheet);
  }

  // Insert indicators
  gallery.style.position = "relative";
  gallery.appendChild(leftIndicator);
  gallery.appendChild(rightIndicator);

  // Add scroll functionality
  leftIndicator.addEventListener("click", () => {
    container.scrollBy({ left: -150, behavior: "smooth" });
  });

  rightIndicator.addEventListener("click", () => {
    container.scrollBy({ left: 150, behavior: "smooth" });
  });

  // Update indicator visibility based on scroll position
  const updateIndicators = () => {
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight =
      container.scrollLeft < container.scrollWidth - container.clientWidth;

    leftIndicator.style.opacity = canScrollLeft ? "0.7" : "0.3";
    rightIndicator.style.opacity = canScrollRight ? "0.7" : "0.3";
    leftIndicator.style.pointerEvents = canScrollLeft ? "auto" : "none";
    rightIndicator.style.pointerEvents = canScrollRight ? "auto" : "none";
  };

  container.addEventListener("scroll", updateIndicators);
  updateIndicators(); // Initial call
}

// Switch main image - Enhanced
function switchMainImage(src, clickedThumbnail, index) {
  const mainImage = document.getElementById("main-project-image");
  mainImage.src = src;

  // Update current index
  currentImageIndex = index;

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
  const zoomPrev = document.getElementById("zoom-prev");
  const zoomNext = document.getElementById("zoom-next");
  const zoomCounter = document.getElementById("zoom-counter");

  // Open zoom modal
  mainImageContainer.addEventListener("click", () => {
    const mainImage = document.getElementById("main-project-image");
    currentImageIndex = parseInt(
      document.querySelector(".thumbnail.active")?.dataset.index || 0
    );
    openZoomModal(currentImageIndex);
  });

  // Navigation functions
  function openZoomModal(index) {
    currentImageIndex = index;
    updateZoomImage();
    updateZoomControls();
    zoomOverlay.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function updateZoomImage() {
    if (galleryImages[currentImageIndex]) {
      zoomImage.src = galleryImages[currentImageIndex];
      zoomImage.alt = `${projectData.title} - Image ${currentImageIndex + 1}`;

      // Update counter
      zoomCounter.textContent = `${currentImageIndex + 1} / ${
        galleryImages.length
      }`;

      // Update main image and thumbnail
      const mainImage = document.getElementById("main-project-image");
      mainImage.src = galleryImages[currentImageIndex];

      // Update active thumbnail
      document.querySelectorAll(".thumbnail").forEach((thumb, index) => {
        thumb.classList.toggle("active", index === currentImageIndex);
      });
    }
  }

  function updateZoomControls() {
    // Update navigation buttons state
    zoomPrev.classList.toggle("disabled", currentImageIndex === 0);
    zoomNext.classList.toggle(
      "disabled",
      currentImageIndex === galleryImages.length - 1
    );

    // Hide navigation if only one image
    const showNav = galleryImages.length > 1;
    zoomPrev.style.display = showNav ? "flex" : "none";
    zoomNext.style.display = showNav ? "flex" : "none";
    zoomCounter.style.display = showNav ? "block" : "none";
  }

  function navigateImage(direction) {
    const newIndex = currentImageIndex + direction;

    if (newIndex >= 0 && newIndex < galleryImages.length) {
      currentImageIndex = newIndex;
      updateZoomImage();
      updateZoomControls();
    }
  }

  // Close zoom
  const closeZoom = () => {
    zoomOverlay.classList.remove("active");
    document.body.classList.remove("modal-open");
    zoomImage.src = "";
  };

  // Event listeners
  zoomClose.addEventListener("click", closeZoom);

  zoomPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    navigateImage(-1);
  });

  zoomNext.addEventListener("click", (e) => {
    e.stopPropagation();
    navigateImage(1);
  });

  zoomOverlay.addEventListener("click", (e) => {
    if (e.target === zoomOverlay) closeZoom();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!zoomOverlay.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeZoom();
        break;
      case "ArrowLeft":
        e.preventDefault();
        navigateImage(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        navigateImage(1);
        break;
      case " ": // Spacebar
        e.preventDefault();
        navigateImage(1);
        break;
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  zoomOverlay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  zoomOverlay.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe right - previous image
        navigateImage(-1);
      } else {
        // Swipe left - next image
        navigateImage(1);
      }
    }
  }
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

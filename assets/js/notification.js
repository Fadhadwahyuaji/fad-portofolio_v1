class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = new Map();
    this.init();
  }

  init() {
    // Create notification container
    this.container = document.createElement("div");
    this.container.className = "notification-container";
    document.body.appendChild(this.container);
  }

  show(options = {}) {
    const {
      title = "Notification",
      message = "",
      type = "info", // info, success, warning, error
      duration = 5000,
      closable = true,
      onClick = null,
    } = options;

    const id = Date.now() + Math.random();

    // Create notification element
    const notification = this.createElement(
      id,
      title,
      message,
      type,
      closable,
      onClick
    );

    // Add to container
    this.container.appendChild(notification);
    this.notifications.set(id, notification);

    // Show animation
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Auto hide
    if (duration > 0) {
      this.startProgressBar(notification, duration);
      setTimeout(() => {
        this.hide(id);
      }, duration);
    }

    return id;
  }

  createElement(id, title, message, type, closable, onClick) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.dataset.id = id;

    const icons = {
      info: "ℹ️",
      success: "✓",
      warning: "⚠️",
      error: "✕",
    };

    notification.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-title">${title}</div>
        ${
          closable
            ? '<button class="notification-close" aria-label="Close">×</button>'
            : ""
        }
      </div>
      ${message ? `<p class="notification-message">${message}</p>` : ""}
      <div class="notification-progress"></div>
    `;

    // Close button event
    if (closable) {
      const closeBtn = notification.querySelector(".notification-close");
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.hide(id);
      });
    }

    // Click event
    if (onClick) {
      notification.style.cursor = "pointer";
      notification.addEventListener("click", onClick);
    }

    return notification;
  }

  startProgressBar(notification, duration) {
    const progressBar = notification.querySelector(".notification-progress");
    if (progressBar) {
      progressBar.style.transition = `transform ${duration}ms linear`;
      requestAnimationFrame(() => {
        progressBar.style.transform = "scaleX(0)";
      });
    }
  }

  hide(id) {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.classList.remove("show");
      notification.classList.add("hide");

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.notifications.delete(id);
      }, 400);
    }
  }

  clear() {
    this.notifications.forEach((notification, id) => {
      this.hide(id);
    });
  }

  // Predefined notification types
  info(title, message, duration = 5000) {
    return this.show({ title, message, type: "info", duration });
  }

  success(title, message, duration = 4000) {
    return this.show({ title, message, type: "success", duration });
  }

  warning(title, message, duration = 6000) {
    return this.show({ title, message, type: "warning", duration });
  }

  error(title, message, duration = 8000) {
    return this.show({ title, message, type: "error", duration });
  }

  // Special notification for unavailable features
  featureUnavailable(featureName, additionalMessage = "") {
    return this.show({
      title: "🚧 Feature Coming Soon",
      message: `${featureName} is not available yet. ${additionalMessage}We're working hard to bring this feature to you soon!`,
      type: "warning",
      duration: 6000,
      closable: true,
    });
  }

  linkUnavailable(linkName, context = "") {
    return this.show({
      title: "🔗 Link Not Available",
      message: `${linkName} link is currently unavailable. ${context}Please check back later or contact us for more information.`,
      type: "info",
      duration: 5000,
      closable: true,
    });
  }
}

// Initialize notification system
const notifications = new NotificationSystem();

// Function to check and handle unavailable links
function handleUnavailableLink(event, linkName, context = "") {
  const target = event.currentTarget;
  const href = target.getAttribute("href");

  // Check if link is unavailable (empty, #, null, etc.)
  if (
    !href ||
    href === "#" ||
    href === "" ||
    href === "null" ||
    href === "undefined"
  ) {
    event.preventDefault();
    event.stopPropagation();

    // Add shake animation
    target.classList.add("shake");
    setTimeout(() => {
      target.classList.remove("shake");
    }, 500);

    // Show notification
    notifications.linkUnavailable(linkName, context);
    return false;
  }

  return true;
}

// Enhanced project card creation with link checking
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("data-project-id", project.id);

  const shortDesc =
    project.shortDescription ||
    (project.description.length > 120
      ? project.description.substring(0, 120) + "..."
      : project.description);

  // Check if demo URL is available
  const demoAvailable =
    project.demoUrl &&
    project.demoUrl !== "#" &&
    project.demoUrl !== "" &&
    project.demoUrl !== "null";

  card.innerHTML = `
    <div class="card-media">
      <img src="${project.image}" alt="${project.title}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3>${project.title}</h3>
      <p>${shortDesc}</p>
      <div class="card-buttons">
        <a href="${project.demoUrl || "#"}" class="live-demo ${
    !demoAvailable ? "unavailable-link" : ""
  }" 
           data-link-name="Live Demo" 
           data-context="This project demo "
           ${demoAvailable ? 'target="_blank" rel="noopener"' : ""}>
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

// Enhanced contact form with better error handling
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

    // Validation
    if (!name || !email || !message) {
      notifications.warning(
        "Missing Information",
        "Please fill in all required fields."
      );
      return;
    }

    if (!email.includes("@")) {
      notifications.error(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

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

        notifications.success(
          "Message Ready!",
          "Your email client should open with the message. If not, please email us directly at fadhadwahyuaji@gmail.com"
        );

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

      notifications.error(
        "Error Sending Message",
        "Something went wrong. Please try again or contact us directly at fadhadwahyuaji@gmail.com"
      );

      // Reset button
      btnText.textContent = "Send Message";
      submitBtn.style.background = "";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
}

// Add link checking to existing elements
function initLinkChecking() {
  // Add event listeners to all potentially unavailable links
  document.addEventListener("click", function (e) {
    const target = e.target.closest("a");
    if (!target) return;

    // Check if it's marked as unavailable link
    if (
      target.classList.contains("unavailable-link") ||
      target.hasAttribute("data-link-name")
    ) {
      const linkName = target.getAttribute("data-link-name") || "This link";
      const context = target.getAttribute("data-context") || "";

      if (!handleUnavailableLink(e, linkName, context)) {
        return false;
      }
    }

    // Special handling for specific link types
    if (target.classList.contains("live-demo")) {
      const href = target.getAttribute("href");
      if (!href || href === "#") {
        handleUnavailableLink(e, "Live Demo", "This project demo ");
        return false;
      }
    }
  });
}

// Enhanced hero buttons with notification
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

        // Show helpful notification
        setTimeout(() => {
          notifications.info(
            "Portfolio Section",
            "Scroll down to explore my projects and certificates!"
          );
        }, 800);
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

        // Show helpful notification
        setTimeout(() => {
          notifications.info(
            "Contact Section",
            "Let's connect! Fill out the form or use the social links."
          );
        }, 800);
      }
    });
  }
}

// Initialize all functions with enhanced notifications
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
    initHeroButtons(); // Updated
    initContactForm(); // Updated
    initLinkChecking(); // New

    // Load project data and initialize related components
    await loadProjectsData();
    await loadAppData();

    setTimeout(() => {
      initLoadMore();
    }, 300);

    // Show welcome notification
    setTimeout(() => {
      notifications.success(
        "Welcome! 👋",
        "Thanks for visiting my portfolio. Feel free to explore my projects and get in touch!"
      );
    }, 1500);

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);
    notifications.error(
      "Loading Error",
      "Some features may not work properly. Please refresh the page."
    );
  }
}

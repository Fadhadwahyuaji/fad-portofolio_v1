const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
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

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(10, 10, 10, 0.95)";
      } else {
        navbar.style.background = "rgba(10, 10, 10, 0.9)";
      }
    });
  }
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", function () {
  if (typingText) typeEffect();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavigation();
  initNavbarScroll();
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

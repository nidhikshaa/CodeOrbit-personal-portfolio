/**
 * ==============================================================================
 * PERSONAL PORTFOLIO WEBSITE – NIDHIKSHAA M
 * Vanilla JavaScript Implementation
 * 
 * Features:
 *  1. Sticky Navigation & Scroll Styling
 *  2. Responsive Mobile Drawer & Hamburger Menu
 *  3. ScrollSpy / Active Navigation Highlighting
 *  4. Smooth Offset Scrolling for Section Anchors
 *  5. Client-Side Contact Form Validation & Mailto Action
 *  6. Floating Back-to-Top Button
 *  7. Dynamic Copyright Year
 *  8. Clipboard Copy Helper with Toast Notification
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DYNAMIC COPYRIGHT YEAR
  // --------------------------------------------------------------------------
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScrollEffects = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    // Header background elevation
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 320) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  // Initial check on load
  handleScrollEffects();

  // Scroll back to top on button click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. RESPONSIVE MOBILE MENU (HAMBURGER & DRAWER)
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!hamburgerBtn || !mobileDrawer) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    if (!hamburgerBtn || !mobileDrawer) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close drawer when any mobile nav link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close drawer if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // Close mobile drawer on window resize above tablet breakpoint (992px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 4. SCROLLSPY / ACTIVE NAVIGATION HIGHLIGHTING
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = (window.scrollY || document.documentElement.scrollTop) + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Desktop links
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mobile links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 5. SMOOTH ANCHOR LINK OFFSET SCROLLING
  // --------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash smoothly without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. TOAST NOTIFICATION HELPER
  // --------------------------------------------------------------------------
  const toastEl = document.getElementById('toast-notification');
  let toastTimeout;

  const showToast = (message, duration = 3200) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  };

  // --------------------------------------------------------------------------
  // 7. COPY-TO-CLIPBOARD FUNCTIONALITY
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for non-https or older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.left = '-999999px';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        console.error('Clipboard copy error: ', err);
        showToast(`Selected: ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION & CLIENT-SIDE HANDLING
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const resetFormBtn = document.getElementById('reset-form-btn');

  // Input elements
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  // Form groups
  const groupName = document.getElementById('group-name');
  const groupEmail = document.getElementById('group-email');
  const groupSubject = document.getElementById('group-subject');
  const groupMessage = document.getElementById('group-message');

  // Validation regular expression for RFC 5322 compliant email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validator individual functions
  const validateName = () => {
    const val = nameInput.value.trim();
    const isValid = val.length >= 2;
    toggleFieldState(groupName, isValid);
    return isValid;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    const isValid = emailRegex.test(val);
    toggleFieldState(groupEmail, isValid);
    return isValid;
  };

  const validateSubject = () => {
    const val = subjectInput.value.trim();
    const isValid = val.length >= 3;
    toggleFieldState(groupSubject, isValid);
    return isValid;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    const isValid = val.length >= 10;
    toggleFieldState(groupMessage, isValid);
    return isValid;
  };

  // Helper to toggle visual error/valid classes
  const toggleFieldState = (groupEl, isValid) => {
    if (!groupEl) return;
    if (isValid) {
      groupEl.classList.remove('has-error');
      groupEl.classList.add('is-valid');
    } else {
      groupEl.classList.add('has-error');
      groupEl.classList.remove('is-valid');
    }
  };

  // Real-time input listener to clear errors on typing
  if (nameInput) nameInput.addEventListener('input', validateName);
  if (emailInput) emailInput.addEventListener('input', validateEmail);
  if (subjectInput) subjectInput.addEventListener('input', validateSubject);
  if (messageInput) messageInput.addEventListener('input', validateMessage);

  // Form submit handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run all field validations
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isSubjectValid = validateSubject();
      const isMessageValid = validateMessage();

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        // Focus first field with error
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isSubjectValid) subjectInput.focus();
        else if (!isMessageValid) messageInput.focus();

        showToast('Please correct highlighted fields before submitting.');
        return;
      }

      // Collect sanitised form values
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Construct mailto link
      // EDITABLE RECIPIENT: Update your target email below if different from your.email@example.com
      const recipientEmail = 'your.email@example.com';
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Hi Nidhikshaa,\n\nYou have received a message from your portfolio website:\n\n` +
        `Sender Name: ${name}\n` +
        `Sender Email: ${email}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}\n\n` +
        `---\nSent via Nidhikshaa M Personal Portfolio`
      );

      const mailtoUrl = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Open mailto client
      window.location.href = mailtoUrl;

      // Show success feedback UI in place of form
      contactForm.style.display = 'none';
      if (formFeedback) {
        formFeedback.classList.add('is-visible');
      }

      showToast('Opening your email client to send message...');
    });
  }

  // Reset button to allow sending another message
  if (resetFormBtn && contactForm && formFeedback) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      [groupName, groupEmail, groupSubject, groupMessage].forEach(grp => {
        if (grp) {
          grp.classList.remove('has-error');
          grp.classList.remove('is-valid');
        }
      });
      formFeedback.classList.remove('is-visible');
      contactForm.style.display = 'flex';
    });
  }

});

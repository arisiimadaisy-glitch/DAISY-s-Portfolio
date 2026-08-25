/* ============================================
   DAISY ARISIIMA — Backend Engineer Portfolio
   Main JavaScript
   ============================================ */

'use strict';

/* ============================================
   1. TYPED TEXT EFFECT
   ============================================ */
const TypeWriter = (() => {
  const phrases = [
    'Backend Engineer',
    'Python Developer',
    'API Architect',
    'Database Designer',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let el = null;

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 50;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 400;

  function tick() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = current.substring(0, charIndex);

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(tick, delay);
  }

  function init() {
    el = document.querySelector('.typed-text');
    if (!el) return;
    setTimeout(tick, 1200);
  }

  return { init };
})();


/* ============================================
   2. PARTICLE BACKGROUND
   ============================================ */
const Particles = (() => {
  let canvas, ctx, particles = [], raf;
  const COUNT   = 55;
  const MAX_DIST = 130;

  class Particle {
    constructor(w, h) {
      this.reset(w, h);
    }
    reset(w, h) {
      this.x  = Math.random() * w;
      this.y  = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
    }
    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100,255,218,${0.15 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100,255,218,0.6)';
      ctx.fill();
    });
    connect();
    raf = requestAnimationFrame(loop);
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle(canvas.width, canvas.height));
    loop();
    window.addEventListener('resize', () => {
      resize();
      particles.forEach(p => p.reset(canvas.width, canvas.height));
    });
  }

  return { init };
})();


/* ============================================
   3. NAVIGATION
   ============================================ */
const Nav = (() => {
  let nav, hamburger, navList;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    highlightActive();
  }

  function highlightActive() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`nav a[href="#${id}"]`);

      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }

  function toggleMenu() {
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navList.classList.remove('open');
  }

  function init() {
    nav       = document.querySelector('nav');
    hamburger = document.querySelector('.hamburger');
    navList   = document.querySelector('nav ul');

    if (!nav) return;

    window.addEventListener('scroll', onScroll, { passive: true });

    if (hamburger) {
      hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu on link click (mobile)
    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  return { init };
})();


/* ============================================
   4. SCROLL REVEAL
   ============================================ */
const ScrollReveal = (() => {
  const THRESHOLD = 0.15;

  function init() {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger skill bars once visible
          if (entry.target.classList.contains('skill-category') ||
              entry.target.querySelector('.skill-fill')) {
            animateSkillBars(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: THRESHOLD });

    targets.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ============================================
   5. SKILL BAR ANIMATION
   ============================================ */
function animateSkillBars(container) {
  const bars = container.querySelectorAll('.skill-fill[data-pct]');
  bars.forEach(bar => {
    const pct = bar.getAttribute('data-pct');
    setTimeout(() => {
      bar.style.width = pct + '%';
    }, 100);
  });
}

// Also run on all visible skill categories on load
function initSkillBars() {
  document.querySelectorAll('.skill-category').forEach(cat => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(cat);
  });
}


/* ============================================
   6. ANIMATED COUNTERS
   ============================================ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const step   = 16;
      const steps  = duration / step;
      const inc    = target / steps;
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ============================================
   7. CONTACT FORM
   ============================================ */
const ContactForm = (() => {
  function validate(name, email, message) {
    if (!name.trim())    return 'Please enter your name.';
    if (!email.trim())   return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (!message.trim()) return 'Please write a message.';
    return null;
  }

  function showMessage(msgEl, text, type) {
    msgEl.textContent = text;
    msgEl.className   = `form-message ${type}`;
  }

  function init() {
    const form    = document.getElementById('contactForm');
    const msgEl   = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = document.getElementById('name').value;
      const email   = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      const error = validate(name, email, message);
      if (error) {
        showMessage(msgEl, error, 'error');
        return;
      }

      // Simulate async send
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      await new Promise(r => setTimeout(r, 1400));

      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      form.reset();
      showMessage(msgEl, '✓ Message sent! I will get back to you soon.', 'success');

      setTimeout(() => { msgEl.className = 'form-message'; }, 5000);
    });
  }

  return { init };
})();


/* ============================================
   8. SMOOTH ACTIVE SECTION INDICATOR
      — Updates URL hash without jumping
   ============================================ */
function initHashUpdate() {
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY + window.innerHeight / 2;
      sections.forEach(section => {
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          history.replaceState(null, '', `#${section.id}`);
        }
      });
      ticking = false;
    });
  }, { passive: true });
}


/* ============================================
   9. FOOTER YEAR
   ============================================ */
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ============================================
   10. INIT — Run everything when DOM is ready
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  Particles.init();
  TypeWriter.init();
  Nav.init();
  ScrollReveal.init();
  initSkillBars();
  animateCounters();
  ContactForm.init();
  initHashUpdate();
  setFooterYear();
});

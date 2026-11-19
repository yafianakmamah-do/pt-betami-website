/* =========================================================
   PT BETAMI — Website Script
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCounterAnimation();
  initActiveNav();
  initContactForm();
  initHeaderScroll();
});

// ===== Mobile Navigation =====
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

// ===== Counter Animation (stats) =====
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        animateValue(entry.target, 0, target, 2000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateValue(el, start, end, duration) {
  const range = end - start;
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  const timer = setInterval(() => {
    current += increment;
    el.textContent = current.toLocaleString('id-ID');
    if (current === end) clearInterval(timer);
  }, stepTime);
}

// ===== Active nav highlight on scroll =====
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-10% 0% -60% 0%' });

  sections.forEach(sec => observer.observe(sec));
}

// ===== Header background on scroll =====
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 20px -6px rgba(11, 61, 46, 0.15)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ===== Contact form =====
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Mengirim...';
    btn.disabled = true;

    // Simulasi pengiriman (ganti dengan endpoint sebenarnya)
    setTimeout(() => {
      alert('Terima kasih! Pesan Anda telah kami terima. Kami akan segera menghubungi Anda.');
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
}

// ===== Gallery Slideshow =====
let currentSlide = 0;
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.gallery-dot');

function changeSlide(direction) {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

// Auto slideshow every 5 seconds
setInterval(() => changeSlide(1), 5000);

// Dot click handlers
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => goToSlide(index));
});

// ===== Live Clock WIB =====
function updateClock() {
  const now = new Date();
  const options = { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const wib = now.toLocaleString('id-ID', options);
  const el = document.getElementById('live-clock');
  if (el) el.textContent = wib;
}
setInterval(updateClock, 1000);
updateClock();

// ===== Language Toggle (ID/EN) =====
const translations = {
  id: {
    'nav.beranda': 'Beranda', 'nav.tentang': 'Tentang Kami', 'nav.kapasitas': 'Kapasitas',
    'nav.keberlanjutan': 'Keberlanjutan', 'nav.csr': 'CSR & Komunitas', 'nav.galeri': 'Galeri Foto',
    'nav.video': 'Video', 'nav.investor': 'Investor', 'nav.karir': 'Karir', 'nav.kontak': 'Kontak',
    'hero.badge': 'Perkebunan Kelapa Sawit Berkelanjutan di Aceh Tamiang',
    'hero.title': 'Menanamkan Masa Depan dengan Keberlanjutan',
    'hero.subtitle': 'PT BETAMI beroperasi selama lebih dari dua dekade di sektor perkebunan Indonesia. Pusat operasional kami di Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam.',
    'btn.tentang': 'Tentang Kami', 'btn.csr': 'CSR & Komunitas', 'btn.kontak': 'Kirim Pesan'
  },
  en: {
    'nav.beranda': 'Home', 'nav.tentang': 'About Us', 'nav.kapasitas': 'Capacity',
    'nav.keberlanjutan': 'Sustainability', 'nav.csr': 'CSR & Community', 'nav.galeri': 'Photo Gallery',
    'nav.video': 'Video', 'nav.investor': 'Investor', 'nav.karir': 'Careers', 'nav.kontak': 'Contact',
    'hero.badge': 'Sustainable Oil Palm Plantation in Aceh Tamiang',
    'hero.title': 'Planting the Future with Sustainability',
    'hero.subtitle': 'PT BETAMI has operated for over two decades in Indonesia plantation sector. Our operations are in Aceh Tamiang Regency, Nanggroe Aceh Darussalam.',
    'btn.tentang': 'About Us', 'btn.csr': 'CSR & Community', 'btn.kontak': 'Send Message'
  }
};

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  const t = translations[lang];
  if (!t) return;
  const map = {
    '[href="#home"]': t['nav.beranda'],
    '[href="#profile"]': t['nav.tentang'],
    '[href="#capacity"]': t['nav.kapasitas'],
    '[href="#sustainability"]': t['nav.keberlanjutan'],
    '[href="#csr"]': t['nav.csr'],
    '[href="#gallery"]': t['nav.galeri'],
    '[href="#video"]': t['nav.video'],
    '[href="#investor"]': t['nav.investor'],
    '[href="#careers"]': t['nav.karir'],
    '[href="#contact"].btn-primary': t['nav.kontak'],
  };
  Object.entries(map).forEach(([selector, text]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
});

// ===== Header Scroll Class =====
const headerEl = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
});

// ===== Mascot Interaction =====
const mascot = document.getElementById('mascot');
const mascotSpeech = document.getElementById('mascot-speech');
const speechText = document.getElementById('speech-text');

const mascotMessages = {
  id: {
    about: 'PT BETAMI beroperasi lebih dari 20 tahun di Aceh Tamiang. Kami komitmen pada keberlanjutan dan kesejahteraan masyarakat.',
    csr: 'Program CSR kami mencakup bantuan sembako, infrastruktur jalan, dan donasi tanah 5 hektar di Mekar Jaya.',
    contact: 'Hubungi kami melalui form di bawah atau hubungi Humas PT BETAMI - Kholidi.'
  },
  en: {
    about: 'PT BETAMI has operated for over 20 years in Aceh Tamiang. We are committed to sustainability and community welfare.',
    csr: 'Our CSR programs include food aid, road infrastructure, and 5 hectare land donation in Mekar Jaya.',
    contact: 'Contact us via the form below or reach PT BETAMI Public Relations - Kholidi.'
  }
};

window.mascotAction = (section) => {
  const lang = document.documentElement.lang || 'id';
  const msg = mascotMessages[lang][section] || mascotMessages['id'][section];
  speechText.textContent = msg;
  mascotSpeech.hidden = false;
  setTimeout(() => { mascotSpeech.hidden = true; }, 5000);
};

mascot.addEventListener('click', () => {
  mascot.style.transform = 'scale(1.1) rotate(-5deg)';
  setTimeout(() => { mascot.style.transform = ''; }, 300);
});

// ===== Security Verification / Anti-Robot =====
let captchaAnswer = 0;
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  captchaAnswer = a + b;
  document.getElementById('captcha-num1').textContent = a;
  document.getElementById('captcha-num2').textContent = b;
}
generateCaptcha();

const contactForm = document.querySelector('.contact-form');
const securityHint = document.getElementById('security-hint');
const captchaInput = document.getElementById('captcha-answer');
const contactSubmit = document.getElementById('contact-submit');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userAnswer = parseInt(captchaInput.value);
    if (isNaN(userAnswer) || userAnswer !== captchaAnswer) {
      securityHint.hidden = false;
      captchaInput.value = '';
      generateCaptcha();
      setTimeout(() => { securityHint.hidden = true; }, 3000);
      return;
    }
    const btn = contactSubmit;
    const originalText = btn.textContent;
    btn.textContent = 'Mengirim...';
    btn.disabled = true;
    setTimeout(() => {
      alert('Terima kasih! Pesan Anda telah kami terima. Kami akan segera menghubungi Anda.');
      contactForm.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      generateCaptcha();
    }, 1200);
  });
}
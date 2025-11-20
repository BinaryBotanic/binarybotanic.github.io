/* -------------------------------------------------
Smooth scroll
------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetID = anchor.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetID);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
});

/* -------------------------------------------------
Lazy‑load images
------------------------------------------------- */
const lazyImages = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window) {
  const imgObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, {rootMargin: '50px 0px', threshold: 0.01});

lazyImages.forEach(img => imgObs.observe(img));
} else {
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}

/* -------------------------------------------------
Dynamic year
------------------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* -------------------------------------------------
Hamburgare
------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("ul.nav");
  const fadedown = document.querySelector(".Fadedown");

  if(toggle && nav && fadedown) {   // säkerhetscheck
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");

      if(nav.classList.contains("show")) {
        fadedown.style.opacity = "1";
      } else {
        fadedown.style.opacity = "0";
      }
    });
  }
});
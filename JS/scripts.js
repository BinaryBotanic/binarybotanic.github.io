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

/* ======================
   INFINITE CAROUSEL JS
====================== */

const track = document.querySelector('.bc-track');
const slides = Array.from(track.children);

// Clone edges
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

let index = 1;
let slideWidth;

function updateWidth() {
  slideWidth = track.children[index].clientWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}
updateWidth();
window.addEventListener('resize', updateWidth);

// Buttons
document.querySelector('.bc-next').onclick = () => move(1);
document.querySelector('.bc-prev').onclick = () => move(-1);

function move(direction) {
  index += direction;
  track.style.transition = 'transform .35s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

track.addEventListener('transitionend', () => {
  if (track.children[index] === track.lastElementChild) {
    track.style.transition = 'none';
    index = 1;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }
  if (track.children[index] === track.firstElementChild) {
    track.style.transition = 'none';
    index = track.children.length - 2;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }
});

// Autoplay + Pause on hover
let autoplay = setInterval(() => move(1), 3000);

document.querySelector('.binary-carousel').addEventListener('mouseenter', () => {
  clearInterval(autoplay);
});

document.querySelector('.binary-carousel').addEventListener('mouseleave', () => {
  autoplay = setInterval(() => move(1), 3000);
});
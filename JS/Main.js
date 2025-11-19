/* ---------- 1️⃣ Animated counters ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const counters = [
    // Edit the numbers to reflect your real stats
    {selector: '#insta-count',  target: 12400},
    {selector: '#twitch-count', target: 8600},
    {selector: '#yt-count',    target: 2150}
  ];

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4          // start counting when 40 % visible
  };

  const animate = (elem, end) => {
    const duration = 1500;     // ms
    const start = performance.now();
    const startVal = 0;
    const step = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(startVal + (end - startVal) * progress);
      elem.textContent = value.toLocaleString();

      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cfg = counters.find(c => c.selector === `#${entry.target.id}`);
       if (cfg) animate(entry.target, cfg.target);
        obs.unobserve(entry.target); // run once
      }
    });
  }, options);

  counters.forEach(c => {
    const el = document.querySelector(c.selector);
    if (el) observer.observe(el);
  });
});

// Helper – fetch Instagram follower count (public endpoint, no auth)
async function fetchInsta() {
  try {
    const res = await fetch('https://www.instagram.com/binarybotanic/?__a=1');
    const json = await res.json();
    // Path may change; currently it's json.graphql.user.edge_followed_by.count
    return json?.graphql?.user?.edge_followed_by?.count ?? 0;
  } catch (_) { return 0; }
}

/* -------- 2️⃣ Smooth scroll for internal links ---------- */
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

/* --------- 3️⃣ Lazy‑load images (IntersectionObserver) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, {rootMargin: '50px 0px', threshold: 0.01});

    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback – load immediately
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
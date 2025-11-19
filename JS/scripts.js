/* -------------------------------------------------
   0️⃣ CONFIG – put your keys / IDs here
   ------------------------------------------------- */
const INSTAGRAM_PROXY = 'https://www.instagram.com/binarybotanic/?igsh=cGNzdGxwZml3anpq'; // ← optional
const YT_API_KEY      = 'YOUR_GOOGLE_API_KEY';
const YT_CHANNEL_ID   = 'UCxxxxxxxxxxxxxx'; // ← your YouTube channel ID
const TWITCH_CLIENT_ID = 'YOUR_TWITCH_CLIENT_ID';
const TWITCH_TOKEN    = 'Bearer YOUR_TWITCH_APP_TOKEN';
const TWITCH_LOGIN    = 'binarybotanic';

/* -------------------------------------------------
   1️⃣ Helper functions – fetch each platform
   ------------------------------------------------- */
async function fetchInstagram() {
  if (!INSTAGRAM_PROXY) return 0; // fallback to manual number
  try {
    const res = await fetch(INSTAGRAM_PROXY);
    const json = await res.json();
    return json.followers ?? 0;
  } catch (e) {
    console.warn('Instagram fetch failed', e);
    return 0;
  }
}

async function fetchYouTube() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YT_CHANNEL_ID}&key=${YT_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const subCount = data.items?.[0]?.statistics?.subscriberCount;
    return Number(subCount) ?? 0;
  } catch (e) {
    console.warn('YouTube fetch failed', e);
    return 0;
  }
}

async function fetchTwitch() {
  const url = `https://api.twitch.tv/helix/users?login=${TWITCH_LOGIN}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': TWITCH_TOKEN
      }
    });
    const data = await res.json();
    const viewCount = data.data?.[0]?.view_count; // or .followers if you request that scope
    return Number(viewCount) ?? 0;
  } catch (e) {
    console.warn('Twitch fetch failed', e);
    return 0;
  }
}

/* -------------------------------------------------
   2️⃣ Main – build the counters array dynamically
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  // 2️⃣a – Get live numbers (run them in parallel)
  const [insta, yt, twitch] = await Promise.all([
    fetchInstagram(),
    fetchYouTube(),
    fetchTwitch()
  ]);

  // 2️⃣b – Fallback numbers if any API failed (replace with your manual defaults)
  const counters = [
    {selector: '#insta-count',  target: insta  || 12400},
    {selector: '#twitch-count', target: twitch || 8600},
    {selector: '#yt-count',    target: yt    || 2150}
  ];

  /* -------------------------------------------------
     3️⃣ Counter animation (unchanged)
     ------------------------------------------------- */
  const options = {root: null, rootMargin: '0px', threshold: 0.4};

  const animate = (elem, end) => {
    const duration = 1500;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      elem.textContent = Math.floor(progress * end).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cfg = counters.find(c => c.selector === `#${entry.target.id}`);
        if (cfg) animate(entry.target, cfg.target);
        obs.unobserve(entry.target);
      }
    });
  }, options);

  counters.forEach(c => {
    const el = document.querySelector(c.selector);
    if (el) observer.observe(el);
  });

  /* -------------------------------------------------
     4️⃣ Smooth scroll (unchanged)
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
     5️⃣ Lazy‑load images (unchanged)
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
     6️⃣ Dynamic year (unchanged)
     ------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
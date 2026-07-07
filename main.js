// Extracted interactivity scripts from index.html
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".form-submit");
  btn.textContent = "Sent! We'll be in touch soon ✓";
  btn.style.background = "var(--teal)";
  btn.style.color = "#ffffff";
  btn.disabled = true;
}



document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("open");
  });
});
/* ── ConnectHive Gallery Slideshow ── */
(function () {
  const AUTOPLAY_DELAY = 500; // ms per slide

  const track      = document.getElementById('sliderTrack');
  const slides     = track.querySelectorAll('.slide');
  const thumbs     = document.querySelectorAll('#sliderThumbs .thumb');
  const btnPrev    = document.getElementById('sliderPrev');
  const btnNext    = document.getElementById('sliderNext');
  const progressEl = document.getElementById('sliderProgress');
  const numEl      = document.getElementById('slideCurrentNum');
  const totalEl    = document.getElementById('slideTotalNum');
  const wrapper    = document.getElementById('sliderTrackWrap');

  const total = slides.length;
  let current = 0;
  let rafId = null;
  let startTs = null;
  let isPaused = false;

  // Init
  totalEl.textContent = total;

  /* ── Core: go to slide ── */
  function goTo(idx, instant = false) {
    // wrap
    idx = ((idx % total) + total) % total;

    // update classes
    slides[current].classList.remove('active');
    thumbs[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    thumbs[current].classList.add('active');

    // translate track
    if (instant) {
      track.style.transition = 'none';
      track.style.transform  = `translateX(-${current * 100}%)`;
      // force reflow then re-enable transition
      track.getBoundingClientRect();
      track.style.transition = '';
    } else {
      track.style.transform = `translateX(-${current * 100}%)`;
    }

    // counter
    numEl.textContent = current + 1;

    // scroll active thumb into view
    thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // restart progress
    resetProgress();
  }

  /* ── Progress bar (rAF-based, no setInterval drift) ── */
  function resetProgress() {
    cancelAnimationFrame(rafId);
    progressEl.style.width = '0%';
    startTs = null;
    if (!isPaused) tick();
  }

  function tick(ts) {
    if (!startTs) startTs = ts;
    const elapsed = ts - startTs;
    const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
    progressEl.style.width = pct + '%';

    if (pct < 100) {
      rafId = requestAnimationFrame(tick);
    } else {
      goTo(current + 1);
    }
  }

  function pause() {
    if (isPaused) return;
    isPaused = true;
    cancelAnimationFrame(rafId);
  }

  function resume() {
    if (!isPaused) return;
    isPaused = false;
    // continue from where progress bar left off
    const pct = parseFloat(progressEl.style.width) || 0;
    const remaining = AUTOPLAY_DELAY * (1 - pct / 100);
    startTs = null;
    rafId = requestAnimationFrame(function tickResume(ts) {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const newPct = pct + Math.min((elapsed / remaining) * (100 - pct), 100 - pct);
      progressEl.style.width = newPct + '%';
      if (newPct < 100) {
        rafId = requestAnimationFrame(tickResume);
      } else {
        goTo(current + 1);
      }
    });
  }

  /* ── Button controls ── */
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  /* ── Thumbnail click ── */
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));

  /* ── Pause on hover ── */
  const slider = document.getElementById('gallerySlider');
  slider.addEventListener('mouseenter', pause);
  slider.addEventListener('mouseleave', resume);

  /* ── Touch / swipe support ── */
  let touchStartX = 0, touchStartY = 0, isDragging = false;

  wrapper.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = false;
  }, { passive: true });

  wrapper.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) isDragging = true;
  }, { passive: true });

  wrapper.addEventListener('touchend', e => {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  /* ── Keyboard support ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ── Visibility API: pause when tab is hidden ── */
  document.addEventListener('visibilitychange', () => {
    document.hidden ? pause() : resume();
  });

  /* ── Start ── */
  requestAnimationFrame(tick);
})();
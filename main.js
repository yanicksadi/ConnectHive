
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.toggle("open");
}


function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".form-submit");
  if (!btn) return;
  
  btn.textContent = "Sent! We'll be in touch soon ✓";
  btn.style.background = "var(--teal)";
  btn.style.color = "#ffffff";
  btn.disabled = true;
}

// Global anchor link event setup to automatically close mobile menu
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.remove("open");
  });
});


// ── 2. Gallery Slideshow System Module ──

document.addEventListener('DOMContentLoaded', () => {
  const AUTOPLAY_DELAY = 4000; // Time in ms per slide
  
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const thumbs = document.querySelectorAll('.thumb');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const progressFill = document.getElementById('sliderProgress');
  const slider = document.getElementById('gallerySlider');
  
  // Guard clause: Exit cleanly if slider is absent on the page
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  let autoplayTimer = null;
  const totalSlides = slides.length;
  
  /**
   * Updates state layout transitions for slides, thumbnails, and tracks
   */
  const updateSlide = (index) => {
    // Loop boundaries gracefully
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    
    // Translate structural track position
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Sync active item element modifiers
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
    
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentIndex);
    });
    
    // Center active thumbnail inside the thumbs strip only (never the page)
    const activeThumb = thumbs[currentIndex];
    const thumbsStrip = activeThumb?.parentElement;
    if (activeThumb && thumbsStrip) {
      const left =
        activeThumb.offsetLeft -
        (thumbsStrip.clientWidth - activeThumb.offsetWidth) / 2;
      thumbsStrip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
    
    // Sync progress timeline fills
    if (progressFill) {
      const progressPct = ((currentIndex + 1) / totalSlides) * 100;
      progressFill.style.width = `${progressPct}%`;
    }
  };
  
  // Helper Actions
  const nextSlide = () => {
    updateSlide(currentIndex + 1);
    resetAutoplay();
  };
  
  const prevSlide = () => {
    updateSlide(currentIndex - 1);
    resetAutoplay();
  };
  
  // Autoplay Lifecycle Methods
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
  };
  
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };
  
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };
  
  // Component Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      updateSlide(index);
      resetAutoplay();
    });
  });
  
  // Keyboard Bindings
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  });
  
  // Hover & Tab Visibility Listeners
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
  }
  
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });
  
  // Startup Lifecycle Runs
  updateSlide(0);
  startAutoplay();
});

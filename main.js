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
/**
 * Gallery Slideshow - ConnectHive
 * Professional slideshow with autoplay, thumbnails, and keyboard support
 */

document.addEventListener('DOMContentLoaded', function() {
  // ── DOM ELEMENTS ──
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const thumbs = document.querySelectorAll('.thumb');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const progressFill = document.getElementById('sliderProgress');
  const pauseBtn = document.getElementById('sliderPauseBtn');
  const currentNum = document.getElementById('slideCurrentNum');
  const totalNum = document.getElementById('slideTotalNum');
  
  // Early return if elements don't exist
  if (!track || slides.length === 0) return;
  
  // ── STATE ──
  let currentIndex = 0;
  let autoplayTimer = null;
  let isPaused = false;
  const totalSlides = slides.length;
  const AUTOPLAY_DELAY = 4000;
  
  // ── SET TOTAL SLIDES ──
  if (totalNum) {
    totalNum.textContent = String(totalSlides).padStart(2, '0');
  }
  
  // ── UPDATE SLIDE ──
  function updateSlide(index, shouldResetAutoplay = true) {
    // Clamp index
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    
    // Move track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
    
    // Update thumbs
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentIndex);
    });
    
    // Update counter
    if (currentNum) {
      currentNum.textContent = String(currentIndex + 1).padStart(2, '0');
    }
    
    // Update progress
    if (progressFill) {
      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressFill.style.width = `${progress}%`;
    }
    
    // Reset autoplay
    if (shouldResetAutoplay && !isPaused) {
      resetAutoplay();
    }
  }
  
  // ── NAVIGATION ──
  function nextSlide() {
    updateSlide(currentIndex + 1);
  }
  
  function prevSlide() {
    updateSlide(currentIndex - 1);
  }
  
  function goToSlide(index) {
    updateSlide(index);
  }
  
  // ── AUTOPLAY ──
  function startAutoplay() {
    stopAutoplay();
    if (!isPaused) {
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
  }
  
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }
  
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }
  
  function togglePause() {
    isPaused = !isPaused;
    
    // Update pause button
    if (pauseBtn) {
      pauseBtn.classList.toggle('paused', isPaused);
      pauseBtn.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
    }
    
    if (isPaused) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }
  
  // ── EVENT LISTENERS ──
  
  // Navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  
  // Thumbnails
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', function() {
      goToSlide(index);
    });
  });
  
  // Pause button
  if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    // Only if gallery is in viewport
    const slider = document.getElementById('gallerySlider');
    const rect = slider?.getBoundingClientRect();
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === ' ' || e.key === 'Space') {
      e.preventDefault();
      togglePause();
    }
  });
  
  // Pause on hover
  const slider = document.getElementById('gallerySlider');
  if (slider) {
    slider.addEventListener('mouseenter', function() {
      if (!isPaused) {
        stopAutoplay();
      }
    });
    
    slider.addEventListener('mouseleave', function() {
      if (!isPaused) {
        startAutoplay();
      }
    });
  }
  
  // ── TOUCH SUPPORT ──
  let touchStartX = 0;
  let touchDiff = 0;
  const trackWrap = document.getElementById('sliderTrackWrap');
  
  if (trackWrap) {
    trackWrap.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchDiff = 0;
      if (!isPaused) stopAutoplay();
    }, { passive: true });
    
    trackWrap.addEventListener('touchmove', function(e) {
      touchDiff = touchStartX - e.touches[0].clientX;
    }, { passive: true });
    
    trackWrap.addEventListener('touchend', function() {
      const threshold = 50;
      if (Math.abs(touchDiff) > threshold) {
        if (touchDiff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else if (!isPaused) {
        startAutoplay();
      }
      touchDiff = 0;
    }, { passive: true });
  }
  
  // ── MOUSE DRAG ──
  let mouseDown = false;
  let mouseStartX = 0;
  let mouseDiff = 0;
  
  if (trackWrap) {
    trackWrap.addEventListener('mousedown', function(e) {
      mouseDown = true;
      mouseStartX = e.clientX;
      mouseDiff = 0;
      if (!isPaused) stopAutoplay();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!mouseDown) return;
      mouseDiff = mouseStartX - e.clientX;
    });
    
    document.addEventListener('mouseup', function() {
      if (!mouseDown) return;
      mouseDown = false;
      const threshold = 50;
      if (Math.abs(mouseDiff) > threshold) {
        if (mouseDiff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else if (!isPaused) {
        startAutoplay();
      }
      mouseDiff = 0;
    });
  }
  
  // ── VISIBILITY CHANGE (pause when tab is hidden) ──
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Tab hidden - pause
      if (!isPaused) {
        stopAutoplay();
      }
    } else {
      // Tab visible - resume
      if (!isPaused && !autoplayTimer) {
        startAutoplay();
      }
    }
  });
  
  // ── INIT ──
  updateSlide(0, false);
  startAutoplay();
  
  // ── CLEANUP ──
  window.addEventListener('beforeunload', function() {
    stopAutoplay();
  });
  
  console.log('🎯 Gallery initialized with', totalSlides, 'slides');
});
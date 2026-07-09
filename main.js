 
  // Mobile menu functions
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

  // Gallery Slideshow
  document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const thumbs = document.querySelectorAll('.thumb');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const progressFill = document.getElementById('sliderProgress');
    
    console.log(' Found elements:', {
      track: !!track,
      slides: slides.length,
      thumbs: thumbs.length,
      prevBtn: !!prevBtn,
      nextBtn: !!nextBtn,
      progressFill: !!progressFill
    });
    
    if (!track || slides.length === 0) {
      console.error('❌ Gallery elements not found!');
      return;
    }
    
    let currentIndex = 0;
    let autoplayTimer = null;
    const totalSlides = slides.length;
    
    console.log(' Gallery initialized with', totalSlides, 'slides');
    
    // Function to update slide
    function updateSlide(index) {
      // Clamp index
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      
      console.log(' Moving to slide:', currentIndex + 1);
      
      // Move track
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      
      // Update slides
      slides.forEach(function(slide, i) {
        if (i === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Update thumbs
      thumbs.forEach(function(thumb, i) {
        if (i === currentIndex) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
      
      // Update progress
      if (progressFill) {
        var progress = ((currentIndex + 1) / totalSlides) * 100;
        progressFill.style.width = progress + '%';
      }
    }
    
    // Navigation functions
    function nextSlide() {
      console.log(' Next slide');
      updateSlide(currentIndex + 1);
      resetAutoplay();
    }
    
    function prevSlide() {
      console.log(' Previous slide');
      updateSlide(currentIndex - 1);
      resetAutoplay();
    }
    
    // Autoplay
    function startAutoplay() {
      stopAutoplay();
      console.log(' Starting autoplay');
      autoplayTimer = setInterval(nextSlide, 4000);
    }
    
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
        console.log(' Stopped autoplay');
      }
    }
    
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }
    
    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
      console.log(' Next button listener added');
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
      console.log(' Previous button listener added');
    }
    
    thumbs.forEach(function(thumb, index) {
      thumb.addEventListener('click', function() {
        console.log(' Thumb clicked:', index + 1);
        updateSlide(index);
        resetAutoplay();
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });
    
    // Pause on hover
    const slider = document.getElementById('gallerySlider');
    if (slider) {
      slider.addEventListener('mouseenter', function() {
        console.log(' Mouse entered - pausing');
        stopAutoplay();
      });
      
      slider.addEventListener('mouseleave', function() {
        console.log(' Mouse left - resuming');
        startAutoplay();
      });
    }
    
    // Start
    updateSlide(0);
    startAutoplay();
  });
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Header
  // ==========================================
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // ==========================================
  // 2. Mobile Menu (Hamburger)
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 3. Accordions (Why Choose Us & FAQ)
  // ==========================================
  const accordions = document.querySelectorAll('.accordion-header');
  
  accordions.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const content = item.querySelector('.accordion-content');
      const container = item.parentElement;
      
      // If it is already open, close it
      if (item.classList.contains('active')) {
        content.style.maxHeight = null;
        item.classList.remove('active');
      } else {
        // Close all other items in the same container
        container.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
        
        // Open current item
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Initialize first item of each accordion as open on load
  const allAccordions = document.querySelectorAll('.accordion');
  allAccordions.forEach(accordion => {
    const firstItem = accordion.querySelector('.accordion-item');
    if (firstItem) {
      firstItem.classList.add('active');
      const content = firstItem.querySelector('.accordion-content');
      if (content) {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }
  });

  // ==========================================
  // 4. Testimonials Slideshow & Stats Counter
  // ==========================================
  const slides = document.querySelectorAll('.review-slide');
  const dotsContainer = document.querySelector('.swiper-nav-dots');
  const counterVal = document.getElementById('happy-customer-val');
  
  let currentSlideIndex = 0;
  let slideInterval;
  
  if (slides.length > 0 && dotsContainer) {
    // Generate navigation dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('swiper-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetSlideTimer();
      });
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.swiper-dot');

    function animateCounter(targetValue) {
      if (!counterVal) return;
      let startValue = 0;
      let duration = 600; // ms
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / duration, 1);
        let current = Math.floor(progress * targetValue);
        counterVal.textContent = current + "K+";
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }
      window.requestAnimationFrame(step);
    }
    
    function goToSlide(index) {
      slides[currentSlideIndex].classList.remove('active');
      dots[currentSlideIndex].classList.remove('active');
      
      currentSlideIndex = index;
      
      slides[currentSlideIndex].classList.add('active');
      dots[currentSlideIndex].classList.add('active');

      // Sync counter stats based on slide data attribute
      const statVal = parseInt(slides[currentSlideIndex].getAttribute('data-stat') || '40', 10);
      animateCounter(statVal);
    }
    
    function nextSlide() {
      let nextIdx = (currentSlideIndex + 1) % slides.length;
      goToSlide(nextIdx);
    }
    
    function startSlideTimer() {
      slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetSlideTimer() {
      clearInterval(slideInterval);
      startSlideTimer();
    }
    
    // Initial run
    const initialStat = parseInt(slides[0].getAttribute('data-stat') || '40', 10);
    animateCounter(initialStat);
    startSlideTimer();
  }

  // ==========================================
  // 5. Video Popup Modal (YouTube)
  // ==========================================
  const playBtn = document.querySelector('.play-btn');
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalClose = document.querySelector('.video-modal-close');

  if (playBtn && videoModal && modalIframe) {
    const videoUrl = 'https://www.youtube.com/embed/Y-x0efG1seA';

    playBtn.addEventListener('click', () => {
      modalIframe.src = `${videoUrl}?autoplay=1`;
      videoModal.classList.add('open');
    });

    const closeModal = () => {
      videoModal.classList.remove('open');
      setTimeout(() => {
        modalIframe.src = '';
      }, 300);
    };

    modalClose.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });

    // Support escape key closure
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // ==========================================
  // 6. Custom Image Slider (Home Page Gallery)
  // ==========================================
  const track = document.getElementById('sliderTrack');
  const viewGalleryBtn = document.getElementById('viewGalleryBtn');
  
  if (track) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', () => {
      isDragging = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
      isDragging = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed multiplier
      track.scrollLeft = scrollLeft - walk;
    });

    // Auto-scroll loop
    let scrollDirection = 1;
    function autoScrollSlider() {
      if (isDragging) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      track.scrollLeft += scrollDirection * 0.5;

      if (track.scrollLeft >= maxScroll) {
        scrollDirection = -1;
      } else if (track.scrollLeft <= 0) {
        scrollDirection = 1;
      }
    }
    
    let scrollTimer = setInterval(autoScrollSlider, 25);
    
    track.addEventListener('mouseenter', () => clearInterval(scrollTimer));
    track.addEventListener('mouseleave', () => {
      scrollTimer = setInterval(autoScrollSlider, 25);
    });
  }

  // ==========================================
  // 7. Lightbox Modal for Gallery
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        lightboxImg.src = imgSrc;
        lightbox.classList.add('open');
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // 8. Form Actions Mocks
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for getting in touch! We have received your message and will get back to you shortly.');
      contactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('mail').value;
      if (email) {
        alert(`Successfully subscribed to newsletter with: ${email}`);
        newsletterForm.reset();
      }
    });
  }
});

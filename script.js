document.addEventListener('DOMContentLoaded', () => {
  // Loader animation
  const loader = document.querySelector('.loader');
  
  // Hide loader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    }, 1000);
  });
  
  // Parallax effect for showcase images
  const parallaxImages = document.querySelectorAll('.parallax-image');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    parallaxImages.forEach(image => {
      const parent = image.closest('.showcase-item');
      const parentTop = parent.getBoundingClientRect().top;
      const speed = 0.15;
      
      if (parentTop < window.innerHeight && parentTop > -parent.offsetHeight) {
        const yPos = -((parentTop * speed));
        image.style.transform = `translateY(${yPos}px)`;
      }
    });
  });
  
  // Inizializzazione del carosello
  const track = document.querySelector('.carousel-track');
  const groups = document.querySelectorAll('.testimonial-group');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentIndex = 0;
  let autoScrollInterval;
  const totalGroups = groups.length;
  
  // Crea i dots di navigazione
  function createDots() {
    groups.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Vai al gruppo di testimonianze ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Vai a uno slide specifico
  function goToSlide(index) {
    // Gestisci lo scorrimento infinito
    if (index >= totalGroups) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalGroups - 1;
    } else {
      currentIndex = index;
    }
    
    // Anima lo scorrimento
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Aggiorna i dots attivi
    updateDots();
  }

  // Aggiorna i dots attivi
  function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Auto-scroll
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  }

  // Gestione eventi
  function setupEventListeners() {
    // Pausa al passaggio del mouse
    track.addEventListener('mouseenter', () => {
      clearInterval(autoScrollInterval);
    });
    
    track.addEventListener('mouseleave', () => {
      startAutoScroll();
    });
    
    // Navigazione con i pulsanti
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
    
    // Navigazione con la tastiera
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
      }
    });
    
    // Swipe per mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeLength = Math.abs(touchEndX - touchStartX);
      
      if (swipeLength > swipeThreshold) {
        if (touchEndX < touchStartX) {
          goToSlide(currentIndex + 1); // Swipe a sinistra
        } else {
          goToSlide(currentIndex - 1); // Swipe a destra
        }
      }
    }
  }

  // Inizializzazione
  function init() {
    createDots();
    setupEventListeners();
    startAutoScroll();
    
    // Per i dispositivi touch, rileva il gruppo visibile e aggiorna i dots
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const groupIndex = Array.from(groups).indexOf(entry.target);
          if (groupIndex !== -1 && groupIndex !== currentIndex) {
            currentIndex = groupIndex;
            updateDots();
          }
        }
      });
    }, { threshold: 0.5 });
    
    groups.forEach(group => {
      observer.observe(group);
    });
  }

  // Tracciamento conversioni WhatsApp
  const whatsappButton = document.querySelector('.cta-button');
  if (whatsappButton) {
    whatsappButton.addEventListener('click', (e) => {
      // Google Analytics 4
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXX/whatsapp_click',
          'value': 1.0,
          'currency': 'EUR'
        });
      }
      
      // Facebook Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Contact');
      }
      
      // LinkedIn Insight Tag
      if (window._linkedin_data_partner_ids) {
        window._linkedin_data_partner_ids.push({
          "event": "conversion",
          "conversion_id": "XXXXXX"
        });
      }
    });
  }

  // Inizializza tutto
  init();
});

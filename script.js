document.addEventListener('DOMContentLoaded', () => {
  // Rimuovo la parte del loader poiché è stato rimosso dall'HTML
  
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
  
  // Inizializzazione del carosello migliorato
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  // Riorganizza le card in gruppi di 3
  function organizeCards() {
    // Rimuovi eventuali gruppi esistenti
    while (track.firstChild) {
      track.removeChild(track.firstChild);
    }
    
    // Calcola quanti gruppi servono
    const cardsArray = Array.from(cards);
    const totalGroups = Math.ceil(cardsArray.length / 3);
    
    // Crea i nuovi gruppi con 3 card ciascuno
    for (let i = 0; i < totalGroups; i++) {
      const group = document.createElement('div');
      group.className = 'testimonial-group';
      
      // Prendi 3 card per questo gruppo o meno se siamo all'ultimo gruppo
      const start = i * 3;
      const end = Math.min(start + 3, cardsArray.length);
      
      for (let j = start; j < end; j++) {
        group.appendChild(cardsArray[j].cloneNode(true));
      }
      
      track.appendChild(group);
    }
    
    return totalGroups;
  }
  
  const totalGroups = organizeCards();
  let currentIndex = 0;
  let autoScrollInterval;
  
  // Crea i dots di navigazione
  function createDots() {
    dotsContainer.innerHTML = ''; // Pulisci eventuali dots esistenti
    
    for (let i = 0; i < totalGroups; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Vai al gruppo di testimonianze ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
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
    
    // Anima lo scorrimento con una transizione fluida
    track.style.transition = 'transform 0.5s ease-in-out';
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

  // Auto-scroll con intervallo più lungo
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 8000);
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
  
  // FAQ Accordion functionality
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const accordionItem = button.parentElement;
      const isActive = accordionItem.classList.contains('active');
      
      // Close all accordion items
      accordionButtons.forEach(btn => {
        btn.parentElement.classList.remove('active');
      });
      
      // Toggle the clicked item
      if (!isActive) {
        accordionItem.classList.add('active');
      }
    });
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.querySelector('.header');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      header.classList.toggle('menu-open');
    });
  }
  
  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        header.classList.remove('menu-open');
      }
    });
  });
  
  // Header scroll effect
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('scrolled');
      
      if (scrollTop > lastScrollTop) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('header-hidden');
    }
    
    lastScrollTop = scrollTop;
  });
});

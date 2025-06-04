document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.track');
  // Duplica le card per scroll infinito
  track.innerHTML += track.innerHTML;
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  carousel.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
  // Monitoraggio click CTA WhatsApp (sostituire AW-XXXXX con ID reale)
  document.querySelector('.cta').addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', { 'send_to': 'AW-XXXXX/whatsapp_click' });
    }
  });
});

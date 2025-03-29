window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const cloudTop = document.querySelector('.cloud-top');
    const cloudBottom = document.querySelector('.cloud-bottom');
  
    
    cloudTop.style.transform = `translateX(${scrollY * 0.5}px)`;
  
    
    cloudBottom.style.transform = `translateX(${-scrollY * 0.5}px)`;
  });
const handleScrollAnimations1 = () => {
  const elements = document.querySelectorAll('.content p, .content h2, .masonry-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      } else {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      }
    });
  }, {
    threshold: 0.5, 
  });

  elements.forEach((el) => observer.observe(el));
};

document.addEventListener('DOMContentLoaded', handleScrollAnimations1);






const handleScrollAnimations = () => {
  const images = document.querySelectorAll('.image-grid img');
  const tableRows = document.querySelectorAll('table tbody tr');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
        entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      } else {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'scale(0.9)';
        entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      }
    });
  }, {
    threshold: 0.5, 
  });

  images.forEach((img) => observer.observe(img));
  tableRows.forEach((row) => observer.observe(row));
};

document.addEventListener('DOMContentLoaded', handleScrollAnimations); 
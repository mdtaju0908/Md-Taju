document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
    } else {
        // If no saved preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
        }
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Set initial icon based on theme
    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                document.getElementById('nav-toggle').checked = false;
            }
        });
    });

    // Add animation on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Add header shadow on scroll
        const header = document.querySelector('header');
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = 'none';
        }
        
        // Animate elements when they come into view
        const animateElements = document.querySelectorAll('.timeline-item, .gallery-item, .about-content, .fade-in');
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });

    // Initialize animation properties
    const animateElements = document.querySelectorAll('.timeline-item, .gallery-item, .about-content, .fade-in');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    // Trigger scroll event to check initial positions
    window.dispatchEvent(new Event('scroll'));
});




/// Modal Elements
const modal = document.getElementById("cert-modal");
const certImage = document.getElementById("cert-image");
const certTitle = document.getElementById("cert-title");
const certOrg = document.getElementById("cert-org");
const certDate = document.getElementById("cert-date");
const certLink = document.getElementById("cert-link");
const certClose = document.querySelector(".cert-close");

// Click event on logos
document.querySelectorAll(".edu-card img").forEach(img => {
  img.addEventListener("click", () => {

    const card = img.closest(".edu-card");

    // Load Certificate Image
    certImage.src = img.dataset.certificate;

    // Load Text Info
    certTitle.textContent = card.querySelector("h3").textContent;
    certOrg.textContent = card.querySelector("p").textContent;
    certDate.textContent = card.querySelector(".edu-date").textContent;
    certLink.href = card.querySelector(".credential-link").href;

    // Show Modal
    modal.style.display = "block";
  });
});

// X button close
certClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// 👉 Close if clicked outside modal-content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

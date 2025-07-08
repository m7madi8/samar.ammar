document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const loaderWrapper = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loaderWrapper) {
                loaderWrapper.style.opacity = '0';
                loaderWrapper.style.visibility = 'hidden';
            }
            document.body.style.overflow = 'auto'; 
        }, 500);
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    const logo = document.getElementById('logo');
    const logoOriginal = 'assets/images/avatar_white.png';
    const logoScrolled = 'assets/images/avatar_beige.png';
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                if (logo) logo.src = logoScrolled;
            } else {
                header.classList.remove('scrolled');
                if (logo) logo.src = logoOriginal;
            }
        });
    }

    // --- Mobile Menu ---
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const overlay = document.getElementById('overlay');
    const menuLinks = document.querySelectorAll('#overlay .menu-link');

    const openMenu = () => {
        if (overlay) overlay.classList.add('show');
        menuLinks.forEach(link => {
            if (link.classList.contains('slide-up')) {
                link.classList.add('visible');
            }
        });
    };

    const closeMenu = () => {
        if (overlay) overlay.classList.remove('show');
        menuLinks.forEach(link => {
            if (link.classList.contains('slide-up')) {
                link.classList.remove('visible');
            }
        });
    };

    if (menuIcon) {
        menuIcon.addEventListener('click', openMenu);
    }

    if (closeIcon) {
        closeIcon.addEventListener('click', closeMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMenu();
            }
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- On-Scroll Animations ---
    const animatedElements = document.querySelectorAll('.scale-in, .slide-in-right, .slide-in-left, .slide-up, [data-aos]');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a class to trigger CSS animation/transition
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // --- Counter Animation ---
    const projectCounter = document.getElementById('project-counter');

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter-number');
                counters.forEach(counter => {
                    counter.innerText = '0';
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    let start = null;

                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        counter.innerText = Math.floor(progress * target);
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                             counter.innerText = target; // Ensure it ends on the exact target
                        }
                    };
                    window.requestAnimationFrame(step);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    if (projectCounter) {
        counterObserver.observe(projectCounter);
    }

    // --- Home Slideshow ---
    const slides = document.querySelectorAll('.home .slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        // Set the first slide as active initially
        slides[currentSlide].classList.add('active');

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change slide every 5 seconds
    }

    // --- Parallax Effect for Service Backgrounds ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSections = document.querySelectorAll('#interior-design, #landscape, #exterior');
        
        parallaxSections.forEach(section => {
            const bg = section.querySelector('.service-background');
            if (bg) {
                // Check if the section is in the viewport
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom >= 0) {
                    const speed = 0.4;
                    const yPos = -(scrolled - section.offsetTop) * speed;
                    bg.style.transform = `translate3d(0px, ${yPos}px, 0px)`;
                }
            }
        });
    });

    // --- FAQ Toggle Functionality ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // --- Enhanced Testimonials Animation ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    const testimonialObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    testimonialCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        testimonialObserver.observe(card);
    });

    // --- Service Features Animation ---
    const serviceFeatures = document.querySelectorAll('.feature');
    
    const featureObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    serviceFeatures.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px) scale(0.9)';
        feature.style.transition = `all 0.5s ease ${index * 0.1}s`;
        featureObserver.observe(feature);
    });

    // --- About Stats Animation ---
    const aboutStats = document.querySelectorAll('.stat-item');
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    aboutStats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        stat.style.transition = `all 0.6s ease ${index * 0.2}s`;
        statsObserver.observe(stat);
    });

    // --- Enhanced Accessibility ---
    // Add keyboard navigation for FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Add ARIA attributes
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    });

    // --- Performance Optimization ---
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // --- Smooth Scrolling Enhancement ---
    // Add offset for fixed header
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
/**
 * Mulch Bros - Premium Scroll Effects & Interactions
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });


    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-top, .scroll-reveal-scale'
    );

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after revealing for performance
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===== PARALLAX EFFECT FOR HERO =====
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    function handleParallax() {
        if (!hero || window.innerWidth < 768) return;

        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.3;
            const contentSpeed = 0.2;

            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }

            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * contentSpeed}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
            }
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });


    // ===== SERVICE CARDS HOVER EFFECT =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0)';
        });
    });


    // ===== STATS COUNTER ANIMATION =====
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        stats.forEach(stat => {
            const target = stat.innerText;
            const isNumber = !isNaN(parseFloat(target));

            if (isNumber) {
                const value = parseFloat(target);
                const suffix = target.replace(/[0-9.]/g, '');
                const duration = 2000;
                const increment = value / (duration / 16);
                let current = 0;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        stat.innerText = target;
                        clearInterval(counter);
                    } else {
                        stat.innerText = Math.floor(current) + suffix;
                    }
                }, 16);
            }
        });

        statsAnimated = true;
    }

    // Trigger stats animation when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }


    // ===== TESTIMONIAL CARD SUBTLE ANIMATION =====
    const testimonialCard = document.querySelector('.testimonial-card');

    if (testimonialCard) {
        let isHovering = false;

        testimonialCard.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        testimonialCard.addEventListener('mouseleave', () => {
            isHovering = false;
            testimonialCard.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });

        testimonialCard.addEventListener('mousemove', (e) => {
            if (!isHovering) return;

            const rect = testimonialCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            testimonialCard.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }


    // ===== BUTTON RIPPLE EFFECT =====
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${x - 50}px;
                top: ${y - 50}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple keyframes if not already present
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }


    // ===== SCROLL PROGRESS INDICATOR =====
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff9700, #e68600);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });


    // ===== LAZY LOADING FOR IMAGES =====
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px' });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }


    // ===== PRICING CARD HOVER EFFECTS =====
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            pricingCards.forEach(c => {
                if (c !== this && !c.classList.contains('featured')) {
                    c.style.opacity = '0.7';
                    c.style.transform = 'scale(0.98)';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            pricingCards.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = c.classList.contains('featured') ? 'scale(1.05)' : 'scale(1)';
            });
        });
    });


    // ===== TEAM CARDS ANIMATION =====
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const photo = this.querySelector('.team-photo');
            if (photo) {
                photo.style.transform = 'scale(1.05)';
                photo.style.borderColor = '#ff9700';
            }
        });

        card.addEventListener('mouseleave', function() {
            const photo = this.querySelector('.team-photo');
            if (photo) {
                photo.style.transform = 'scale(1)';
                photo.style.borderColor = '#999';
            }
        });
    });


    // ===== HERO SLIDESHOW =====
    const slideshow = document.querySelector('.hero-slideshow');

    if (slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.querySelectorAll('.dot');
        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            currentSlide = index;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Auto-advance every 2 seconds
        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 2000);
        }

        // Click on dots to navigate
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(index);
                startSlideshow();
            });
        });

        startSlideshow();
    }


    // ===== LOGO SPIN ON LOAD =====
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.classList.add('spin-in');
        setTimeout(() => {
            logoImg.classList.remove('spin-in');
        }, 800);
    }


    // ===== FEATURE CHECKMARKS POP ANIMATION =====
    const featureLists = document.querySelectorAll('.feature-list');

    featureLists.forEach(list => {
        const checkmarks = list.querySelectorAll('.feature-check');

        const checkmarkObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    checkmarks.forEach((check, index) => {
                        setTimeout(() => {
                            check.classList.add('popped');
                        }, index * 150); // 150ms delay between each
                    });
                    checkmarkObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        checkmarkObserver.observe(list);
    });


    // ===== FLOATING CTA BUTTON (MOBILE) =====
    const floatingCta = document.querySelector('.floating-cta');

    function handleFloatingCta() {
        if (!floatingCta) return;

        const scrollY = window.pageYOffset;

        if (scrollY > 300) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleFloatingCta, { passive: true });


    // ===== INITIALIZE =====
    // Run initial checks
    handleNavbarScroll();
    updateScrollProgress();

    // Reveal elements that are already in view on page load
    setTimeout(() => {
        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }, 100);

    // ===== PAGE TRANSITION EFFECT =====
    const pageTransition = document.querySelector('.page-transition');

    // Handle page entry - slide the overlay out
    if (pageTransition) {
        // Check if we came from another page (sessionStorage flag)
        if (sessionStorage.getItem('pageTransition') === 'true') {
            sessionStorage.removeItem('pageTransition');
            // Small delay then start exit animation
            setTimeout(() => {
                document.documentElement.classList.remove('page-entering');
                pageTransition.classList.add('exit');
            }, 50);
        }
    }

    // Handle navigation links
    const internalLinks = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's the current page
            if (href === window.location.pathname.split('/').pop()) {
                return;
            }

            e.preventDefault();

            if (pageTransition) {
                // Set flag for the next page
                sessionStorage.setItem('pageTransition', 'true');

                // Trigger the slide up animation
                pageTransition.classList.remove('exit');
                pageTransition.classList.remove('ready');
                pageTransition.classList.add('active');

                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            } else {
                window.location.href = href;
            }
        });
    });

    console.log('Mulch Bros - Scripts Loaded');
});

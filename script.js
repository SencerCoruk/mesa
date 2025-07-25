// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initProductFilter();
    initFAQ();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
});

// Enhanced Mobile Menu with Touch Support
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (hamburger && navMenu) {
        // Toggle menu with touch support
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Touch events for better mobile interaction
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        
        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            
            // Add ARIA attributes for accessibility
            hamburger.setAttribute('aria-expanded', 'true');
            navMenu.setAttribute('aria-hidden', 'false');
        }
        
        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
            
            // Add ARIA attributes for accessibility
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', debounce(function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250));
        
        // Initialize ARIA attributes
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        navMenu.setAttribute('aria-hidden', 'true');
        navMenu.setAttribute('id', 'nav-menu');
    }
}

// Product Filter
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    // Debug mode - set to false for production
    const DEBUG_MODE = true;
    
    if (DEBUG_MODE) {
        console.log('Filter buttons found:', filterButtons.length);
        console.log('Product cards found:', productCards.length);
    }
    
    if (filterButtons.length > 0 && productCards.length > 0) {
        if (DEBUG_MODE) {
            // Log all product categories for debugging
            productCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                console.log(`Product ${index + 1}:`, category);
            });
        }
        
        // Show all products initially
        productCards.forEach(card => {
            card.classList.remove('filter-hidden');
            card.classList.add('filter-visible');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'all 0.3s ease';
        });
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filterValue = this.getAttribute('data-filter');
                
                if (DEBUG_MODE) {
                    console.log('Filter clicked:', filterValue);
                }
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Count visible products
                let visibleCount = 0;
                
                // Filter products
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        // Show card
                        card.classList.remove('filter-hidden');
                        card.classList.add('filter-visible');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        visibleCount++;
                    } else {
                        // Hide card
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-10px)';
                        
                        setTimeout(() => {
                            card.classList.remove('filter-visible');
                            card.classList.add('filter-hidden');
                        }, 300);
                    }
                });
                
                if (DEBUG_MODE) {
                    console.log(`Visible products: ${visibleCount}`);
                }
                
                // Show message if no products found
                const existingMessage = document.querySelector('.no-products-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                if (visibleCount === 0 && filterValue !== 'all') {
                    const productsGrid = document.getElementById('products-grid');
                    if (productsGrid) {
                        const noProductsMsg = document.createElement('div');
                        noProductsMsg.className = 'no-products-message';
                        noProductsMsg.style.cssText = `
                            grid-column: 1 / -1;
                            text-align: center;
                            padding: 4rem 2rem;
                            color: #666;
                            font-size: 1.2rem;
                        `;
                        noProductsMsg.innerHTML = `
                            <i class="fas fa-search" style="font-size: 3rem; color: #D4AF37; margin-bottom: 1rem; display: block;"></i>
                            <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
                        `;
                        productsGrid.appendChild(noProductsMsg);
                    }
                }
            });
        });
    } else if (DEBUG_MODE) {
        console.error('Filter buttons or product cards not found!');
        console.log('Available filter buttons:', document.querySelectorAll('[data-filter]'));
        console.log('Available product cards:', document.querySelectorAll('[data-category]'));
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Show success message
                showMessage('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // In a real application, you would send the data to a server here
                console.log('Form data:', formObject);
            }
        });
    }
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    // Required fields
    if (!data.firstName || data.firstName.trim() === '') {
        errors.push('Ad alanı zorunludur.');
    }
    
    if (!data.lastName || data.lastName.trim() === '') {
        errors.push('Soyad alanı zorunludur.');
    }
    
    if (!data.email || data.email.trim() === '') {
        errors.push('E-posta alanı zorunludur.');
    } else if (!isValidEmail(data.email)) {
        errors.push('Geçerli bir e-posta adresi giriniz.');
    }
    
    if (!data.subject || data.subject === '') {
        errors.push('Konu seçimi zorunludur.');
    }
    
    if (!data.message || data.message.trim() === '') {
        errors.push('Mesaj alanı zorunludur.');
    }
    
    if (!data.consent) {
        errors.push('Kişisel veri işleme onayı zorunludur.');
    }
    
    if (errors.length > 0) {
        showMessage('Lütfen aşağıdaki hataları düzeltiniz:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show Message
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    messageDiv.textContent = message;
    
    // Insert message
    const form = document.getElementById('contactForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .product-category,
        .product-card,
        .stat-card,
        .mvv-card,
        .choose-item,
        .process-step,
        .contact-card
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        }
    }
});

// Product Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Show product details modal or redirect
            showProductDetails(productName);
        });
    });
});

// Show Product Details
function showProductDetails(productName) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: fadeInUp 0.3s ease;
    `;
    
    let modalHTML = '';
    
    // Special handling for ASPİRİN GRUBU
    if (productName === 'ASPİRİN GRUBU') {
        modalHTML = `
            <h3 style="margin-bottom: 2rem; color: #2c3e50; text-align: center;">ASPİRİN GRUBU - Ürün Detayları</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                
                <!-- ASPİRİN ŞEFFAF -->
                <div class="detail-product-card">
                    <div class="detail-product-header">
                        <h4 style="color: #D4AF37; margin-bottom: 0.5rem;">ASPİRİN ŞEFFAF</h4>
                        <p style="color: #666; margin-bottom: 1rem;">Şeffaf aspirin malzemesi</p>
                    </div>
                    <div class="size-options">
                        <h5 style="margin-bottom: 0.5rem; color: #333;">Boyut Seçenekleri:</h5>
                        <div class="size-grid">
                            <span class="size-option">100cm</span>
                            <span class="size-option">120cm</span>
                            <span class="size-option">140cm</span>
                            <span class="size-option">160cm</span>
                            <span class="size-option">180cm</span>
                            <span class="size-option">200cm</span>
                        </div>
                    </div>
                    <div class="product-specs">
                        <span class="spec-tag">Şeffaf</span>
                        <span class="spec-tag">Çeşitli Boyutlar</span>
                    </div>
                </div>
                
                <!-- ASPİRİN RENKLİ -->
                <div class="detail-product-card">
                    <div class="detail-product-header">
                        <h4 style="color: #D4AF37; margin-bottom: 0.5rem;">ASPİRİN RENKLİ</h4>
                        <p style="color: #666; margin-bottom: 1rem;">Renkli aspirin malzemesi</p>
                    </div>
                    <div class="size-options">
                        <h5 style="margin-bottom: 0.5rem; color: #333;">Boyut Seçenekleri:</h5>
                        <div class="size-grid">
                            <span class="size-option">100cm</span>
                            <span class="size-option">120cm</span>
                            <span class="size-option">140cm</span>
                            <span class="size-option">160cm</span>
                            <span class="size-option">180cm</span>
                            <span class="size-option">200cm</span>
                        </div>
                    </div>
                    <div class="product-specs">
                        <span class="spec-tag">Renkli</span>
                        <span class="spec-tag">Çeşitli Boyutlar</span>
                    </div>
                </div>
                
                <!-- ASPİRİN NAYLON TORBA ŞEFFAF -->
                <div class="detail-product-card">
                    <div class="detail-product-header">
                        <h4 style="color: #D4AF37; margin-bottom: 0.5rem;">ASPİRİN NAYLON TORBA ŞEFFAF</h4>
                        <p style="color: #666; margin-bottom: 1rem;">Şeffaf naylon torba aspirin</p>
                    </div>
                    <div class="product-info">
                        <p><strong>Malzeme:</strong> Naylon</p>
                        <p><strong>Tip:</strong> Torba</p>
                        <p><strong>Renk:</strong> Şeffaf</p>
                    </div>
                    <div class="product-specs">
                        <span class="spec-tag">Naylon</span>
                        <span class="spec-tag">Torba</span>
                        <span class="spec-tag">Şeffaf</span>
                    </div>
                </div>
                
                <!-- ASPİRİN NAYLON TORBA RENKLİ -->
                <div class="detail-product-card">
                    <div class="detail-product-header">
                        <h4 style="color: #D4AF37; margin-bottom: 0.5rem;">ASPİRİN NAYLON TORBA RENKLİ</h4>
                        <p style="color: #666; margin-bottom: 1rem;">Renkli naylon torba aspirin</p>
                    </div>
                    <div class="product-info">
                        <p><strong>Malzeme:</strong> Naylon</p>
                        <p><strong>Tip:</strong> Torba</p>
                        <p><strong>Renk:</strong> Renkli</p>
                    </div>
                    <div class="product-specs">
                        <span class="spec-tag">Naylon</span>
                        <span class="spec-tag">Torba</span>
                        <span class="spec-tag">Renkli</span>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <p style="color: #666; margin-bottom: 1rem;">Detaylı bilgi ve sipariş için bizimle iletişime geçin.</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="iletisim.html" class="btn btn-primary">İletişime Geç</a>
                    <button class="btn btn-secondary close-modal">Kapat</button>
                </div>
            </div>
        `;
    } else {
        // Default modal for other products
        modalHTML = `
            <h3 style="margin-bottom: 1rem; color: #2c3e50; text-align: center;">${productName}</h3>
            <p style="margin-bottom: 2rem; color: #666; text-align: center;">
                Bu ürün hakkında detaylı bilgi almak için lütfen bizimle iletişime geçin. 
                Uzman ekibimiz size en uygun çözümü sunacaktır.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="iletisim.html" class="btn btn-primary">İletişime Geç</a>
                <button class="btn btn-secondary close-modal">Kapat</button>
            </div>
        `;
    }
    
    modalContent.innerHTML = modalHTML;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close modal functionality
    const closeModal = () => {
        modalOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.remove();
            }
        }, 300);
    };
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    modalContent.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // ESC key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    
    document.addEventListener('keydown', handleEscape);
}

// Add CSS animations for modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
document.head.appendChild(modalStyles);

// Loading Animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (if needed in the future)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        const debouncedSearch = debounce(performSearch, 300);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                debouncedSearch(query);
            } else {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            }
        });
    }
}

function performSearch(query) {
    // Implement search functionality
    console.log('Searching for:', query);
    // This would typically make an API call to search products
}

// Page Loading Animation
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    const pageContent = document.querySelector('.page-content');
    
    if (loader) {
        // Simulate loading time
        setTimeout(() => {
            loader.classList.add('hidden');
            
            if (pageContent) {
                pageContent.classList.add('loaded');
            }
            
            // Initialize scroll animations after page loads
            setTimeout(() => {
                initScrollAnimations();
            }, 150);
        }, 800);
    } else {
        // If no loader, just initialize animations
        if (pageContent) {
            pageContent.classList.add('loaded');
        }
        initScrollAnimations();
    }
}

// Enhanced Scroll Animations with Stagger Effect
function initScrollAnimationsAdvanced() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add stagger effect for grouped elements
                if (element.closest('.features-grid, .products-grid, .mvv-grid, .contact-cards')) {
                    const siblings = Array.from(element.parentNode.children);
                    const index = siblings.indexOf(element);
                    
                    setTimeout(() => {
                        element.style.animation = 'slideInUp 0.8s ease forwards';
                        element.style.opacity = '1';
                    }, index * 150); // Stagger delay
                } else {
                    element.style.animation = 'fadeInUp 0.8s ease forwards';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Enhanced element selection
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .product-category,
        .product-card,
        .stat-card,
        .mvv-card,
        .choose-item,
        .process-step,
        .contact-card,
        .form-container,
        .contact-details,
        .faq-item
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Communication Toggle
function initCommunicationToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-form');
    const emailForm = document.getElementById('email-form');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            if (target === 'email-form' && emailForm) {
                if (emailForm.style.display === 'none' || emailForm.style.display === '') {
                    emailForm.style.display = 'block';
                    emailForm.style.animation = 'slideInUp 0.5s ease forwards';
                    this.textContent = 'Formu Gizle';
                    this.classList.remove('btn-secondary');
                    this.classList.add('btn-primary');
                    
                    // Scroll to form
                    setTimeout(() => {
                        emailForm.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 100);
                } else {
                    emailForm.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        emailForm.style.display = 'none';
                        this.textContent = 'Formu Göster';
                        this.classList.remove('btn-primary');
                        this.classList.add('btn-secondary');
                    }, 300);
                }
            }
        });
    });
}

// WhatsApp Integration
function initWhatsAppIntegration() {
    const whatsappBtns = document.querySelectorAll('.whatsapp-btn');
    
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track click for analytics (if needed)
            console.log('WhatsApp button clicked');
        });
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mesa Malzemecilik website loaded');
    
    // Initialize page loader first
    initPageLoader();
    
    // Core functionality
    initMobileMenu();
    initProductFilter();
    initFAQ();
    initContactForm();
    initSmoothScroll();
    initSearch();
    initCommunicationToggle();
    initWhatsAppIntegration();
    
    // Enhanced features
    initResponsiveFeatures();
    initMobileFormEnhancements();
    initAccessibilityFeatures();
    
    // Initialize enhanced scroll animations
    initScrollAnimationsAdvanced();
    
    // Initialize product details modal
    const productButtons = document.querySelectorAll('.product-btn');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            showProductDetails(productName);
        });
    });
});

// Responsive Utilities
function initResponsiveFeatures() {
    // Viewport detection
    function getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= 575,
            isTablet: window.innerWidth > 575 && window.innerWidth <= 991,
            isDesktop: window.innerWidth > 991
        };
    }
    
    // Touch device detection
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Add device class to body
    function updateDeviceClass() {
        const viewport = getViewportSize();
        const body = document.body;
        
        // Remove existing classes
        body.classList.remove('mobile', 'tablet', 'desktop', 'touch', 'no-touch');
        
        // Add viewport classes
        if (viewport.isMobile) {
            body.classList.add('mobile');
        } else if (viewport.isTablet) {
            body.classList.add('tablet');
        } else {
            body.classList.add('desktop');
        }
        
        // Add touch classes
        if (isTouchDevice()) {
            body.classList.add('touch');
        } else {
            body.classList.add('no-touch');
        }
    }
    
    // Optimize touch interactions
    function optimizeTouchInteractions() {
        const touchElements = document.querySelectorAll('.btn, .filter-btn, .nav-menu a, .feature-card, .product-card');
        
        touchElements.forEach(element => {
            // Add touch start and end events for better feedback
            element.addEventListener('touchstart', function() {
                this.style.transition = 'transform 0.1s ease';
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
            
            element.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Image lazy loading for better performance
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    // Responsive font scaling
    function initResponsiveFonts() {
        function updateFontSizes() {
            const viewport = getViewportSize();
            const root = document.documentElement;
            
            if (viewport.isMobile) {
                root.style.fontSize = '14px';
            } else if (viewport.isTablet) {
                root.style.fontSize = '15px';
            } else {
                root.style.fontSize = '16px';
            }
        }
        
        updateFontSizes();
        window.addEventListener('resize', debounce(updateFontSizes, 250));
    }
    
    // Performance monitoring
    function initPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', function() {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
        });
        
        // Monitor scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(function() {
                    scrollTimeout = null;
                    // Trigger any scroll-dependent optimizations here
                }, 100);
            }
        });
    }
    
    // Viewport change handler
    function handleViewportChange() {
        updateDeviceClass();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('viewportChange', {
            detail: getViewportSize()
        }));
    }
    
    // Initialize all responsive features
    updateDeviceClass();
    optimizeTouchInteractions();
    initLazyLoading();
    initResponsiveFonts();
    initPerformanceMonitoring();
    
    // Handle resize events
    window.addEventListener('resize', debounce(handleViewportChange, 250));
    window.addEventListener('orientationchange', debounce(handleViewportChange, 250));
    
    // Expose utility functions globally
    window.MesaUtils = {
        getViewportSize,
        isTouchDevice,
        updateDeviceClass
    };
}

// Enhanced form validation for mobile
function initMobileFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevent zoom on iOS
            if (input.type === 'email' || input.type === 'tel' || input.type === 'number') {
                input.setAttribute('inputmode', input.type === 'email' ? 'email' : 
                                              input.type === 'tel' ? 'tel' : 'numeric');
            }
            
            // Better mobile keyboard
            if (input.type === 'search') {
                input.setAttribute('inputmode', 'search');
            }
            
            // Auto-capitalize for name fields
            if (input.name === 'name' || input.name === 'firstName' || input.name === 'lastName') {
                input.setAttribute('autocapitalize', 'words');
            }
        });
    });
}

// Accessibility improvements
function initAccessibilityFeatures() {
    // Focus management
    const focusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    // Add skip links for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Ana içeriğe atla';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #D4AF37;
        color: #1a1a1a;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
        font-weight: 600;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero, .page-header');
    if (mainContent) {
        mainContent.setAttribute('id', 'main-content');
    }
}

// Enhanced features are initialized in the main DOMContentLoaded event

// Console log for development
console.log('Mesa Malzemecilik responsive website loaded successfully!');
console.log('All responsive features initialized.');

// ================================
// ASPIRIN PRODUCT MODAL FUNCTIONS
// ================================

// Product data for aspirin products
const aspirinProducts = {
    'aspirin-seffaf': {
        title: 'ASPİRİN NAYLON ŞEFFAF GENEL',
        category: 'Naylon Aspirin',
        type: 'Şeffaf',
        description: 'Yüksek kaliteli şeffaf naylon malzemeden üretilen aspirin. Ambalaj ve koruma amaçlı kullanım için ideal.',
        features: [
            'Şeffaf yapı',
            'Yüksek dayanıklılık',
            'Çok amaçlı kullanım',
            'Su geçirmez',
            'UV koruma'
        ],
        sizes: [
            { size: '100 cm', stock: '50+ adet', price: 'İletişim' },
            { size: '120 cm', stock: '45+ adet', price: 'İletişim' },
            { size: '140 cm', stock: '40+ adet', price: 'İletişim' },
            { size: '160 cm', stock: '35+ adet', price: 'İletişim' },
            { size: '180 cm', stock: '30+ adet', price: 'İletişim' },
            { size: '200 cm', stock: '25+ adet', price: 'İletişim' }
        ],
        applications: ['Paketleme', 'Depolama', 'Koruma', 'Taşıma']
    },
    'aspirin-renkli': {
        title: 'ASPİRİN NAYLON RENKLİ GENEL',
        category: 'Naylon Aspirin',
        type: 'Renkli',
        description: 'Farklı renk seçenekleriyle üretilen dayanıklı naylon aspirin. Görsel ayırt etme ve estetikte tercih edilir.',
        features: [
            'Çok renkli seçenekler',
            'Yüksek dayanıklılık',
            'Görsel ayırt etme',
            'Estetik görünüm',
            'Uzun ömürlü'
        ],
        sizes: [
            { size: '100 cm', stock: '40+ adet', price: 'İletişim' },
            { size: '120 cm', stock: '35+ adet', price: 'İletişim' },
            { size: '140 cm', stock: '30+ adet', price: 'İletişim' },
            { size: '160 cm', stock: '25+ adet', price: 'İletişim' },
            { size: '180 cm', stock: '20+ adet', price: 'İletişim' },
            { size: '200 cm', stock: '15+ adet', price: 'İletişim' }
        ],
        applications: ['Renkli paketleme', 'Marka tanıma', 'Estetik koruma', 'Kategorilendirme']
    },
    'aspirin-torba-seffaf': {
        title: 'ASPİRİN NAYLON TORBA ŞEFFAF',
        category: 'Naylon Torba',
        type: 'Şeffaf Torba',
        description: 'Pratik kullanım için tasarlanmış şeffaf naylon torba. Paketleme ve taşıma işlemlerinde ideal çözüm.',
        features: [
            'Torba formatı',
            'Şeffaf yapı',
            'Pratik kullanım',
            'Güçlü dikiş',
            'Taşıma kolaylığı'
        ],
        sizes: [
            { size: 'Küçük Boy', stock: '100+ adet', price: 'İletişim' },
            { size: 'Orta Boy', stock: '80+ adet', price: 'İletişim' },
            { size: 'Büyük Boy', stock: '60+ adet', price: 'İletişim' },
            { size: 'Jumbo Boy', stock: '40+ adet', price: 'İletişim' }
        ],
        applications: ['Market alışverişi', 'Ürün paketleme', 'Kişisel eşya taşıma', 'Mağaza kullanımı']
    },
    'aspirin-torba-renkli': {
        title: 'ASPİRİN NAYLON TORBA RENKLİ',
        category: 'Naylon Torba',
        type: 'Renkli Torba',
        description: 'Çeşitli renklerde üretilen naylon torba. Marka tanıtımı ve estetik kullanım için mükemmel.',
        features: [
            'Çok renkli seçenekler',
            'Torba formatı',
            'Marka tanıtımı',
            'Estetik görünüm',
            'Dayanıklı yapı'
        ],
        sizes: [
            { size: 'Küçük Boy', stock: '90+ adet', price: 'İletişim' },
            { size: 'Orta Boy', stock: '70+ adet', price: 'İletişim' },
            { size: 'Büyük Boy', stock: '50+ adet', price: 'İletişim' },
            { size: 'Jumbo Boy', stock: '30+ adet', price: 'İletişim' }
        ],
        applications: ['Mağaza torbaları', 'Promosyon malzemesi', 'Renkli paketleme', 'Marka tanıtımı']
    },
    'aspirin-super-eko': {
        title: 'ASPİRİN SÜPER EKO GRUBU',
        category: 'Süper Eko',
        type: 'Ekonomik Çözüm',
        description: 'Çevre dostu ve ekonomik aspirin seçeneği. Sürdürülebilir üretim anlayışıyla hazırlanmıştır.',
        features: [
            'Çevre dostu',
            'Ekonomik fiyat',
            'Sürdürülebilir',
            'Kaliteli malzeme',
            'Uygun maliyetli'
        ],
        sizes: [
            { size: '100 cm', stock: '60+ adet', price: 'İletişim' },
            { size: '150 cm', stock: '45+ adet', price: 'İletişim' },
            { size: '200 cm', stock: '30+ adet', price: 'İletişim' }
        ],
        applications: ['Ekonomik paketleme', 'Çevre dostu projeler', 'Toplu kullanım', 'Sürdürülebilir çözümler']
    },
    'aspirin-eko-seffaf': {
        title: 'ASPİRİN EKO GRUBU ŞEFFAF',
        category: 'Eko Grup',
        type: 'Şeffaf Eko',
        description: 'Şeffaf ve çevre dostu naylon aspirin. 120 cm boyutunda 2 katlı seçeneği mevcuttur.',
        features: [
            'Eko dostu yapı',
            'Şeffaf malzeme',
            '2 katlı seçenek',
            'Çok boyutlu',
            'Sürdürülebilir'
        ],
        sizes: [
            { size: '100 cm', stock: '50+ adet', price: 'İletişim' },
            { size: '120 cm', stock: '45+ adet', price: 'İletişim' },
            { size: '120 cm (2 Katlı)', stock: '25+ adet', price: 'İletişim', special: true },
            { size: '130 cm', stock: '40+ adet', price: 'İletişim' },
            { size: '140 cm', stock: '35+ adet', price: 'İletişim' },
            { size: '160 cm', stock: '30+ adet', price: 'İletişim' },
            { size: '200 cm', stock: '20+ adet', price: 'İletişim' }
        ],
        applications: ['Çevre dostu paketleme', 'Şeffaf koruma', 'Özel projeler', 'Sürdürülebilir ambalaj']
    }
};

// Function to open product modal
function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const product = aspirinProducts[productId];
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    modalContent.innerHTML = generateModalContent(product);
    modal.style.display = 'block';
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for closing modal
    setupModalCloseEvents(modal);
}

// Function to generate modal content
function generateModalContent(product) {
    const sizesHTML = product.sizes.map(size => `
        <div class="size-option ${size.special ? 'special' : ''}">
            <div class="size-info">
                <span class="size-name">${size.size}</span>
                ${size.special ? '<span class="special-badge">Özel</span>' : ''}
            </div>
            <div class="size-details">
                <span class="size-stock">${size.stock}</span>
                <span class="size-price">${size.price}</span>
            </div>
        </div>
    `).join('');
    
    const featuresHTML = product.features.map(feature => `
        <span class="feature-tag">${feature}</span>
    `).join('');
    
    const applicationsHTML = product.applications.map(app => `
        <span class="app-tag">${app}</span>
    `).join('');
    
    return `
        <div class="detail-product-card">
            <div class="detail-header">
                <h2>${product.title}</h2>
                <div class="detail-badges">
                    <span class="category-badge">${product.category}</span>
                    <span class="type-badge">${product.type}</span>
                </div>
            </div>
            
            <div class="detail-description">
                <p>${product.description}</p>
            </div>
            
            <div class="detail-section">
                <h3>Özellikler</h3>
                <div class="features-grid">
                    ${featuresHTML}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Boyut Seçenekleri</h3>
                <div class="size-grid">
                    ${sizesHTML}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Kullanım Alanları</h3>
                <div class="applications-grid">
                    ${applicationsHTML}
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="contactForProduct('${product.title}')">İletişime Geç</button>
                <button class="btn btn-secondary" onclick="closeProductModal()">Kapat</button>
            </div>
        </div>
    `;
}

// Function to setup modal close events (FIX: Single click close)
function setupModalCloseEvents(modal) {
    // Remove any existing event listeners to prevent duplication
    const existingCloseBtn = modal.querySelector('.close');
    if (existingCloseBtn) {
        existingCloseBtn.onclick = null;
    }
    
    // Close button event
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            closeProductModal();
        };
    }
    
    // Click outside modal to close (FIX: Prevent event bubbling)
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeProductModal();
        }
    };
    
    // Prevent modal content clicks from closing modal
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.onclick = function(event) {
            event.stopPropagation();
        };
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeProductModal();
        }
    });
}

// Function to close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Remove event listeners
    modal.onclick = null;
    document.removeEventListener('keydown', closeProductModal);
}

// Function to handle contact for specific product
function contactForProduct(productName) {
    // You can customize this function to handle contact form with pre-filled product info
    const message = `Merhaba, ${productName} hakkında bilgi almak istiyorum.`;
    const encodedMessage = encodeURIComponent(message);
    
    // Option 1: WhatsApp (if you have WhatsApp number)
    // window.open(`https://wa.me/905XXXXXXXXX?text=${encodedMessage}`, '_blank');
    
    // Option 2: Email
    window.location.href = `mailto:info@mesamalzemecilik.com?subject=Ürün Bilgi Talebi&body=${encodedMessage}`;
    
    // Option 3: Redirect to contact page
    // window.location.href = 'iletisim.html';
} 
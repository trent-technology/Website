// scripts.js
// Modern ES6+ JavaScript with improved error handling and performance

/**
 * Activates a tab based on ID with smooth transitions
 * @param {string} tabId - The ID of the tab to activate
 */
function activateTab(tabId) {
    try {
        // Remove active states
        document.querySelectorAll('.tab-link').forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });
        
        // Add active states
        const targetSection = document.getElementById(tabId);
        const activeLink = document.querySelector(`.navbar-nav .tab-link[data-tab="${tabId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
        }
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-selected', 'true');
        }
        
        // Scroll to top (instant for initial load, smooth for tab switches)
        const isInitialLoad = !document.querySelector('.tab-content.active');
        window.scrollTo({ top: 0, behavior: isInitialLoad ? 'instant' : 'smooth' });
        
        // Update page title for better UX
        const tabNames = {
            'Home': 'Project Highlights',
            'Resume': 'Resume & Experience',
            'CompSciClub': 'Computer Science Club',
            'Services': 'Services & Products',
            'Contact': 'Contact Me'
        };
        document.title = `${tabNames[tabId] || 'Trent Technology'} - Trent Technology`;
        
    } catch (error) {
        console.error('Error activating tab:', error);
    }
}

// Function to initialize tab
function initializeTab() {
    // Scroll to top immediately on page load
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const validTabs = ['Home', 'Resume', 'CompSciClub', 'Services', 'Contact'];
    let tabId = localStorage.getItem('activeTab');
    if (!tabId || !validTabs.includes(tabId)) {
        const hash = window.location.hash.substring(1);
        const normalizedHash = validTabs.find(tab => tab.toLowerCase() === hash.toLowerCase());
        tabId = normalizedHash || 'Home';
    }
    activateTab(tabId);
    if (window.location.hash !== `#${tabId}`) {
        window.history.replaceState(null, '', `#${tabId}`);
    }
    localStorage.setItem('activeTab', tabId);
    setTimeout(() => {
        const activeSection = document.querySelector('.tab-content.active');
        if (!activeSection || activeSection.id !== tabId) activateTab(tabId);
        // Ensure we're at the top after tab activation
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
}

// Tab switching logic
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            activateTab(tabId);
            window.history.pushState(null, '', `#${tabId}`);
            localStorage.setItem('activeTab', tabId);
        });
    });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTab);
    } else {
        initializeTab();
    }
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        const validTabs = ['Home', 'Resume', 'CompSciClub', 'Services', 'Contact'];
        const normalizedHash = validTabs.find(tab => tab.toLowerCase() === hash.toLowerCase());
        const tabId = normalizedHash || 'Home';
        activateTab(tabId);
        localStorage.setItem('activeTab', tabId);
        if (window.location.hash !== `#${tabId}`) {
            window.history.replaceState(null, '', `#${tabId}`);
        }
    });
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('#email').value;
        const statusMessage = document.getElementById('form-status');
        const submitButton = form.querySelector('button[type="submit"]');
        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            statusMessage.textContent = 'Please enter a valid email address.';
            statusMessage.style.color = '#e74c3c';
            setTimeout(() => statusMessage.textContent = '', 5000);
            return;
        }
        submitButton.disabled = true;
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                statusMessage.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!';
                statusMessage.style.color = '#4a90e2';
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            statusMessage.textContent = 'Sorry, something went wrong. Please try again later.';
            statusMessage.style.color = '#e74c3c';
            setTimeout(() => statusMessage.textContent = '', 5000);
        } finally {
            submitButton.disabled = false;
        }
    });
}

// Image enlargement in CompSciClub with lazy loading support
function initializeImageModal() {
    const images = document.querySelectorAll('#CompSciClub img');
    const modalImage = document.getElementById('modalImage');
    const imageModal = document.getElementById('imageModal');
    
    if (!modalImage || !imageModal) return;
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.setAttribute('role', 'button');
        img.setAttribute('tabindex', '0');
        img.setAttribute('aria-label', `View larger image: ${img.alt || 'Image'}`);
        
        const openModal = () => {
            modalImage.src = img.src;
            modalImage.alt = img.alt || 'Enlarged image';
            const modal = new bootstrap.Modal(imageModal);
            modal.show();
        };
        
        img.addEventListener('click', openModal);
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
    });
}

// Initialize image modal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageModal);
} else {
    initializeImageModal();
}

// Enhanced scroll behavior and performance
window.addEventListener('load', () => {
    // Scroll to top on initial load
    if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    // Initialize intersection observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe cards and metric items
        document.querySelectorAll('.card, .metric-item, .skill-category, .competency-item').forEach(el => {
            observer.observe(el);
        });
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            const modal = bootstrap.Modal.getInstance(openModal);
            if (modal) modal.hide();
        }
    }
    
    // Arrow key navigation for carousel (when focused)
    if (e.target.closest('.carousel')) {
        if (e.key === 'ArrowLeft') {
            const prevButton = e.target.closest('.carousel').querySelector('.carousel-control-prev');
            if (prevButton) prevButton.click();
        } else if (e.key === 'ArrowRight') {
            const nextButton = e.target.closest('.carousel').querySelector('.carousel-control-next');
            if (nextButton) nextButton.click();
        }
    }
});

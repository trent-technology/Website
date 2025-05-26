// Function to activate a tab based on ID
function activateTab(tabId) {
    console.log('Activating tab:', tabId); // Debug
    // Remove active class from all links and sections
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        console.log('Removed active class from section:', content.id); // Debug
    });
    // Add active class to the target link and section
    const targetSection = document.getElementById(tabId);
    const activeLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Applied active class to section:', tabId); // Debug
    } else {
        console.warn('Section not found for tabId:', tabId);
    }
    if (activeLink) {
        activeLink.classList.add('active');
        console.log('Applied active class to link:', tabId); // Debug
    } else {
        console.warn('Link not found for tabId:', tabId);
    }
    // Scroll to top after activating tab
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, 0);
}

// Function to initialize tab based on localStorage, hash, or default
function initializeTab() {
    console.log('Initializing tab, current hash:', window.location.hash); // Debug
    const validTabs = ['AboutMe', 'Resume', 'CompSciClub', 'Contact'];
    
    // Check localStorage for the last selected tab
    let tabId = localStorage.getItem('activeTab');
    console.log('Retrieved from localStorage:', tabId); // Debug
    
    // If no valid tab in localStorage, fall back to URL hash
    if (!tabId || !validTabs.includes(tabId)) {
        const hash = window.location.hash.substring(1); // Get hash without '#'
        console.log('Raw hash:', hash); // Debug
        // Match hash case-insensitively
        const normalizedHash = validTabs.find(tab => tab.toLowerCase() === hash.toLowerCase());
        tabId = normalizedHash || 'AboutMe'; // Default to AboutMe
        console.log('Normalized tabId:', tabId); // Debug
    }
    
    activateTab(tabId);
    // Ensure the hash is set in the URL
    if (window.location.hash !== `#${tabId}`) {
        window.history.replaceState(null, '', `#${tabId}`);
        console.log('Updated URL hash to:', `#${tabId}`); // Debug
    }
    // Save the selected tab to localStorage
    localStorage.setItem('activeTab', tabId);
    console.log('Saved active tab to localStorage:', tabId); // Debug
    
    // Fallback: Re-run activation after a delay to handle browser hash behavior
    setTimeout(() => {
        const activeSection = document.querySelector('.tab-content.active');
        if (!activeSection || activeSection.id !== tabId) {
            console.log('Re-activating tab due to mismatch:', tabId); // Debug
            activateTab(tabId);
        }
    }, 100);
}

// Tab switching logic for clicks (only on index.html)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            console.log('Tab clicked:', tabId); // Debug
            activateTab(tabId);
            window.history.pushState(null, '', `#${tabId}`);
            // Save the selected tab to localStorage
            localStorage.setItem('activeTab', tabId);
            console.log('Set hash and saved to localStorage:', `#${tabId}`); // Debug
        });
    });

    // Run tab initialization as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing tab'); // Debug
            initializeTab();
        });
    } else {
        console.log('DOM already loaded, initializing tab'); // Debug
        initializeTab();
    }

    // Handle hash changes (e.g., browser back/forward)
    window.addEventListener('hashchange', () => {
        console.log('Hash changed:', window.location.hash); // Debug
        const hash = window.location.hash.substring(1);
        const validTabs = ['AboutMe', 'Resume', 'CompSciClub', 'Contact'];
        // Match hash case-insensitively
        const normalizedHash = validTabs.find(tab => tab.toLowerCase() === hash.toLowerCase());
        const tabId = normalizedHash || 'AboutMe';
        console.log('Normalized tabId on hashchange:', tabId); // Debug
        activateTab(tabId);
        // Save the selected tab to localStorage
        localStorage.setItem('activeTab', tabId);
        console.log('Saved active tab to localStorage on hashchange:', tabId); // Debug
        // Ensure the hash is updated in the URL
        if (window.location.hash !== `#${tabId}`) {
            window.history.replaceState(null, '', `#${tabId}`);
            console.log('Updated URL hash on hashchange to:', `#${tabId}`); // Debug
        }
    });
}

// Handle contact form submission (only on index.html)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable button during submission
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.textContent = 'Thank you! Your message has been sent. Redirecting...';
                successMessage.style.color = '#4a90e2';
                form.appendChild(successMessage);
                form.reset(); // Clear form
                // Redirect to thank-you page after 2 seconds
                setTimeout(() => {
                    console.log('Redirecting to thank-you.html'); // Debug
                    window.location.href = '/thank-you.html'; // Use relative path
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Form submission failed:', errorData); // Debug
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error during form submission:', error); // Debug
            // Show error message
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Sorry, something went wrong. Please try again later.';
            errorMessage.style.color = '#e74c3c';
            form.appendChild(errorMessage);
            // Remove error message after 5 seconds
            setTimeout(() => errorMessage.remove(), 5000);
        } finally {
            submitButton.disabled = false; // Re-enable button
        }
    });
}

// Scroll to top on page load for all pages
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, 0);
});

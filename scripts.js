// Function to activate a tab based on ID
function activateTab(tabId) {
    console.log('Activating tab:', tabId); // Debug
    // Remove active class from all links and sections
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    // Add active class to the target link and section
    const targetSection = document.getElementById(tabId);
    const activeLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn('Section not found for tabId:', tabId);
    }
    if (activeLink) {
        activeLink.classList.add('active');
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

// Tab switching logic for clicks (only on index.html)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            activateTab(tabId);
            window.history.pushState(null, '', `#${tabId}`);
        });
    });
}

// On page load, show section based on URL hash (only on index.html)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    window.addEventListener('load', () => {
        console.log('Page loaded, checking hash'); // Debug
        const hash = window.location.hash.substring(1);
        const validTabs = ['Resume', 'CompSci Club', 'Contact'];
        const tabId = hash && validTabs.includes(hash) ? hash : 'Resume';
        activateTab(tabId);
        // Scroll to top on initial load
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        }, 0);
    });

    // Handle hash changes (e.g., browser back/forward)
    window.addEventListener('hashchange', () => {
        console.log('Hash changed:', window.location.hash); // Debug
        const hash = window.location.hash.substring(1);
        const validTabs = ['Resume', 'CompSci Club', 'Contact'];
        const tabId = hash && validTabs.includes(hash) ? hash : 'Resume';
        activateTab(tabId);
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

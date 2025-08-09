// Function to activate a tab based on ID
function activateTab(tabId) {
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const targetSection = document.getElementById(tabId);
    const activeLink = document.querySelector(`.navbar-nav .tab-link[data-tab="${tabId}"]`);
    if (targetSection) targetSection.classList.add('active');
    if (activeLink) activeLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to initialize tab
function initializeTab() {
    const validTabs = ['Home', 'Resume', 'CompSciClub', 'Contact'];
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
        const validTabs = ['Home', 'Resume', 'CompSciClub', 'Contact'];
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
                method: form.method;
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                statusMessage.textContent = 'Thank you! Your message has been sent. Redirecting...';
                statusMessage.style.color = '#4a90e2';
                form.reset();
                setTimeout(() => {
                    window.location.href = '/thank-you.html';
                }, 2000);
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

// Scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
});

// Modal for CompSci Club images
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const closeBtn = document.getElementsByClassName("close")[0];

    document.querySelectorAll('#CompSciClub .img-fluid').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

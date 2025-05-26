// Tab switching logic
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Tab clicked:', link.getAttribute('data-tab')); // Debug
        // Remove active class from all links and sections
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        // Add active class to clicked link and corresponding section
        const tabId = link.getAttribute('data-tab');
        link.classList.add('active');
        const targetSection = document.getElementById(tabId);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.error('Section not found for tabId:', tabId);
        }
        // Update URL
        window.history.pushState(null, '', `#${tabId}`);
    });
});

// On page load, show section based on URL hash
window.addEventListener('load', () => {
    console.log('Page loaded, checking hash'); // Debug
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            targetSection.classList.add('active');
            const activeLink = document.querySelector(`.tab-link[data-tab="${hash}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            } else {
                console.error('Link not found for hash:', hash);
            }
        } else {
            console.error('Section not found for hash:', hash);
        }
    }
});

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
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

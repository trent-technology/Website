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

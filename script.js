// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');

function toggleMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

// Close menu when clicking any link inside it
navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
});

// Luxury Scroll Reveal Effect for Elements
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.creator-card, .service-card, .section, .form-wrapper, .career-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});

// Join Us Form Submission to Google Sheets
const joinForm = document.getElementById("join-form");
if (joinForm) {
    joinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const tiktok = document.getElementById("tiktok").value.trim();
        const whatsApp = document.getElementById("whatsApp").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !tiktok || !message) {
            alert("Please fill in all required fields.");
            return;
        }

        // Google Apps Script Web App URL
        const scriptURL = "https://script.google.com/macros/s/AKfycbzlNAu2z4z1ryU64fDILogEF37U_PxmKRbaTMEAdrWTzd7x2Q7BRvrKzMGwrJs4m1WT/exec";
        const data = { name, tiktok, whatsApp, message };

        try {
            await fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            alert("✅ Thank you for applying! We'll review your submission and get back to you soon.");
            joinForm.reset();
        } catch (error) {
            alert("❌ Something went wrong. Please try again later.");
            console.error(error);
        }
    });
}

// 1. Smooth Scroll for Navigation Links
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

// 2. Mobile Menu Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');

function toggleMenu() {
    if(menuToggle && navMenu && menuOverlay) {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

if (navMenu) {
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && menuToggle && navMenu && menuOverlay) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });
}

// 3. Luxury Scroll Reveal Effect for Elements
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

// 4. Join Us Form Submission to Google Sheets
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
// 5. --- كود الـ Service Pop-up المطور للأزرار الجديدة ---
const watchButtons = document.querySelectorAll('.watch-btn');
const modal = document.getElementById('video-modal');
const video = document.getElementById('service-video');
const closeModal = document.querySelector('.close-modal');
let videoTimer; 

watchButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // منع انتشار الضغطة للكارد نفسه
        const videoSrc = button.getAttribute('data-video');
        console.log("Watch button clicked! Video source:", videoSrc); 
        
        if (videoSrc && modal && video) {
            video.src = videoSrc;
            video.load();
            modal.style.display = 'flex'; 
            
            // تشغيل الفيديو تلقائياً بعد الفتح
            video.play().catch(error => {
                console.log("Autoplay failed or blocked by browser:", error);
            });

            // تايمر الإغلاق التلقائي (10 ثواني)
            clearTimeout(videoTimer);
            videoTimer = setTimeout(() => {
                closeModalFunction();
            }, 10000);
        } else {
            console.error("Missing elements! Modal:", modal, "Video:", video);
        }
    });
});

function closeModalFunction() {
    if (modal && video) {
        modal.style.display = 'none';
        video.pause();
        video.src = ''; 
        clearTimeout(videoTimer); 
    }
}

if (closeModal) {
    closeModal.addEventListener('click', closeModalFunction);
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunction();
    }
});

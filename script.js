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

// 5. Service Video Modal
const watchButtons = document.querySelectorAll('.watch-btn');
const modal = document.getElementById('video-modal');
const video = document.getElementById('service-video');
const closeModal = document.querySelector('.close-modal');

watchButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoSrc = button.dataset.video;
        if (videoSrc && modal && video) {
            video.pause();
            video.currentTime = 0;
            video.src = videoSrc;
            video.load();
            video.muted = false;
            video.volume = 1;
            modal.style.display = "flex";
            video.play().catch(err => console.log(err));
        }
    });
});

if (video) {
    video.addEventListener("ended", closeModalFunction);
}

function closeModalFunction() {
    modal.style.display = "none";
    video.pause();
    video.currentTime = 0;
    video.removeAttribute("src");
    video.load();
}

if (closeModal) {
    closeModal.addEventListener("click", closeModalFunction);
}

window.addEventListener("click", function(e){
    if(e.target === modal){
        closeModalFunction();
    }
});

// ================= Luxury Preloader (6s), Ambient Audio, Light/Dark Theme & Back-to-Top =================
document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("luxury-preloader");
    const progressFill = document.getElementById("progress-fill");
    const progressCounter = document.getElementById("progress-counter");
    const bgSound = document.getElementById("bg-ambient-sound");
    const soundBtn = document.getElementById("sound-toggle-btn");
    const themeModeBtn = document.getElementById("theme-mode-btn");
    const backToTopBtn = document.getElementById("back-to-top-btn");

    // 1. شاشة التحميل (6 ثوانٍ بدقة تامة)
    const startTime = Date.now();
    const duration = 1200; 

    const preloaderInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let progress = Math.min(Math.floor((elapsed / duration) * 100), 100);

        if (progressFill) progressFill.style.width = progress + "%";
        if (progressCounter) progressCounter.innerText = progress + "%";

        if (progress >= 100) {
            clearInterval(preloaderInterval);
            if (preloader) {
                preloader.classList.add("fade-out");
                setTimeout(() => {
                    preloader.remove();
                }, 600);
            }
        }
    }, 50);
if (bgSound) {
    bgSound.volume = 0;

    bgSound.play().then(() => {
        let volume = 0;

        const fade = setInterval(() => {
            volume += 0.01;
            bgSound.volume = Math.min(volume, 0.08); // أقصى صوت 8%

            if (volume >= 0.08) {
                clearInterval(fade);
            }
        }, 120);

    }).catch(() => {});
}
    // 2. إدارة الصوت مع ضمان التفعيل المباشر
    if (bgSound && soundBtn) {
        bgSound.volume = 0.4;

        soundBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (bgSound.paused) {
                bgSound.play().then(() => {
                    soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                }).catch(err => {
                    console.log("Audio play error:", err);
                });
            } else {
                bgSound.pause();
                soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
        });

        const unlockAudio = () => {
            if (bgSound.paused) {
                bgSound.play().then(() => {
                    soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                    window.removeEventListener('click', unlockAudio);
                    window.removeEventListener('touchstart', unlockAudio);
                }).catch(() => {});
            }
        };
        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('touchstart', unlockAudio, { once: true });
    }

    // 3. زر البرق (Dark / Bright Light Mode Switcher)
    if (themeModeBtn) {
        const currentMode = localStorage.getItem("szm_theme_mode");
        if (currentMode === "light") {
            document.body.classList.add("light-mode");
            themeModeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }

        themeModeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            
            if (document.body.classList.contains("light-mode")) {
                localStorage.setItem("szm_theme_mode", "light");
                themeModeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                localStorage.setItem("szm_theme_mode", "dark");
                themeModeBtn.innerHTML = '<i class="fa-solid fa-bolt"></i>';
            }

            themeModeBtn.style.transform = "scale(1.15) rotate(15deg)";
            setTimeout(() => {
                themeModeBtn.style.transform = "scale(1) rotate(0deg)";
            }, 300);
        });
    }

    // 4. زر العودة لأعلى الصفحة (Back to Top)
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


// 1. Language Toggle System (EN / AR)
const langBtns = document.querySelectorAll(".lang-btn");
const langLabels = document.querySelectorAll(".lang-label");

let currentLang = localStorage.getItem("szm_language") || "en";

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    langLabels.forEach(label => {
        label.innerText = lang === "ar" ? "EN" : "AR";
    });

    // Translate Text Elements
    document.querySelectorAll("[data-en]").forEach(el => {
        const arText = el.getAttribute("data-ar");
        const enText = el.getAttribute("data-en");

        if (lang === "ar" && arText) {
            el.innerText = arText;
        } else if (lang === "en" && enText) {
            el.innerText = enText;
        }
    });

    // Switch Hero Image
    const heroImage = document.querySelector(
        ".hero-image img[data-en-src][data-ar-src]"
    );

    if (heroImage) {
        heroImage.src = lang === "ar"
            ? heroImage.dataset.arSrc
            : heroImage.dataset.enSrc;

        heroImage.alt = lang === "ar"
            ? "ستارز زون ميديا - شريك نموك على تيك توك لايف"
            : "Stars Zone Media - Your Growth Partner on TikTok Live";
    }

    // Translate Placeholders
    document.querySelectorAll("[data-placeholder-en]").forEach(input => {
        const arPh = input.getAttribute("data-placeholder-ar");
        const enPh = input.getAttribute("data-placeholder-en");

        if (lang === "ar" && arPh) {
            input.placeholder = arPh;
        } else if (lang === "en" && enPh) {
            input.placeholder = enPh;
        }
    });

    // Update Submit Button Language
    if (typeof window.updateJoinSubmitButtonLanguage === "function") {
        window.updateJoinSubmitButtonLanguage(lang);
    }

    // Save Selected Language
    localStorage.setItem("szm_language", lang);
}

// Language Button Events
langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "ar" : "en";
        applyLanguage(currentLang);
    });
});

// Switch Navbar Logo According to Theme
function updateNavbarLogo() {
    const isLightMode = document.body.classList.contains("light-mode");

    document.querySelectorAll(
        ".nav-logo img[data-light-src][data-dark-src]"
    ).forEach(logo => {
        logo.src = isLightMode
            ? logo.dataset.lightSrc
            : logo.dataset.darkSrc;
    });
}


// 2. Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Dropdown Click Toggle
const dropdownToggle = document.querySelector('.dropdown-toggle');
const navDropdown = document.querySelector('.nav-dropdown');

if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            navDropdown.classList.toggle('active');
        }
    });
}

// Mobile Menu Navigation Toggle
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
        if (e.target.tagName === 'A' && !e.target.classList.contains('dropdown-toggle')) {
            if (menuToggle && navMenu && menuOverlay) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            }
        }
    });
}

// 3. Horizontal Carousel Controls (Elite, Graduated, & Feedback)
function setupCarousel(prevBtnId, nextBtnId, wrapperId, scrollAmount = 340) {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const wrapper = document.getElementById(wrapperId);

    if (prevBtn && nextBtn && wrapper) {
        nextBtn.addEventListener('click', () => {
            const isRTL = document.documentElement.dir === 'rtl';
            wrapper.scrollBy({ left: isRTL ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const isRTL = document.documentElement.dir === 'rtl';
            wrapper.scrollBy({ left: isRTL ? scrollAmount : -scrollAmount, behavior: 'smooth' });
        });
    }
}

setupCarousel('elite-prev', 'elite-next', 'elite-carousel-wrapper', 680);
setupCarousel('grad-prev', 'grad-next', 'grad-carousel-wrapper', 260);
setupCarousel('feedback-prev', 'feedback-next', 'feedback-carousel-wrapper', 300);


// 4. Join Us Form Submission (Google Sheets + inline button feedback)
const joinForm = document.getElementById("join-form");

if (joinForm) {
    const submitButton = joinForm.querySelector('button[type="submit"]');
    const submitButtonLabel = submitButton?.querySelector("span");

    let isSubmitting = false;
    let joinSubmitState = "idle";

    const buttonLabels = {
        idle: {
            en: submitButtonLabel?.dataset.en || "Submit Application",
            ar: submitButtonLabel?.dataset.ar || "إرسال الطلب"
        },
        loading: {
            en: "Submitting...",
            ar: "جارٍ الإرسال..."
        },
        success: {
            en: "Submitted",
            ar: "تم الإرسال"
        },
        error: {
            en: "Try Again",
            ar: "حاول مرة أخرى"
        }
    };

    submitButton?.classList.add("application-submit-btn");
    submitButton?.setAttribute("aria-live", "polite");

    function setJoinSubmitState(state) {
        joinSubmitState = state;

        if (!submitButton) return;

        submitButton.dataset.state = state;

        submitButton.classList.remove(
            "is-loading",
            "is-success",
            "is-error"
        );

        if (state !== "idle") {
            submitButton.classList.add(`is-${state}`);
        }

        submitButton.setAttribute(
            "aria-busy",
            state === "loading" ? "true" : "false"
        );

        if (submitButtonLabel) {
            submitButtonLabel.textContent =
                buttonLabels[state][currentLang] ||
                buttonLabels[state].en;
        }
    }

    // Update button text when language changes
    window.updateJoinSubmitButtonLanguage = function(lang) {
        if (submitButtonLabel) {
            submitButtonLabel.textContent =
                buttonLabels[joinSubmitState][lang] ||
                buttonLabels[joinSubmitState].en;
        }
    };

    // Allow another application after editing the form
    joinForm.addEventListener("input", () => {
        if (
            !isSubmitting &&
            (joinSubmitState === "success" ||
             joinSubmitState === "error")
        ) {
            setJoinSubmitState("idle");

            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });

    joinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const name = document.getElementById("name").value.trim();
        const tiktok = document.getElementById("tiktok").value.trim();
        const whatsApp = document.getElementById("whatsApp").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !tiktok || !message) {
            alert(
                currentLang === "ar"
                    ? "يرجى ملء جميع الحقول المطلوبة."
                    : "Please fill in all required fields."
            );
            return;
        }

        const scriptURL =
            "https://script.google.com/macros/s/AKfycbzlNAu2z4z1ryU64fDILogEF37U_PxmKRbaTMEAdrWTzd7x2Q7BRvrKzMGwrJs4m1WT/exec";

        const data = { name, tiktok, whatsApp, message };

        isSubmitting = true;

        if (submitButton) {
            submitButton.disabled = true;
        }

        setJoinSubmitState("loading");

        try {
            await fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data)
            });

            joinForm.reset();

            setJoinSubmitState("success");

            if (submitButton) {
                submitButton.disabled = true;
            }

        } catch (error) {
            console.error("Google Sheets submission error:", error);

            setJoinSubmitState("error");

            if (submitButton) {
                submitButton.disabled = false;
            }

        } finally {
            isSubmitting = false;
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

function closeModalFunction() {
    if (modal && video) {
        modal.style.display = "none";
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        video.load();
    }
}

if (closeModal) closeModal.addEventListener("click", closeModalFunction);

window.addEventListener("click", function(e){
    if(e.target === modal){
        closeModalFunction();
    }
});

// Preloader & Controls Initialization
document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(currentLang);

    const preloader = document.getElementById("luxury-preloader");
    const progressFill = document.getElementById("progress-fill");
    const progressCounter = document.getElementById("progress-counter");
    const backToTopBtn = document.getElementById("back-to-top-btn");

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
                setTimeout(() => { preloader.remove(); }, 600);
            }
        }
    }, 50);

    // Light / Dark Theme Switcher
    const themeModeBtns = document.querySelectorAll(".theme-mode-btn");
    if (themeModeBtns.length > 0) {
        const currentMode = localStorage.getItem("szm_theme_mode");
        if (currentMode === "light") {
            document.body.classList.add("light-mode");
            themeModeBtns.forEach(btn => {
                btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            });
        } else {
            document.body.classList.remove("light-mode");
        }
        updateNavbarLogo();

        themeModeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                document.body.classList.toggle("light-mode");
                
                const isLight = document.body.classList.contains("light-mode");
                localStorage.setItem("szm_theme_mode", isLight ? "light" : "dark");
                updateNavbarLogo();
                
                themeModeBtns.forEach(b => {
                    b.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-bolt"></i>';
                });
            });
        });
    }

    // Scroll to Top
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
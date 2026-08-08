const WHATSAPP_NUMBER = "250792040262";
const REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");

function initRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");

    if (REDUCED_MOTION_QUERY.matches) {
        revealItems.forEach((item) => item.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 70, 400)}ms`;
        observer.observe(item);
    });
}

function initTiltCards() {
    const cards = document.querySelectorAll(".tilt-card");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!cards.length || !finePointer || REDUCED_MOTION_QUERY.matches) {
        return;
    }

    cards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 20;
            const rotateY = (x - centerX) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });
}

function initActiveNavLinks() {
    const links = document.querySelectorAll(".main-nav a");
    const sections = document.querySelectorAll("main section[id]");

    if (!links.length || !sections.length) {
        return;
    }

    const setActiveLink = () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.id;
            }
        });

        links.forEach((link) => {
            link.classList.toggle("active-link", link.getAttribute("href") === `#${current}`);
        });
    };

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
}

function initWhatsAppForm() {
    const form = document.getElementById("contactForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const message = document.getElementById("message")?.value.trim() || "";

        const text = [
            "Hello Sabine,",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            "Message:",
            message
        ].join("\n");

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank", "noopener");

        form.reset();
    });
}

function setYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = `${new Date().getFullYear()}`;
    }
}

initRevealAnimations();
initTiltCards();
initActiveNavLinks();
initWhatsAppForm();
setYear();

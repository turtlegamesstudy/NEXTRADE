document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTOS
    const openSorpresa = document.getElementById("openSorpresa");
    const closeBtn = document.querySelector(".close-modal");
    const modal = document.getElementById("sorpresaModal");
    const slides = document.querySelectorAll(".slide");
    const startBtn = document.getElementById("startExperience");
    const audioBtn = document.getElementById("playAudio");
    const audio = document.getElementById("audio");
    const daysCounter = document.getElementById("daysCounter");
    const lyricsContainer = document.getElementById("lyrics");

    let currentSlide = 0;
    let isAnimating = false;
    let touchStartY = 0;
    let touchEndY = 0;

    // ABRIR / CERRAR MODAL
    openSorpresa.addEventListener("click", () => {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        currentSlide = 0;
        updateSlides();
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        audio.pause();
        audio.currentTime = 0;
    });

    // NAVEGACIÓN SLIDES
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateY(${100 * (index - currentSlide)}vh)`;
        });
    }

    function moveSlide(dir) {
        if (isAnimating) return;
        if (dir === "next" && currentSlide < slides.length - 1) currentSlide++;
        else if (dir === "prev" && currentSlide > 0) currentSlide--;
        
        isAnimating = true;
        updateSlides();
        setTimeout(() => { isAnimating = false; }, 900);
    }

    window.addEventListener("wheel", (e) => {
        if (!modal.classList.contains("active")) return;
        moveSlide(e.deltaY > 0 ? "next" : "prev");
    });

    // SOPORTE PARA CELULARES (TOUCH)
window.addEventListener("touchstart", (e) => {
    if (!modal.classList.contains("active")) return;
    touchStartY = e.changedTouches[0].screenY;
}, false);

window.addEventListener("touchend", (e) => {
    if (!modal.classList.contains("active")) return;
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
}, false);

function handleGesture() {
    const swipeThreshold = 50; // Sensibilidad del deslizamiento
    if (touchEndY < touchStartY - swipeThreshold) {
        moveSlide("next"); // Deslizó hacia arriba
    }
    if (touchEndY > touchStartY + swipeThreshold) {
        moveSlide("prev"); // Deslizó hacia abajo
    }
}

    startBtn.addEventListener("click", () => moveSlide("next"));

    // CONTADOR
    const startDate = new Date("2025-10-14");
    const today = new Date();
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    let count = 0;
    const interval = setInterval(() => {
        if (count < diffDays) {
            count += Math.ceil(diffDays / 50);
            if (count > diffDays) count = diffDays;
            daysCounter.textContent = count;
        } else clearInterval(interval);
    }, 30);

    // AUDIO & LETRAS
    const lyrics = [
        { time: 2, text: "Ay yo no sé cómo expresarme..." },
        { time: 6, text: "Por eso escribi esta canción..." },
        { time: 10, text: "Pa' demostrar cuánto te amo..." },
        { time: 14, text: "Con el lenguaje del corazón." },
        { time: 18, text: "Ay yo no sé si quiero hablarte..." },
        { time: 22, text: "Pero me quedo en la intensión..." },
        { time: 26, text: "Ayúdame pa' poder darte..." },
        { time: 30, text: "Todo este amor que siento por vos." },
        { time: 34, text: "Amor me sobra para darte..." },
        { time: 38, text: "Y con mucha pasión..." },
        { time: 42, text: "Si conmigo quieres quedarte..." },
        { time: 46, text: "Prometo darte lo mejor..." },
        { time: 50, text: "Para hacerte muy feliz." }
    ];

    let currentLine = 0;
    audioBtn.addEventListener("click", () => {
        audio.play();
        lyricsContainer.classList.add("show");
    });

    audio.addEventListener("timeupdate", () => {
        if (currentLine < lyrics.length && audio.currentTime >= lyrics[currentLine].time) {
            lyricsContainer.classList.remove("animate");
            void lyricsContainer.offsetWidth; 
            lyricsContainer.textContent = lyrics[currentLine].text;
            lyricsContainer.classList.add("animate");
            currentLine++;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // === ELEMENTOS ===
    const loader = document.getElementById("loader");
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

    // === 1. DESACTIVAR LOADER ===
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 1000);
        }, 2000);
    });

    // === 2. ABRIR / CERRAR MODAL ===
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
        currentLine = 0;
        lyricsContainer.textContent = "";
        
        // Resetear animaciones de flores al cerrar
        document.querySelectorAll('.flowers-animated').forEach(s => s.classList.remove('active-animation'));
    });

    // === 3. NAVEGACIÓN SLIDES ===
    function updateSlides() {
        slides.forEach((slide, index) => {
            // Efecto de desplazamiento vertical
            slide.style.transform = `translateY(${100 * (index - currentSlide)}vh) scale(${index === currentSlide ? 1 : 0.95})`;
            
            if (index === currentSlide) {
                slide.classList.add("active-animation");
                
                // DISPARADOR: Contador de días
                if (slide.querySelector("#daysCounter")) {
                    startCounter();
                }

                // DISPARADOR: Flores Amarillas (Si el slide tiene la clase)
                if (slide.classList.contains("flowers-animated")) {
                    console.log("Iniciando jardín..."); // Para debug
                }
            } else {
                slide.classList.remove("active-animation");
            }
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

    // Navegación con Scroll y Teclado
    window.addEventListener("wheel", (e) => {
        if (!modal.classList.contains("active")) return;
        moveSlide(e.deltaY > 0 ? "next" : "prev");
    }, { passive: true });

    window.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "ArrowDown") moveSlide("next");
        if (e.key === "ArrowUp") moveSlide("prev");
    });

    // === 4. SOPORTE TOUCH (Celulares) ===
    modal.addEventListener("touchstart", (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    modal.addEventListener("touchend", (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const swipeThreshold = 50;
        if (touchStartY - touchEndY > swipeThreshold) moveSlide("next");
        else if (touchEndY - touchStartY > swipeThreshold) moveSlide("prev");
    }, { passive: true });

    if(startBtn) startBtn.addEventListener("click", () => moveSlide("next"));

    // === 5. CONTADOR DINÁMICO ===
    function startCounter() {
        // Tu fecha especial: 14 de Octubre 2025
        const startDate = new Date("2025-10-14");
        const today = new Date();
        const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        
        let count = 0;
        daysCounter.textContent = "0";
        
        const interval = setInterval(() => {
            if (count < diffDays) {
                count += Math.ceil(diffDays / 40);
                if (count > diffDays) count = diffDays;
                daysCounter.textContent = count;
            } else {
                clearInterval(interval);
            }
        }, 40);
    }

    // === 6. AUDIO & LETRAS (Basado en tu canción "Otro Año" u otra de ElHanzell) ===
    const lyrics = [
        { time: 2, text: "Ay yo no sé cómo expresarme..." },
        { time: 6, text: "Por eso escribí esta canción..." },
        { time: 10, text: "Pa' demostrar cuánto te amo..." },
        { time: 14, text: "Con el lenguaje del corazón." },
        { time: 18, text: "Ay yo no sé si quiero hablarte..." },
        { time: 22, text: "Pero me quedo en la intención..." },
        { time: 26, text: "Ayúdame pa' poder darte..." },
        { time: 30, text: "Todo este amor que siento por vos." },
        { time: 34, text: "Amor me sobra para darte..." },
        { time: 38, text: "Y con mucha pasión..." },
        { time: 42, text: "Si conmigo quieres quedarte..." },
        { time: 46, text: "Prometo darte lo mejor..." },
        { time: 50, text: "Para hacerte muy feliz." }
    ];

    audioBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            audioBtn.textContent = "⏸ Pausar Música";
            lyricsContainer.classList.add("show");
        } else {
            audio.pause();
            audioBtn.textContent = "▶ Reproducir Música";
        }
    });

    audio.addEventListener("timeupdate", () => {
        let lineToShow = lyrics.find((l, i) => {
            let nextLine = lyrics[i + 1];
            return audio.currentTime >= l.time && (!nextLine || audio.currentTime < nextLine.time);
        });

        if (lineToShow && lyricsContainer.textContent !== lineToShow.text) {
            lyricsContainer.classList.remove("animate");
            void lyricsContainer.offsetWidth; 
            lyricsContainer.textContent = lineToShow.text;
            lyricsContainer.classList.add("animate");
        }
    });

    audio.addEventListener("ended", () => {
        audioBtn.textContent = "▶ Reproducir Música";
    });
});

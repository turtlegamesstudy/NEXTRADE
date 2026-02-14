document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".slide");
    const startBtn = document.getElementById("startExperience");
    const audioBtn = document.getElementById("playAudio");
    const audio = document.getElementById("audio");
    const daysCounter = document.getElementById("daysCounter");

    let currentSlide = 0;
    let isAnimating = false;

    /* =========================
       POSICIONAR SLIDES
    ========================== */
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateY(${100 * (index - currentSlide)}vh)`;
        });
    }

    updateSlides();

    /* =========================
       NAVEGACIÓN
    ========================== */
    function nextSlide() {
        if (currentSlide < slides.length - 1 && !isAnimating) {
            currentSlide++;
            animate();
        }
    }

    function prevSlide() {
        if (currentSlide > 0 && !isAnimating) {
            currentSlide--;
            animate();
        }
    }

    function animate() {
        isAnimating = true;
        updateSlides();
        setTimeout(() => {
            isAnimating = false;
        }, 900);
    }

    /* Scroll controlado */
    window.addEventListener("wheel", (e) => {
        if (isAnimating) return;

        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    });

    /* Teclado */
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") nextSlide();
        if (e.key === "ArrowUp") prevSlide();
    });

    /* =========================
       BOTÓN COMENZAR
    ========================== */
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            nextSlide();
        });
    }

    /* =========================
       CONTADOR REAL
    ========================== */

    if (daysCounter) {

        // CAMBIA ESTA FECHA
        const startDate = new Date("2025-01-01");
        const today = new Date();

        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let count = 0;

        const counterAnimation = setInterval(() => {
            count += Math.ceil(diffDays / 60);

            if (count >= diffDays) {
                count = diffDays;
                clearInterval(counterAnimation);
            }

            daysCounter.textContent = count;
        }, 30);
    }

    /* =========================
       AUDIO FADE IN
    ========================== */

    if (audioBtn && audio) {

        audioBtn.addEventListener("click", () => {
            audio.volume = 0;
            audio.play();

            let fade = setInterval(() => {
                if (audio.volume < 0.9) {
                    audio.volume += 0.05;
                } else {
                    clearInterval(fade);
                }
            }, 200);
        });

    }

});


const audio = document.getElementById("audio");
const playBtn = document.getElementById("playAudio");
const lyricsContainer = document.getElementById("lyrics");

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
    { time: 50, text: "Para hacerte muy feliz." },
    { time: 58, text: "Ay yo no sé quiero besarte..." },
    { time: 62, text: "Pero me quedo en la intensión..." },
    { time: 66, text: "Ayúdame pa' poder darte..." },
    { time: 70, text: "Todo este amor que siento por vos." },
    { time: 74, text: "Amor me sobra para darte..." },
    { time: 78, text: "Y con mucha pasión..." },
    { time: 82, text: "Si conmigo quieres quedarte..." },
    { time: 86, text: "Prometo darte lo mejor..." },
    { time: 90, text: "Para hacerte muy feliz." },
    { time: 104, text: "Amor me sobra para darte..." },
    { time: 108, text: "Y con mucha pasión..." },
    { time: 112, text: "Si conmigo quieres quedarte..." },
    { time: 116, text: "Prometo darte lo mejor..." },
    { time: 120, text: "Para hacerte muy feliz." },
    { time: 128, text: "Para hacerte muy feliz..." },
    { time: 136, text: "Para hacerte muy feliz." }
];

let currentLine = 0;

playBtn.addEventListener("click", () => {
    audio.play();
    lyricsContainer.classList.add("show");
});

audio.addEventListener("timeupdate", () => {
    if (
        currentLine < lyrics.length &&
        audio.currentTime >= lyrics[currentLine].time
    ) {
        lyricsContainer.classList.remove("animate");
        void lyricsContainer.offsetWidth; // reinicia animación
        lyricsContainer.textContent = lyrics[currentLine].text;
        lyricsContainer.classList.add("animate");
        currentLine++;
    }
});


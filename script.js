document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FONDO DE PARTÍCULAS / CONSTELACIONES ---
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random();
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = window.innerWidth < 600 ? 55 : 100;
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        // dibuja líneas entre partículas cercanas: efecto constelación
        function dibujarConstelaciones() {
            const maxDist = window.innerWidth < 600 ? 90 : 130;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.strokeStyle = `rgba(226, 185, 115, ${0.15 * (1 - dist / maxDist)})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            dibujarConstelaciones();
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
        resize();
        initParticles();
        animateParticles();
    }

    // --- 2. REVELACIÓN ESCALONADA DE TARJETAS ---
    const cards = document.querySelectorAll('.gift-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('reveal');
        }, 300 * (index + 1));
    });

    // --- 3. MANEJO DE MODALES ---
    const closeBtns = document.querySelectorAll('.close-modal');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');

                if (targetId === 'modalCarta') iniciarCarta();
                if (targetId === 'modalFlores') iniciarFlores();
                if (targetId === 'modalHistoria') setTimeout(animarContador, 1000);
                if (targetId === 'modalBesos') iniciarBesos();
                if (targetId === 'modalCartas') construirGridCartas();
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            modal.classList.remove('active');

            detenerCarta();
            detenerFlores();
            detenerBesos();
            reiniciarVistaCartas();

            const audio = document.getElementById('audio');
            if (audio && !audio.paused) {
                audio.pause();
                const btnAudio = document.getElementById('playAudio');
                if (btnAudio) btnAudio.innerText = "▶ Reproducir";
            }
        });
    });

    // --- 4. EFECTO TYPEWRITER (CARTA) ---
    const textoCarta = "Quería escribirte esto porque hay cosas que es mejor dejarlas plasmadas. Desde que coincidimos, has traído una luz muy especial a mis días. Me encanta tu vibra, tu forma de ser y cada momento que compartimos. Esto es solo un pequeño detalle para recordarte lo mucho que me importas. ❤️";
    const cartaElement = document.getElementById('typewriter-text');
    let typeWriterTimeout;
    let indexCarta = 0;

    function iniciarCarta() {
        if (!cartaElement) return;
        cartaElement.innerHTML = '<span class="cursor"></span>';
        indexCarta = 0;
        escribirLetra();
    }

    function escribirLetra() {
        if (indexCarta < textoCarta.length) {
            cartaElement.innerHTML = textoCarta.substring(0, indexCarta + 1) + '<span class="cursor"></span>';
            indexCarta++;
            let velocidad = Math.floor(Math.random() * (80 - 30 + 1)) + 30;
            typeWriterTimeout = setTimeout(escribirLetra, velocidad);
        } else {
            setTimeout(() => {
                const cursor = document.querySelector('#typewriter-text .cursor');
                if (cursor) cursor.style.display = 'none';
            }, 3000);
        }
    }

    function detenerCarta() {
        clearTimeout(typeWriterTimeout);
    }

    // --- 5. ANIMACIÓN FLORES AMARILLAS ---
    const petalsContainer = document.getElementById('petals-container');
    const phraseElement = document.querySelector('.flower-message p');
    let petalInterval;
    let phraseInterval;

    const frasesFlores = [
        "Porque te mereces todo lo bonito de este mundo... 🌻",
        "Eres mi momento favorito del día.",
        "Un detalle amarillo para la niña más linda. ✨",
        "Tu sonrisa ilumina más que cualquier girasol.",
        "Quiero que te quedes en mi vida por mucho tiempo. ❤️",
        "Eres luz, eres paz, eres música.",
        "Contigo todo se siente más suave.",
        "Para mi niña, hoy y siempre. 🌼"
    ];

    function iniciarFlores() {
        petalInterval = setInterval(crearElementoMagico, 250);
        cambiarFrase();
        phraseInterval = setInterval(cambiarFrase, 4000);
    }

    function detenerFlores() {
        clearInterval(petalInterval);
        clearInterval(phraseInterval);
        if (petalsContainer) petalsContainer.innerHTML = '';
    }

    function cambiarFrase() {
        const p = document.getElementById('dynamic-phrase') || phraseElement;
        if (!p) return;

        p.style.opacity = 0;

        setTimeout(() => {
            const index = Math.floor(Math.random() * frasesFlores.length);
            p.innerText = frasesFlores[index];
            p.style.opacity = 1;
        }, 800);
    }

    function crearElementoMagico() {
        if (!petalsContainer) return;

        const element = document.createElement('div');
        const isSparkle = Math.random() > 0.7;

        if (isSparkle) {
            element.classList.add('sparkle');
            const size = Math.random() * 5 + 2;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
        } else {
            element.classList.add('petal');
            const size = Math.random() * 15 + 10;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
        }

        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 4;

        element.style.left = `${left}vw`;
        element.style.top = `-20px`;
        element.style.animationDuration = `${duration}s`;

        petalsContainer.appendChild(element);

        setTimeout(() => {
            element.remove();
        }, duration * 1000);
    }

    // --- 6. CONTADOR DE DÍAS ANIMADO ---
    const targetDays = 158; // Cambia este valor por los días reales
    const counterElement = document.getElementById('daysCounter');
    let hasCounted = false;

    function animarContador() {
        if (hasCounted || !counterElement) return;
        hasCounted = true;

        let count = 0;
        const duration = 2000;
        const intervalTime = Math.max(duration / targetDays, 10);

        const counter = setInterval(() => {
            count++;
            counterElement.innerText = count;
            if (count >= targetDays) clearInterval(counter);
        }, intervalTime);
    }

    // --- 7. AUDIO FINAL ---
    const btnAudio = document.getElementById('playAudio');
    const audioElement = document.getElementById('audio');

    if (btnAudio && audioElement) {
        btnAudio.addEventListener('click', () => {
            if (audioElement.paused) {
                audioElement.play();
                btnAudio.innerText = "⏸ Pausar";
            } else {
                audioElement.pause();
                btnAudio.innerText = "▶ Reproducir";
            }
        });
    }

    // --- 8. SECCIÓN DE BESOS ---
    const kissesContainer = document.getElementById('kissesContainer');
    const kissBtn = document.getElementById('kissBtn');
    const kissCountEl = document.getElementById('kissCount');
    let kissFloatInterval;
    let kissCount = parseInt(localStorage.getItem('kissCount') || '0', 10);
    if (kissCountEl) kissCountEl.innerText = kissCount;

    function iniciarBesos() {
        detenerBesos();
        kissFloatInterval = setInterval(crearBesoFlotante, 500);
    }

    function detenerBesos() {
        clearInterval(kissFloatInterval);
        if (kissesContainer) kissesContainer.innerHTML = '';
    }

    function crearBesoFlotante() {
        if (!kissesContainer) return;
        const kiss = document.createElement('div');
        kiss.classList.add('kiss-float');
        const emojis = ['💋', '❤️', '💗', '✨'];
        kiss.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 5;
        const size = Math.random() * 1 + 1;
        kiss.style.left = `${left}vw`;
        kiss.style.fontSize = `${size}rem`;
        kiss.style.animationDuration = `${duration}s`;
        kissesContainer.appendChild(kiss);
        setTimeout(() => kiss.remove(), duration * 1000);
    }

    if (kissBtn) {
        kissBtn.addEventListener('click', (e) => {
            kissCount++;
            localStorage.setItem('kissCount', kissCount);
            if (kissCountEl) kissCountEl.innerText = kissCount;

            const rect = kissBtn.getBoundingClientRect();
            const originX = rect.left + rect.width / 2;
            const originY = rect.top + rect.height / 2;

            for (let i = 0; i < 12; i++) {
                const burst = document.createElement('div');
                burst.classList.add('kiss-burst');
                burst.innerText = '💋';
                const angle = (Math.PI * 2 * i) / 12;
                const distance = 80 + Math.random() * 40;
                burst.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                burst.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                burst.style.left = `${originX}px`;
                burst.style.top = `${originY}px`;
                document.body.appendChild(burst);
                setTimeout(() => burst.remove(), 900);
            }
        });
    }

    // --- 9. SECCIÓN 100 CARTAS ---
    // Cada carta va aquí como un objeto { numero, titulo, texto }.
    // La #1 ya está escrita como ejemplo. Para las tuyas, COPIA el bloque
    // comentado de abajo, pégalo antes del cierre "]" de este arreglo,
    // cambia el número (2, 3, 4...), el título y el texto, y listo:
    //
    // {
    //     numero: 2,
    //     titulo: "Escribe aquí el título de tu carta",
    //     texto: "Escribe aquí el contenido completo de tu carta..."
    // },
    const cartas = [
        {
            numero: 1,
            titulo: "La primera vez que te vi sonreír",
            texto: "Esta es la carta de ejemplo — reemplaza este texto por el tuyo. Quiero que cada una de estas cien cartas sea un motivo distinto por el que te quiero: puede ser un recuerdo, una razón, una promesa o simplemente algo que nunca te he dicho. Empieza por lo que sientas más cerca del corazón y ve completando el resto poco a poco. 💌"
        }
    ];

    // Genera automáticamente las cartas 2 a 100 con un texto provisional
    // para las que aún no has escrito. En cuanto agregues una carta real
    // arriba con ese mismo número, esta versión provisional se reemplaza sola.
    for (let i = 1; i <= 100; i++) {
        if (!cartas.find(c => c.numero === i)) {
            cartas.push({
                numero: i,
                titulo: `Carta #${i}`,
                texto: "Esta carta todavía no ha sido escrita... pero ya la tengo pensada para ti. 💌"
            });
        }
    }
    cartas.sort((a, b) => a.numero - b.numero);

    const cartasGrid = document.getElementById('cartasGrid');
    const cartaReader = document.getElementById('cartaReader');
    const cartaReaderTitulo = document.getElementById('cartaReaderTitulo');
    const cartaReaderTexto = document.getElementById('cartaReaderTexto');
    const btnVolverCartas = document.getElementById('btnVolverCartas');
    let cartaTypeTimeout;

    function construirGridCartas() {
        if (!cartasGrid || cartasGrid.childElementCount > 0) return;
        cartas.forEach(carta => {
            const envelope = document.createElement('button');
            envelope.classList.add('envelope-btn');
            envelope.innerText = carta.numero;
            envelope.addEventListener('click', () => abrirCarta(carta));
            cartasGrid.appendChild(envelope);
        });
    }

    function abrirCarta(carta) {
        if (!cartaReader || !cartasGrid) return;
        cartasGrid.classList.add('hidden');
        cartaReader.classList.add('active');
        cartaReaderTitulo.innerText = `Carta #${carta.numero}: ${carta.titulo}`;
        cartaReaderTexto.innerHTML = '<span class="cursor"></span>';

        clearTimeout(cartaTypeTimeout);
        let idx = 0;
        function escribir() {
            if (idx < carta.texto.length) {
                cartaReaderTexto.innerHTML = carta.texto.substring(0, idx + 1) + '<span class="cursor"></span>';
                idx++;
                cartaTypeTimeout = setTimeout(escribir, 15);
            }
        }
        escribir();
    }

    function reiniciarVistaCartas() {
        clearTimeout(cartaTypeTimeout);
        if (cartaReader) cartaReader.classList.remove('active');
        if (cartasGrid) cartasGrid.classList.remove('hidden');
    }

    if (btnVolverCartas) {
        btnVolverCartas.addEventListener('click', reiniciarVistaCartas);
    }
});

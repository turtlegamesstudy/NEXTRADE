document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FONDO DE PARTÍCULAS (ESTRELLAS) ---
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
            for (let i = 0; i < 100; i++) particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        animateParticles();
    }

    // --- 2. REVELACIÓN ESCALONADA DE TARJETAS ---
    const cards = document.querySelectorAll('.gift-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('reveal');
        }, 300 * (index + 1)); // Aparecen una tras otra
    });

    // --- 3. MANEJO DE MODALES ---
    const closeBtns = document.querySelectorAll('.close-modal');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');
                
                // Disparar acciones específicas según el modal
                if (targetId === 'modalCarta') iniciarCarta();
                if (targetId === 'modalFlores') iniciarFlores();
                if (targetId === 'modalHistoria') setTimeout(animarContador, 1000);
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            modal.classList.remove('active');
            
            // Detener procesos al cerrar
            detenerCarta();
            detenerFlores();
        });
    });

    // --- 4. EFECTO TYPEWRITER (CARTA) ---
    const textoCarta = "Quería escribirte esto porque hay cosas que es mejor dejarlas plasmadas. Desde que coincidimos, has traído una luz muy especial a mis días. Me encanta tu vibra, tu forma de ser y cada momento que compartimos. Esto es solo un pequeño detalle para recordarte lo mucho que me importas. ❤️";
    const cartaElement = document.getElementById('typewriter-text');
    let typeWriterTimeout;
    let indexCarta = 0;

    function iniciarCarta() {
        if(!cartaElement) return;
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
                const cursor = document.querySelector('.cursor');
                if(cursor) cursor.style.display = 'none';
            }, 3000);
        }
    }

    function detenerCarta() {
        clearTimeout(typeWriterTimeout);
    }

    // --- 5. ANIMACIÓN FLORES AMARILLAS ---
    const petalsContainer = document.getElementById('petals-container');
    let petalInterval;

    function iniciarFlores() {
        if(!petalsContainer) return;
        petalInterval = setInterval(crearPetalo, 300);
    }

    function detenerFlores() {
        clearInterval(petalInterval);
        if(petalsContainer) petalsContainer.innerHTML = '';
    }

    function crearPetalo() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 4;
        
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}vw`;
        petal.style.animationDuration = `${duration}s`;
        
        petalsContainer.appendChild(petal);
        setTimeout(() => petal.remove(), duration * 1000);
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
});

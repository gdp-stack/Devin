import './FlameEffect.css';
export const createFlameEffect = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'flameCanvas';
    canvas.width = 400; // Ajustez selon la taille souhaitée
    canvas.height = 400; // Ajustez selon la taille souhaitée
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const particles = [];

    function createParticle() {
        const size = Math.random() * 10 + 5; // Taille entre 2 et 7
        particles.push({
            x: canvas.width / 2,
            y: canvas.height,
            size: size,
            speedX: Math.random() - 0.5,
            speedY: Math.random() * -3 - 1,
            color: `hsl(${Math.random() * 20 + 20}, 100%, 50%)`, // Couleur
        });
    }

    function drawParticle(particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    }

    function updateAndDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (particles.length < 600) { // Limite pour la densité
            createParticle();
        }

        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.size *= 0.95; // Les particules rétrécissent

            if (particle.size < 0.5) {
                particles.splice(index, 1); // Supprimer les petites particules
            } else {
                drawParticle(particle);
            }
        });

        requestAnimationFrame(updateAndDraw);
    }

    updateAndDraw();

    // Optionnel: Nettoyer le canvas après un certain temps
    setTimeout(() => {
        canvas.remove();
    }, 3500); // Ajustez ce temps selon les besoins
};

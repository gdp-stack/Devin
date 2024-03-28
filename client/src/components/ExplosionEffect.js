import './ExplosionEffect.css';

export const createExplosionEffect = (type) => {
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'explosion-container';
    document.body.appendChild(explosionContainer);

    let colors;
    let particleCount;

    switch (type) {
        case 'confirmé':
            colors = ['#FFD700', '#FFA500']; // Or et orange pour confirmé
            particleCount = 50; // Nombre de particules pour confirmé
            break;
        case 'expert':
            colors = ['#00FF00', '#0000FF']; // Vert et bleu pour expert
            particleCount = 100; // Nombre de particules pour expert
            break;
        case 'maître':
            colors = ['#FF69B4', '#8A2BE2']; // Rose et violet pour maître
            particleCount = 1200; // Nombre de particules pour maître
            break;
        default:
            colors = ['#FFFFFF']; // Blanc comme couleur par défaut
            particleCount = 50; // Nombre de particules par défaut
    }

    const sizes = [5, 3, 2]; // Tailles des particules

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        particle.style.backgroundColor = color;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        explosionContainer.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const speed = (Math.random() * 5 + 5) * 20;

        const moveX = Math.cos(angle) * speed;
        const moveY = Math.sin(angle) * speed;

        setTimeout(() => {
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            particle.style.opacity = 0;
        }, 0);
    }

    setTimeout(() => {
        explosionContainer.remove();
    }, 3000);
};
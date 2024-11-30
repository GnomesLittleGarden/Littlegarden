document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.fireflies');
    
    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        
        // Randomize size
        const size = Math.random() * 10 + 5; // Size between 5px and 15px
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        
        // Randomize position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        firefly.style.top = `${posY}vh`;
        firefly.style.left = `${posX}vw`;

        // Append firefly to container
        container.appendChild(firefly);
    }
    
    // Create a number of fireflies
    for (let i = 0; i < 50; i++) {
        createFirefly();
    }
});

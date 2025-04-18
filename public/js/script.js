// JavaScript para la página de inicio de Synapsai

document.addEventListener('DOMContentLoaded', function() {
    // Animación de texto escribiéndose letra por letra
    const welcomeText = document.getElementById('typing-text');
    if (welcomeText) {
        const text = welcomeText.textContent;
        welcomeText.textContent = '';
        welcomeText.style.opacity = '1';
        
        let i = 0;
        const typingSpeed = 50; // Velocidad de escritura en milisegundos
        
        function typeWriter() {
            if (i < text.length) {
                welcomeText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        
        setTimeout(() => {
            typeWriter();
        }, 300);
    }
    
    // Efectos para botones de acción
    const actionButtons = document.querySelectorAll('.action-button');
    
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efecto sutil para las imágenes de características
    const featureImages = document.querySelectorAll('.feature img');
    
    featureImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
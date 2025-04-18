// Script para la página name.html

document.addEventListener('DOMContentLoaded', function() {
    // Animación de texto escribiéndose
    const typingQuestion = document.getElementById('typing-question');
    const textToType = typingQuestion.textContent;
    typingQuestion.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < textToType.length) {
            typingQuestion.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 70);
        }
    }
    
    setTimeout(() => {
        typeWriter();
    }, 300);
    
    // Manejar el envío del nombre
    const nameSubmit = document.getElementById('name-submit');
    const userNameInput = document.getElementById('user-name');
    
    nameSubmit.addEventListener('click', submitName);
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitName();
        }
    });
    
    function submitName() {
        const userName = userNameInput.value.trim();
        if (userName !== '') {
            // Guardar el nombre en localStorage para usarlo en chat.html
            localStorage.setItem('synapsaiUserName', userName);
            // Redirigir a la página de chat
            window.location.href = 'chat.html';
        } else {
            userNameInput.placeholder = "Please enter your name...";
            userNameInput.classList.add('error');
            setTimeout(() => {
                userNameInput.classList.remove('error');
            }, 1000);
        }
    }
});
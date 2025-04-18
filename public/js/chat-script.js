document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre del usuario del almacenamiento local
    const userName = localStorage.getItem('synapsaiUserName') || 'Friend';
    
    // Actualizar el mensaje de bienvenida con el nombre del usuario
    const welcomeMessage = document.getElementById('welcome-message');
    const welcomeText = `¿How its your Day ${userName}?`;
    welcomeMessage.textContent = '';
    
    // Animación de escritura para el mensaje de bienvenida
    let i = 0;
    function typeWelcome() {
        if (i < welcomeText.length) {
            welcomeMessage.textContent += welcomeText.charAt(i);
            i++;
            setTimeout(typeWelcome, 70);
        }
    }
    
    setTimeout(() => {
        typeWelcome();
    }, 300);
    
    // Referencias a elementos del DOM
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message');
    const newChatButton = document.getElementById('new-chat');
    const chatHistory = document.querySelector('.chat-history');
    
    // IMPORTANTE: En una aplicación de producción, esto debería estar en un backend seguro
    // Tu API key de OpenRouter.ai
    const apiKey = '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';
    
    // URL base para OpenRouter.ai
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    // Sistema para manejar múltiples chats
    let chats = loadChatsFromStorage();
    let currentChatId = localStorage.getItem('currentChatId');
    
    // Si no hay chats o chat actual, crear uno nuevo
    if (Object.keys(chats).length === 0 || !currentChatId || !chats[currentChatId]) {
        createNewChat();
    } else {
        // Cargar el chat actual
        loadChat(currentChatId);
    }
    
    // Actualizar la visualización del historial de chats
    updateChatHistoryDisplay();

    // Manejar el envío de mensajes
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Función para enviar un mensaje
    async function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            // Añadir mensaje del usuario
            addMessage(messageText, 'user');
            messageInput.value = '';
            
            // Es el primer mensaje? Actualizar título del chat si es necesario
            if (chats[currentChatId].messages.length === 1) {
                // El único mensaje es el de sistema, este sería el primer mensaje del usuario
                const chatTitle = truncateTitle(messageText, 30);
                
                // Animar el cambio de título
                const chatItem = document.querySelector(`.history-item[data-chat-id="${currentChatId}"]`);
                if (chatItem) {
                    animateTypeTitle(chatItem, chatTitle);
                }
                
                // Actualizar el título en el objeto de chats
                chats[currentChatId].title = chatTitle;
            }
            
            // Añadir el mensaje del usuario al historial
            chats[currentChatId].messages.push({
                role: "user",
                content: messageText
            });
            
            // Guardar el estado actual de los chats
            saveChatsToStorage();
            
            // Mostrar indicador de escritura
            showTypingIndicator();
            
            try {
                // Llamar a la API de OpenRouter.ai
                const response = await fetchAIResponse(chats[currentChatId].messages);
                
                // Eliminar indicador de escritura
                removeTypingIndicator();
                
                // Añadir la respuesta de la IA al chat
                const aiResponseText = response.choices[0].message.content;
                addMessage(aiResponseText, 'ai');
                
                // Añadir respuesta de la IA al historial
                chats[currentChatId].messages.push({
                    role: "assistant",
                    content: aiResponseText
                });
                
                // Limitar el historial para no exceder los límites de tokens
                if (chats[currentChatId].messages.length > 10) {
                    // Mantener el mensaje del sistema y los últimos mensajes
                    chats[currentChatId].messages = [
                        chats[currentChatId].messages[0],
                        ...chats[currentChatId].messages.slice(-9)
                    ];
                }
                
                // Guardar el estado actualizado
                saveChatsToStorage();
            } catch (error) {
                console.error("Error al obtener respuesta de la IA:", error);
                removeTypingIndicator();
                addMessage("Lo siento, parece que hay un problema de conexión. Por favor, inténtalo de nuevo más tarde.", 'ai');
            }
        }
    }
    
    // Función para crear un nuevo chat
    function createNewChat() {
        // Generar un ID único para el chat
        const chatId = 'chat_' + Date.now();
        
        // Crear un nuevo objeto de chat
        chats[chatId] = {
            id: chatId,
            title: "Chat...",
            createdAt: new Date().toISOString(),
            messages: [
                {
                    role: "system",
                    content: `Eres Synapsai, un asistente de IA amigable y útil creado para ayudar a las personas. 
                             Estás hablando con ${userName}. Tu objetivo es ser útil, informativo y amigable.
                             Mantén tus respuestas breves, conversacionales y personalizadas.
                             Puedes hablar sobre programación, mascotas, viajes, películas, música, deportes, y muchos otros temas.
                             Si no sabes algo, indícalo honestamente en lugar de inventar información.`
                }
            ]
        };
        
        // Establecer este como el chat actual
        currentChatId = chatId;
        localStorage.setItem('currentChatId', chatId);
        
        // Limpiar los mensajes actuales
        chatMessages.innerHTML = '';
        
        // Guardar y actualizar la interfaz
        saveChatsToStorage();
        updateChatHistoryDisplay();
    }
    
    // Función para cargar un chat específico
    function loadChat(chatId) {
        if (chats[chatId]) {
            // Actualizar el chat actual
            currentChatId = chatId;
            localStorage.setItem('currentChatId', chatId);
            
            // Limpiar mensajes actuales
            chatMessages.innerHTML = '';
            
            // Cargar mensajes del chat
            const chatToLoad = chats[chatId];
            
            // Solo mostrar mensajes de usuario y asistente, no del sistema
            for (let i = 1; i < chatToLoad.messages.length; i++) {
                const message = chatToLoad.messages[i];
                if (message.role === 'user' || message.role === 'assistant') {
                    addMessage(message.content, message.role === 'user' ? 'user' : 'ai');
                }
            }
            
            // Actualizar la interfaz para resaltar el chat actual
            highlightCurrentChat();
        }
    }
    
    // Cargar chats desde localStorage
    function loadChatsFromStorage() {
        const savedChats = localStorage.getItem('synapsaiChats');
        return savedChats ? JSON.parse(savedChats) : {};
    }
    
    // Guardar chats en localStorage
    function saveChatsToStorage() {
        localStorage.setItem('synapsaiChats', JSON.stringify(chats));
    }
    
    // Actualizar la visualización del historial de chats
    function updateChatHistoryDisplay() {
        // Limpiar el historial actual
        chatHistory.innerHTML = '';
        
        // Ordenar los chats por fecha de creación (más reciente primero)
        const sortedChatIds = Object.keys(chats).sort((a, b) => {
            return new Date(chats[b].createdAt) - new Date(chats[a].createdAt);
        });
        
        // Añadir cada chat al historial
        sortedChatIds.forEach(chatId => {
            const chat = chats[chatId];
            const chatItem = document.createElement('div');
            chatItem.classList.add('history-item');
            chatItem.dataset.chatId = chatId;
            chatItem.textContent = chat.title;
            
            // Resaltar el chat actual
            if (chatId === currentChatId) {
                chatItem.classList.add('active');
            }
            
            // Añadir evento de clic para cargar el chat
            chatItem.addEventListener('click', () => {
                loadChat(chatId);
            });
            
            chatHistory.appendChild(chatItem);
        });
    }
    
    // Función para resaltar el chat actual en la interfaz
    function highlightCurrentChat() {
        // Eliminar la clase active de todos los elementos de historial
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Añadir la clase active al chat actual
        const currentChatElement = document.querySelector(`.history-item[data-chat-id="${currentChatId}"]`);
        if (currentChatElement) {
            currentChatElement.classList.add('active');
        }
    }
    
    // Función para truncar títulos largos
    function truncateTitle(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }
    
    // Función para animar el cambio de título
    function animateTypeTitle(element, newTitle) {
        const currentTitle = element.textContent;
        let i = currentTitle.length;
        
        // Primero, borrar el título actual
        const eraseInterval = setInterval(() => {
            if (i > 0) {
                element.textContent = currentTitle.substring(0, i - 1);
                i--;
            } else {
                clearInterval(eraseInterval);
                
                // Luego, escribir el nuevo título
                let j = 0;
                const typeInterval = setInterval(() => {
                    if (j <= newTitle.length) {
                        element.textContent = newTitle.substring(0, j);
                        j++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 50);
            }
        }, 30);
    }
    
    // Función para obtener respuesta de la API
    async function fetchAIResponse(messages) {
        const requestBody = {
            model: "deepseek/deepseek-chat", // Modelo de DeepSeek a través de OpenRouter
            messages: messages,
            temperature: 0.7,          // Controla la creatividad (0.0-1.0)
            max_tokens: 800,           // Tamaño máximo de respuesta
            top_p: 0.9,                // Muestreo diverso
            frequency_penalty: 0.0,    // Penalización por repetición
            presence_penalty: 0.0      // Penalización por mencionar temas ya presentes
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin, // Requerido por OpenRouter
                'X-Title': 'Synapsai Chat'             // Nombre de tu aplicación
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Error API:", errorData);
            throw new Error('Error en la solicitud a la API: ' + response.statusText);
        }
        
        return await response.json();
    }
    
    // Función para añadir un mensaje al chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        
        // Convertir URLs en enlaces clicables
        const linkedText = text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        messageElement.innerHTML = linkedText;
        chatMessages.appendChild(messageElement);
        
        // Desplazar hacia abajo para mostrar el mensaje más reciente
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Mostrar indicador de escritura
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'ai-message', 'typing-indicator-container');
        typingElement.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        typingElement.id = 'typing-indicator';
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Eliminar indicador de escritura
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Manejar el botón de nuevo chat
    newChatButton.addEventListener('click', function() {
        createNewChat();
    });
    
    // Sistema de manejo de errores mejorado
    window.addEventListener('error', function(event) {
        console.error('Error capturado:', event.error);
        removeTypingIndicator();
        if (!chatMessages.querySelector('.error-message')) {
            const errorMsg = "Ha ocurrido un error en la aplicación. Por favor, recarga la página.";
            addMessage(errorMsg, 'ai');
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const languageButton = document.getElementById('language-button');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    languageButton.addEventListener('click', function () {
        languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', function () {
            const selectedLang = this.getAttribute('data-lang');
            languageButton.textContent = this.textContent;
            languageDropdown.style.display = 'none';
            changeLanguage(selectedLang);
        });
    });

    window.addEventListener('click', function (event) {
        if (!event.target.matches('#language-button')) {
            languageDropdown.style.display = 'none';
        }
    });

    function changeLanguage(lang) {
        // Aquí puedes implementar la lógica para cambiar el idioma de toda la página
        // Por ejemplo, puedes redirigir al usuario a una versión de la página en el idioma seleccionado
        // o cambiar dinámicamente el contenido de la página.
        console.log('Idioma seleccionado:', lang);
        // Ejemplo de redirección (descomenta la línea siguiente si deseas usar redirección)
        // window.location.href = `/${lang}/index.html`;
    }
});

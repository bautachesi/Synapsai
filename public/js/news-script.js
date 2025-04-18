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
            if (languageDropdown) {
                languageDropdown.style.display = 'none';
            }
        }
    });

    function changeLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
});

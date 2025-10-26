function initPhoneMenu() {
    console.log('Initializing phone menu...');
    const menuButton = document.querySelector('.phone-menu__button');
    const menuNav = document.querySelector('.phone-menu__nav');

    if (!menuButton || !menuNav) {
        console.log('Menu elements not found');
        return;
    }

    console.log('Menu elements found, adding listeners...');

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menuButton.classList.toggle('active');
        menuNav.classList.toggle('active');
        console.log('Menu button clicked, active:', menuButton.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        const isClickInside = menuNav.contains(event.target) || menuButton.contains(event.target);
        if (!isClickInside && menuNav.classList.contains('active')) {
            menuButton.classList.remove('active');
            menuNav.classList.remove('active');
            console.log('Closing menu by outside click');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneMenu);
} else {
    initPhoneMenu();
}

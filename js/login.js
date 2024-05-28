function togglePassword() {
    let passwordInput = document.getElementById('password');
    let passwordToggleIcon = document.querySelector('.password-toggle-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggleIcon.src = './assets/img/password-visible.png';
    } else {
        passwordInput.type = 'password';
        passwordToggleIcon.src = './assets/img/password-hide.png';
    }
}
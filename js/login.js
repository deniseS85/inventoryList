function showForm(formId) {
    clearFormInputs();
    var forms = document.querySelectorAll('.auth-container form');
    forms.forEach(function(form) {
        form.style.display = 'none';
    });
    document.getElementById(formId).style.display = 'flex';
}

function clearFormInputs() {
    let inputs = document.querySelectorAll('.auth-container input');
    inputs.forEach(function(input) {
        input.value = '';
    });

    let passwordToggleIcons = document.querySelectorAll('.auth-container .password-toggle-icon');
    passwordToggleIcons.forEach(function(icon) {
        icon.src = './assets/img/password-hide.png';
    });
}

function togglePassword(inputID) {
    let passwordInput = document.getElementById(inputID);
    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';

    let passwordToggleIcon = passwordInput.nextElementSibling;
    passwordToggleIcon.src = (passwordInput.type === 'password') ? './assets/img/password-hide.png' : './assets/img/password-visible.png';
}
function showForm(formId) {
    clearFormInputs();
    resetInfoNotUser(formId);
    let forms = document.querySelectorAll('.auth-container form');
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

function resetInfoNotUser(formId) {
    document.getElementById('infoNotUser').style.display = 'none';
    if (formId == 'signupForm') {
        window.history.replaceState({}, document.title, window.location.pathname); 
    }
}

function togglePassword(inputID) {
    let passwordInput = document.getElementById(inputID);
    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';

    let passwordToggleIcon = passwordInput.nextElementSibling;
    passwordToggleIcon.src = (passwordInput.type === 'password') ? './assets/img/password-hide.png' : './assets/img/password-visible.png';
}



function validateLoginForm() {    
    let email = document.getElementById('email').value;
    let password = document.getElementById('passwordLogin').value;
    let emailError = document.getElementById('emailError');
    let passwordError = document.getElementById('passwordError');

    if (email.trim() === "") {
        showError(emailError, "E-Mail ist erforderlich"); 
        return false;
    } else if (!isValidEmail(email)) {
        showError(emailError, "Ungültige E-Mail-Adresse");
        return false;
    }

    if (password.trim() === "") {
        showError(passwordError, "Passwort ist erforderlich");
        return false;
    } 
    return true;
}

function showError(element, message) {
    element.innerHTML = message;
}

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const registered = urlParams.get('registered');

    if (registered === "false") {
        document.getElementById('infoNotUser').style.display = 'flex';
    }
});

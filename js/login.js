function showForm(formId, popupID) {
    if (formId) {
        clearFormInputs();
        hideInfoMessage(formId, popupID);
        let forms = document.querySelectorAll('.auth-container form');
        forms.forEach(function(form) {
            form.style.opacity = '0';
            form.style.display = 'none';
        });
        let currentForm = document.getElementById(formId);
        if (currentForm) {
            currentForm.style.display = 'flex';
            setTimeout(function() {
                currentForm.style.opacity = '1';
            }, 30);
            localStorage.setItem('currentForm', formId);
        }
    }
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

function hideInfoMessage(formId, popupID) {
    let popupElement = document.getElementById(popupID);

    if (popupElement) {
        popupElement.style.opacity = '0';
        setTimeout(function() {
            popupElement.style.display = 'none';
        }, 300); // Delayed hiding after animation
    }
    if (formId) {
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
        showPopup('infoNotUser');
    } else if (registered === "already") {
        showPopup('infoAlreadyUser');
        showForm('signupForm');
    } else {
        const currentForm = localStorage.getItem('currentForm');
        if (currentForm) {
            showForm(currentForm);
        }
    }

    if (registered === "success") {
        showPopup('registrationSuccess');
        setTimeout(function() {
            hidePopup('registrationSuccess');
            showForm('loginForm');
        }, 3000);
    }
});

function showPopup(popupID) {
    let popupElement = document.getElementById(popupID);
    if (popupElement) {
        popupElement.style.display = 'flex';
        setTimeout(function() {
            popupElement.style.opacity = '1';
        }, 50);
    }
}

function hidePopup(popupID) {
    let popupElement = document.getElementById(popupID);
    if (popupElement) {
        popupElement.style.opacity = '0';
        setTimeout(function() {
            popupElement.style.display = 'none';
        }, 300);
    }
}

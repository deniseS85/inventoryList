function showForm(formId, popupID) {
    if (formId) {
        clearFormInputs();
        hideInfoMessage(formId, popupID);
        let forms = document.querySelectorAll('.auth-container form');
        forms.forEach(form => {
            form.style.opacity = '0';
            form.style.display = 'none';
        });
        let currentForm = document.getElementById(formId);
        if (currentForm) {
            currentForm.style.display = 'flex';
            setTimeout(() => {
                currentForm.style.opacity = '1';
            }, 30);
            localStorage.setItem('currentForm', formId);
        }
    }
}

function clearFormInputs() {
    let inputs = document.querySelectorAll('.auth-container input');
    inputs.forEach(input => {
        input.value = '';
    });

    let passwordToggleIcons = document.querySelectorAll('.auth-container .password-toggle-icon');
    passwordToggleIcons.forEach(icon => {
        icon.src = './assets/img/password-hide.png';
    });
}

function hideInfoMessage(formId, popupID) {
    let popupElement = document.getElementById(popupID);

    if (popupElement) {
        popupElement.style.opacity = '0';
        setTimeout(() => {
            popupElement.style.display = 'none';
        }, 300);
    }
    if (formId) {
        window.history.replaceState({}, document.title, window.location.pathname); 
    }
}

function togglePassword(inputID) {
    let passwordInput = document.getElementById(inputID);
    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';

    let passwordToggleIcon = passwordInput.nextElementSibling;
    let pathPrefix = (inputID === 'newPassword' || inputID === 'confirmPassword') ? '../assets/img/' : './assets/img/';
    passwordToggleIcon.src = (passwordInput.type === 'password') ? pathPrefix + 'password-hide.png' : pathPrefix + 'password-visible.png';}

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

function validatePasswords() {
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let errorContainer = document.getElementById('newPasswordError');

    if (newPassword !== confirmPassword) {
        errorContainer.innerHTML = "Die Passwörter stimmen nicht überein."
        return false; 
    } else {
        errorContainer.innerHTML = "";
        return true;
    }
}

function closeTab() {
    window.close();
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const registered = urlParams.get('registered');
    const emailSent = urlParams.get('emailSent');

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

    if (emailSent) {
        const emailSentPopup = document.getElementById('sendMailPopup');
        if (emailSentPopup) {
            emailSentPopup.style.display = "flex";
            setTimeout(() => {
                showForm('loginForm');
                emailSentPopup.style.display = "none";
            }, 6000);
        }
    }

    document.getElementById('resetForm').addEventListener('submit', event => {
        event.preventDefault();
       
        if (validatePasswords()) {
            fetch('../php/setNewPassword.php', {
                method: 'POST',
                body: new FormData(document.getElementById('resetForm'))
            }).then(result => {
                showPopup('passwordUpdatedPopup');
                return result.text();
            });
        }
    });
});

function showPopup(popupID) {
    let popupElement = document.getElementById(popupID);
    if (popupElement) {
        popupElement.style.display = 'flex';
        setTimeout(() => {
            popupElement.style.opacity = '1';
        }, 50);
    }
}

function hidePopup(popupID) {
    let popupElement = document.getElementById(popupID);
    if (popupElement) {
        popupElement.style.opacity = '0';
        setTimeout(() => {
            popupElement.style.display = 'none';
        }, 300);
    }
}


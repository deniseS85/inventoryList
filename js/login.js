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

    let errorElements = document.querySelectorAll('.auth-container .error');
    errorElements.forEach(element => {
        element.innerHTML = '';
    })

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
    passwordToggleIcon.src = (passwordInput.type === 'password') ? pathPrefix + 'password-hide.png' : pathPrefix + 'password-visible.png';
}

function validateForm(formID, emailID, passwordID, emailErrorID, passwordErrorID) {
    let email = document.getElementById(emailID).value; 
    let password = document.getElementById(passwordID).value;
    let emailError = document.getElementById(emailErrorID);
    let passwordError = document.getElementById(passwordErrorID);

    if (formID === 'signupForm') {
        let firstName = document.getElementById('signupFirstName').value;
        let firstNameError = document.getElementById('signupFirstNameError');
        if (firstName.trim() === "") {
            showError(firstNameError, "Vorname ist erforderlich");
            return false;
        }
    } 
    
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

function validateForgotPasswordForm(formID, emailID, emailErrorID) {
    let email = document.getElementById(emailID).value; 
    let emailError = document.getElementById(emailErrorID);
    if (email.trim() === "") {
        showError(emailError, "E-Mail ist erforderlich"); 
        return false;
    } else if (!isValidEmail(email)) {
        showError(emailError, "Ungültige E-Mail-Adresse");
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
    let resetForm = document.getElementById('resetForm');

    if (registered === "false") {
        showPopup('infoNotUser');
    } else if (registered === "already") {
        showPopup('infoAlreadyUser');
        showForm('signupForm');
    } else if (registered === "success") {
        showPopup('registrationSuccess');
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

    if (resetForm) {
        document.getElementById('resetForm').addEventListener('submit', submitResetPasswordForm);
    }
});

function submitResetPasswordForm(event) {
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
}

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

function doNotClose(event) {
    event.stopPropagation();
}


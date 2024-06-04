<form id="signupForm" action="php/signUp.php" method="post" style="display:none;" onsubmit="return validateForm('signupForm', 'signupEmail', 'passwordSignup', 'signupEmailError', 'signupPasswordError')";>
    <h4 class="popup-title">Registrierung</h4>
    <div class="form-group">
        <label for="signupFirstName" class="form-label">Vorname</label>
        <input type="text" name="signupFirstName" id="signupFirstName" placeholder="Dein Vorname">
        <div class="error" id="signupFirstNameError"></div>
    </div>

    <div class="form-group">
        <label for="signupEmail" class="form-label">Email</label>
        <input type="email" name="signupEmail" id="signupEmail" placeholder="Deine E-Mail-Adresse">
        <div class="error" id="signupEmailError"></div>
    </div>

    <div class="form-group">
        <label for="signupPassword" class="form-label">Passwort</label>
        <div class="password-container">
            <input type="password" name="signupPassword" id="passwordSignup">
            <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('passwordSignup')">
        </div>
        <div class="error" id="signupPasswordError"></div>
    </div>

    <div class="btn-container-auth">
        <button type="submit" id="signupButton">Registrieren</button>
    </div>

    <div class="form-footer">
        <div>Bereits registriert?</div>
        <a class="login-link" onclick="showForm('loginForm')">Zum Login</a>
    </div>
</form>

<div id="infoAlreadyUser" class="login-message-bg" style="display:none" onclick="hidePopup('infoAlreadyUser')">
    <span class="login-message-content" onclick="doNotClose(event)">
        <div>Du hast bereits ein Konto,</div>
        <div> bitte melde dich
            <a onclick="showForm('loginForm', 'infoAlreadyUser')" class="signup-link here">hier</a> an.
        </div>
    </span>
</div>

<div id="registrationSuccess" class="login-message-bg" style="display: none;" onclick="hidePopup('registrationSuccess')">
    <span class="login-message-content" onclick="doNotClose(event)">
        <div>Registrierung erfolgreich!</div>
        <div>Du kannst dich jetzt anmelden.</div>
        <div class="btn-container-auth">
        <a onclick="hidePopup('registrationSuccess')" class="signup-link here">Zum Login</a>
    </div>
    </span>
</div>

<form id="signupForm" action="php/signUp.php" method="post" style="display:none;">
    <h4 class="popup-title">Registrierung</h4>
    <div class="form-group">
        <label for="signupFirstName" class="form-label">Vorname</label>
        <input type="text" name="signupFirstName" id="signupFirstName" placeholder="Dein Vorname" required>
        <span id="signupFirstNameError"></span>
    </div>

    <div class="form-group">
        <label for="signupEmail" class="form-label">Email</label>
        <input type="email" name="signupEmail" id="signupEmail" placeholder="Deine E-Mail-Adresse" required>
        <span id="signupEmailError"></span>
    </div>

    <div class="form-group">
        <label for="signupPassword" class="form-label">Passwort</label>
        <div class="password-container">
            <input type="password" name="signupPassword" id="passwordSignup" required>
            <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('passwordSignup')">
        </div>
        <span id="signupPasswordError"></span>
    </div>

    <div class="btn-container-auth">
        <button type="submit" id="signupButton">Registrieren</button>
        <div id="signupError"></div>
    </div>

    <div class="form-footer">
        <div>Bereits registriert?</div>
        <a class="login-link" onclick="showForm('loginForm')">Zum Login</a>
    </div>
</form>

<div id="infoAlreadyUser" class="login-message-bg" style="display:none">
    <span class="login-message-content">
        <div>Du hast bereits ein Konto,</div>
        <div> bitte melde dich
            <a onclick="showForm('loginForm', 'infoAlreadyUser')" class="signup-link here">hier</a> an.
        </div>
    </span>
</div>

<div id="registrationSuccess" class="login-message-bg" style="display: none;">
    <span class="login-message-content">
        <div>Registrierung erfolgreich!</div>
        <div>Du kannst dich jetzt anmelden.</div>
    </span>
</div>

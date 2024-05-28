<form id="signupForm" style="display:none;">
    <h4 class="popup-title">Registrierung</h4>
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
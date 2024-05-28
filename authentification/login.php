<div class="login-container">
    <form id="loginForm">
        <h4 class="popup-title">Login</h4>
        <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" name="email" id="email" placeholder="Deine E-Mail-Adresse" required>
            <span id="emailError"></span>
        </div>

        <div class="form-group">
            <label for="password" class="form-label">Passwort</label>
            <div class="password-container">
                <input type="password" name="password" id="password" required>
                <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword()">
            </div>
            <span id="passwordError"></span>
        </div>

        <div class="sub-form-group">
            <div class="remember-container">
                <input type="checkbox" id="rememberMe" class="remember-me-checkbox">
                <label for="rememberMe">Angemeldet bleiben</label>
            </div>
            <div class="forgot-container">
                <a href="#" class="forgot-link">Passwort vergessen?</a>
            </div>
        </div>

        <div class="btn-container-login">
            <button type="submit" id="loginButton">Login</button>
            <div id="loginError"></div>
        </div>

        <div  class="sign-up-container">
            <div>Noch nicht registriert?</div>
            <a class="signup-link" href="#">Zur Registrierung</a>
        </div>
    </form>
</div>
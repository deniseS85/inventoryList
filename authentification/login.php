<div class="auth-container" id="auth-container">
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
                <input type="password" name="password" id="passwordLogin" required>
                <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('passwordLogin')">
            </div>
            <span id="passwordError"></span>
        </div>

        <div class="sub-form-group">
            <div class="remember-container">
                <input type="checkbox" id="rememberMe" class="remember-me-checkbox">
                <label for="rememberMe">Angemeldet bleiben</label>
            </div>
            <div class="forgot-container">
                <a onclick="showForm('forgotForm')" class="forgot-link">Passwort vergessen?</a>
            </div>
        </div>

        <div class="btn-container-auth">
            <button type="submit" id="loginButton">Login</button>
            <div id="loginError"></div>
        </div>

        <div  class="form-footer">
            <div>Noch nicht registriert?</div>
            <a onclick="showForm('signupForm')" class="signup-link">Zur Registrierung</a>
        </div>
    </form>

    <?php 
        include 'signup.php';
        include 'forgotPassword.php'
    ?>
</div>
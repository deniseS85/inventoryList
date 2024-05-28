<form id="forgotForm" style="display:none;">
    <h4 class="popup-title">Passwort zurücksetzen</h4>
    <div class="form-group">
        <label for="forgotEmail" class="form-label">Email</label>
        <input type="email" name="forgotEmail" id="forgotEmail" placeholder="Deine E-Mail-Adresse" required>
        <span id="forgotEmailError"></span>
    </div>
    <div class="btn-container-auth">
        <button type="submit" id="forgotButton">Passwort zurücksetzen</button>
        <div id="forgotError"></div>
    </div>
    <div class="form-footer backToLogin">
        <div>Zurück zum<a class="login-link" onclick="showForm('loginForm')">Login</a></div>
        
    </div>
</form>
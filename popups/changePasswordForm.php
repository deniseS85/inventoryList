<div class="change-password-container">
    <h4 class="popup-title">Passwort ändern</h4>
    <form id="changePasswordForm" autocomplete="off" onsubmit="validateAndSubmit(event)">
        <div class="form-group">
            <label for="currentPassword">Aktuelles Passwort</label>
            <div class="password-container">
                <input type="password" class="input-new-item" name="currentPassword" id="currentPassword" autocomplete="off" required>
                <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('currentPassword')">
            </div>
            <div class="error" id="currentPasswordError"></div>
        </div>
        <div class="form-group">
            <label for="newPassword" class="form-label">Neues Passwort</label>
            <div class="password-container">
                <input type="password" class="input-new-item" name="newChangePassword" id="newChangePassword" autocomplete="off" required>
                <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('newChangePassword')">
            </div>
            <div class="error"></div>
        </div>
        <div class="form-group">
            <label for="confirmNewPassword" class="form-label">Neues Passwort bestätigen</label>
            <div class="password-container">
                <input type="password" class="input-new-item" name="confirmNewPassword" id="confirmNewPassword" autocomplete="off" required>
                <img src="./assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('confirmNewPassword')">
            </div>
            <div class="error" id="newPasswordConfirmError"></div>
        </div>
        <div class="btn-container change-password-btn">
            <button type="reset" onclick="backToAccountView()">Abbrechen</button>
            <button type="submit" id="changePasswordButton" disabled>Passwort ändern</button>
        </div>
    </form>
</div>
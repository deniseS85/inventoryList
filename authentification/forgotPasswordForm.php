<?php
$emailSent = isset($_GET['emailSent']) ? filter_var($_GET['emailSent'], FILTER_VALIDATE_BOOLEAN) : null;
?>

<form id="forgotForm" action="php/sendPasswordReset.php" method="POST" style="display:none;" onsubmit="return validateForgotPasswordForm('forgotEmail', 'forgotEmailError')">
    <h4 class="popup-title">Passwort zurücksetzen</h4>
    <div class="form-group">
        <label for="forgotEmail" class="form-label">Email</label>
        <input type="email" name="forgotEmail" id="forgotEmail" placeholder="Deine E-Mail-Adresse">
        <div class="error" id="forgotEmailError"></div>
    </div>
    <div class="btn-container-auth">
        <button type="submit" id="forgotButton">Passwort zurücksetzen</button>
        <div id="forgotError"></div>
    </div>
    <div class="form-footer backToLogin">
        <div>Zurück zum<a class="login-link" onclick="showForm('loginForm')">Login</a></div>
    </div>
    
    <div id="sendMailPopup" class="send-mail-message" style="display:<?php echo $emailSent !== null ? 'flex' : 'none'; ?>;">
        <div class="<?php echo $emailSent === true ? 'login-message-content' : 'reset-passwort-message'; ?>">
            <?php if ($emailSent === true): ?>
                <div>E-Mail wurde gesendet!</div>
                <div>Bitte überprüfe dein E-Mail-Postfach.</div>
            <?php elseif ($emailSent === false): ?>
                <div>Die eingegebene E-Mail-Adresse ist ungültig oder nicht registriert.</div>
                <div>Bitte überprüfe deine Eingabe und versuche es erneut.</div>
            <?php endif; ?>
        </div>
    </div>
</form>
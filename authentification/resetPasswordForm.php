<!-- Link is not valid, show message -->
<?php
session_start();
include '../php/db_connection.php';

if(isset($_GET['token']) && isset($_GET['expiry'])) {
    $token = $_GET['token'];
    $expiry_date = $_GET['expiry'];

    $stmt = $conn->prepare("SELECT * FROM Users WHERE reset_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if(time() > strtotime($expiry_date) || ($result->num_rows == 0 && $token !== null)) {
        $html_message = "
            <!DOCTYPE html>
            <html lang='de'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Link abgelaufen</title>
                <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH' crossorigin='anonymous'>
                <link rel='stylesheet' href='../styles.css'>
            </head>
            <body>
                <div class='reset-container'>
                    <span class='reset-content'>
                        <div>Der Link ist nicht mehr gültig.</div>
                        <div>Bitte fordere einen neuen Link an.</div>
                        <button onclick='window.close()'>Fenster schließen</button>
                    </span>
                </div>
            </body>
            </html>";

        echo  $html_message;
        $expired_tokens = $conn->prepare("UPDATE Users SET reset_token = NULL, reset_token_expiry = NULL WHERE reset_token_expiry < NOW()");
        $expired_tokens->execute();
        exit();
    }
}
?>

<!-- Link is valid, then show Form for set new password -->
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles.css">
    <script language="javascript" type="text/javascript" src="../js/login.js"></script>
</head>
    <body>
        <div class="reset-container">
            <form id="resetForm">
                <h4 class="popup-title">Neues Passwort</h4>
                <input type="hidden" name="token" value="<?php echo isset($_GET['token']) ? $_GET['token'] : ''; ?>">
                <div class="form-group">
                    <label for="newPassword" class="form-label">Passwort</label>
                    <div class="password-container">
                        <input type="password" name="newPassword" id="newPassword" placeholder="Neues Passwort" autocomplete="off">
                        <img src="../assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('newPassword')">
                    </div>
                </div>
                <div class="form-group">
                    <label for="confirmPassword" class="form-label">Passwort bestätigen</label>
                    <div class="password-container">
                        <input type="password" id="confirmPassword" placeholder="Passwort bestätigen" autocomplete="off">
                        <img src="../assets/img/password-hide.png" class="password-toggle-icon" onclick="togglePassword('confirmPassword')">
                    </div>
                    <span id="newPasswordError" class="error"></span>
                </div>
                <div class="btn-container-auth">
                    <button type="submit" id="resetButton">Passwort aktualisieren</button>
                </div>

                <div id="passwordUpdatedPopup" class="send-mail-message" style="display:none;">
                    <span class="reset-content">
                        <div>Das Passwort wurde erfolgreich aktualisiert!</div>
                        <div>Du kannst dieses Fenster jetzt schließen.</div>
                        <button onclick="closeTab()">Fenster schließen</button>
                    </span>
                </div>
            </form>
        </div> 
    </body>
</html>
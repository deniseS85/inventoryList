<?php
session_start();
include '../php/db_connection.php';

if(isset($_GET['token']) && isset($_GET['expiry'])) {
    $token = $_GET['token'];
    $expiry_date = $_GET['expiry'];

    if(time() > strtotime($expiry_date)) {
        $html_message = "
            <!DOCTYPE html>
            <html lang='de'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Token abgelaufen</title>
                <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH' crossorigin='anonymous'>
                <link rel='stylesheet' href='../styles.css'>
            </head>
            <body>
                <div class='reset-container'>
                    <div class='alert alert-danger' role='alert'>
                        Der Token ist abgelaufen. Bitte fordere einen neuen Token an.
                    </div>
                </div>
            </body>
            </html>
            ";

        echo  $html_message;
        $expired_tokens = $conn->prepare("UPDATE Users SET reset_token = NULL, reset_token_expiry = NULL WHERE reset_token_expiry < NOW()");
        $expired_tokens->execute();
        exit();
    }
} else {
    echo "Ungültiger Link. Bitte fordern Sie einen neuen Token an.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles.css">
</head>
    <body>
        <div class="reset-container">
            <form id="resetForm" action="../php/setNewPassword.php" method="POST">
                <h4 class="popup-title">Neues Passwort</h4>
                <input type="hidden" name="token" value="<?php echo $_GET['token']; ?>">
                <div class="form-group">
                    <label for="newPassword" class="form-label">Passwort</label>
                    <input type="password" name="newPassword" id="newPassword" placeholder="Neues Passwort" required>
                    <span id="newPasswordError"></span>
                </div>
                <div class="btn-container-auth">
                    <button type="submit" id="resetButton">Passwort aktualisieren</button>
                    <div id="resetError"></div>
                </div>
            </form>
        </div>
    </body>
</html>
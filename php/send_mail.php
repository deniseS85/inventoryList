<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$phpmailerPath = '/Applications/XAMPP/xamppfiles/htdocs/PHPMailer/src/';

require $phpmailerPath . 'Exception.php';
require $phpmailerPath . 'PHPMailer.php';
require $phpmailerPath . 'SMTP.php';

$sender_email = 'inventoryList@gmail.com';

function sendMail($email, $reset_link, $username) {
    global $debug, $sender_email;
    $mail = new PHPMailer($debug);

    if ($debug) {
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    }

    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = "smtp.gmail.com";
    $mail->Port = 465;
    $mail->Username = "my.messages.contact@gmail.com";
    $mail->Password = "dpmx badl axfd goex";
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->isHTML(true);

    $mail->setFrom($sender_email, 'Inventory List');
    $mail->addAddress($email);
    $mail->Subject = 'Passwort zurücksetzen';
    $mail->Body = '<html>';
    $mail->Body .=  '<body>';
    $mail->Body .=      '<h2>Passwort zurücksetzen</h2>';
    $mail->Body .=      '<p>Hey ' . $username . '! 😊</p>';
    $mail->Body .=      '<p>Du hast angefordert, dein Passwort zurückzusetzen. Keine Sorge, wir helfen dir gerne!</p>';
    $mail->Body .=      '<p>Klicke einfach auf den folgenden Link, um fortzufahren und dein Passwort zurückzusetzen:</p>';
    $mail->Body .=      '<p><a href="' . $reset_link . '">Passwort zurückzusetzen</a></p>';
    $mail->Body .=      '<p>Bitte beachte, dass dieser Link nur 30 Minuten gültig ist.</p>';
    $mail->Body .=      '<p>Wenn du Probleme hast oder Fragen auftauchen, zögere nicht, uns zu kontaktieren. Wir helfen dir gerne weiter!</p>';
    $mail->Body .=      '<p>Bis bald! 🌟</p>';
    $mail->Body .=  '</body>';
    $mail->Body .= '</html>';

    if ($mail->send()) {
        return true; 
    } else {
        return false;
    }
}
?>

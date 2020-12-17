<?php
$retour = mail('nabila.tantast@gmail.com', 'Envoi depuis la page Contact', $_POST['message'], 'From : nabila.tantast@gmail.com');
if ($retour) {
echo '<p>Votre message a bien été envoyé.</p>';
}
?>
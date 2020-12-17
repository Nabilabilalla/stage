<?php
//reception des donnes du formulaire
$nom=$_POST ['contact_nom'];
$email=$_POST['contact_email'];
$message=$_POST['contact_message'];
echo "votre nom est:".$nom."<br>votre email est:".$email."<br>votremessage".$message;
?>
<?php

session_start();

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$useremail = $_POST["txtEmail"];
$error = "Email inválido ou não cadastrado!";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the new user page.
}

$sql = "SELECT * FROM users where USEREMAIL='" . $useremail. "'";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	$row = $result->fetch_array(MYSQLI_ASSOC);

    $to = $row["USEREMAIL"];
    $subject = "Bolao Copa 2022 - reenvio de dados";
    $asenha = $row["USERPASSWORD"];
    $txt = "Olá  \r\n 
            Você solicitou que sua senha fosse reenviada.  Estamos lhe enviando abaixo a sua senha. \r\n 
             \r\n 
             \r\n 
             $asenha 
             \r\n
             \r\n
            Em caso de dúvidas, nos envie um email. \r\n 
            Até mais, \r\n 
            Administração do Bolão";
    $headers = "From: bolaoaisportnews@gmail.com";
    // $headers = "From: amarav01@gmail.com";

    mail($to,$subject,$txt,$headers);

    $_SESSION["pwdsent"] = "senha reenviada";
    $conn->close();
    header("location: ../helpme.php"); //send user back to the helpe me page.
} 
else {
    $_SESSION["error"] = $error;
    $conn->close();
    header("location: ../helpme.php"); //send user back to the new user page.

}

?>
<?php

//  *************************************
//  									*
// 				EXTRAS  				*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$champion = $_POST["txtChampion"];
$semifinalist1 = $_POST["txtSemi1"];
$semifinalist2 = $_POST["txtSemi2"];
$semifinalist3 = $_POST["txtSemi3"];
$striker = $_POST["txtStriker"];
$strikergoals = $_POST["txtStrikerGoals"];
$error = "...";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../newuser.php"); //send user back to the new user page.
}


$sql = "UPDATE USERS SET CHAMPION = '" .$champion . "', SEMIFINALIST_1 = '" . $semifinalist1 . "', SEMIFINALIST_2 = '" . $semifinalist2 . "', SEMIFINALIST_3 = '" . $semifinalist3 . "', STRIKER = '" . $striker . "', STRIKER_GOALS = " . $strikergoals ." WHERE USERID = " . $_SESSION["userid"] . ";";

if ($conn->query($sql) == TRUE) {

	$_SESSION["betsupdated"] = "Palpites atualizados as ". date("d-m-Y h:i:sa");
	header("location: ../extras.php#palpites"); //send user back to the new user page.
} else {
	echo "deu algum erro...". $sql;
}

?>

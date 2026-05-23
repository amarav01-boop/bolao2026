<?php

//  *************************************
//  									*
// 		CREATE TWITTER MESSAGE			*
//										*
//***************************************

session_start();

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$mensagem = $_POST["txtTwitter"];
$error = "...";


// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../newuser.php"); //send user back to the new user page.
}

// Check if nickname already exists


$sql = "INSERT INTO twitter (USERID, MESSAGE_TXT, MESSAGE_TIMESTAMP) VALUES('". $_SESSION["userid"]. "', '". $mensagem. "', sysdate())";
echo $sql;
if ($mensagem== null){
		header("location: ../home.php#twitter"); //send user back to the login page.
}else{
if ($conn->query($sql) === TRUE) {
		header("location: ../home.php#twitter"); //send user back to the login page.
} else {
	 $error = $conn->error;
	 $_SESSION["error"] = $error;
     header("location: ../index.php"); //send user back to the new user page.
}
}

$conn->close();

?>
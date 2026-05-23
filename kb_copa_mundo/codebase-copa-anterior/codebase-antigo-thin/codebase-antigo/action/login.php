<?php

session_start();

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$useremail = $_POST["txtEmail"];
$userpwd = $_POST["txtPwd"];
$error = "username/password incorrect";

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

	if ($userpwd == $row["USERPASSWORD"]){
		$_SESSION["userlogged"]=$row["USERNICKNAME"];
		$_SESSION["userid"]=$row["USERID"];
    	header("location: ../home.php"); //send user back to the new user page.
	} else {
	    $_SESSION["error"] = $error;
    	header("location: ../index.php"); //send user back to the new user page.
	}

} else {
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the login page.
}



?>
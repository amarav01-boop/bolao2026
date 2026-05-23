<?php 

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$error = "Não foi possível abrir tabela de mensagens!";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the new user page.
}

$sql = "SELECT * FROM messages where SYSDATE() between MESSAGE_START AND MESSAGE_END";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$_SESSION["alertmessage"] = $row["MESSAGE_TEXT"];
	echo ("<p>". utf8_encode($row["MESSAGE_TEXT"]) . "</p>");
	
}
else{
		$_SESSION["alertmessage"] = null;
	}


$conn->close();


?>
<?php 

//  *************************************
//  									*
// 			SHOW TWITTERS 				*
//										*
//***************************************

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$error = "Não foi possível abrir tabela de apostas!";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the new user page.
}

$sql = "SELECT * FROM TWITTER, USERS WHERE TWITTER.USERID = USERS.USERID ORDER BY MESSAGE_TIMESTAMP DESC LIMIT 40";

	echo "<table border=1 cellspacing='1' cellpadding='3'>";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr>";
				$formateddate = new DateTime($row["MESSAGE_TIMESTAMP"]);
			/*	echo "<td>". $formateddate->format('d-m') . "</td>";*/
				echo "<td>";
				echo "<strong>".$row["USERNICKNAME"] . "</strong> | ".$formateddate->format('d-m | h:i:sa') . "<br>";
//				echo utf8_encode($row["MESSAGE_TXT"]);
				echo $row["MESSAGE_TXT"];
				echo "</td>";
			echo "</tr>";
	 }
 }
else{
	echo "nothing...";
}


	echo "</table>";
?>
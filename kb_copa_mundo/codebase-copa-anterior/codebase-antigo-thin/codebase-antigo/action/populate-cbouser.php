<?php 

//  *************************************
//  									*
// 		SELECTED SHOW BETS 				*
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

$sql = "SELECT * FROM USERS ORDER BY USERNICKNAME";

$result = $conn->query($sql);
$x=1;
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			echo "<option value=" . $row["USERID"] . ">" . $row["USERNICKNAME"] . "</option>";
	 }

 }
else{
	echo "no users to be displayed :(";
}

?>
<?php 

//  *************************************
//  									*
// 			SHOW DAILY STATISTICS		*
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

$sql = "CALL spGetGameStatistics()";

echo "<table>";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			echo "<tr>";
			echo "<td>";
				echo utf8_encode($row["TEAM_A"]);
				echo "<br>";
				echo $row["PERC_VITORIA_A"] ."%";
			echo "</td>";
			echo "<td>";
				echo " X ";
				echo "<br>";
				echo $row["PERC_EMPATE"] ."%";
			echo "</td>";
			echo "<td>";
				echo utf8_encode($row["TEAM_B"]);
				echo "<br>";
				echo $row["PERC_VITORIA_B"] ."%";
			echo "</td>";
	 }

 }
else{
	echo "no statistics today :(";
}
echo "</table>";

?>
<?php 

//  *************************************
//  									*
// 			LOAD MASTER    				*
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

$sql = "SELECT  MASTER.GAME_ID, MASTER.PHASE_ID, MASTER.TEAM_A, MASTER.TEAM_B, MASTER.SCORE_A, MASTER.SCORE_B,
MASTER.GAME_DATE, MASTER.GAME_STATUS, ROUNDS.ROUND_ID, ROUNDS.ROUND_STATUS
FROM MASTER, ROUNDS
WHERE MASTER.GAME_ID = ROUNDS.GAME_ID
ORDER BY ROUNDS.ROUND_ID, MASTER.GAME_ID";

echo "<form name='formMaster' id='formMaster' action='./action/update-master.php' method='POST'>";
echo "<input type='submit' value='Salvar'>";
echo "<table>";
echo "<tr>";
echo "<th>Rodada</th>";
echo "<th>Data Jogo</th>";
echo "<th>Equipe A</th>";
echo "<th>&nbsp</th>";
echo "<th>&nbsp</th>";
echo "<th>Equipe B</th>";
echo "<th>Status</th>";
echo "</tr>";
$myRound = null;
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			echo "<tr>";
	 		if ($myRound != $row["ROUND_ID"]){
	 			$myRound = $row["ROUND_ID"];
				echo "<td>";
					echo "<input type='text' name='txtRound". $row["ROUND_ID"]. "' size=1 value='" . $row["ROUND_STATUS"] . "' >";
					echo "<br>coloque <strong>1</strong> para rodada finalizada";
				echo "</td>";
	 		} else {
	 			echo "<td></td>";
	 		}
			echo "<td>";
			echo utf8_encode($row["GAME_DATE"]);
			echo "</td>";
			echo "<td>";
			echo utf8_encode($row["TEAM_A"]);
			echo "</td>";
			echo "<td>";
			echo "<input type='text' name='txtGame". $row["GAME_ID"]. "_A' size=1 value='" . $row["SCORE_A"] . "' >";
			echo "</td>";
			echo "<td>";
			echo "<input type='text' name='txtGame". $row["GAME_ID"]. "_B' size=1 value='" . $row["SCORE_B"] . "' >";
			echo "</td>";
			echo "<td>";
			echo utf8_encode($row["TEAM_B"]);
			echo "</td>";
			echo "<td>";
			echo "<input type='text' name='txtGame". $row["GAME_ID"]. "_Status' size=1 value='" . $row["GAME_STATUS"] . "' >";
			echo "<br>coloque <strong>1</strong> para jogo realizado";
			echo "</td>";
			echo "</tr>";
	 }

 }
else{
	echo "no statistics today :(";
}
echo "</table>";
echo "</form>";

?>
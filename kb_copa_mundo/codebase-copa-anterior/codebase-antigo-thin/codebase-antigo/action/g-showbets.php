<?php 

//  *************************************
//  									*
// 				GROUP G 				*
//										*
//***************************************

header('Content-Type: text/html; charset=utf-8');

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

$sql = "SELECT MASTER.GAME_ID, MASTER.PHASE_ID, MASTER.GAME_DATE, MASTER.TEAM_A, MASTER.TEAM_B, 
			BETS.SCORE_A, BETS.SCORE_B, MASTER.GAME_STATUS, 
			IF(MASTER.GAME_STATUS = 1, CONCAT(MASTER.SCORE_A, ' X ', MASTER.SCORE_B) , ' N/A ') AS GAME_RESULT,
			BETS.BET_POINTS FROM MASTER, BETS  WHERE MASTER.GAME_ID = BETS.GAME_ID AND BETS.USERID = " . $_SESSION["userid"] . " AND MASTER.PHASE_ID = 'G' ORDER BY MASTER.PHASE_ID, MASTER.GAME_ID";

	echo "<table border=1 cellspacing='1' cellpadding='3'>";
	echo "<tr>";
	echo "<th class='o-col-352px'>EQUIPE A";
	echo "</th>";
	echo "<th class='o-col-44px'>&nbsp";
	echo "</th>";
	echo "<th class='o-col-44px'>&nbsp";
	echo "</th>";
	echo "<th class='o-col-44px'>&nbsp";
	echo "</th>";
	echo "<th class='o-col-352px'>EQUIPE B";
	echo "</th>";
	echo "<th class='o-col-132px'>DATA";
	echo "</th>";
	echo "<th class='o-col-132px'>STATUS";
	echo "</th>";
	echo "<th class='o-col-132px'>PONTOS";
	echo "</th>";
	echo "</tr>";
	echo "<tr>";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr>";
				echo "<td class='o-col-352px'>". utf8_encode($row["TEAM_A"]). "</td>";
				$fieldnameA = "txtJogo". utf8_encode($row["GAME_ID"]) . "PlacarA";
				$fieldnameB = "txtJogo". utf8_encode($row["GAME_ID"]) . "PlacarB";
				echo "<td class='o-col-44px'>". "<input type='text' class= 'o-inputscore' maxlength=2 size=1 name='". $fieldnameA . "' value='".utf8_encode($row["SCORE_A"]) ."' />" .  "</td>";
				echo "<td class='o-col-44px'><center>". "X". "</center></td>";
				echo "<td class='o-col-44px'>". "<input type='text' class= 'o-inputscore' maxlength=2 size=1 name='". $fieldnameB . "' value='".utf8_encode($row["SCORE_B"]) ."' />" .  "</td>";
				echo "<td class='o-col-352px'>". utf8_encode($row["TEAM_B"]). "</td>";
				$formateddate = new DateTime($row["GAME_DATE"]);
				echo "<td class='o-col-132px'>". $formateddate->format('d-m') . "</td>";
				echo "<td class='o-col-132px'>". utf8_encode($row["GAME_RESULT"]). "</td>";
				echo "<td class='o-col-132px'>". utf8_encode($row["BET_POINTS"]). "</td>";
			echo "</tr>";
	 }
 }
else{
	echo "nothing...";
}


	echo "</table>";
?>
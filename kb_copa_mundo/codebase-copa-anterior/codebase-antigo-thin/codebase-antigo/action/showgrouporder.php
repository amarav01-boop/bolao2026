<?php 

//  *************************************
//  									*
// 				SHOW GROUP ORDER		*
//										*
//***************************************

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$error = "Não foi possível abrir tabela de apostas!";

  


// Create connection
$conn2 = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn2->connect_error) {
    $error = "Connection failed: " . $conn2->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the new user page.
}

	$sql = "SELECT EQUIPE, SUM(PTS) AS TOT_PTS, SUM(GP) - SUM(GC) TOT_DIF, SUM(GP) AS TOT_GP, SUM(GC) AS TOT_GC FROM (SELECT TEAM_A AS EQUIPE, IF(BETS.SCORE_A>BETS.SCORE_B, 3, IF(BETS.SCORE_A<BETS.SCORE_B, 0, 1)) AS PTS, BETS.SCORE_A AS GP, BETS.SCORE_B AS GC FROM BETS, MASTER WHERE BETS.GAME_ID =  MASTER.GAME_ID AND BETS.USERID=" . $selectedid . " AND MASTER.PHASE_ID = '". $selectedgroup. "' UNION ALL SELECT TEAM_B AS EQUIPE, IF(BETS.SCORE_B>BETS.SCORE_A, 3, IF(BETS.SCORE_B<BETS.SCORE_A, 0, 1)) AS PTS, BETS.SCORE_B AS GP, BETS.SCORE_A AS GC
FROM BETS, MASTER WHERE BETS.GAME_ID =  MASTER.GAME_ID AND BETS.USERID=" . $selectedid . " AND MASTER.PHASE_ID = '". $selectedgroup."') AS DADO GROUP BY DADO.EQUIPE ORDER BY 2 DESC, 3 DESC, 4 DESC, 1";

	echo "<table>";
	echo "<tr>";
		echo "<th>EQUIPE</th>";
		echo "<th>TOT PTS</th>";
		echo "<th>SALDO G</th>";
		echo "<th>TOT GP</th>";
		echo "<th>TOT GC</th>";
	echo "</tr>";

$result2 = $conn2->query($sql);
if ($result2->num_rows > 0) {
	 while($row2 = $result2->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr>";
				echo "<td class='o-col-44px'>". utf8_encode($row2["EQUIPE"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row2["TOT_PTS"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row2["TOT_DIF"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row2["TOT_GP"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row2["TOT_GC"]). "</td>";
			echo "</tr>"; 
	 }
 }
 else {
 	echo "nothing...";
 }
 echo "</table>";
?>
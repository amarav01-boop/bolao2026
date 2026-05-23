<?php 

//  *************************************
//  									*
// 				GROUP C 				*
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
	echo "</table>";

	echo "<br>";
	echo "<h4>Classificação do grupo </h4>";

	$sql = "SELECT EQUIPE, SUM(PTS) AS TOT_PTS, SUM(GP) - SUM(GC) TOT_DIF, SUM(GP) AS TOT_GP, SUM(GC) AS TOT_GC FROM (SELECT TEAM_A AS EQUIPE, IF(BETS.SCORE_A>BETS.SCORE_B, 3, IF(BETS.SCORE_A<BETS.SCORE_B, 0, 1)) AS PTS, BETS.SCORE_A AS GP, BETS.SCORE_B AS GC FROM BETS, MASTER WHERE BETS.GAME_ID =  MASTER.GAME_ID AND BETS.USERID=" . $_SESSION["userid"] . " AND MASTER.PHASE_ID = 'C' UNION ALL SELECT TEAM_B AS EQUIPE, IF(BETS.SCORE_B>BETS.SCORE_A, 3, IF(BETS.SCORE_B<BETS.SCORE_A, 0, 1)) AS PTS, BETS.SCORE_B AS GP, BETS.SCORE_A AS GC
FROM BETS, MASTER WHERE BETS.GAME_ID =  MASTER.GAME_ID AND BETS.USERID=" . $_SESSION["userid"] . " AND MASTER.PHASE_ID = 'C') AS DADO GROUP BY DADO.EQUIPE ORDER BY 2 DESC, 3 DESC, 4 DESC, 1";

	echo "<table>";
	echo "<tr>";
		echo "<th>EQUIPE</th>";
		echo "<th>TOT PTS</th>";
		echo "<th>SALDO G</th>";
		echo "<th>TOT GP</th>";
		echo "<th>TOT GC</th>";
	echo "</tr>";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr>";
				echo "<td class='o-col-44px'>". utf8_encode($row["EQUIPE"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row["TOT_PTS"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row["TOT_DIF"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row["TOT_GP"]). "</td>";
				echo "<td class='o-col-44px'>". utf8_encode($row["TOT_GC"]). "</td>";
			echo "</tr>"; 
	 }
 }
 else {
 	echo "nothing...";
 }
 echo "</table>";
 echo "<p> Ao salvar os dados, a classificação do grupo será atualizada.</p>"
?>
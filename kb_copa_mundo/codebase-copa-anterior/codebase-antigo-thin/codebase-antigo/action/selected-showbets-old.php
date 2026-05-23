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

if ( isset ($_POST["cboUser"]) ){
	$selecteduser = $_POST["cboUser"];
} else{
	$selecteduser = $_SESSION["userid"];
}

$error = "Não foi possível abrir tabela de apostas!";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the new user page.
}

$sql = "SELECT USERS.USERID, USERS.USERNICKNAME, USERS.USERLOCATION, USERS.CHAMPION, USERS.SEMIFINALIST_1, USERS.SEMIFINALIST_2,
USERS.SEMIFINALIST_3, USERS.STRIKER, USERS.STRIKER_GOALS, BETS.GAME_ID, BETS.SCORE_A, BETS.SCORE_B, BETS.BET_POINTS, 
MASTER.PHASE_ID, MASTER.TEAM_A, MASTER.TEAM_B, MASTER.SCORE_A AS MASTER_SCORE_A, MASTER.SCORE_B AS MASTER_SCORE_B,
MASTER.GAME_DATE, MASTER.GAME_STATUS FROM USERS, BETS, MASTER WHERE USERS.USERID = BETS.USERID AND USERS.USERID=". $selecteduser ." AND BETS.GAME_ID = MASTER.GAME_ID AND MASTER.GAME_ID <= 48 ORDER BY MASTER.PHASE_ID, MASTER.GAME_ID";

$result = $conn->query($sql);
$x=0;
$grupo=null;
$gameline = null;
$champion = null;
$semi1 = null;
$semi2 = null;
$semi3 = null;
$striker = null;
$strikergoals = null;
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			if ($x==0){
				echo "<h2>Palpites do ". $row["USERNICKNAME"] . "</h2>";
				$champion = $row["CHAMPION"];
				$semi1 = $row["SEMIFINALIST_1"];
				$semi2 = $row["SEMIFINALIST_2"];
				$semi3 = $row["SEMIFINALIST_3"];
				$striker = $row["STRIKER"];
				$strikergoals = $row["STRIKER_GOALS"];
				$x=1;
			}	

			if ($row["PHASE_ID"] != $grupo){
				$grupo =  $row["PHASE_ID"];
				/*include "./showgrouporder.php?id=". $selecteduser ."?groupid=".$row["PHASE_ID"];*/
				$selectedid = $selecteduser;
				$selectedgroup = $row["PHASE_ID"];
				echo "<div id='layout-home-content-70'>";
					echo "<h5> GRUPO ". $row["PHASE_ID"] . "</h5>";
					include "./action/showgrouporder.php";
				echo "</div>";
			}	
				echo "<div id='layout-home-content-48'>";
				echo "<table>";
				echo "<tr>";
				echo "<td>";
				echo utf8_encode($row["TEAM_A"]);	
				echo "&nbsp";
				echo utf8_encode($row["SCORE_A"]);	
				echo " X ";
				echo utf8_encode($row["SCORE_B"]);	
				echo "&nbsp";
				echo utf8_encode($row["TEAM_B"]);	
				echo "&nbsp";
				echo "|";
				echo "&nbsp";
				$formateddate = new DateTime($row["GAME_DATE"]);
				echo $formateddate->format('d-m ') ;	
				echo "&nbsp";
				echo "|";
				echo "&nbsp";
				echo "|";
				echo "&nbsp";
				if ($row["BET_POINTS"] == null){
					echo "";
				}else{
					echo utf8_encode($row["BET_POINTS"]) . " pts";
				}
				echo "</td>";
				echo "</tr>";
				echo "</table>";
				echo "</div>";
	 }

	 /** palpites extras **/
	echo "<div id='layout-home-content-70'>";
	echo "<h5> PALPITES EXTRA</h5>";
		echo "<table>";
		echo "<tr>";
			echo "<th>";
			echo "CAMPEÃO";
			echo "</th>";
			echo "<td>";
			echo $champion;
			echo "</td>";
		echo "<tr>";
		echo "<tr>";
			echo "<th>";
			echo "SEMIFINALISTA";
			echo "</th>";
			echo "<td>";
			echo $semi1;
			echo "</td>";
		echo "<tr>";
		echo "<tr>";
			echo "<th>";
			echo "SEMIFINALISTA";
			echo "</th>";
			echo "<td>";
			echo $semi2;
			echo "</td>";
		echo "<tr>";
		echo "<tr>";
			echo "<th>";
			echo "SEMIFINALISTA";
			echo "</th>";
			echo "<td>";
			echo $semi3;
			echo "</td>";
		echo "<tr>";
		echo "<tr>";
			echo "<th>";
			echo "ARTILHEIRO";
			echo "</th>";
			echo "<td>";
			echo $striker;
			echo "</td>";
		echo "<tr>";
		echo "<tr>";
			echo "<th>";
			echo "NÚMERO GOLS ARTILHEIRO";
			echo "</th>";
			echo "<td>";
			echo $strikergoals;
			echo "</td>";
		echo "<tr>";
	echo "</div>";

 }
else{
	echo "no bets to be displayed :(";
}
?>
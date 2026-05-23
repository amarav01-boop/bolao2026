<?php 

//  *************************************
//  									*
// 		SHOW BEST OF ROUND (NA MOSCA)	*
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

$sql = "select users.USERID, users.USERNICKNAME, users.USERLOCATION,
		master.TEAM_A, master.TEAM_B, master.SCORE_A, master.SCORE_B
from users, bets, master, rounds
where users.USERID = bets.USERID
and bets.GAME_ID = master.GAME_ID
and rounds.ROUND_ID = (select max(round_id) from rounds where round_status = 1)
and rounds.GAME_ID = master.GAME_ID
and master.GAME_STATUS = 1
and bets.SCORE_A = master.SCORE_A
and bets.SCORE_B = master.SCORE_B order by master.GAME_ID, users.USERNICKNAME";

	echo "<table border=1 cellspacing='1' cellpadding='3'>";

$result = $conn->query($sql);

$game = null;

if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			if ($row["USERID"]==$_SESSION["userid"]){
			echo "<tr class='special-tr'>";
			} else {
				echo "<tr>";
			}
				if ($game <> $row["TEAM_A"] ."X". $row["TEAM_B"]){
					$game=$row["TEAM_A"] ."X". $row["TEAM_B"];
					$gametodisplay = $row["TEAM_A"] . " ". $row["SCORE_A"] . " X ". $row["SCORE_B"] . " " .$row["TEAM_B"];
					echo "<th class='o-col-352px'>". utf8_encode($gametodisplay). "</th></tr><tr>";

				}
				echo "<td class='o-col-352px'>". $row["USERNICKNAME"]. "<br>&nbsp&nbsp&nbsp". $row["USERLOCATION"] ."</td>";
			echo "</tr>";

	 }

 }
else{
	echo "Nenhum placar na mosca nesta rodada...";
}


	echo "</table>";
?>
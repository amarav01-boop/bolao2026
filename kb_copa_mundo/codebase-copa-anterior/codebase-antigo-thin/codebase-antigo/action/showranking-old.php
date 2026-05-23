<?php 

//  *************************************
//  									*
// 				SHOW RANKING			*
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

$sql = "SELECT USERS.USERID, USERS.USERNICKNAME, max(RANKING.RANKING) as 
CURRENT_POS, max(RANKING.LAST_RANKING) AS PREVIOUS_POS, max(RANKING.RANKING) - max(RANKING.LAST_RANKING) as POS_DIFF, SUM(RANKING.ROUND_PTS) AS TOTAL_PONTOS 
		FROM RANKING, USERS
		WHERE USERS.USERID = RANKING.USERID
		GROUP BY USERS.USERID, USERS.USERNICKNAME
		ORDER BY TOTAL_PONTOS DESC, 2, 1";

	echo "<table border=1 cellspacing='1' cellpadding='3'>";
	echo "<tr>";
	echo "<th class='o-col-44px'>POS";
	echo "</th>";
	echo "<th class='o-col-352px'>NICKNAME";
	echo "</th>";
	echo "<th class='o-col-44px'>PTS";
	echo "</th>";
	echo "<th class='o-col-44px'>";
	echo "</th>";
	echo "</tr>";
	echo "<tr>";

$result = $conn->query($sql);
$x=1;
$posicao = 1;
$pontosposicao = null;
$difposicao = null;
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			if ($row["USERID"]==$_SESSION["userid"]){
			echo "<tr class='special-tr'>";
			} else {
				echo "<tr>";
			}
				
				if ($pontosposicao == $row["TOTAL_PONTOS"]){
					echo "<td class='o-col-44px'>&nbsp</td>";
				} else{
					/*echo "<td class='o-col-44px'>".$posicao. " | " . $row["CURRENT_POS"]. " | " . $row["PREVIOUS_POS"] . " | " . $difposicao . "</td>";*/
					$pontosposicao = $row["TOTAL_PONTOS"];
					echo "<td class='o-col-44px'>".$posicao. " | " . $difposicao .  "</td>";
				/*	echo ">>>  ";
					echo $difposicao;
					echo " | ";
					echo $posicao;
					echo " | ";
					echo $row["LAST_RANKING"];*/
				}
				$posicao= $posicao + 1; 
				$difposicao = $row["POS_DIFF"];
				echo "<td class='o-col-352px'>". $row["USERNICKNAME"]. "</td>";
				echo "<td class='o-col-44px'>". $row["TOTAL_PONTOS"]. "</td>";

				if ($difposicao == 0){
					echo "<td class='o-col-44px'></td>";
				}elseif ($difposicao > 0){
					echo "<td class='o-col-44px'><img src='./img/down-arrow.png' height=16px></td>";
				}else{
					echo "<td class='o-col-44px'><img src='./img/up-arrow.png' height=16px></td>";
				}
/*				if ($difposicao > 5){
					echo "<td class='o-col-44px'><img src='./img/rocket.png' height=16px></td>";
				} elseif ($difposicao > 0 and $difposicao < 5) {
					echo "<td class='o-col-44px'><img src='./img/up-arrow.png' height=16px></td>";
				} elseif ($difposicao = 0) {
					echo "<td class='o-col-44px'></td>";
				} elseif ($difposicao < 0 and $difposicao > -5) {
					echo "<td class='o-col-44px'><img src='./img/down-arrow.png' height=16px></td>";
				} else {
					echo "<td class='o-col-44px'><img src='./img/lightining.png' height=16px></td>";
				}*/

				/*echo "<td class='o-col-44px'>".$x. "</td>";
				echo "<td class='o-col-352px'>". $row["USERNICKNAME"]. "</td>";
				echo "<td class='o-col-44px'>". "0". "</td>";
				echo "<td class='o-col-44px'></td>";*/
			echo "</tr>";

			$x=$x+1;
	 }

 }
else{
	echo "nothing...";
}


	echo "</table>";
	echo "<p>";
	echo "Legenda<br>";
	echo "<table>";
	echo "<tr>";
		echo "<td>";
		echo "<img src='./img/up-arrow.png' height=16px>";
		echo "&nbsp";
		echo "Subiu até 5 posições";
		echo "</td>";
	echo "</tr>";
	echo "<tr>";
		echo "<td>";
		echo "<img src='./img/down-arrow.png' height=16px>";
		echo "&nbsp";
		echo "Desceu até 5 posições";
		echo "</td>";
	echo "</tr>";
	echo "<tr>";
		echo "<td>";
		echo "<img src='./img/rocket.png' height=16px>";
		echo "&nbsp";
		echo "Subiu mais que 5 posições";
		echo "</td>";
	echo "</tr>";
	echo "<tr>";
		echo "<td>";
		echo "<img src='./img/lightining.png' height=16px>";
		echo "&nbsp";
		echo "Desceu mais que 5 posições";
		echo "</td>";
	echo "</tr>";
	echo "</table>";
	echo "<br>";
?>
<?php 

//  *************************************
//  									*
// 				SHOW GROUP CLASS POINTS	*
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

if ($selectedgroup=="A") {
	$mygroupid = 70;
	$grouporder = "HOLANDA | SENEGAL | EQUADOR | CATAR";
} 
 elseif ($selectedgroup=="B"){
	$mygroupid = 71;
	$grouporder = "INGLATERRA | ESTADOS UNIDOS | IRÃ | PAÍS DE GALES";
}
 elseif ($selectedgroup=="C"){
	$mygroupid = 72;
	$grouporder = "ARGENTINA | POLÔNIA | MÉXICO | ARÁBIA SAUDITA";
}
 elseif ($selectedgroup=="D"){
	$mygroupid = 73;
	$grouporder = "FRANÇA | AUSTRALIA | TUNÍSIA | DINAMARCA";
}
 elseif ($selectedgroup=="E"){
	$mygroupid = 74;
	$grouporder = "JAPÃO | ESPANHA | ALEMANHA | COSTA RICA";
}
 elseif ($selectedgroup=="F"){
	$mygroupid = 75;
	$grouporder = "MARROCOS | CROÁCIA | BÉLGICA | CANADÁ";
}
 elseif ($selectedgroup=="G"){
	$mygroupid = 76;
	$grouporder = "BRASIL | SUÍÇA | CAMARÕES | SÉRVIA";
}
 elseif ($selectedgroup=="H"){
	$mygroupid = 77;
	$grouporder = "PORTUGAL | CORÉIA DO SUL | URUGUAI | GANA";
}

	$sql = "SELECT BET_POINTS FROM BETS WHERE BETS.USERID=" . $selectedid . " AND BETS.GAME_ID = ". $mygroupid;

	echo "<table>";

$result2 = $conn2->query($sql);
if ($result2->num_rows > 0) {
	 while($row2 = $result2->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr>";
				echo "<td class='o-col-44px'><strong>". $grouporder. "</strong></td>";
				echo "<td class='o-col-44px'><strong> PONTOS CLASSIFICAÇÃO GRUPO: ". utf8_encode($row2["BET_POINTS"]). "</strong></td>";
			echo "</tr>"; 
	 }
 }
 else {
 }
 echo "</table>";
?>
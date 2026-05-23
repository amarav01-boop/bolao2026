<?php 

//  *************************************
//  									*
// 				SHOW STRIKER GOALS    	*
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

	$mygroupid = 80;
	$grouporder = "8 GOLS";


	$sql = "SELECT BET_POINTS FROM BETS WHERE BETS.USERID=" . $selectedid . " AND BETS.GAME_ID = ". $mygroupid;

	echo "<table>";

$result2 = $conn2->query($sql);
if ($result2->num_rows > 0) {
	 while($row2 = $result2->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr>";
				echo "<td class='o-col-44px'><strong>". $grouporder. "</strong></td>";
				echo "<td class='o-col-44px'><strong> PONTOS GOLS DO ARTILHEIRO: ". utf8_encode($row2["BET_POINTS"]). "</strong></td>";
			echo "</tr>"; 
	 }
 }
 else {
 }
 echo "</table>";
?>
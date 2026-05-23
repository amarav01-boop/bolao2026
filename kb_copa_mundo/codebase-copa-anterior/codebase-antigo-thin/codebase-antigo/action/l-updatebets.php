<?php

//  *************************************
//  									*
// 				FINAIS	  				*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtJogo63PlacarA"];
$jogo1placarB = $_POST["txtJogo63PlacarB"];
$jogo2placarA = $_POST["txtJogo64PlacarA"];
$jogo2placarB = $_POST["txtJogo64PlacarB"];
$error = "...";

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE BETS SET SCORE_A = '" .$jogo1placarA . "', SCORE_B = '" . $jogo1placarB ."' WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 63;";
$sql .= "UPDATE BETS SET SCORE_A = '" .$jogo2placarA . "', SCORE_B = '" . $jogo2placarB ."' WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 64;";

if (!$mysqli->multi_query($sql)) {
    echo "Multi query failed: (" . $mysqli->errno . ") " . $mysqli->error;
}

do {
    if ($res = $mysqli->store_result()) {
        var_dump($res->fetch_all(MYSQLI_ASSOC));
        $res->free();
    }
} while ($mysqli->more_results() && $mysqli->next_result());

$_SESSION["betsupdated"] = "Palpites atualizados as ". date("d-m-Y h:i:sa");
header("location: ../l-group.php#palpites"); //send user back to the new user page.

?>

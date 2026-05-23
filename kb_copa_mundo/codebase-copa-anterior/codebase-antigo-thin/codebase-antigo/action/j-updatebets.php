<?php

//  *************************************
//  									*
// 				QUARTAS DE FINAL		*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtJogo57PlacarA"];
$jogo1placarB = $_POST["txtJogo57PlacarB"];
$jogo2placarA = $_POST["txtJogo58PlacarA"];
$jogo2placarB = $_POST["txtJogo58PlacarB"];
$jogo3placarA = $_POST["txtJogo59PlacarA"];
$jogo3placarB = $_POST["txtJogo59PlacarB"];
$jogo4placarA = $_POST["txtJogo60PlacarA"];
$jogo4placarB = $_POST["txtJogo60PlacarB"];
$error = "...";

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE BETS SET SCORE_A = '" .$jogo1placarA . "', SCORE_B = '" . $jogo1placarB ."' WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 57;";
$sql .= "UPDATE BETS SET SCORE_A = '" .$jogo2placarA . "', SCORE_B = '" . $jogo2placarB ."' WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 58;";
$sql .= "UPDATE BETS SET SCORE_A = '" .$jogo3placarA . "', SCORE_B = '" . $jogo3placarB ."' WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 59;";
$sql .= "UPDATE BETS SET SCORE_A = '" .$jogo4placarA . "', SCORE_B = '" . $jogo4placarB ."' WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 60;";

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
header("location: ../j-group.php#palpites"); //send user back to the new user page.

?>

<?php

//  *************************************
//  									*
// 				GROUP C 				*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtJogo13PlacarA"];
$jogo1placarB = $_POST["txtJogo13PlacarB"];
$jogo2placarA = $_POST["txtJogo14PlacarA"];
$jogo2placarB = $_POST["txtJogo14PlacarB"];
$jogo3placarA = $_POST["txtJogo15PlacarA"];
$jogo3placarB = $_POST["txtJogo15PlacarB"];
$jogo4placarA = $_POST["txtJogo16PlacarA"];
$jogo4placarB = $_POST["txtJogo16PlacarB"];
$jogo5placarA = $_POST["txtJogo17PlacarA"];
$jogo5placarB = $_POST["txtJogo17PlacarB"];
$jogo6placarA = $_POST["txtJogo18PlacarA"];
$jogo6placarB = $_POST["txtJogo18PlacarB"];
$error = "...";

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE BETS SET SCORE_A = " .$jogo1placarA . ", SCORE_B = " . $jogo1placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 13;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo2placarA . ", SCORE_B = " . $jogo2placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 14;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo3placarA . ", SCORE_B = " . $jogo3placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 15;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo4placarA . ", SCORE_B = " . $jogo4placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 16;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo5placarA . ", SCORE_B = " . $jogo5placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 17;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo6placarA . ", SCORE_B = " . $jogo6placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 18;";

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
header("location: ../c-group.php#palpites"); //send user back to the new user page.

?>

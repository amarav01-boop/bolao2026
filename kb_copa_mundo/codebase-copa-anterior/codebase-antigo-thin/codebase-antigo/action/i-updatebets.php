<?php

//  *************************************
//  									*
// 				OITAVAS DE FINAL		*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtJogo49PlacarA"];
$jogo1placarB = $_POST["txtJogo49PlacarB"];
$jogo2placarA = $_POST["txtJogo50PlacarA"];
$jogo2placarB = $_POST["txtJogo50PlacarB"];
$jogo3placarA = $_POST["txtJogo51PlacarA"];
$jogo3placarB = $_POST["txtJogo51PlacarB"];
$jogo4placarA = $_POST["txtJogo52PlacarA"];
$jogo4placarB = $_POST["txtJogo52PlacarB"];
$jogo5placarA = $_POST["txtJogo53PlacarA"];
$jogo5placarB = $_POST["txtJogo53PlacarB"];
$jogo6placarA = $_POST["txtJogo54PlacarA"];
$jogo6placarB = $_POST["txtJogo54PlacarB"];
$jogo7placarA = $_POST["txtJogo55PlacarA"];
$jogo7placarB = $_POST["txtJogo55PlacarB"];
$jogo8placarA = $_POST["txtJogo56PlacarA"];
$jogo8placarB = $_POST["txtJogo56PlacarB"];
$error = "...";

//if is_null($jogo1placarA)==true { $jogo1placarA=0}
/*if is_null($jogo1placarB) { $jogo1placarB=0}
if is_null($jogo2placarA) { $jogo2placarA=0}
if is_null($jogo2placarB) { $jogo2placarB=0}
if is_null($jogo3placarA) { $jogo3placarA=0}
if is_null($jogo3placarB) { $jogo3placarB=0}
if is_null($jogo4placarA) { $jogo4placarA=0}
if is_null($jogo4placarB) { $jogo4placarB=0}
if is_null($jogo5placarA) { $jogo5placarA=0}
if is_null($jogo5placarB) { $jogo5placarB=0}*/

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE BETS SET SCORE_A = " .$jogo1placarA . ", SCORE_B = " . $jogo1placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 49;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo2placarA . ", SCORE_B = " . $jogo2placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 50;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo3placarA . ", SCORE_B = " . $jogo3placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 51;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo4placarA . ", SCORE_B = " . $jogo4placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 52;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo5placarA . ", SCORE_B = " . $jogo5placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 53;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo6placarA . ", SCORE_B = " . $jogo6placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 54;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo7placarA . ", SCORE_B = " . $jogo7placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 55;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo8placarA . ", SCORE_B = " . $jogo8placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 56;";

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
header("location: ../i-group.php#palpites"); //send user back to the new user page.

?>

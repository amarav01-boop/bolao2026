<?php

//  *************************************
//  									*
// 				GROUP F 				*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtJogo31PlacarA"];
$jogo1placarB = $_POST["txtJogo31PlacarB"];
$jogo2placarA = $_POST["txtJogo32PlacarA"];
$jogo2placarB = $_POST["txtJogo32PlacarB"];
$jogo3placarA = $_POST["txtJogo33PlacarA"];
$jogo3placarB = $_POST["txtJogo33PlacarB"];
$jogo4placarA = $_POST["txtJogo34PlacarA"];
$jogo4placarB = $_POST["txtJogo34PlacarB"];
$jogo5placarA = $_POST["txtJogo35PlacarA"];
$jogo5placarB = $_POST["txtJogo35PlacarB"];
$jogo6placarA = $_POST["txtJogo36PlacarA"];
$jogo6placarB = $_POST["txtJogo36PlacarB"];
$error = "...";

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE BETS SET SCORE_A = " .$jogo1placarA . ", SCORE_B = " . $jogo1placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 31;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo2placarA . ", SCORE_B = " . $jogo2placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 32;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo3placarA . ", SCORE_B = " . $jogo3placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 33;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo4placarA . ", SCORE_B = " . $jogo4placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 34;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo5placarA . ", SCORE_B = " . $jogo5placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 35;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo6placarA . ", SCORE_B = " . $jogo6placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 36;";

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
header("location: ../f-group.php#palpites"); //send user back to the new user page.

?>

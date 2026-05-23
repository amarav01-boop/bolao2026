<?php

//  *************************************
//  									*
// 				GROUP D 				*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtJogo19PlacarA"];
$jogo1placarB = $_POST["txtJogo19PlacarB"];
$jogo2placarA = $_POST["txtJogo20PlacarA"];
$jogo2placarB = $_POST["txtJogo20PlacarB"];
$jogo3placarA = $_POST["txtJogo21PlacarA"];
$jogo3placarB = $_POST["txtJogo21PlacarB"];
$jogo4placarA = $_POST["txtJogo22PlacarA"];
$jogo4placarB = $_POST["txtJogo22PlacarB"];
$jogo5placarA = $_POST["txtJogo23PlacarA"];
$jogo5placarB = $_POST["txtJogo23PlacarB"];
$jogo6placarA = $_POST["txtJogo24PlacarA"];
$jogo6placarB = $_POST["txtJogo24PlacarB"];
$error = "...";

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE BETS SET SCORE_A = " .$jogo1placarA . ", SCORE_B = " . $jogo1placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 19;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo2placarA . ", SCORE_B = " . $jogo2placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 20;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo3placarA . ", SCORE_B = " . $jogo3placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 21;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo4placarA . ", SCORE_B = " . $jogo4placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 22;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo5placarA . ", SCORE_B = " . $jogo5placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 23;";
$sql .= "UPDATE BETS SET SCORE_A = " .$jogo6placarA . ", SCORE_B = " . $jogo6placarB ." WHERE USERID = " . $_SESSION["userid"] . " AND GAME_ID = 24;";

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
header("location: ../d-group.php#palpites"); //send user back to the new user page.

?>

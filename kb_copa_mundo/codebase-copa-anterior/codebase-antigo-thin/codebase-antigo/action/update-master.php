<?php

//  *************************************
//  									*
// 				UPDATE MASTER			*
//										*
//***************************************

session_start();

date_default_timezone_set('America/Sao_Paulo');

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$jogo1placarA = $_POST["txtGame1_A"];
$jogo1placarB = $_POST["txtGame1_B"];
$jogo1status = $_POST["txtGame1_Status"];

$jogo2placarA = $_POST["txtGame2_A"];
$jogo2placarB = $_POST["txtGame2_B"];
$jogo2status = $_POST["txtGame2_Status"];

$jogo3placarA = $_POST["txtGame3_A"];
$jogo3placarB = $_POST["txtGame3_B"];
$jogo3status = $_POST["txtGame3_Status"];

$jogo4placarA = $_POST["txtGame4_A"];
$jogo4placarB = $_POST["txtGame4_B"];
$jogo4status = $_POST["txtGame4_Status"];

$jogo5placarA = $_POST["txtGame5_A"];
$jogo5placarB = $_POST["txtGame5_B"];
$jogo5status = $_POST["txtGame5_Status"];

$jogo6placarA = $_POST["txtGame6_A"];
$jogo6placarB = $_POST["txtGame6_B"];
$jogo6status = $_POST["txtGame6_Status"];

$jogo7placarA= $_POST["txtGame7_A"];
$jogo7placarB= $_POST['txtGame7_B'];
$jogo7status= $_POST['txtGame7_Status'];

$jogo8placarA= $_POST["txtGame8_A"];
$jogo8placarB= $_POST['txtGame8_B'];
$jogo8status= $_POST['txtGame8_Status'];

$jogo9placarA= $_POST["txtGame9_A"];
$jogo9placarB= $_POST['txtGame9_B'];
$jogo9status= $_POST['txtGame9_Status'];

$jogo10placarA= $_POST["txtGame10_A"];
$jogo10placarB= $_POST['txtGame10_B'];
$jogo10status= $_POST['txtGame10_Status'];

$jogo11placarA= $_POST["txtGame11_A"];
$jogo11placarB= $_POST['txtGame11_B'];
$jogo11status= $_POST['txtGame11_Status'];

$jogo12placarA= $_POST["txtGame12_A"];
$jogo12placarB= $_POST['txtGame12_B'];
$jogo12status= $_POST['txtGame12_Status'];

$jogo13placarA= $_POST["txtGame13_A"];
$jogo13placarB= $_POST['txtGame13_B'];
$jogo13status= $_POST['txtGame13_Status'];

$jogo14placarA= $_POST["txtGame14_A"];
$jogo14placarB= $_POST['txtGame14_B'];
$jogo14status= $_POST['txtGame14_Status'];

$jogo15placarA= $_POST["txtGame15_A"];
$jogo15placarB= $_POST['txtGame15_B'];
$jogo15status= $_POST['txtGame15_Status'];

$jogo16placarA= $_POST["txtGame16_A"];
$jogo16placarB= $_POST['txtGame16_B'];
$jogo16status= $_POST['txtGame16_Status'];

$jogo17placarA= $_POST["txtGame17_A"];
$jogo17placarB= $_POST['txtGame17_B'];
$jogo17status= $_POST['txtGame17_Status'];

$jogo18placarA= $_POST["txtGame18_A"];
$jogo18placarB= $_POST['txtGame18_B'];
$jogo18status= $_POST['txtGame18_Status'];

$jogo19placarA= $_POST["txtGame19_A"];
$jogo19placarB= $_POST['txtGame19_B'];
$jogo19status= $_POST['txtGame19_Status'];

$jogo20placarA= $_POST["txtGame20_A"];
$jogo20placarB= $_POST['txtGame20_B'];
$jogo20status= $_POST['txtGame20_Status'];

$jogo21placarA= $_POST["txtGame21_A"];
$jogo21placarB= $_POST['txtGame21_B'];
$jogo21status= $_POST['txtGame21_Status'];

$jogo22placarA= $_POST["txtGame22_A"];
$jogo22placarB= $_POST['txtGame22_B'];
$jogo22status= $_POST['txtGame22_Status'];

$jogo23placarA= $_POST["txtGame23_A"];
$jogo23placarB= $_POST['txtGame23_B'];
$jogo23status= $_POST['txtGame23_Status'];

$jogo24placarA= $_POST["txtGame24_A"];
$jogo24placarB= $_POST['txtGame24_B'];
$jogo24status= $_POST['txtGame24_Status'];

$jogo25placarA= $_POST["txtGame25_A"];
$jogo25placarB= $_POST['txtGame25_B'];
$jogo25status= $_POST['txtGame25_Status'];

$jogo26placarA= $_POST["txtGame26_A"];
$jogo26placarB= $_POST['txtGame26_B'];
$jogo26status= $_POST['txtGame26_Status'];

$jogo27placarA= $_POST["txtGame27_A"];
$jogo27placarB= $_POST['txtGame27_B'];
$jogo27status= $_POST['txtGame27_Status'];

$jogo28placarA= $_POST["txtGame28_A"];
$jogo28placarB= $_POST['txtGame28_B'];
$jogo28status= $_POST['txtGame28_Status'];

$jogo29placarA= $_POST["txtGame29_A"];
$jogo29placarB= $_POST['txtGame29_B'];
$jogo29status= $_POST['txtGame29_Status'];

$jogo30placarA= $_POST["txtGame30_A"];
$jogo30placarB= $_POST['txtGame30_B'];
$jogo30status= $_POST['txtGame30_Status'];

$jogo31placarA= $_POST["txtGame31_A"];
$jogo31placarB= $_POST['txtGame31_B'];
$jogo31status= $_POST['txtGame31_Status'];

$jogo32placarA= $_POST["txtGame32_A"];
$jogo32placarB= $_POST['txtGame32_B'];
$jogo32status= $_POST['txtGame32_Status'];

$jogo33placarA= $_POST["txtGame33_A"];
$jogo33placarB= $_POST['txtGame33_B'];
$jogo33status= $_POST['txtGame33_Status'];

$jogo34placarA= $_POST["txtGame34_A"];
$jogo34placarB= $_POST['txtGame34_B'];
$jogo34status= $_POST['txtGame34_Status'];

$jogo35placarA= $_POST["txtGame35_A"];
$jogo35placarB= $_POST['txtGame35_B'];
$jogo35status= $_POST['txtGame35_Status'];

$jogo36placarA= $_POST["txtGame36_A"];
$jogo36placarB= $_POST['txtGame36_B'];
$jogo36status= $_POST['txtGame36_Status'];

$jogo37placarA= $_POST["txtGame37_A"];
$jogo37placarB= $_POST['txtGame37_B'];
$jogo37status= $_POST['txtGame37_Status'];

$jogo38placarA= $_POST["txtGame38_A"];
$jogo38placarB= $_POST['txtGame38_B'];
$jogo38status= $_POST['txtGame38_Status'];

$jogo39placarA= $_POST["txtGame39_A"];
$jogo39placarB= $_POST['txtGame39_B'];
$jogo39status= $_POST['txtGame39_Status'];

$jogo40placarA= $_POST["txtGame40_A"];
$jogo40placarB= $_POST['txtGame40_B'];
$jogo40status= $_POST['txtGame40_Status'];

$jogo41placarA= $_POST["txtGame41_A"];
$jogo41placarB= $_POST['txtGame41_B'];
$jogo41status= $_POST['txtGame41_Status'];

$jogo42placarA= $_POST["txtGame42_A"];
$jogo42placarB= $_POST['txtGame42_B'];
$jogo42status= $_POST['txtGame42_Status'];

$jogo43placarA= $_POST["txtGame43_A"];
$jogo43placarB= $_POST['txtGame43_B'];
$jogo43status= $_POST['txtGame43_Status'];

$jogo44placarA= $_POST["txtGame44_A"];
$jogo44placarB= $_POST['txtGame44_B'];
$jogo44status= $_POST['txtGame44_Status'];

$jogo45placarA= $_POST["txtGame45_A"];
$jogo45placarB= $_POST['txtGame45_B'];
$jogo45status= $_POST['txtGame45_Status'];

$jogo46placarA= $_POST["txtGame46_A"];
$jogo46placarB= $_POST['txtGame46_B'];
$jogo46status= $_POST['txtGame46_Status'];

$jogo47placarA= $_POST["txtGame47_A"];
$jogo47placarB= $_POST['txtGame47_B'];
$jogo47status= $_POST['txtGame47_Status'];

$jogo48placarA= $_POST["txtGame48_A"];
$jogo48placarB= $_POST['txtGame48_B'];
$jogo48status= $_POST['txtGame48_Status'];

$jogo49placarA= $_POST["txtGame49_A"];
$jogo49placarB= $_POST['txtGame49_B'];
$jogo49status= $_POST['txtGame49_Status'];

$jogo50placarA= $_POST["txtGame50_A"];
$jogo50placarB= $_POST['txtGame50_B'];
$jogo50status= $_POST['txtGame50_Status'];

$jogo51placarA= $_POST["txtGame51_A"];
$jogo51placarB= $_POST['txtGame51_B'];
$jogo51status= $_POST['txtGame51_Status'];

$jogo52placarA= $_POST["txtGame52_A"];
$jogo52placarB= $_POST['txtGame52_B'];
$jogo52status= $_POST['txtGame52_Status'];

$jogo53placarA= $_POST["txtGame53_A"];
$jogo53placarB= $_POST['txtGame53_B'];
$jogo53status= $_POST['txtGame53_Status'];

$jogo54placarA= $_POST["txtGame54_A"];
$jogo54placarB= $_POST['txtGame54_B'];
$jogo54status= $_POST['txtGame54_Status'];

$jogo55placarA= $_POST["txtGame55_A"];
$jogo55placarB= $_POST['txtGame55_B'];
$jogo55status= $_POST['txtGame55_Status'];

$jogo56placarA= $_POST["txtGame56_A"];
$jogo56placarB= $_POST['txtGame56_B'];
$jogo56status= $_POST['txtGame56_Status'];

$jogo57placarA= $_POST["txtGame57_A"];
$jogo57placarB= $_POST['txtGame57_B'];
$jogo57status= $_POST['txtGame57_Status'];

$jogo58placarA= $_POST["txtGame58_A"];
$jogo58placarB= $_POST['txtGame58_B'];
$jogo58status= $_POST['txtGame58_Status'];

$jogo59placarA= $_POST["txtGame59_A"];
$jogo59placarB= $_POST['txtGame59_B'];
$jogo59status= $_POST['txtGame59_Status'];

$jogo60placarA= $_POST["txtGame60_A"];
$jogo60placarB= $_POST['txtGame60_B'];
$jogo60status= $_POST['txtGame60_Status'];

$jogo61placarA= $_POST["txtGame61_A"];
$jogo61placarB= $_POST['txtGame61_B'];
$jogo61status= $_POST['txtGame61_Status'];

$jogo62placarA= $_POST["txtGame62_A"];
$jogo62placarB= $_POST['txtGame62_B'];
$jogo62status= $_POST['txtGame62_Status'];

$jogo63placarA= $_POST["txtGame63_A"];
$jogo63placarB= $_POST['txtGame63_B'];
$jogo63status= $_POST['txtGame63_Status'];

$jogo64placarA= $_POST["txtGame64_A"];
$jogo64placarB= $_POST['txtGame64_B'];
$jogo64status= $_POST['txtGame64_Status'];

$roundId1 = $_POST["txtRound1"];
$roundId2 = $_POST["txtRound2"];
$roundId3 = $_POST["txtRound3"];
$roundId4 = $_POST["txtRound4"];
$roundId5 = $_POST["txtRound5"];
$roundId6 = $_POST["txtRound6"];
$roundId7 = $_POST["txtRound7"];
$roundId8 = $_POST["txtRound8"];
$roundId9 = $_POST["txtRound9"];
$roundId10 = $_POST["txtRound10"];
$roundId11 = $_POST["txtRound11"];
$roundId12 = $_POST["txtRound12"];
$roundId13 = $_POST["txtRound13"];
/* round 14 is for group classification: A, B, C, D */
$roundId14 = $_POST["txtRound14"];
$roundId15 = $_POST["txtRound15"];
$roundId16 = $_POST["txtRound16"];
/* round 17 is for group classification: E, F, G, H */
$roundId17 = $_POST["txtRound17"];
$roundId18 = $_POST["txtRound18"];
$roundId19 = $_POST["txtRound19"];
/* round 20 is for semifinals team points*/
$roundId21 = $_POST["txtRound21"];
$roundId22 = $_POST["txtRound22"];
/* round 23 is for Striker*/
/* round 24 is for Striker Goals*/
/* round 25 is for Champion*/

$error = "...";

$mysqli = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "UPDATE MASTER SET SCORE_A = " .$jogo1placarA . ", SCORE_B = " . $jogo1placarB .", GAME_STATUS = " . $jogo1status . " WHERE GAME_ID = 1;";
$sql.= "UPDATE MASTER SET SCORE_A = " .$jogo2placarA . ", SCORE_B = " . $jogo2placarB .", GAME_STATUS = " . $jogo2status . " WHERE GAME_ID = 2;";
$sql.= "UPDATE MASTER SET SCORE_A = " .$jogo3placarA . ", SCORE_B = " . $jogo3placarB .", GAME_STATUS = " . $jogo3status . " WHERE GAME_ID = 3;";
$sql.= "UPDATE MASTER SET SCORE_A = " .$jogo4placarA . ", SCORE_B = " . $jogo4placarB .", GAME_STATUS = " . $jogo4status . " WHERE GAME_ID = 4;";
$sql.= "UPDATE MASTER SET SCORE_A = " .$jogo5placarA . ", SCORE_B = " . $jogo5placarB .", GAME_STATUS = " . $jogo5status . " WHERE GAME_ID = 5;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo6placarA . ", SCORE_B= " . $jogo6placarB. ", GAME_STATUS = ".$jogo6status. " WHERE GAME_ID = 6;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo7placarA . ", SCORE_B= " . $jogo7placarB. ", GAME_STATUS = ".$jogo7status. " WHERE GAME_ID = 7;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo8placarA . ", SCORE_B= " . $jogo8placarB. ", GAME_STATUS = ".$jogo8status. " WHERE GAME_ID = 8;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo9placarA . ", SCORE_B= " . $jogo9placarB. ", GAME_STATUS = ".$jogo9status. " WHERE GAME_ID = 9;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo10placarA . ", SCORE_B= " . $jogo10placarB. ", GAME_STATUS = ".$jogo10status. " WHERE GAME_ID = 10;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo11placarA . ", SCORE_B= " . $jogo11placarB. ", GAME_STATUS = ".$jogo11status. " WHERE GAME_ID = 11;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo12placarA . ", SCORE_B= " . $jogo12placarB. ", GAME_STATUS = ".$jogo12status. " WHERE GAME_ID = 12;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo13placarA . ", SCORE_B= " . $jogo13placarB. ", GAME_STATUS = ".$jogo13status. " WHERE GAME_ID = 13;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo14placarA . ", SCORE_B= " . $jogo14placarB. ", GAME_STATUS = ".$jogo14status. " WHERE GAME_ID = 14;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo15placarA . ", SCORE_B= " . $jogo15placarB. ", GAME_STATUS = ".$jogo15status. " WHERE GAME_ID = 15;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo16placarA . ", SCORE_B= " . $jogo16placarB. ", GAME_STATUS = ".$jogo16status. " WHERE GAME_ID = 16;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo17placarA . ", SCORE_B= " . $jogo17placarB. ", GAME_STATUS = ".$jogo17status. " WHERE GAME_ID = 17;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo18placarA . ", SCORE_B= " . $jogo18placarB. ", GAME_STATUS = ".$jogo18status. " WHERE GAME_ID = 18;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo19placarA . ", SCORE_B= " . $jogo19placarB. ", GAME_STATUS = ".$jogo19status. " WHERE GAME_ID = 19;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo20placarA . ", SCORE_B= " . $jogo20placarB. ", GAME_STATUS = ".$jogo20status. " WHERE GAME_ID = 20;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo21placarA . ", SCORE_B= " . $jogo21placarB. ", GAME_STATUS = ".$jogo21status. " WHERE GAME_ID = 21;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo22placarA . ", SCORE_B= " . $jogo22placarB. ", GAME_STATUS = ".$jogo22status. " WHERE GAME_ID = 22;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo23placarA . ", SCORE_B= " . $jogo23placarB. ", GAME_STATUS = ".$jogo23status. " WHERE GAME_ID = 23;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo24placarA . ", SCORE_B= " . $jogo24placarB. ", GAME_STATUS = ".$jogo24status. " WHERE GAME_ID = 24;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo25placarA . ", SCORE_B= " . $jogo25placarB. ", GAME_STATUS = ".$jogo25status. " WHERE GAME_ID = 25;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo26placarA . ", SCORE_B= " . $jogo26placarB. ", GAME_STATUS = ".$jogo26status. " WHERE GAME_ID = 26;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo27placarA . ", SCORE_B= " . $jogo27placarB. ", GAME_STATUS = ".$jogo27status. " WHERE GAME_ID = 27;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo28placarA . ", SCORE_B= " . $jogo28placarB. ", GAME_STATUS = ".$jogo28status. " WHERE GAME_ID = 28;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo29placarA . ", SCORE_B= " . $jogo29placarB. ", GAME_STATUS = ".$jogo29status. " WHERE GAME_ID = 29;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo30placarA . ", SCORE_B= " . $jogo30placarB. ", GAME_STATUS = ".$jogo30status. " WHERE GAME_ID = 30;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo31placarA . ", SCORE_B= " . $jogo31placarB. ", GAME_STATUS = ".$jogo31status. " WHERE GAME_ID = 31;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo32placarA . ", SCORE_B= " . $jogo32placarB. ", GAME_STATUS = ".$jogo32status. " WHERE GAME_ID = 32;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo33placarA . ", SCORE_B= " . $jogo33placarB. ", GAME_STATUS = ".$jogo33status. " WHERE GAME_ID = 33;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo34placarA . ", SCORE_B= " . $jogo34placarB. ", GAME_STATUS = ".$jogo34status. " WHERE GAME_ID = 34;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo35placarA . ", SCORE_B= " . $jogo35placarB. ", GAME_STATUS = ".$jogo35status. " WHERE GAME_ID = 35;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo36placarA . ", SCORE_B= " . $jogo36placarB. ", GAME_STATUS = ".$jogo36status. " WHERE GAME_ID = 36;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo37placarA . ", SCORE_B= " . $jogo37placarB. ", GAME_STATUS = ".$jogo37status. " WHERE GAME_ID = 37;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo38placarA . ", SCORE_B= " . $jogo38placarB. ", GAME_STATUS = ".$jogo38status. " WHERE GAME_ID = 38;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo39placarA . ", SCORE_B= " . $jogo39placarB. ", GAME_STATUS = ".$jogo39status. " WHERE GAME_ID = 39;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo40placarA . ", SCORE_B= " . $jogo40placarB. ", GAME_STATUS = ".$jogo40status. " WHERE GAME_ID = 40;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo41placarA . ", SCORE_B= " . $jogo41placarB. ", GAME_STATUS = ".$jogo41status. " WHERE GAME_ID = 41;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo42placarA . ", SCORE_B= " . $jogo42placarB. ", GAME_STATUS = ".$jogo42status. " WHERE GAME_ID = 42;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo43placarA . ", SCORE_B= " . $jogo43placarB. ", GAME_STATUS = ".$jogo43status. " WHERE GAME_ID = 43;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo44placarA . ", SCORE_B= " . $jogo44placarB. ", GAME_STATUS = ".$jogo44status. " WHERE GAME_ID = 44;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo45placarA . ", SCORE_B= " . $jogo45placarB. ", GAME_STATUS = ".$jogo45status. " WHERE GAME_ID = 45;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo46placarA . ", SCORE_B= " . $jogo46placarB. ", GAME_STATUS = ".$jogo46status. " WHERE GAME_ID = 46;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo47placarA . ", SCORE_B= " . $jogo47placarB. ", GAME_STATUS = ".$jogo47status. " WHERE GAME_ID = 47;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo48placarA . ", SCORE_B= " . $jogo48placarB. ", GAME_STATUS = ".$jogo48status. " WHERE GAME_ID = 48;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo49placarA . ", SCORE_B= " . $jogo49placarB. ", GAME_STATUS = ".$jogo49status. " WHERE GAME_ID = 49;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo50placarA . ", SCORE_B= " . $jogo50placarB. ", GAME_STATUS = ".$jogo50status. " WHERE GAME_ID = 50;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo51placarA . ", SCORE_B= " . $jogo51placarB. ", GAME_STATUS = ".$jogo51status. " WHERE GAME_ID = 51;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo52placarA . ", SCORE_B= " . $jogo52placarB. ", GAME_STATUS = ".$jogo52status. " WHERE GAME_ID = 52;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo53placarA . ", SCORE_B= " . $jogo53placarB. ", GAME_STATUS = ".$jogo53status. " WHERE GAME_ID = 53;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo54placarA . ", SCORE_B= " . $jogo54placarB. ", GAME_STATUS = ".$jogo54status. " WHERE GAME_ID = 54;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo55placarA . ", SCORE_B= " . $jogo55placarB. ", GAME_STATUS = ".$jogo55status. " WHERE GAME_ID = 55;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo56placarA . ", SCORE_B= " . $jogo56placarB. ", GAME_STATUS = ".$jogo56status. " WHERE GAME_ID = 56;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo57placarA . ", SCORE_B= " . $jogo57placarB. ", GAME_STATUS = ".$jogo57status. " WHERE GAME_ID = 57;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo58placarA . ", SCORE_B= " . $jogo58placarB. ", GAME_STATUS = ".$jogo58status. " WHERE GAME_ID = 58;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo59placarA . ", SCORE_B= " . $jogo59placarB. ", GAME_STATUS = ".$jogo59status. " WHERE GAME_ID = 59;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo60placarA . ", SCORE_B= " . $jogo60placarB. ", GAME_STATUS = ".$jogo60status. " WHERE GAME_ID = 60;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo61placarA . ", SCORE_B= " . $jogo61placarB. ", GAME_STATUS = ".$jogo61status. " WHERE GAME_ID = 61;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo62placarA . ", SCORE_B= " . $jogo62placarB. ", GAME_STATUS = ".$jogo62status. " WHERE GAME_ID = 62;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo63placarA . ", SCORE_B= " . $jogo63placarB. ", GAME_STATUS = ".$jogo63status. " WHERE GAME_ID = 63;";
$sql.="UPDATE MASTER SET SCORE_A=" .$jogo64placarA . ", SCORE_B= " . $jogo64placarB. ", GAME_STATUS = ".$jogo64status. " WHERE GAME_ID = 64;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId1 . " WHERE ROUND_ID=1;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId2 . " WHERE ROUND_ID=2;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId3 . " WHERE ROUND_ID=3;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId4 . " WHERE ROUND_ID=4;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId5 . " WHERE ROUND_ID=5;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId6 . " WHERE ROUND_ID=6;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId7 . " WHERE ROUND_ID=7;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId8 . " WHERE ROUND_ID=8;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId9 . " WHERE ROUND_ID=9;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId10 . " WHERE ROUND_ID=10;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId11 . " WHERE ROUND_ID=11;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId12 . " WHERE ROUND_ID=12;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId13 . " WHERE ROUND_ID=13;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId14 . " WHERE ROUND_ID=14;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId15 . " WHERE ROUND_ID=15;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId16 . " WHERE ROUND_ID=16;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId17 . " WHERE ROUND_ID=17;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId18 . " WHERE ROUND_ID=18;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId19 . " WHERE ROUND_ID=19;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId21 . " WHERE ROUND_ID=21;";
$sql.= "UPDATE ROUNDS SET ROUND_STATUS = ". $roundId22 . " WHERE ROUND_ID=22;";

$sql.="UPDATE BETS
INNER JOIN 	vw_users_points 
	ON (BETS.USERID = vw_users_points.USERID  AND BETS.GAME_ID = vw_users_points.GAME_ID AND vw_users_points.GAME_STATUS = 1
	AND vw_users_points.ROUND_ID<=(select max(round_id) from rounds where round_status = 1))
SET BETS.BET_POINTS = vw_users_points.PONTOS;";

$sql.= "DELETE FROM RANKING;";

$sql.="INSERT INTO RANKING (USERID, ROUND_ID, ROUND_PTS) 
SELECT userid, round_id, sum(pontos) FROM vw_users_points
where round_id <= (select max(round_id) from rounds where round_status = 1)
and vw_users_points.game_status = 1
group by userid, round_id;";

$sql.="CALL spSetRanking()";

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
header("location: ../master.php"); //send user back to the new user page. 

?>

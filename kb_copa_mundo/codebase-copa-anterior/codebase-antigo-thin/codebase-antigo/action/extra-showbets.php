<?php 

//  *************************************
//  									*
// 				EXTRAS   				*
//										*
//***************************************

header('Content-Type: text/html; charset=utf-8');

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

$sql = "SELECT * FROM USERS WHERE USERID = " . $_SESSION["userid"];

	echo "<table border=1 cellspacing='1' cellpadding='3'>";
	echo "<tr>";
	echo "<th class='o-col-352px'>EXTRA";
	echo "</th>";
	echo "<th class='o-col-352px'>SEU PALPITE";
	echo "</th>";
	echo "</tr>";
	echo "<tr>";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			echo "<tr'>";
				echo "<td class='o-col-100px'>CAMPEÃO DA COPA DE 2022</td>";
				echo "<td class='o-col-100px'>". 
				"<select class='o-inputextra' id='txtChampion' name='txtChampion'>
					<option value='null'>SELECIONE A SELEÇÃO</option>";
				if (utf8_encode($row["CHAMPION"])=="ALEMANHA"){echo "<option value='ALEMANHA' selected>ALEMANHA</option>";}else{echo "<option value='ALEMANHA'>ALEMANHA</option>";}
				if (utf8_encode($row["CHAMPION"])=="ARABIA SAUDITA"){echo "<option value='ARABIA SAUDITA' selected>ARABIA SAUDITA</option>";}else{echo "<option value='ARABIA SAUDITA'>ARABIA SAUDITA</option>";}
				if (utf8_encode($row["CHAMPION"])=="ARGENTINA"){echo "<option value='ARGENTINA' selected>ARGENTINA</option>";}else{echo "<option value='ARGENTINA'>ARGENTINA</option>";}
				if (utf8_encode($row["CHAMPION"])=="AUSTRALIA"){echo "<option value='AUSTRALIA' selected>AUSTRALIA</option>";}else{echo "<option value='AUSTRALIA'>AUSTRALIA</option>";}
				if (utf8_encode($row["CHAMPION"])=="BELGICA"){echo "<option value='BELGICA' selected>BELGICA</option>";}else{echo "<option value='BELGICA'>BELGICA</option>";}
				if (utf8_encode($row["CHAMPION"])=="BRASIL"){echo "<option value='BRASIL' selected>BRASIL</option>";}else{echo "<option value='BRASIL'>BRASIL</option>";}
				if (utf8_encode($row["CHAMPION"])=="CAMARAOES"){echo "<option value='CAMARAOES' selected>CAMARAOES</option>";}else{echo "<option value='CAMARAOES'>CAMARAOES</option>";}
				if (utf8_encode($row["CHAMPION"])=="CANADA"){echo "<option value='CANADA' selected>CANADA</option>";}else{echo "<option value='CANADA'>CANADA</option>";}
				if (utf8_encode($row["CHAMPION"])=="CATAR"){echo "<option value='CATAR' selected>CATAR</option>";}else{echo "<option value='CATAR'>CATAR</option>";}
				if (utf8_encode($row["CHAMPION"])=="COREIA DO SUL"){echo "<option value='COREIA DO SUL' selected>COREIA DO SUL</option>";}else{echo "<option value='COREIA DO SUL'>COREIA DO SUL</option>";}
				if (utf8_encode($row["CHAMPION"])=="COSTA RICA"){echo "<option value='COSTA RICA' selected>COSTA RICA</option>";}else{echo "<option value='COSTA RICA'>COSTA RICA</option>";}
				if (utf8_encode($row["CHAMPION"])=="CROACIA"){echo "<option value='CROACIA' selected>CROACIA</option>";}else{echo "<option value='CROACIA'>CROACIA</option>";}
				if (utf8_encode($row["CHAMPION"])=="DINAMARCA"){echo "<option value='DINAMARCA' selected>DINAMARCA</option>";}else{echo "<option value='DINAMARCA'>DINAMARCA</option>";}
				if (utf8_encode($row["CHAMPION"])=="EQUADOR"){echo "<option value='EQUADOR' selected>EQUADOR</option>";}else{echo "<option value='EQUADOR'>EQUADOR</option>";}
				if (utf8_encode($row["CHAMPION"])=="ESPANHA"){echo "<option value='ESPANHA' selected>ESPANHA</option>";}else{echo "<option value='ESPANHA'>ESPANHA</option>";}
				if (utf8_encode($row["CHAMPION"])=="ESTADOS UNIDOS"){echo "<option value='ESTADOS UNIDOS' selected>ESTADOS UNIDOS</option>";}else{echo "<option value='ESTADOS UNIDOS'>ESTADOS UNIDOS</option>";}
				if (utf8_encode($row["CHAMPION"])=="FRANCA"){echo "<option value='FRANCA' selected>FRANCA</option>";}else{echo "<option value='FRANCA'>FRANCA</option>";}
				if (utf8_encode($row["CHAMPION"])=="GANA"){echo "<option value='GANA' selected>GANA</option>";}else{echo "<option value='GANA'>GANA</option>";}
				if (utf8_encode($row["CHAMPION"])=="HOLANDA"){echo "<option value='HOLANDA' selected>HOLANDA</option>";}else{echo "<option value='HOLANDA'>HOLANDA</option>";}
				if (utf8_encode($row["CHAMPION"])=="INGLATERRA"){echo "<option value='INGLATERRA' selected>INGLATERRA</option>";}else{echo "<option value='INGLATERRA'>INGLATERRA</option>";}
				if (utf8_encode($row["CHAMPION"])=="IRA"){echo "<option value='IRA' selected>IRA</option>";}else{echo "<option value='IRA'>IRA</option>";}
				if (utf8_encode($row["CHAMPION"])=="JAPAO"){echo "<option value='JAPAO' selected>JAPAO</option>";}else{echo "<option value='JAPAO'>JAPAO</option>";}
				if (utf8_encode($row["CHAMPION"])=="MARROCOS"){echo "<option value='MARROCOS' selected>MARROCOS</option>";}else{echo "<option value='MARROCOS'>MARROCOS</option>";}
				if (utf8_encode($row["CHAMPION"])=="MEXICO"){echo "<option value='MEXICO' selected>MEXICO</option>";}else{echo "<option value='MEXICO'>MEXICO</option>";}
				if (utf8_encode($row["CHAMPION"])=="PAIS DE GALES"){echo "<option value='PAIS DE GALES' selected>PAIS DE GALES</option>";}else{echo "<option value='PAIS DE GALES'>PAIS DE GALES</option>";}
				if (utf8_encode($row["CHAMPION"])=="POLONIA"){echo "<option value='POLONIA' selected>POLONIA</option>";}else{echo "<option value='POLONIA'>POLONIA</option>";}
				if (utf8_encode($row["CHAMPION"])=="PORTUGAL"){echo "<option value='PORTUGAL' selected>PORTUGAL</option>";}else{echo "<option value='PORTUGAL'>PORTUGAL</option>";}
				if (utf8_encode($row["CHAMPION"])=="SENEGAL"){echo "<option value='SENEGAL' selected>SENEGAL</option>";}else{echo "<option value='SENEGAL'>SENEGAL</option>";}
				if (utf8_encode($row["CHAMPION"])=="SERVIA"){echo "<option value='SERVIA' selected>SERVIA</option>";}else{echo "<option value='SERVIA'>SERVIA</option>";}
				if (utf8_encode($row["CHAMPION"])=="SUICA"){echo "<option value='SUICA' selected>SUICA</option>";}else{echo "<option value='SUICA'>SUICA</option>";}
				if (utf8_encode($row["CHAMPION"])=="TUNISIA"){echo "<option value='TUNISIA' selected>TUNISIA</option>";}else{echo "<option value='TUNISIA'>TUNISIA</option>";}
				if (utf8_encode($row["CHAMPION"])=="URUGUAI"){echo "<option value='URUGUAI' selected>URUGUAI</option>";}else{echo "<option value='URUGUAI'>URUGUAI</option>";}
				echo "</select></td>";
				/*echo "<td class='o-col-100px'>". "<input type='text' class= 'o-inputextra' maxlength=100 size=44 name='txtChampion' value='".utf8_encode($row["CHAMPION"]) ."' />" .  "</td>";*/
			echo "</tr>";

			echo "<tr'>";
				echo "<td class='o-col-100px'>OUTRO SEMIFINALISTA #1</td>";
				echo "<td class='o-col-100px'>". 
				"<select class='o-inputextra' id='txtSemi1' name='txtSemi1'>
					<option value='null'>SELECIONE A SELEÇÃO</option>";
					if (utf8_encode($row["SEMIFINALIST_1"])=="ALEMANHA"){echo "<option value='ALEMANHA' selected>ALEMANHA</option>";}else{echo "<option value='ALEMANHA'>ALEMANHA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="ARABIA SAUDITA"){echo "<option value='ARABIA SAUDITA' selected>ARABIA SAUDITA</option>";}else{echo "<option value='ARABIA SAUDITA'>ARABIA SAUDITA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="ARGENTINA"){echo "<option value='ARGENTINA' selected>ARGENTINA</option>";}else{echo "<option value='ARGENTINA'>ARGENTINA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="AUSTRALIA"){echo "<option value='AUSTRALIA' selected>AUSTRALIA</option>";}else{echo "<option value='AUSTRALIA'>AUSTRALIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="BELGICA"){echo "<option value='BELGICA' selected>BELGICA</option>";}else{echo "<option value='BELGICA'>BELGICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="BRASIL"){echo "<option value='BRASIL' selected>BRASIL</option>";}else{echo "<option value='BRASIL'>BRASIL</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="CAMARAOES"){echo "<option value='CAMARAOES' selected>CAMARAOES</option>";}else{echo "<option value='CAMARAOES'>CAMARAOES</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="CANADA"){echo "<option value='CANADA' selected>CANADA</option>";}else{echo "<option value='CANADA'>CANADA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="CATAR"){echo "<option value='CATAR' selected>CATAR</option>";}else{echo "<option value='CATAR'>CATAR</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="COREIA DO SUL"){echo "<option value='COREIA DO SUL' selected>COREIA DO SUL</option>";}else{echo "<option value='COREIA DO SUL'>COREIA DO SUL</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="COSTA RICA"){echo "<option value='COSTA RICA' selected>COSTA RICA</option>";}else{echo "<option value='COSTA RICA'>COSTA RICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="CROACIA"){echo "<option value='CROACIA' selected>CROACIA</option>";}else{echo "<option value='CROACIA'>CROACIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="DINAMARCA"){echo "<option value='DINAMARCA' selected>DINAMARCA</option>";}else{echo "<option value='DINAMARCA'>DINAMARCA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="EQUADOR"){echo "<option value='EQUADOR' selected>EQUADOR</option>";}else{echo "<option value='EQUADOR'>EQUADOR</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="ESPANHA"){echo "<option value='ESPANHA' selected>ESPANHA</option>";}else{echo "<option value='ESPANHA'>ESPANHA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="ESTADOS UNIDOS"){echo "<option value='ESTADOS UNIDOS' selected>ESTADOS UNIDOS</option>";}else{echo "<option value='ESTADOS UNIDOS'>ESTADOS UNIDOS</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="FRANCA"){echo "<option value='FRANCA' selected>FRANCA</option>";}else{echo "<option value='FRANCA'>FRANCA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="GANA"){echo "<option value='GANA' selected>GANA</option>";}else{echo "<option value='GANA'>GANA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="HOLANDA"){echo "<option value='HOLANDA' selected>HOLANDA</option>";}else{echo "<option value='HOLANDA'>HOLANDA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="INGLATERRA"){echo "<option value='INGLATERRA' selected>INGLATERRA</option>";}else{echo "<option value='INGLATERRA'>INGLATERRA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="IRA"){echo "<option value='IRA' selected>IRA</option>";}else{echo "<option value='IRA'>IRA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="JAPAO"){echo "<option value='JAPAO' selected>JAPAO</option>";}else{echo "<option value='JAPAO'>JAPAO</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="MARROCOS"){echo "<option value='MARROCOS' selected>MARROCOS</option>";}else{echo "<option value='MARROCOS'>MARROCOS</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="MEXICO"){echo "<option value='MEXICO' selected>MEXICO</option>";}else{echo "<option value='MEXICO'>MEXICO</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="PAIS DE GALES"){echo "<option value='PAIS DE GALES' selected>PAIS DE GALES</option>";}else{echo "<option value='PAIS DE GALES'>PAIS DE GALES</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="POLONIA"){echo "<option value='POLONIA' selected>POLONIA</option>";}else{echo "<option value='POLONIA'>POLONIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="PORTUGAL"){echo "<option value='PORTUGAL' selected>PORTUGAL</option>";}else{echo "<option value='PORTUGAL'>PORTUGAL</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="SENEGAL"){echo "<option value='SENEGAL' selected>SENEGAL</option>";}else{echo "<option value='SENEGAL'>SENEGAL</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="SERVIA"){echo "<option value='SERVIA' selected>SERVIA</option>";}else{echo "<option value='SERVIA'>SERVIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="SUICA"){echo "<option value='SUICA' selected>SUICA</option>";}else{echo "<option value='SUICA'>SUICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="TUNISIA"){echo "<option value='TUNISIA' selected>TUNISIA</option>";}else{echo "<option value='TUNISIA'>TUNISIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_1"])=="URUGUAI"){echo "<option value='URUGUAI' selected>URUGUAI</option>";}else{echo "<option value='URUGUAI'>URUGUAI</option>";}
					echo "</select></td>";
				/*echo "<td class='o-col-100px'>". "<input type='text' class= 'o-inputextra' maxlength=100 size=44 name='txtSemi1' value='".utf8_encode($row["SEMIFINALIST_1"]) ."' />" .  "</td>";*/
			echo "</tr>";

			echo "<tr>";
				echo "<td class='o-col-100px'>OUTRO SEMIFINALISTA #2</td>";
				echo "<td class='o-col-100px'>". 
				"<select class='o-inputextra' id='txtSemi2' name='txtSemi2'>
					<option value='null'>SELECIONE A SELEÇÃO</option>";
					if (utf8_encode($row["SEMIFINALIST_2"])=="ALEMANHA"){echo "<option value='ALEMANHA' selected>ALEMANHA</option>";}else{echo "<option value='ALEMANHA'>ALEMANHA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="ARABIA SAUDITA"){echo "<option value='ARABIA SAUDITA' selected>ARABIA SAUDITA</option>";}else{echo "<option value='ARABIA SAUDITA'>ARABIA SAUDITA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="ARGENTINA"){echo "<option value='ARGENTINA' selected>ARGENTINA</option>";}else{echo "<option value='ARGENTINA'>ARGENTINA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="AUSTRALIA"){echo "<option value='AUSTRALIA' selected>AUSTRALIA</option>";}else{echo "<option value='AUSTRALIA'>AUSTRALIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="BELGICA"){echo "<option value='BELGICA' selected>BELGICA</option>";}else{echo "<option value='BELGICA'>BELGICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="BRASIL"){echo "<option value='BRASIL' selected>BRASIL</option>";}else{echo "<option value='BRASIL'>BRASIL</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="CAMARAOES"){echo "<option value='CAMARAOES' selected>CAMARAOES</option>";}else{echo "<option value='CAMARAOES'>CAMARAOES</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="CANADA"){echo "<option value='CANADA' selected>CANADA</option>";}else{echo "<option value='CANADA'>CANADA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="CATAR"){echo "<option value='CATAR' selected>CATAR</option>";}else{echo "<option value='CATAR'>CATAR</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="COREIA DO SUL"){echo "<option value='COREIA DO SUL' selected>COREIA DO SUL</option>";}else{echo "<option value='COREIA DO SUL'>COREIA DO SUL</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="COSTA RICA"){echo "<option value='COSTA RICA' selected>COSTA RICA</option>";}else{echo "<option value='COSTA RICA'>COSTA RICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="CROACIA"){echo "<option value='CROACIA' selected>CROACIA</option>";}else{echo "<option value='CROACIA'>CROACIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="DINAMARCA"){echo "<option value='DINAMARCA' selected>DINAMARCA</option>";}else{echo "<option value='DINAMARCA'>DINAMARCA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="EQUADOR"){echo "<option value='EQUADOR' selected>EQUADOR</option>";}else{echo "<option value='EQUADOR'>EQUADOR</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="ESPANHA"){echo "<option value='ESPANHA' selected>ESPANHA</option>";}else{echo "<option value='ESPANHA'>ESPANHA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="ESTADOS UNIDOS"){echo "<option value='ESTADOS UNIDOS' selected>ESTADOS UNIDOS</option>";}else{echo "<option value='ESTADOS UNIDOS'>ESTADOS UNIDOS</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="FRANCA"){echo "<option value='FRANCA' selected>FRANCA</option>";}else{echo "<option value='FRANCA'>FRANCA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="GANA"){echo "<option value='GANA' selected>GANA</option>";}else{echo "<option value='GANA'>GANA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="HOLANDA"){echo "<option value='HOLANDA' selected>HOLANDA</option>";}else{echo "<option value='HOLANDA'>HOLANDA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="INGLATERRA"){echo "<option value='INGLATERRA' selected>INGLATERRA</option>";}else{echo "<option value='INGLATERRA'>INGLATERRA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="IRA"){echo "<option value='IRA' selected>IRA</option>";}else{echo "<option value='IRA'>IRA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="JAPAO"){echo "<option value='JAPAO' selected>JAPAO</option>";}else{echo "<option value='JAPAO'>JAPAO</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="MARROCOS"){echo "<option value='MARROCOS' selected>MARROCOS</option>";}else{echo "<option value='MARROCOS'>MARROCOS</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="MEXICO"){echo "<option value='MEXICO' selected>MEXICO</option>";}else{echo "<option value='MEXICO'>MEXICO</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="PAIS DE GALES"){echo "<option value='PAIS DE GALES' selected>PAIS DE GALES</option>";}else{echo "<option value='PAIS DE GALES'>PAIS DE GALES</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="POLONIA"){echo "<option value='POLONIA' selected>POLONIA</option>";}else{echo "<option value='POLONIA'>POLONIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="PORTUGAL"){echo "<option value='PORTUGAL' selected>PORTUGAL</option>";}else{echo "<option value='PORTUGAL'>PORTUGAL</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="SENEGAL"){echo "<option value='SENEGAL' selected>SENEGAL</option>";}else{echo "<option value='SENEGAL'>SENEGAL</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="SERVIA"){echo "<option value='SERVIA' selected>SERVIA</option>";}else{echo "<option value='SERVIA'>SERVIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="SUICA"){echo "<option value='SUICA' selected>SUICA</option>";}else{echo "<option value='SUICA'>SUICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="TUNISIA"){echo "<option value='TUNISIA' selected>TUNISIA</option>";}else{echo "<option value='TUNISIA'>TUNISIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_2"])=="URUGUAI"){echo "<option value='URUGUAI' selected>URUGUAI</option>";}else{echo "<option value='URUGUAI'>URUGUAI</option>";}
					echo "</select></td>";
				/*echo "<td class='o-col-100px'>". "<input type='text' class= 'o-inputextra' maxlength=100 size=44 name='txtSemi2' value='".utf8_encode($row["SEMIFINALIST_2"]) ."' />" .  "</td>";*/
			echo "</tr>";

			echo "<tr>";
				echo "<td class='o-col-100px'>OUTRO SEMIFINALISTA #3</td>";
				echo "<td class='o-col-100px'>". 
				"<select class='o-inputextra' id='txtSemi3' name='txtSemi3'>
					<option value='null'>SELECIONE A SELEÇÃO</option>";
					if (utf8_encode($row["SEMIFINALIST_3"])=="ALEMANHA"){echo "<option value='ALEMANHA' selected>ALEMANHA</option>";}else{echo "<option value='ALEMANHA'>ALEMANHA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="ARABIA SAUDITA"){echo "<option value='ARABIA SAUDITA' selected>ARABIA SAUDITA</option>";}else{echo "<option value='ARABIA SAUDITA'>ARABIA SAUDITA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="ARGENTINA"){echo "<option value='ARGENTINA' selected>ARGENTINA</option>";}else{echo "<option value='ARGENTINA'>ARGENTINA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="AUSTRALIA"){echo "<option value='AUSTRALIA' selected>AUSTRALIA</option>";}else{echo "<option value='AUSTRALIA'>AUSTRALIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="BELGICA"){echo "<option value='BELGICA' selected>BELGICA</option>";}else{echo "<option value='BELGICA'>BELGICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="BRASIL"){echo "<option value='BRASIL' selected>BRASIL</option>";}else{echo "<option value='BRASIL'>BRASIL</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="CAMARAOES"){echo "<option value='CAMARAOES' selected>CAMARAOES</option>";}else{echo "<option value='CAMARAOES'>CAMARAOES</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="CANADA"){echo "<option value='CANADA' selected>CANADA</option>";}else{echo "<option value='CANADA'>CANADA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="CATAR"){echo "<option value='CATAR' selected>CATAR</option>";}else{echo "<option value='CATAR'>CATAR</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="COREIA DO SUL"){echo "<option value='COREIA DO SUL' selected>COREIA DO SUL</option>";}else{echo "<option value='COREIA DO SUL'>COREIA DO SUL</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="COSTA RICA"){echo "<option value='COSTA RICA' selected>COSTA RICA</option>";}else{echo "<option value='COSTA RICA'>COSTA RICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="CROACIA"){echo "<option value='CROACIA' selected>CROACIA</option>";}else{echo "<option value='CROACIA'>CROACIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="DINAMARCA"){echo "<option value='DINAMARCA' selected>DINAMARCA</option>";}else{echo "<option value='DINAMARCA'>DINAMARCA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="EQUADOR"){echo "<option value='EQUADOR' selected>EQUADOR</option>";}else{echo "<option value='EQUADOR'>EQUADOR</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="ESPANHA"){echo "<option value='ESPANHA' selected>ESPANHA</option>";}else{echo "<option value='ESPANHA'>ESPANHA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="ESTADOS UNIDOS"){echo "<option value='ESTADOS UNIDOS' selected>ESTADOS UNIDOS</option>";}else{echo "<option value='ESTADOS UNIDOS'>ESTADOS UNIDOS</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="FRANCA"){echo "<option value='FRANCA' selected>FRANCA</option>";}else{echo "<option value='FRANCA'>FRANCA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="GANA"){echo "<option value='GANA' selected>GANA</option>";}else{echo "<option value='GANA'>GANA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="HOLANDA"){echo "<option value='HOLANDA' selected>HOLANDA</option>";}else{echo "<option value='HOLANDA'>HOLANDA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="INGLATERRA"){echo "<option value='INGLATERRA' selected>INGLATERRA</option>";}else{echo "<option value='INGLATERRA'>INGLATERRA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="IRA"){echo "<option value='IRA' selected>IRA</option>";}else{echo "<option value='IRA'>IRA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="JAPAO"){echo "<option value='JAPAO' selected>JAPAO</option>";}else{echo "<option value='JAPAO'>JAPAO</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="MARROCOS"){echo "<option value='MARROCOS' selected>MARROCOS</option>";}else{echo "<option value='MARROCOS'>MARROCOS</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="MEXICO"){echo "<option value='MEXICO' selected>MEXICO</option>";}else{echo "<option value='MEXICO'>MEXICO</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="PAIS DE GALES"){echo "<option value='PAIS DE GALES' selected>PAIS DE GALES</option>";}else{echo "<option value='PAIS DE GALES'>PAIS DE GALES</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="POLONIA"){echo "<option value='POLONIA' selected>POLONIA</option>";}else{echo "<option value='POLONIA'>POLONIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="PORTUGAL"){echo "<option value='PORTUGAL' selected>PORTUGAL</option>";}else{echo "<option value='PORTUGAL'>PORTUGAL</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="SENEGAL"){echo "<option value='SENEGAL' selected>SENEGAL</option>";}else{echo "<option value='SENEGAL'>SENEGAL</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="SERVIA"){echo "<option value='SERVIA' selected>SERVIA</option>";}else{echo "<option value='SERVIA'>SERVIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="SUICA"){echo "<option value='SUICA' selected>SUICA</option>";}else{echo "<option value='SUICA'>SUICA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="TUNISIA"){echo "<option value='TUNISIA' selected>TUNISIA</option>";}else{echo "<option value='TUNISIA'>TUNISIA</option>";}
					if (utf8_encode($row["SEMIFINALIST_3"])=="URUGUAI"){echo "<option value='URUGUAI' selected>URUGUAI</option>";}else{echo "<option value='URUGUAI'>URUGUAI</option>";}
					echo "</select></td>";				
				/*echo "<td class='o-col-100px'>". "<input type='text' class= 'o-inputextra' maxlength=100 size=44 name='txtSemi3' value='".utf8_encode($row["SEMIFINALIST_3"]) ."' />" .  "</td>";*/
			echo "</tr>";

			echo "<tr>";
				echo "<td class='o-col-100px'>ARTILHEIRO DA COPA</td>";
				echo "<td class='o-col-100px'>". "<input type='text' class= 'o-inputextra' maxlength=100 size=44 name='txtStriker' value='".utf8_encode($row["STRIKER"]) ."' />" .  "</td>";
			echo "</tr>";

			echo "<tr>";
				echo "<td class='o-col-100px'>NÚMERO DE GOLS DO ARTILHEIRO NA COPA</td>";
				echo "<td class='o-col-100px'>". "<input type='number' maxlength=2 size=10 name='txtStrikerGoals' value='".utf8_encode($row["STRIKER_GOALS"]) ."' />" .  "</td>";
			echo "</tr>";
	 }
 }
else{
	echo "nothing...";
}


	echo "</table>";
?>
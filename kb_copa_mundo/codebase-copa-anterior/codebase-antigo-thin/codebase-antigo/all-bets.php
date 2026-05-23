<?php

	//  *************************************
	//  									*
	// 			ALL BETS   					*
	//										*
	//***************************************

	// Start the session
	session_start();

	 if (isset($_SESSION["userlogged"])) {
	 	/* echo $_SESSION["userlogged"]. " - ". $_SESSION["userid"]; */
	} else	{
		header("location: index.php"); //send user back to the login page;
	}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Bolão 2022 - Todos os palpites</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" type= "text/css" href="css/global.css" />
	<meta name="viewport" content="width=device-width">
</head>
<body>
	<div id="layout-fundo">
		<div id="layout-cabecalho">
		</div>
		<div id="layout-home-navbar">
			<ul>
				<li><a href="./home.php">Home</a></li>
				<li><span class="o-fakelink-navbar">Palpites</span></li>
				<li><a href="./img/regras-bolao-2022.pdf" target="_blank">Regras </a></li>
				<li><a href="./action/logout.php"> Sair </a></li>
				<?php 
					$adminid = $_SESSION["userid"];
					if ($adminid==4){
					echo "<li><a href='./master.php'>Master</a></li>";
				}?>
			</ul>
		</div>
		<div id= "layout-home-content">
			<h3> Apostas de todos os participantes </h3>
			<form id="formAllBets" name="formAllBets" action="./all-bets.php" method="POST">
				<select name="cboUser" id="cboUser">
					<option>Selecione um participante</option>
					<?php include "./action/populate-cbouser.php"; ?>
				</select>
				<input type="submit" value="Abrir">
			</form>
			<br>
			<?php include "./action/selected-showbets.php"; ?>
		</div>
	</div>
</body>
</html>
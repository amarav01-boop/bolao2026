<?php

	//  *************************************
	//  									*
	// 				GROUP F 				*
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
	<title>Bolão 2022 - Grupo F</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" type= "text/css" href="css/global.css" />
	<meta name="viewport" content="width=device-width">
</head>
<body>
	<div id="layout-fundo">
		<div id="layout-cabecalho">
		</div>
		<div id="layout-sidebar">
			<div class="content-desktop">
				<?php echo  "Olá, <strong>". utf8_encode($_SESSION["userlogged"]). "</strong> - " ?>
				<a href="./action/logout.php"> Sair </a><br><br>
				Seja bem-vindo ao Bolão 2022! <br> <br>
				Aqui você terá informações sobre sua pontuação, sobre a pontuação dos demais participantes, e também poderá interagir com os demais participantes através do nosso <strong>Twitter do Bolão</strong>!<br>
				<br>
				Ouvindo suas sugestões, fizemos mudanças nas regras para melhorar a competitividade do bolão! Não deixe de ler novamente <span class="o-regras"> <a target="_blank" href="./img/regras-bolao-2022.pdf">nossas regras </a> </span> e se preparar!<br><br>
				Preencha seus palpites para a Fase de Grupos ao lado! <br><br>
			</div>
			<div class="content-mobile">
				<?php echo  "Olá, <strong>". utf8_encode($_SESSION["userlogged"]). "</strong> - " ?>
				<a href="./action/logout.php"> Sair </a><br><br>
				Seja bem-vindo ao Bolão 2022! <br> <br>
				Aqui você terá informações sobre sua pontuação, sobre a pontuação dos demais participantes, e também poderá interagir com os demais participantes através do nosso <strong>Twitter do Bolão</strong>!<br>
				<br>
				Ouvindo suas sugestões, fizemos mudanças nas regras para melhorar a competitividade do bolão! Não deixe de ler novamente <span class="o-regras"> <a target="_blank" href="./img/regras-bolao-2022.pdf">nossas regras </a> </span> e se preparar!<br><br>
				Preencha seus palpites para a Fase de Grupos abaixo (faça scroll down da página)! <br><br>
			</div>
		</div>
		<div id= "layout-maincontent">
			<div id="layout-alert">
				<?php include "./action/showmessage.php"; ?>
			</div>
			<div id="layout-content">
				<h3 id="palpites"> Entre com seus palpites </h3>
				<?php 
					if(isset($_SESSION["betsupdated"])){
                	        echo "<div id='l-sucess-message-home'> ". $_SESSION["betsupdated"] ."</div>";
                    	}
				?>
				<form id="formUpdateBets" name="formUpdateBets" class="l-form-login" action="./action/f-updatebets.php" method="POST">
					<input class="o-savebutton" type="submit" name="btnLogin" value="Salvar Grupo F" />
					<span class="o-small-text">Clique aqui para salvar seus palpites para este grupo</span>
					<ul>
						<li> <a href="./a-group.php">Grupo A</a></li>
						<li> <a href="./b-group.php">Grupo B</a></li>
						<li> <a href="./c-group.php">Grupo C</a></li>
						<li> <a href="./d-group.php">Grupo D</a></li>
						<li> <a href="./e-group.php">Grupo E</a></li>
						<li> <span class="o-fakelink">Grupo F </span></li>
						<li> <a href="./g-group.php">Grupo G</a></li>
						<li> <a href="./h-group.php">Grupo H</a></li>
						<li> <a href="./extras.php">Extras</a></li>
					</ul>
					<?php include "./action/f-showbets.php"; ?>
					<?php include "./action/f-showgrouporder.php"; ?>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
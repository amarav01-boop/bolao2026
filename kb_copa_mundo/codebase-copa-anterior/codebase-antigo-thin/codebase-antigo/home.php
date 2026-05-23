<?php

	//  *************************************
	//  									*
	// 				HOME PAGE 				*
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
	<title>Bolão 2022 - Home</title>
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
				<li><span class="o-fakelink-navbar">Home </span></li>
				<!-- <li><a class="o-fakelink-navbar-special" href="./a-group.php">Grupo A</a></li>-->
				<!--<li><a class="o-fakelink-navbar-special" href="./i-group.php">Oitavas</a></li>-->
				<!--li><a class="o-fakelink-navbar-special" href="./j-group.php">Quartas</a></li>-->
				<!--<li><a class="o-fakelink-navbar-special" href="./k-group.php">Semifinais</a></li>-->
				<!--<li><a class="o-fakelink-navbar-special" href="./l-group.php">Finais</a></li>-->
				<li><a href="./all-bets.php">Palpites</a></li>
				<li><a href="./img/regras-bolao-2022.pdf" target="_blank">Regras </a></li>
				<li><a href="./action/logout.php"> Sair </a></li>
				<?php 
					$adminid = $_SESSION["userid"];
					if ($adminid==1){
					echo "<li><a href='./master.php'>Master</a></li>";
				}?>
			</ul>
		</div>
		<div id="layout-home-sidebar">
			<p> Ranking do Bolão</p>
			<!-- Sejam muito bem-vindos!!!<br>-->
			<!--Chegamos a última rodada! <br> Parabéns a todos pela participação, espero que tenham se divertido nessa jornada.  Boa sorte aos que estão na disputa pelo 1, 2 e 3 lugar! Vamos vamos ou allez allez ??-->
			Parabéns <strong>Joy (Joyce Pereira)</strong> !!! Campeã do Bolão de 2022!  Na reta final, com o acerto do artilheiro e número de gols, deixou todo mundo para trás!
			<?php include "./action/showranking.php"; ?>
		</div>
		<div id= "layout-home-content">
			<div id="layout-home-content-66">
					<h3> Twitter do Bolão </h3>
					<form name="formTwitter" id="formTwitter" action="./action/createmessage.php" method="POST">
						<?php echo utf8_encode($_SESSION["userlogged"]) ?>
						<textarea rows="3" cols="40" maxlength="140" name="txtTwitter" id="txtTwitter" placeholder="O que está rolando... conte-nos!"></textarea>
						<input class="o-savebutton" type="submit" name="btnSend" value="Enviar Mensagem"> 
					</form>
					<?php include "./action/showtwitters.php"; ?>
			</div>
			<div id="layout-home-content-33">
				<h3>Meme do dia</h3>
				<center>
					<?php include "./action/showmeme.php"; ?>
				</center>
			</div>
			<div id="layout-home-content-33">
				<h3>Estatística do dia</h3>
				<?php include "./action/showdailystatistics.php"; ?>
			</div>
		</div>
	</div>
</body>
</html>
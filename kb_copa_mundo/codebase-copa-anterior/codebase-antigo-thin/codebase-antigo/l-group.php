<?php

	//  *************************************
	//  									*
	// 				FINALS					*
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
	<title>Bolão 2022 - Finais</title>
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
				<?php echo  "Olá, <strong>". $_SESSION["userlogged"]. "</strong> - " ?>
				<a href="./action/logout.php"> Sair </a><br><br>
				<strong>Finais</strong> <br> <br>
				Chegamos na última rodada!  Que bacana foi essa Copa, não?<br> Espero que você tenha se divertido muito! Caso esteja na disputa por prêmio, boa sorte! Capriche!<br> Para você que agora só está com a disputa pessoal com seus amigos, preencha os palpites para ganhar deles! <br>Como sempre, não deixe de interagir com os demais participantes através do <strong>Twitter do Bolão</strong>!<br>
				<br>
				Confira <span class="o-regras"> <a target="_blank" href="./img/regras-bolao-2022.pdf">nossas regras </a> </span> e boa sorte!<br><br>
			</div>
			<div class="content-mobile">
				<?php echo  "Olá, <strong>". $_SESSION["userlogged"]. "</strong> - " ?>
				<a href="./action/logout.php"> Sair </a><br><br>
				<strong>Finais</strong> <br> <br>
				Chegamos na última rodada!  Que bacana foi essa Copa, não?<br> Espero que você tenha se divertido muito! Caso esteja na disputa por prêmio, boa sorte! Capriche!<br> Para você que agora só está com a disputa pessoal com seus amigos, preencha os palpites para ganhar deles! <br>Como sempre, não deixe de interagir com os demais participantes através do <strong>Twitter do Bolão</strong>!<br>
				<br>
				Confira <span class="o-regras"> <a target="_blank" href="./img/regras-bolao-2022.pdf">nossas regras </a> </span> e boa sorte!<br><br>
				Preencha seus palpites para as Oitavas abaixo (faça scroll down da página)! <br><br>
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
				<form id="formUpdateBets" name="formUpdateBets" class="l-form-login" action="./action/l-updatebets.php" method="POST">
					<input class="o-savebutton" type="submit" name="btnLogin" value="Salvar Finais" />
					<span class="o-small-text">Clique aqui para salvar seus palpites para este grupo</span>
					<ul>
						<li> <span class="o-fakelink">Finais</span></li>
						<li> <a href="./home.php">Home</a></li>
					</ul>
					<?php include "./action/l-showbets.php"; ?>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
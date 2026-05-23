<?php
	// Start the session
	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<title>Esqueci minha senha - Bolão</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type= "text/css" href="css/global.css" />
	<meta name="viewport" content="width=device-width">
</head>
<body>
	<div id="l-container-login">
		<div id="l-banner-login">
			banner
		</div>
		<?php 
			if(isset($_SESSION["error"])){
                        $error = $_SESSION["error"];
						echo "<div id='l-alert-login'> $error</div>";
                    }
		?>
		<?php 
			if(isset($_SESSION["pwdsent"])){
                        echo "<div id='l-sucess-message'> Sua senha foi reenviada para seu email!</div>";
                    }
		?>
		<div id="l-form-login">
			<br>
			<div id="l-text-whitin-page">
				Digite abaixo o seu email e clique no botão. <br>
				Dentro de alguns segundos você receberá sua senha.<br>
				Se ainda estiver com problemas,<br>
				envie email para <a href="mailto:vitoramaral@hotmail.com"> vitoramaral@hotmail.com </a><br>
				ou mande whatsapp para (11)99176-3660.<br>
			</div>
			<form id="formForgot" name="formForgot" action="./action/sendpwd.php" method="POST">
				<input class="o-inputlogin" type="email" name="txtEmail" placeholder="Email do participante" required="true"/>
				<br>
				<input class="o-loginbutton" type="submit" name="btnLogin" value="Envie a senha para o email"/>
			</form>
		</div>
		<a href="index.php" class="backbutton-class">
			<div id="l-newuser-login">Voltar</div>
		</a>
	</div>
</body>
</html>

<?php
	// Start the session
	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<title>Novo Participante</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type= "text/css" href="css/global.css" />
	<meta name="viewport" content="width=device-width">
</head>
<body>
	<div id="l-container-login">
		<div id="l-banner-login">
		
		</div>
		<?php 
			if(isset($_SESSION["error"])){
                        $error = $_SESSION["error"];
						echo "<div id='l-alert-login'> $error</div>";
                    }
		?>
		<div id="l-form-login">
			<form id="formNewUser" name="formNewUser" action="./action/createuser.php" method="POST">
				<input class="o-input-regular" type="text" name="txtName" placeholder="Nome do participante" required="true" maxlength="200" />
				<br>
				<input class="o-input-regular" type="email" name="txtEmail" placeholder="Email do participante" required="true" maxlength="250"/>
				<br>
				<div id="l-text-whitin-page-small"><strong>Importante:</strong> o nickname é como você será reconhecido no site.  Capriche no nickname, seja criativo.  Um nickname bacana causará curiosidade nos demais participantes! </div>
				<input class="o-input-regular" type="text" name="txtNickname" placeholder="Nickname do participante" required="true" maxlength="100" />
				<br>
				<input class="o-input-regular" type="text" name="txtLocation" placeholder="Localidade do participante" required="true" maxlength="200"/>
				<br>
				<input class="o-input-regular" type="text" name="txtPwd" placeholder="Senha do participante" required="true" maxlength="10" />
				<br>
				<input class="o-loginbutton" type="submit" name="btnLogin" value="Cadastrar"/>
				<br>
				<a href="./img/regras-bolao-2022.pdf"  class="forgetpwd-class target="_blank">Baixe aqui as regras do bolão da copa 2022 </a>
			</form>
		</div>

		<a href="index.php" class="backbutton-class">
			<div id="l-newuser-login">Voltar</div>
		</a>
	</div>
</body>
</html>
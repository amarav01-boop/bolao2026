<?php
	// Start the session
	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<title>Login - Bolão 2018X</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type= "text/css" href="css/global.css" />
	<meta name="viewport" content="width=device-width">
</head>
<body>
	<div id="l-container-login">
		<div id="l-banner-login">
			&nbsp;
		</div>
		<?php 
			if(isset($_SESSION["error"])){
                        $error = $_SESSION["error"];
						echo "<div id='l-alert-login'> $error</div>";
                    }
		?>
		<?php 
			if(isset($_SESSION["newusercreated"])){
                        echo "<div id='l-sucess-message'> Parabéns! Participante criado com sucesso!</div>";
                    }
		?>
		<div id="l-form-login">
			<form id="formLogin" name="formLogin" action="./action/login.php" method="POST">
				<input class="o-inputlogin" type="email" name="txtEmail" placeholder="Email do participante" required="true"/>
				<br>
				<input class="o-inputlogin" type="password" name="txtPwd" placeholder="Senha do participante" required="true"/>
				<br>
				<input class="o-loginbutton" type="submit" name="btnLogin" value="Entrar no site"/>
			</form>
			<br><br>
			<a href="helpme.php" class="forgetpwd-class">Esqueci minha senha</a>
			<br><br>
			<!--<a href="newuser.php" class="forgetpwd-class">Novo usuário</a>-->
		</div>
	</div>
</body>
</html>

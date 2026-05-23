<?php

	//  *************************************
	//  									*
	// 				MASTER  				*
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
	<title>Bolão 2018 - Home</title>
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
				<li><a href="./home.php">Home </a></li>
				<li><a href="./all-bets.php">Palpites</a></li>
				<li><a href="./action/logout.php"> Sair </a></li>
				<?php 
					$adminid = $_SESSION["userid"];
					if ($adminid==4){
					echo "<li><span class='o-fakelink-navbar'>Master</span></li>";
				}?>
			</ul>
		</div>
	<div id= "layout-home-content">
			<?php 
					if(isset($_SESSION["betsupdated"])){
                	        echo "<div id='l-sucess-message-home'> ". $_SESSION["betsupdated"] ."</div>";
                    	}
			?>
			<?php include "./action/load-master.php"; ?>
		</div>
	</div>
</body>
</html>
<?php

session_start();

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$username = $_POST["txtName"];
$useremail = $_POST["txtEmail"];
$userpwd = $_POST["txtPwd"];
$usernickname = $_POST["txtNickname"];
$userlocation = $_POST["txtLocation"];
$error = "...";
$userid = null;


// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    $error = "Connection failed: " . $conn->connect_error;
    $_SESSION["error"] = $error;
    header("location: ../newuser.php"); //send user back to the new user page.
}

// Check if nickname already exists

if (is_null($useremail)) {
 	$error = "Email não pode ser nulo/branco, amigão :(";
    $_SESSION["error"] = $error;
    $conn->close();
    header("location: ../newuser.php"); //send user back to the new user page.
    exit();
}

$sql = "call spCalculateGamePoints(1)";
$result = $conn->query($sql);


$sql = "SELECT * FROM users where USEREMAIL='" . $useremail. "'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
 	$error = "Email já está em uso por outro participante :(";
    $_SESSION["error"] = $error;
    $conn->close();
    header("location: ../newuser.php"); //send user back to the new user page.
    exit();
} 

$sql = "INSERT INTO users (USEREMAIL, USERNAME, USERNICKNAME, USERLOCATION, USERPASSWORD) VALUES('". $useremail. "', '". $username. "', '". $usernickname. "', '". $userlocation. "', '". $userpwd. "')";
echo $sql;
if ($conn->query($sql) === TRUE) {

    /** Now let's create the bets **/
    $sql = "SELECT USERID FROM users where USEREMAIL='".$useremail."'";
    $result = $conn->query($sql);
    $row = $result->fetch_array(MYSQLI_ASSOC);
    $userid = $row["USERID"];

        for ($x = 1; $x <= 64; $x++) {
            $sql = "INSERT INTO bets (USERID, GAME_ID) VALUES (".$userid.",".$x.")";
            if ($conn->query($sql) === FALSE) {
                $error = $conn->error;
                $_SESSION["error"] = $error;
                header("location: ../newuser.php"); //send user back to the new user page.
            }

        }

	    $_SESSION["error"] = null;
		$_SESSION["newusercreated"] = "New record created successfully";

        $to = $useremail;
        $subject = "Bolao Copa 2018 - Bem vindo!";
        $txt = "Olá  \r\n 
            Bem vindo a mais uma edição do nosso bolão da copa do mundo!  \r\n 
            Esperamos que você goste muito da edição deste ano, e que sua experiência seja muito divertida. Como gostamos de dizer, o nosso bolão é para pessoas que realmente gostam de futebol e copa do mundo.  Nosso objetivo continua sendo premiar aquele participante que consegue ter o melhor desempenho durante toda a copa do mundo, por isso, capriche nos palpites! Mostre que você conhece mesmo de futebol! Desejamos sorte e muita diversão! \r\n          \r\n
            Em caso de dúvidas, nos envie um email. \r\n 
            Até mais, \r\n 
            Administração do Bolão\r\n  
            http://bolao.aisportnews.com/";


        $headers = "From: bolaoaisportnews@gmail.com";

        mail($to,$subject,$txt,$headers);

		header("location: ../index.php"); //send user back to the login page.
} else {
	 $error = $conn->error;
	 $_SESSION["error"] = $error;
     header("location: ../newuser.php"); //send user back to the new user page.
}


$conn->close();

/*
if($username == "admin"){
    $_SESSION["username"] = $username;
  	$_SESSION["error"] = null;
    header("location: homepage.php"); //send user to homepage, for example.
}else{
    $_SESSION["error"] = $error;
    header("location: ../index.php"); //send user back to the login page.
}
*/
?>
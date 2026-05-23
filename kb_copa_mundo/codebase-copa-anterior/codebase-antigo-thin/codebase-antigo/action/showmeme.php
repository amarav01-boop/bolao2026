<?php 

//  *************************************
//  									*
// 				SHOW MEME  				*
//										*
//***************************************

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

$sql = "SELECT * FROM ADMIN WHERE ADMIN_ITEM = 'MEME'";

$result = $conn->query($sql);
$x=1;
if ($result->num_rows > 0) {
	 while($row = $result->fetch_array(MYSQLI_ASSOC)){
			
			$meme_img_location = $row["ADMIN_ITEM_LOCATION"];
			$meme_img_label = $row["ADMIN_ITEM_LABEL"];

			//echo "Parabéns <strong>Denys</strong> pela vitória no bolão da Copa de 2018!";	
			//echo "<img src='.\img\denys.jpg' height='132'>";
			echo utf8_encode($meme_img_label);
			echo "<img src=$meme_img_location height='132'>";			
	 }

 }
else{
	echo "no meme today :(";
}

?>
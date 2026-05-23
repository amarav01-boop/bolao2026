<!DOCTYPE html>
<html>
<head>
	<title>Bolão 2018 - Database Utiliy</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<!--<link rel="stylesheet" type= "text/css" href="../css/global.css" />-->
	<meta name="viewport" content="width=device-width">
</head>
<body>
<?php 

//  *************************************
//  									*
// 		DATABASE UTILIY 				*
//										*
//***************************************

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$error = "Não foi possível abrir tabela de apostas!";

$dbsql = $_POST["txtSQL"]; 

echo "<div id='layout-fundo'>";
echo "<form name='formRunQuery' action='dbu.php' method='POST'>";
echo "<textarea cols='80' rows='8' name='txtSQL' id='txtSQL'></textarea>";
echo "<input type='submit' class='o-runquerybutton' name='btnRunQuery' id='btnRunQuery'>";
echo "</form>";
echo "</div>";
echo "<div id='layout-fundo'>";
echo $dbsql;
echo "</div>";
echo "<div id='layout-fundo'>";
if ($dbsql){
	// Create connection
	$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

	// Check connection
	if ($conn->connect_error) {
    	$error = "Connection failed: " . $conn->connect_error;
    	$_SESSION["error"] = $error;
    	header("location: ../index.php"); //send user back to the new user page.
	}

		 echo "<table>";
	$result = $conn->query($dbsql);
	if ($result->num_rows > 0) {
		 while($row = $result->fetch_array(MYSQLI_NUM)){
		 	 /*echo "rows-". $result->num_rows;
		 	 echo "<br>";
		 	 echo "columns". mysqli_field_count($conn);*/
		 	 echo "<tr>";
		 	for ($x = 0; $x < mysqli_field_count($conn); $x++) {
   			 	/*echo "The number is: $x <br>";*/
   			 		echo "<td>";
   			 		echo $row[$x];
   			 		echo "</td>";
				}
			echo "</tr>";

		}	
		 echo "</table>";
	}
}
echo "</div>";

?>
</body>
</html>
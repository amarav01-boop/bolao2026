<?php

session_start();

session_destroy();

header("location: ../index.php"); //send user back to the login page;


?>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$file = 'db.txt';	

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	if(!isset($_POST['pid']) || !isset($_POST['optionKey'])){
		die('Error');
	}	
	$pid = $_POST['pid'];
	$optionKey = $_POST['optionKey'];
	
	$db = unserialize(file_get_contents($file));
	if(isset($db[$pid][$optionKey])){
		$db[$pid][$optionKey]++;
	}else{
		$db[$pid][$optionKey] = 1;
	}
	
	if(file_put_contents($file, serialize($db))){
		$total = 0;
		foreach($db[$pid] as $k => $v){
			$total += $v;
		}
		$arr = array('id'=> $pid, 'votes'=>$db[$pid],'total'=>$total);
	
		echo json_encode($arr);
	}
	
	//var_dump($db);
	die();
}else{

	if(!isset($_GET['pid'])){
		die('Error');
	}

	header('Content-Type: application/json');
	$pid = $_GET['pid'];

	//Increase optionKey value
	$db = unserialize(file_get_contents($file));
	
	//var_dump(isset($db[$pid]));die();
	
	$total = 0;
	
	if(!isset($db[$pid])){
		$db[$pid] = array('1'=>0, '2'=>0);
	}else{
		foreach($db[$pid] as $k => $v){
			$total += $v;
		}	
	}

	
	$arr = array('id'=> $pid, 'votes'=>$db[$pid],'total'=>$total);

	echo json_encode($arr);
	
	die();

}



?>
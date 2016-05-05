<?php
/**
 * Created by PhpStorm.
 * User: retana
 * Date: 05/05/2016
 * Time: 12:58
 */
    require_once '../db/Database.php';
    $carretera="";
    $transporte="";
    $dia="";
    $hotel="";
    $bioma="";
    $horarioIncio="";
    $horarioFinal="";
    $actividad="";
    $lugares="";
    $sitios=array();

    if(isset($_POST["carretera"])){
        $carretera=$_POST["carretera"];
        $transporte=$_POST["transporte"];
        $dia=$_POST["dia"];
        $hotel=$_POST["hotel"];
        $bioma=$_POST["bioma"];
        $horarioIncio=$_POST["horaInicio"];
        $horarioFinal=$_POST["horaFin"];
        $actividad=$_POST["actividad"];
        $lugares=$_POST["lugares"];
        $sitios=$_POST["sitios"];
    }
    $connection=Database::getInstance()->getConnection();
    mysqli_query($connection,"INSERT INTO db_tour.tour

VALUES (null,
        '".$dia."',
        '".$horarioIncio."',
        '".$horarioFinal."',
        '".$actividad."',
        '".$hotel."',
        '',
        '".$carretera."',
        '".$transporte."',
        '".$bioma."',
        '".$lugares."');");

    $result=mysqli_query($connection," SELECT LAST_INSERT_ID() AS id");
    $row=mysqli_fetch_assoc($result);

    foreach($sitios as &$item){
        mysqli_query($connection,"INSERT INTO lugar VALUES (null,
        '".$item['nombre']."',
        '".$item['longitud']."',
        '".$item['latitud']."',
        '".$row['id']."');");
    }
?>

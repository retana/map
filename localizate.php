<?php
require_once 'db/Database.php';
$id = $_GET['idTour'];
$connection = Database::getInstance()->getConnection();
$result = mysqli_query($connection, "Select * from lugar where idTour=" . $id);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description"
          content="Get Google Maps Driving Directions to plan your route or calculate your itinerary from GPS coordinates or addresses. Unlimited multiple stops or destinations.">

    <title>Tour</title>

    <link rel="stylesheet" href="css/bootstrap.css" type="text/css"/>
    <link rel="stylesheet" href="css/itilogstyle.css" type="text/css"/>
    <link rel="stylesheet" href="js/ladda/dist/ladda-themeless.min.css" type="text/css"/>


    <!-- For IE 9 and below. ICO should be 32x32 pixels in size -->
    <!--[if IE]>
    <link rel="shortcut icon" href="favicon.ico?v3"><![endif]-->
    <!-- Touch Icons - iOS and Android 2.1+ 180x180 pixels in size. -->
    <link rel="apple-touch-icon" href="apple-touch-icon.png?v3">
    <link rel="icon" type="image/png" href="android-chrome-192x192.png?v3" sizes="192x192">
    <!-- Firefox, Chrome, Safari, IE 11+ and Opera. 192x192 pixels in size. -->
    <link rel="icon" href="favicon.ico?v3">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/ladda/dist/spin.min.js"></script>
    <script src="js/ladda/dist/ladda.min.js"></script>
    <link rel="stylesheet" href="assets/css/AdminLTE.min.css">
    <!-- AdminLTE Skins. Choose a skin from the css/skins
         folder instead of downloading all of them to reduce the load. -->
    <link rel="stylesheet" href="assets/css/skins/_all-skins.min.css">


    <script>var markerPath = "images/marker_"</script>

    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?sensor=false&language=en&libraries=places"></script>
    <script type="text/javascript" src="js/map.js?v3"></script>
    <script type="text/javascript" src="js/directions.js"></script>
    <script type="text/javascript" src="js/language_en.js?v3"></script>


</head>


<body class="hold-transition skin-green layout-top-nav" onload="initialize(14.625486, -90.535399);"


<div class="wrapper">
    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div id="logged_bar">
            <div class="navbar-collapse collapse">
                <div class="container">
                    <div class="row" id="topbar">
                    </div>
                </div>
            </div>
        </div>

        <div class="navbar-header">

            <div class="container header-container">

                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" href="/">Agencia<span> De Viajes</span></a>
            </div>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
            <div class="container">
                <div class="row">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="index.php">Regresar a Inicio</a></li>

                    </ul>
                </div>
            </div>
        </div>
        <!--/.nav-collapse -->

    </nav>
    <div class="content">
        <div class="row">
            <div id="map_wrapper">
                <div id="map_canvas"></div>
                <div id="map_buttons">
                    <button id="b1" class="directions_button btn btn-primary btn-xs ladda-button" data-style="zoom-in"
                            onclick="calcRoute( function() { l1.stop(); l2.stop(); l3.stop(); });"><span
                            class="ladda-label">Trazar Ruta</span>
                    </button>
                    <button class="submit_button btn btn-primary btn-xs hidden" type="submit" name="connect"
                            onclick="displayInfo(); $('#form_orig_submit').trigger('click');">Guardar
                    </button>
                    <button id="show_traffic" class="submit_button weather white btn btn-primary btn-xs"
                            onclick="showTraffic();">Trafico
                    </button>
                    <button id="hide_traffic" class="submit_button weather white btn btn-success btn-xs"
                            style="display:none"
                            onclick="hideTraffic();">Trafico
                    </button>
                </div>

                <div id="tools" class="col-md-5">
                    <div class="row">
                        <div class="col-md-12">
                            <div id="poi_box" class="info_box">
                                <div id=poi_wrapper>
                                    <div id="itiInfo">
                                        <form name="itiform" id="itiform" class="form-horizontal" method="post"
                                              autocomplete="off">
                                            <div id="tools_display" class="form-group" style="display:none;">
                                                <div class="col-sm-12 text-right">
                                                    <button type="button" class="btn btn-primary"
                                                            onclick="displayDirections()">
                                                        Ver detalle de ruta
                                                    </button>
                                                </div>
                                            </div>
                                            <h1 class="tools_title">Información de Tour</h1>
                                            <ul id="coordinates_sortable" class="coordinates list-unstyled"
                                                data-prototype="&lt;div id=&quot;dp_itibundle_itinerarytype_coordinates___name__&quot; &gt;                &lt;input type=&quot;text&quot; id=&quot;dp_itibundle_itinerarytype_coordinates___name___ordre&quot; name=&quot;dp_itibundle_itinerarytype[coordinates][__name__][ordre]&quot; readonly=&quot;readonly&quot; class=&quot;class_ordre form-control&quot; style=&quot;display:none;&quot; style_marker=&quot;width:8%;&quot; style=&quot; display:none;&quot; /&gt;
			&lt;span class=&quot;order_marker text-center table-cell&quot; style=&quot;width:8%;&quot;&gt;&lt;/span&gt;
						&lt;input type=&quot;text&quot; id=&quot;dp_itibundle_itinerarytype_coordinates___name___address&quot; name=&quot;dp_itibundle_itinerarytype[coordinates][__name__][address]&quot; class=&quot;class_address form-control&quot; style=&quot;width:50%;&quot; data-place=&quot;0&quot; style=&quot; width:50%;&quot; /&gt;
						&lt;input type=&quot;text&quot; id=&quot;dp_itibundle_itinerarytype_coordinates___name___latitude&quot; name=&quot;dp_itibundle_itinerarytype[coordinates][__name__][latitude]&quot; required=&quot;required&quot; class=&quot;class_latitude class_coordinate form-control&quot; style=&quot;width:21%;&quot; placeholder=&quot;Lat&quot; style=&quot; width:21%;&quot; /&gt;
						&lt;input type=&quot;text&quot; id=&quot;dp_itibundle_itinerarytype_coordinates___name___longitude&quot; name=&quot;dp_itibundle_itinerarytype[coordinates][__name__][longitude]&quot; required=&quot;required&quot; class=&quot;class_longitude class_coordinate form-control&quot; style=&quot;width:21%;&quot; placeholder=&quot;Long&quot; style=&quot; width:21%;&quot; /&gt;
		&lt;/div&gt;">                          <?php
                                                    $index=0;
                                                    while($row= mysqli_fetch_array($result)){
                                                        echo "<li class='coordinate_container'>";
                                                        echo "<div class='form-inline'>";
                                                        echo "<div class='form-group'>";
                                                        echo "    <div class='input-group'>";
                                                        echo "<div id='dp_itibundle_itinerarytype_coordinates_".$index."'>";
                                                        echo "<input type='text' id='dp_itibundle_itinerarytype_coordinates_".$index."_ordre' name='dp_itibundle_itinerarytype[coordinates][0][ordre]' readonly='readonly' class='class_ordre form-control' style='display:none;' style_marker='width:8%;' style=' display:none;' value='".($index+1)."' />";
                                                        echo "<span class='order_marker text-center table-cell'
                                                                  style='width:8%;'>".($index+1)."</span>";
                                                        echo "<input type='text'
                                                                           id='dp_itibundle_itinerarytype_coordinates_".$index."_address'
                                                                           name='dp_itibundle_itinerarytype[coordinates][".$index."][address]'
                                                                           class='class_address form-control'
                                                                           style='width:50%;'
                                                                           data-place='".$index."' style='width:50%;' value='$row[nombre]' />";
                                                        echo "<input type='text'
                                                                           id='dp_itibundle_itinerarytype_coordinates_".$index."_latitude'
                                                                           name='dp_itibundle_itinerarytype[coordinates][".$index."][latitude]'
                                                                           required='required'
                                                                           class='class_latitude class_coordinate form-control'
                                                                           style='width:21%;' placeholder='Lat'
                                                                           style=' width:21%;' value='$row[latitud]'/>";
                                                        echo "<input type='text'
                                                                           id='dp_itibundle_itinerarytype_coordinates_".$index."_longitude'
                                                                           name='dp_itibundle_itinerarytype[coordinates][".$index."][longitude]'
                                                                           required='required'
                                                                           class='class_longitude class_coordinate form-control'
                                                                           style='width:21%;' placeholder='Long'
                                                                           style=' width:21%;' value='$row[longitud]'/>";
                                                        $index++;
                                                    }
                                                ?>

                                                <li id="new_link_li" class="ui-state-disabled">
                                                    <div class="row">
                                                        <div class="col-sm-12 text-right">
                                                            <button id="add_poi_li" class="btn btn-primary hidden">
                                                                Agregar Punto
                                                            </button>
                                                            <button id="b2"
                                                                    class="directions_button btn btn-primary ladda-button hidden"
                                                                    data-style="zoom-in"
                                                                    onclick="calcRoute( function() { l1.stop(); l2.stop(); l3.stop(); });">
                                                                <span class="ladda-label">Trazar Ruta</span></button>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>

                                            <hr>


                                            <div class="col-sm-9">
                                                <input type="hidden" id="dp_itibundle_itinerarytype__token"
                                                       name="dp_itibundle_itinerarytype[_token]"
                                                       value="AIzaSyCT6-SoqHmS2uEUDLdmFM2TE95wNc3vOEc"/>
                                            </div>

                                            <div class="form-group">
                                                <div class="col-sm-12 text-right">

                                                    <button id="b3"
                                                            class="directions_button btn btn-primary ladda-button"
                                                            data-style="zoom-in"
                                                            onclick="calcRoute( function() { l1.stop(); l2.stop(); l3.stop(); });">
                                                        <span class="ladda-label">Trazar Ruta</span></button>
                                                    <img id="loader2" style="display:none;"
                                                         src="images/ajax-loader.gif"/>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div id="directionsPanelWrapper" style="display: none;">
                                        <form class="form-horizontal">
                                            <div class="form-group">
                                                <div class="col-sm-12 text-right">
                                                    <a class="button_link btn btn-primary"
                                                       href="javascript:window.print();"
                                                       title="Imprimer">Print</a>
                                                    <button type="button" class="btn btn-primary"
                                                            onclick="displayInfo()"><span
                                                            class="glyphicon glyphicon-remove"
                                                            aria-hidden="true"></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        <h1 class="tools_title">Google Maps Directions</h1>

                                        <div id="directionsPanel"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>

</div>


<script type="text/javascript" src="js/coordinates.js"></script>

<script type="text/javascript">
    function showTraffic() {
        trafficLayer.setMap(map);
        document.getElementById('show_traffic').style.display = 'none';
        document.getElementById('hide_traffic').style.display = 'inline';
    }

    function hideTraffic() {
        trafficLayer.setMap(null);
        document.getElementById('hide_traffic').style.display = 'none';
        document.getElementById('show_traffic').style.display = 'inline';
    }

    function displayInfo() {
        $('#directionsPanelWrapper').fadeOut('slow');
        $('#itiInfo').fadeIn('slow');
    }

    function displayDirections() {
        $('#tools_display').css('display', 'block');
        $('#directionsPanelWrapper').fadeIn('slow');
        $('#itiInfo').fadeOut('slow');
    }

    $('#address').on('keydown', function (e) {
        if (e.which == 13) {
            $('#address_to_map').trigger('click');
        }
    });

    $('.coordinate_to_map').on('keydown', function (e) {
        if (e.which == 13) {
            $('#coordinates_to_map').trigger('click');
        }
    });
</script>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Modal title</h4>
            </div>
            <div id="myModalBody" class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>


<script type="text/javascript">
    (function () {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js?onload=onLoadCallback';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();
    $(document).ready(function () {
        var data = {
            "carretera": "",
            "transporte": "",
            "dia": "",
            "hotel": "",
            "bioma": "",
            "horaInicio": "",
            "horaFin": "",
            "actividad": "",
            "distancia": "",
            "lugares": "",
            sitios: []
        };
        $("#form_orig_submit").on('click', function (evt) {
            var sitios = [];
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var datos = $("#coordinates_sortable");
            indice = 0;
            datos.find(".coordinate_container").each(function () {
                sitios.push({
                    "nombre": $("#dp_itibundle_itinerarytype_coordinates_" + indice + "_address").val(),
                    "longitud": $("#dp_itibundle_itinerarytype_coordinates_" + indice + "_longitude").val(),
                    "latitud": $("#dp_itibundle_itinerarytype_coordinates_" + indice + "_latitude").val()
                });
                indice++;
            });
            data.carretera = $("#carretera").val();
            data.transporte = $(".transporte").val();
            data.dia = $("#dia").val();
            data.hotel = $("#hotel").val();
            data.bioma = $("#bioma").val();
            data.horaInicio = $("#horaInicio").val();
            data.horaFin = $("#horaFin").val();
            data.actividad = $("#actividad").val();
            data.lugares = $("#lugares").val();
            data.sitios = sitios;
            $.ajax({
                url: "code/addTour.php",
                method: "post",
                dataType: "json",
                data: data
            }).success(function (data) {
                //alert("Datos agregados correctamente: "+ data);
            }).error(function (err) {
                //alert("Error al guardar datos: "+err);
            });
            console.log(data);
        });
    });
</script>

<footer class="main-footer">
    <div class="container">
        <div class="pull-right hidden-xs">
            <b>Version</b> 1.0
        </div>
        <strong>Copyright &copy; 2016 <a href="http://umg.edu.gt">Universidad</a>.</strong> All rights reserved.
    </div>
    <!-- /.container -->
</footer>
</body>
</html>

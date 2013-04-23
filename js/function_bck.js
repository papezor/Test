function loadAssets(){jQuery.getScript(locAssets+"GeoReferenziazioneMunicipi.js", function(){loadPlessiAssets();});}
function loadPlessiAssets(){jQuery.getScript(locAssets+"AnagraficaPlessi.js", function(){createMappaDef();});}


	/*<script type="text/javascript" src="assets/"></script>
	<script type="text/javascript" src="assets/.js"></script>
	*/
function createMappaDef(){
 
		// CARICO COORDINATE SEZIONI
		loadPlessi();


		// creo div per la mappa se non esiste
		createDivCanvas();

		// AFF GRAPH PANEL
		addGraphPanel();


	    // CREO MAPPA DEFAULT //
		var mapOptions = {
			center:  coord_def,
			zoom: zoom,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl:true,
			navigationControl: false,
			mapTypeControl: false,
			scaleControl: false,
			disableDoubleClickZoom: true,
			streetViewControl: false,
			minZoom: 10,
			maxZoom: 18
			};
		map = new google.maps.Map(document.getElementById("map_canvas"),
			mapOptions);


		// bug jquery mobile sul render della mappa. Rirenderizzo la mappa mezzo secondo dopo il caricamento.
		setTimeout(function() {
			google.maps.event.trigger(map,'resize');
			map.setCenter(targetCoordMun);
			}, 1000);


		// CREO LISTNER SULL ZOOM
		google.maps.event.addListener(map,'zoom_changed', function() {
		remMarkerAll();
			if (map.getZoom() >= 15){addMarkerSez();}else{addMarkerMun();}
		});
		 // CREO LISTNER SUL DRAG END
		 google.maps.event.addListener(map,'dragend',function(){
		 remMarkerAll();
			if (map.getZoom() >= 15){addMarkerSez();}else{addMarkerMun();}
		});




		// IMPAGINO MUNICIPI PER TABELLE //
		loadMun();

		// CARICO DATI //
		loadData();


}


// AGGIUNGO MARKER MUNICIPIO
function addMarkerMun(){
	 for (var key in munMap) {

		var mun = munMap[key]["MUNICIPIO"];
		var coord = munMap[key]["COORDINATE"];


		var src = "images/mun" + mun + ".png";
		if (mun.length > 3){src = "images/elett.png";}
		var position = new google.maps.LatLng(coord[1],coord[0]);
		var marker=new google.maps.Marker({
					position:position,
					icon:new google.maps.MarkerImage(src, null, null, null, new google.maps.Size(29, 29))

					});
		markerMun[position.lat() + '' + position.lng()] = marker;
		marker.setMap(map);


		google.maps.event.addListener(marker, 'click', (function(marker, mun) {
			return function() {zoomMuni(mun,marker.getPosition());}
		})(marker, mun));


	}
    addPanelData();

}

// AGGIUNGO MARKER SEZIONI
function addMarkerSez(zoomLevel,center,bounds){

	var center = map.getCenter();
	var bounds = map.getBounds();
	var dx = bounds.getNorthEast().lat();
	var sx = bounds.getSouthWest().lat();
	var tp = bounds.getNorthEast().lng();
	var bt = bounds.getSouthWest().lng();

	var conta = 0;

	for (var x in coordPless){
		var coord = x.split(',');
		lng = coord[0].replace('"','');
		lat = coord[1].replace('"','');
		var coord = new google.maps.LatLng(lat,lng);

		if ((lng > bt && lng < tp) && (lat > sx && lat < dx)){
			// meglio non sapere cosa è
			if (!dist){var dist = distanceFromCenter(coord); targetCoordMun = coord;}else{if (distanceFromCenter(coord) < dist){dist = distanceFromCenter(coord);targetCoordMun = coord;}}

			// controllo stato affluenze su coordinate //
			 stato = getStatoCoordinata(lat,lng);
		     addSingleMarker(coord,stato);
		}else{
		     remSingleMarker(coord);
		}
	}
	addPanelData();


}



// AGGIUNGO SINGLE MARKER //
function addSingleMarker(coord,stato){
        if (stato == 0){src = 'images/rosso_rosso.gif';}
		if (stato == 1){src = 'images/verde_rosso.gif';}
		if (stato == 2){src = 'images/verde_verde.gif';}
		var marker=new google.maps.Marker({
					position:coord,
					icon:new google.maps.MarkerImage(src, null, null, null, new google.maps.Size(20, 20))

					});
		marker.setMap(map);
		markerArray[coord.lat() + '' + coord.lng()] = marker;

		google.maps.event.addListener(marker, 'click', (function(marker) {
			return function() {
			     // CLICK SU SINGOLA BANDIERINA
			    //ARROTONDO A 7 DECIMANLI PER PROBLEMI DI JAVASCRIPT CON I DOBULE
				lat = roundNumber(marker.getPosition().lat(),7); while (lat.length != 10){lat = lat + "0" + "";}
				lng = roundNumber(marker.getPosition().lng(),7); while (lng.length != 10){lng = lng + "0" + "";}
				//console.log("coordinate cliccate", lng + ',' + lat);
				var plesso = coordPless['"'+lng+','+lat+'"'][0];
				var html = '';
				for (var x in plesso){
					color = 'red'; if (dataSetSez[parseInt(plesso[x]["Numero"])] == true){color = 'green';}
				    //html += '<span class="listaSezioni" style="color:'+color+'" onclick="caricoSezione('+"'"+ x +"'"+');">Sezione '+ plesso[x]["Numero"] + '</span><br>';
				     html+= '<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="null" data-iconpos="null" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-submit ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text" style="color:'+color+';font-size:0.8em;">Sezione '+ plesso[x]["Numero"] + '</span></span><button type="submit" data-theme="c" class="ui-btn-hidden" aria-disabled="false" onclick="caricoSezione('+"'"+ x +"'"+');">Hmm</button></div>';
				}
				infowindow.setContent(html);
				infowindow.open(map,marker);
			}
		})(marker));
}

// RIMUOVO SINGLE MARKER //
function remSingleMarker(coord){
        if (markerArray[coord.lat() + '' + coord.lng()]){markerArray[coord.lat() + '' + coord.lng()].setMap(null);}
		if (markerMun[coord.lat() + '' + coord.lng()]){markerMun[coord.lat() + '' + coord.lng()].setMap(null);}
}

// RIMUOVI MARKER MUNICIPIO IN CASO DI ZOOM MAGGIORE DI 12
function remMarkerAll(){
   remMarkerMun();
   remMarkerSez();

}

function remMarkerMun(){
         for (var x in markerMun){
			markerMun[x].setMap(null);
		 }
}

// RIMUOVI MARKER SEZIONI IN CASO DI ZOOM MINORE DI 12
function remMarkerSez(){
         for (var x in markerArray){
			markerArray[x].setMap(null);
		 }
}

// ZOOMO SUL CLICK DEL MUNICIPIO
function zoomMuni(mun,coord){
      map.setCenter(coord);
	  map.setZoom(15);

}



// AGGIUNGO PANNELLO DETTAGLIO
function addPanel(title1,title2,perc,color){

    if (!document.getElementById("titleDet1")){
		var html = '<span style="font-size:1.1em;font-weight:bold;" id="titleDet1">'+title1+'</span></br>';
		    html += '<span style="font-size:1.0em;" id="titleDet2">'+title2+'</span></br>';
		    html += '<p>Totale Sezioni: <font color="'+color+'" id="percDet">'+perc+'</font></p>';
		var dettPanelBox = document.createElement('div');
		dettPanelBox.id = 'dettPanelBox';
		var box = document.createElement('div');
		box.id = 'dettPanel';
		box.style.height = '120px';
		box.style.width = '250px';
		box.style.backgroundColor = 'white';
		box.innerHTML = html;
		dettPanelBox.appendChild(box);
		dettPanelBox.index = -500;
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(dettPanelBox);
	}else{
		jQuery("#titleDet1").html(title1);
		jQuery("#titleDet2").html(title2);
		jQuery("#percDet").html(perc);
	//	jQuery("#percDet").color(color);
	//	jQuery("#titleDet").html(title);

	}
}


function addPanelData(){
//    var totPerc; var color; var title1; var title2;
	if (name == 'Aff'){title1 = 'Affluenza ';}if (name == 'Comp'){title1 = 'Composizione ';}if (name == 'Scr'){title1 = 'Scrutinio ';}
	if (tipo == 0 && name == 'Comp'){title1 += 'Seggi';}else{
		if (tipo == 0){title1 += 'Regionali'}
		if (tipo == 1){title1 += 'Camera'}
		if (tipo == 2){title1 += 'Senato'}
	}



		var tot = 0;var conta = 0;
		for (var x in dataSetMun){
		 	tot += parseFloat(dataSetMun[x].replace('%',''));
			conta++;
		}
		totPerc = roundNumber(tot / conta,2) + "%";
		percTotMun = totPerc.replace('%','');

		color='red';if (totPerc == '100%'){color='green';}
		title2 = 'Dati Totali';

	if (map.getZoom() >= 15){//AGGIUNGO DETTAGLIO MUNICIPIO //
    	detailMunicipio();
		var title2 = 'Municipio ' + munD;
		var tot = 0;var conta = 0;
		var totPerc = dataSetMun[munD];


		color='red';if (totPerc == '100%'){color='green';}

	}
    addPanel(title1,title2,totPerc,color);

}

// AGGIUNGO DATA AL PANNELLO DI DETTAGLIO
function detailMunicipio(){
    munD = '';
    if (map.getZoom() >= 15){
	    var latDet = roundNumber(targetCoordMun.lat(),7); while (latDet.length != 10){latDet = latDet + "0" + "";}
		var lngDet = roundNumber(targetCoordMun.lng(),7); while (lngDet.length != 10){lngDet = lngDet + "0" + "";}
		var plesso = coordPless['"'+lngDet+','+latDet+'"'][0];
	    for (var x in plesso){
			munD = plesso[x]["Municipio"];
		}
    }

}




// AGGIUNGO PANNELLO GRAFICO
function addGraphPanel(){

    target = createDivGraph(); html = '';
	html +='<div class="ui-grid-a" style="width:100%;">';
    html +='<div class="ui-block-a" style="width:1%;min-width:30px;">';
	html += '<a href="javaScript:slideGraph();" data-icon="arrow-u" data-iconpos="notext" id="slideButton"></a>';
	html +='</div>'; // /block-a
	html +='<div class="ui-block-b" style="text-align:center;margin-left:180px;padding-top:2px;">';
	html += '<span id="titleGraph"></span>';
	html +='</div>'; // /block-b
	html +='</div>'; // /grid-a


	html +='<div class="ui-grid-a">';
	html +='<div class="ui-block-a" style="width:30%">';
    html +='<div id="chartPieDiff"style="width:80%;height:280px"></div>';
	html +='</div>'; // /block-a
	html +='<div class="ui-block-b" style="width:67%">';
	html +='<div id="chartGraphDiff" style="height:280px;"></div>';
	html +='</div>'; // /block-b
	html +='</div>'; // /grid
	jQuery(target).append(html);
	jQuery('#slideButton').button();

}

function addDataGraph(){

	var affTot = 65;
	var pubTot = 30;
	var priTot = 5;
		var data = [
		['NON Pervenute',affTot],
		['Pubblicate',pubTot],
		['Nuovi Arrivi',priTot]

	];

	 plotPieDiff = jQuery.jqplot ('chartPieDiff', [data], {
      seriesDefaults: {
        // Make this a pie chart.
        renderer: jQuery.jqplot.PieRenderer,
        rendererOptions: {
           showDataLabels: true
        }},
	  title: "Situazione Sezioni",
	  legend: {
                show: true,
                location: 'e',
                placement: 'outside'
            },
	  grid: {background:'transparent', borderColor: '#dedede'}	  });

	plotPieDiff.replot();
	plotPieDiff.redraw();

	if (name == 'Aff'){title1 = 'Affluenza ';}if (name == 'Comp'){title1 = 'Composizione ';}if (name == 'Scr'){title1 = 'Scrutinio ';}
	if (tipo == 0 && name == 'Comp'){title1 += 'Seggi';}else{
		if (tipo == 0){title1 += 'Regionali'}
		if (tipo == 1){title1 += 'Camera'}
		if (tipo == 2){title1 += 'Senato'}
	}

	jQuery('#titleGraph').html("Stato di avanzamento  - " + title1);
	var dataDiff = [];

	for (var mun in dataSetDetMun){
		var perv = parseInt(dataSetDetMun[mun]["pervenute"]);
	     dataDiff.push(["Municipio " + mun,parseInt(dataSetDetMun[mun]["pervenute"].replace('%',''))]);
	}

		plotGraphDiff = jQuery.jqplot ('chartGraphPerc', [dataDiff], {
		seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer
		},

		axesDefaults: {
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: -30,
				fontSize: '10pt'
				}
		},
		axes: {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				angle: -30,
				fontSize: '10pt',
				tickOptions:{showGridline: false}

				},
			// yaxis: {angle:0}
			yaxis: {min: 0, max: 500, numberTicks:5}
			// yaxis: {renderer: $.jqplot.CategoryAxisRenderer}
		},

		grid: {background:'transparent', borderColor: '#dedede'} });
	plotGraphDiff.replot();
	plotGraphDiff.redraw();


    var dataPerc = [];
	var dataPercTick = [];
	var dataPercX = [
						["0",0],
						["25",25],
						["50",50],
						["75",75],
						["100",100]
					];
    conta = 1;
	for (var mun in dataSetMun){
	   dataPerc.push(parseInt(dataSetMun[mun].replace('%','')));
	   dataPercTick.push(["Mun " + mun+'']);
	   conta++;


	}


	jQuery('#chartGraphPerc').css('height',(jQuery('.ui-content').height())+'px');
	plotGraphPerc = jQuery.jqplot ('chartGraphDiff', [dataPerc], {
		seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer,
			rendererOptions: {
					barDirection: 'vertical'
				},
		    pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
			},
		seriesColors: [ "#ffff00"],
		axesDefaults: {
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: -30,
				fontSize: '10pt'

				}
		},
		axes: {
			yaxis: {
				//renderer: $.jqplot.CategoryAxisRenderer,
				fontSize: '10pt',

				tickOptions:  {angle:-20,formatString: '%d%    '},
				ticks: dataPercX


				},
			   xaxis: {
						renderer: $.jqplot.CategoryAxisRenderer,
						tickOptions: {angle:-20,showGridline: false},
						ticks:dataPercTick
						}
			 //yaxis: {min: 0, max: 500, numberTicks:5}
			 //yaxis: {}
		},
		title: "Sezioni Pervenute ",
		grid: {background:'transparent', borderColor: '#dedede'} });
	plotGraphPerc.replot();
	plotGraphPerc.redraw();
}

function slideGraph(){
	if (statusGraph == false){ 	statusGraph = true; // apro pannello
		jQuery('#homeGraph').fadeIn(1000).animate({"bottom":"-4"}, "slow");
		jQuery('#slideButton').buttonMarkup({icon:"arrow-d"});
		jQuery('#slideButton').button();
	}else{ statusGraph = false; // chiudo pannello
		jQuery('#homeGraph').fadeIn(1000).animate({"bottom":"-285px"}, "slow");
		jQuery('#slideButton').buttonMarkup({icon:"arrow-u"});
	    jQuery('#slideButton').button();

	}
}




// CARICO DATI POPUP SEZIONE
function caricoSezione(x){
   var sezione = coordPless['"'+lng+','+lat+'"'][0][x];
   var perv = "No";var color = "red";if (dataSetSez[parseInt(sezione["Numero"])] == true){perv = "Si";color = "green";}
   jQuery("#dettSezioneNumero").html(sezione["Numero"]);
   jQuery("#dettSezioneIncaricato").html(sezione["User"] + " - " + sezione["IncaricatoDataEntry"]);
   jQuery("#dettSezioneScuola").html(sezione["Scuola"]);
   jQuery("#dettSezioneMunicipio").html(sezione["Municipio"]);
   jQuery("#dettSezioneUbicazione").html(sezione["Ubicazione"]);
   jQuery("#dettSezioneGruppo").html(sezione["Gruppo"]);
   jQuery("#dettSezioneTelefono").html(sezione["Telefono"]);
   jQuery("#dettSezioneCellulare").html(sezione["Cellulare"]);
   jQuery("#dettSezioneVoip").html(sezione["Voip"]);
   jQuery("#dettSezionePerv").html('<font color="'+color+'">'+ perv + '</font>');
   jQuery("#dettSezione").popup("open");
}

// CARICO ANAGRAFICA PLESSI  (COMPRESE LE COORDINATE)
function loadPlessi(){
   for (var x in plessi){
      var obj = plessi[x];
	  var coordinate = obj["Coordinate"].replace(",0","");
	  if (!coordPless['"' + coordinate + '"']){coordPless['"' + coordinate + '"'] = [];}
	  coordPless['"' + coordinate + '"'].push(obj["sezioni"]);
   }
}

// AGGIORNO DATA
function loadData(){
/* AJAX PER CROSSDOMAIN
jQuery.ajax({
     url:"http://www.elezioni.comune.roma.it/elezioni/2013/m/private/data/"+name+tipo+'.json',
     dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
     callback: 'readResult',
     success:function(json){ readResult(json)
         // do stuff with json (in this case an array)
     }, error:function(){}
});
*/

/* GET JSON PER LOCALE */
var e; var result;
jQuery.getJSON(locData+name+tipo+'.txt',
				{},
				function(result){checkConfig(result);})
/* fINE */

}

// LEGGO RISULTATI DELLA LOAD_DATA()
function readResult(e){

	 for (var k in e){
	    dataSetMun[e[k]["municipio"]] = e[k]["perc"];
		if (!dataSetDetMun[e[k]["municipio"]]){dataSetDetMun[e[k]["municipio"]] = [];}
		dataSetDetMun[e[k]["municipio"]]["pervenute"] = e[k]["pervenute"];
		dataSetDetMun[e[k]["municipio"]]["totale"] = e[k]["totale"];
		var ple = e[k]["plessi"];
		for (var x in ple){
			var sez = ple[x]["sezioni"];
			for (var s in sez){
			   var perv = false;
			   if (sez[s]["pervenuta"] == "SI"){perv = true;}
			   dataSetSez[parseInt(sez[s]["numero"])] = perv;
			}
		}
	}

		jQuery('#renderPage,#renderTable').hide();
	    if (divDisp == '#renderPage'){
			remMarkerAll();
			if (map.getZoom() >= 15){addMarkerSez();}else{addMarkerMun();}
	    }else{
			 loadDataTable();

			}
	   jQuery(divDisp).show();
       jQuery('#nav-panel').panel('close');
	   resetFiltri();

	   if (statusTimer == false){startTimer();}else{resetTimer();}

	   addDataGraph();
		console.log("Dati Caricati: ",name+tipo+"");
}


function getStatoCoordinata(lat,lng){
   // 0 ROSSO 1 ROSSO/VERDE 2 VERDE
   var plesso = coordPless['"'+lng+','+lat+'"'][0];
   var ck1 = 0; var ck2 = 0;
   for (var x in plesso){
        ck1++;
		if (dataSetSez[parseInt(plesso[x]["Numero"])] == true){ck2++;}
	}
    if (ck2 == 0){return 0;}
	if (ck2 > 0 && ck2 != ck1){return 1;}
	if (ck2 > 0 && ck2 == ck1){return 2;}
}

// CLICCO SU VOCI MENU
function loadMenu(dest,type){
// dest  Aff = affluenze  Com = composizione Scr = scrutinio
// type  0 = regionali 1 = camera 2 = senato
   name = dest;
   tipo = type;
   divDisp = '#renderPage';
   loadData();
}


// INIZIO JS PER TABELLE //
function loadTable(dest,type){
// dest  Aff = affluenze  Com = composizione Scr = scrutinio
// type  0 = regionali 1 = camera 2 = senato
   name = dest;
   tipo = type;
   divDisp = '#renderTable';
   if (name == 'Aff') { title1 = 'Affluenza '; } if (name == 'Comp') { title1 = 'Composizione '; } if (name == 'Scr') { title1 = 'Scrutinio '; }
   if (tipo == 0 && name == 'Comp') { title1 += 'Seggi'; } else {
       if (tipo == 0) { title1 += 'Regionali' }
       if (tipo == 1) { title1 += 'Camera' }
       if (tipo == 2) { title1 += 'Senato' }
   }
   //jQuery('#titolo').html(title1);
   loadData();
}

var filMun = 0;
// CARICO LISTA MUNICIPIO
function loadMun(){

    for (var key in munMap) {
	  var mun = munMap[key]["MUNICIPIO"];
	   var coord = munMap[key]["COORDINATE"];
	   var s  = document.getElementById("select-choice-0");

       if (mun.length < 5) s.options[s.options.length]= new Option('Municipio ' + mun, mun);



	}
	 jQuery('#select-choice-0').selectmenu('refresh', true);
}





var filMun = 0;
var filSez = '';
var filPerv = false;
var filNonPerv = true;
// CLICK SUL MENU
function clickLisMun(mun){
 filMun = mun;
 //loadMun();
 loadDataTable();

}

// CARICO DATI TABLE
function loadDataTable(e){

   if(e!=null)
	{
	  var x = e.keyCode? e.keyCode : e.charCode;
	  //alert(x);
	  if( x==13) $('#search-basic').blur();
	}



    var conta = 0;
	var contaPerv = 0;
	var contaNonPerv = 0;
    //  var htmlsi = '<div class="ui-grid-solo">';
    jQuery('#risultati').css("height", (jQuery('.ui-page').height() - 50) + 'px');
	var html = '<div id="tableSez" class="tableDet" style="overflow-y:scroll;overflow-x:hidden;text-align:center;padding:5px 5px 5px 5px;opacity:1"></div>';
    jQuery('#pannelloSezioni').html(html);
    jQuery('#pannelloSezioni').css("height", (jQuery('#risultati').height() - 10) + 'px');
    jQuery('#pannelloSezioni').css("width", '98%');
	jQuery('#tableSez').css("height", (jQuery('.ui-page').height() - 114) + 'px');
	jQuery('#tableSez').css("background",'rgb(0, 0, 0)');
    jQuery('#tableSez').css("background",'rgba(0, 0, 0, 0.5)');

    html = '<ul data-role="listview" id="appoList" style="line-height:20px; padding-top:5px;margin-left:3px;margin-top:3px;width:99%;">';

    for (var x in coordPless){
		var coord = x.split(',');
		lng = coord[0].replace('"','');
		lat = coord[1].replace('"','');
		var plesso = coordPless['"'+lng+','+lat+'"'][0];
		for (var y in plesso){

		   if (plesso[y]["Municipio"] == filMun || filMun == 0){

				var sez = plesso[y]["Numero"];
				var func = "javaScript:apriSezTab('"+y+"',"+lng+","+lat+");";
				 var s = sez.substring(0,filSez.length);
				 //console.log(sez,s);
			  if(filSez == '' || (s == filSez) ){

			  if (dataSetSez[parseInt(sez)] == true) {
			     if(filPerv) {
				   //html += '<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="null" data-iconpos="null" data-theme="c" class="ui-submit ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false" data-disabled="false" ><span class="ui-btn-inner" style="color:#54af62;"><span class="ui-btn-text">Sez. '+sez+' - Municipio '+plesso[y]["Municipio"]+'</span></span><button type="submit" data-theme="c" class="ui-btn-hidden" data-disabled="false" onClick="'+func+'">'+sez+'</button></div>';
			         html += '<li ><a class="menuItem sel" href="' + func + '" style="color:green">Sez. ' + sez + ' - Municipio ' + plesso[y]["Municipio"] + '</a></li>';
			         contaPerv ++;
				 }
			   } else {
			       if(filNonPerv) {
				     //html += '<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="null" data-iconpos="null" data-theme="c" class="ui-submit ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false" data-disabled="false"><span class="ui-btn-inner" style="color:#d81417;"><span class="ui-btn-text">Sez. '+sez+' - Municipio '+plesso[y]["Municipio"]+'</span></span><button type="submit" data-theme="c" class="ui-btn-hidden" data-disabled="false" onClick="'+func+'">'+sez+'</button></div>';
			           html += '<li><a class="menuItem sel" href="' + func + '" style="color:red">Sez. ' + sez + ' - Municipio ' + plesso[y]["Municipio"] + '</a></li>'; ;
		               contaNonPerv ++;
				  }
		       }

			   conta++; if ((conta > 200 && filPerv && filNonPerv) || (filPerv && contaPerv > 200) || (filNonPerv && contaNonPerv > 200) ) { html = '<div style="padding:5px 15px;margin-top:50px; margin-left:20px; width:80%;line-height:1.1em;text-shadow:none;color:red;font-weight:bold;">La ricerca ha prodotto piu di 100 risultati. Applicare almeno un altro filtro</div>';   }
		   }
		  }
		}
	}
	 html += '</ul>';
	//htmlsi += '</div>';
//	htmlno += '</div>';
	 jQuery('#tableSez').html(html);
	 jQuery('#appoList').listview();
	 if(filPerv && !filNonPerv) {
	 	 document.getElementById('lblRes').innerHTML=contaPerv +" sezioni su "+conta;
	} else if(filNonPerv && !filPerv){
	    document.getElementById('lblRes').innerHTML=contaNonPerv +" sezioni su "+conta;
	} else document.getElementById('lblRes').innerHTML=conta +" sezioni su "+conta;
	jQuery('#tableSez').html(html);
	 jQuery('#appoList').listview();
	 //$('#tableSez').listview();

}

function filtraSezioni(perv) {
   if(perv == 1) {
     if(filPerv) {
	     filPerv = false;
      }
	  else {
	    filPerv = true;  
	  }
	  
   } else {
      if(filNonPerv) {
	    filNonPerv = false;
      }
	  else {
	    filNonPerv = true;  
	  }
   
   } 
   clickLisMun(filMun);
}



function apriSezTab(sez,lng,lat){

		  var html =  '';//jQuery("#tableSezDett").html(html)
		  lat = roundNumber(lat,7); while (lat.length != 10){lat = lat + "0" + "";}
		  lng = roundNumber(lng,7); while (lng.length != 10){lng = lng + "0" + "";}
		  var sezione = coordPless['"'+lng+','+lat+'"'][0][sez];

	if (!document.getElementById('popDett' + sezione["Numero"])){
		  //alert(dataSetSez[parseInt(sezione["Numero"])] + '  '+lng + ',' + lat);
		  var perv = "No";var color = "red";if (dataSetSez[parseInt(sezione["Numero"])] == true){perv = "Si";color = "green";}
		  html += '<div id="popDett' + sezione["Numero"] + '" class="ui-corner-all ui-body-c" style="padding:5px 15px;margin-top:15px; margin-left:20px; width:80%;line-height:1.1em;border: 1px solid orange;text-shadow:none;color:white;background:rgb(0, 0, 0);background: rgba(0, 0, 0, 0.5);">';

		  var func = "chiudiSezTab('popDett" + sezione["Numero"] + "')";
		  var funcMap = "apriMappa("+lng+","+lat+")";

		 // html+= '<a href="#mypanel" data-icon="plus" data-iconpos="notext">Add</a>';

		  html+= '<div class="ui-grid-a" style="width:100%;">';
		  html += '<div class="ui-block-a" >';
		  html += '<a href="javaScript:' + func + ';" data-icon="delete" data-role="button"  data-iconpos="notext" data-mini="true" id="buttSez' + sezione["Numero"] + '">Close</a>' + '</h3>';

		  html += '</div>';
		  html += '<div class="ui-block-b" style="float:right;text-align:right;" >';
		  html += '<a href="javaScript:' + funcMap + ';" data-icon="delete" data-role="button" data-mini="true" id="buttSez' + sezione["Numero"] + 'mappa">Mappa</a>' + '</h3>';
		  html += '</div>';
		  html+='</div>';
		  html += '<div><h3><font color="' + color + '">Sezione Numero ' + sezione["Numero"] + '</font>';
		  html+= '</h3><p>Pervenuta <font color="'+color+'">'+ perv + '</font><br>';
		  html+= 'Municipio '+ sezione["Municipio"] +'<br>';
		  html+= 'Incaricato '+ sezione["User"] + " - " + sezione["IncaricatoDataEntry"] +'<br>';
		  html+= 'Scuola '+ sezione["Scuola"] +'<br>';
		  html+= 'Indirizzo '+ sezione["Ubicazione"] +'<br>';
		  html+= 'Gruppo '+ sezione["Gruppo"] +'<br>';
		  html+= 'Telefono '+ sezione["Telefono"] +'<br>';
		  html+= 'Cellulare '+ sezione["Cellulare"] +'<br>';
		  html+= 'Voip '+ sezione["Voip"] +'<br>';
		  html += '</p></div>';
		  jQuery("#tableSezDett").css('height',(jQuery('.ui-content').height() - 70) + 'px');
		  jQuery("#tableSezDett").css('overflow-y','scroll');
		  jQuery("#tableSezDett").append(html).show();
		  jQuery("#buttSez" + sezione["Numero"]).button();
		  jQuery("#buttSez" + sezione["Numero"]+'mappa').button();

		 // jQuery('a').button('refresh');
	}else{chiudiSezTab('popDett' + sezione["Numero"]);}
}

function chiudiSezTab(id) {
  jQuery("#"+id).remove();
 //  jQuery('#tableSezDett').remove('#'+id);
}


// FUNZIONI VARIE LIKE FUNZIONI DI TIMER PER RELOAD DATA, CREAZIONE DIV PER MAPPA E ARROTODANMENTO NUMERI
function addSecTimer(){if (timer == refresh){setTimeout("addSecTimer()",1000);loadData();}else{/*console.log(timer);*/timer++;setTimeout("addSecTimer()",1000);}}
function resetTimer(){timer = 0;}
function stopTimer(){timer = -2000;}
function startTimer(){statusTimer = true; resetTimer();setTimeout("addSecTimer()",1000);}
function roundNumber(rnum, rlength) {var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);	return newnumber.toString();}
function createDivCanvas(){document.getElementById("renderPage").innerHTML = '<div id="map_canvas" style="width:100%; height:'+(jQuery(document).height())+'px;"></div>';}
function createDivGraph(){if (!document.getElementById("homeGraph")){jQuery(".ui-content").append('<div id="homeGraph" class="ui-corner-all ui-body-a" style="width:'+(jQuery(document).width()-9)+'px;height:320px; bottom:-285px;position:absolute;left:3px; right:3px;z-index:100" data-theme="a" ></div>');} return '#homeGraph';}
function distanceFromCenter(coord){return google.maps.geometry.spherical.computeDistanceBetween(coord,map.getCenter());}
function closeAllPanel(str){statusGraph = true; slideGraph(); jQuery('#nav-panel').panel('close'); jQuery('#graphPerc').panel('close');jQuery('#'+str).panel('open');}
function loadPage(page){jQuery('#nav-panel').panel('close');window.location.href = page;}

function checkParams(){
	var loc = window.location.href.split('?');
	if(loc[1]){
		var params = loc[1].split('&');
		var paramsName = params[0].split('=');
		var paramsType = params[1].split('=');

		name = paramsName[1];
		tipo = paramsType[1];
	}
}

function checkConfig(result){
/* AJAX PER CROSSDOMAIN
jQuery.ajax({
     url:"http://www.elezioni.comune.roma.it/elezioni/2013/m/private/data/"+name+tipo+'.json',
     dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
     callback: 'readResult',
     success:function(json){ readResult(json)
         // do stuff with json (in this case an array)
     }, error:function(){}
});
*/

/* GET JSON PER LOCALE */
var cfg;
jQuery.getJSON(locData+"config.json",
				{},
				function(cfg){
					if (vers == 0){
						vers = cfg[0].versione;
						readResult(result);
					}else{
					   if (vers == cfg[0].versione){readResult(result);}else{reloadPage();return false;}

					}
				});

/* fINE */
}

 function resetFiltri() {
        filMun = 0;
        filPerv = false;
		filNonPerv = true;
        filSez = '';
        jQuery('#select-choice-0').prop('selectedIndex',0);
        jQuery('#select-choice-0').selectmenu('refresh');
		jQuery('#checkbox-1').attr('checked',false).checkboxradio('refresh');
		jQuery('#checkbox-2').attr('checked',true).checkboxradio('refresh');
        jQuery('#search-basic').attr('value','');
        clickLisMun(0);

    }



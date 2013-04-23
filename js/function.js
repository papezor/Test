function loadAssets(){ loadingCustom(0);jQuery.getScript(locAssets+"GeoReferenziazioneMunicipi.js", function(){loadPlessiAssets();}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});}
function loadPlessiAssets(){jQuery.getScript(locAssets+"AnagraficaPlessi2.js", function(){createMappaDef();}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});}


	/*<script type="text/javascript" src="assets/"></script>
	<script type="text/javascript" src="assets/.js"></script>
	*/
function createMappaDef(){

		// CHECK REDIRECT
		checkParams();

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
			}, 1500);


		// CREO LISTNER SULL ZOOM
		google.maps.event.addListener(map,'zoom_changed', function() {
		remMarkerAll();
			if (map.getZoom() >= 14){addMarkerSez();}else{addMarkerMun();}
		});
		 // CREO LISTNER SUL DRAG END
		 google.maps.event.addListener(map,'dragend',function(){
		 remMarkerAll();
			if (map.getZoom() >= 14){addMarkerSez();}else{addMarkerMun();}
		});

		// GESTIONE SWIPE
		/*google.maps.event.addListener(map,'center_changed',function(){
		    if (isInfoWindowOpen(infowindow)){
				remMarkerAll();
				if (map.getZoom() >= 14){addMarkerSez();}else{addMarkerMun();}
			}
		});*/

		// GESTIONE SWIPE
				google.maps.event.addListener(map,'idle',function(){
				    if (!isInfoWindowOpen(infowindow)){
						remMarkerAll();
						if (map.getZoom() >= 14){addMarkerSez();}else{addMarkerMun();}
					}
		});

        if (name == 'Aff'){
		   loadStato();	
	    }else{ // CARICO DATI //
		   loadData();
		}
		


}

function loadStato() {
    var e; var result;
   jQuery.getJSON(locData + 'Affluenza.json?nc='+Math.random(),
				{},
				function(result){
					var aff = result['AFFLUENZE'][0]['AFFLUENZA'];
					if(aff == 2)statoAttuale= 'Affluenza Domenica ore 12:00';     
					if(aff == 3)statoAttuale= 'Affluenza Domenica ore 19:00';         
					if(aff == 4)statoAttuale= 'Affluenza Domenica ore 22:00';         
					if(aff == 9)statoAttuale= 'Affluenza Lunedi ore 15:00';         
					console.log(statoAttuale);
					loadData();
				}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
}

function isInfoWindowOpen(infoWindow){return (infoWindow.getMap()!=null);}
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
			return function() {

				zoomMuni(mun,marker.getPosition());
			}
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
				/* DISABILITO SWIPE */
					// GESTIONE SWIPE
					google.maps.event.addListener(map,'center_changed',function(){
					   return null;
					});



			     // CLICK SU SINGOLA BANDIERINA
			    //ARROTONDO A 7 DECIMANLI PER PROBLEMI DI JAVASCRIPT CON I DOBULE
				lat = roundNumber(marker.getPosition().lat(),7); while (lat.length != 10){lat = lat + "0" + "";}
				lng = roundNumber(marker.getPosition().lng(),7); while (lng.length != 10){lng = lng + "0" + "";}
				//console.log("coordinate cliccate", lng + ',' + lat);
				var plesso = coordPless['"'+lng+','+lat+'"'][0];
				var html = '';
				for (var x in plesso){
					color = 'red'; if (dataSetSez[parseInt(plesso[x]["N"])] == true){color = 'green';}
				    //html += '<span class="listaSezioni" style="color:'+color+'" onclick="caricoSezione('+"'"+ x +"'"+');">Sezione '+ plesso[x]["Numero"] + '</span><br>';
				     html+= '<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="null" data-iconpos="null" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-submit ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text" style="color:'+color+';font-size:0.8em;">Sezione '+ plesso[x]["N"] + '</span></span><button type="submit" data-theme="c" class="ui-btn-hidden" aria-disabled="false" onclick="caricoSezione('+"'"+ x +"'"+');">Hmm</button></div>';
				}
				infowindow.setContent(html);
				infowindow.open(map,marker);
			}
		})(marker));

	/*	google.maps.event.addListener(infowindow,'closeclick', function(){
				google.maps.event.addListener(map,'center_changed',function(){
					remMarkerAll();
					if (map.getZoom() >= 14){addMarkerSez();}else{addMarkerMun();}
					});
				});
		*/

}

// RIMUOVO SINGLE MARKER //
function remSingleMarker(coord){
        if (markerArray[coord.lat() + '' + coord.lng()]){markerArray[coord.lat() + '' + coord.lng()].setMap(null);}
		if (markerMun[coord.lat() + '' + coord.lng()]){markerMun[coord.lat() + '' + coord.lng()].setMap(null);}
}

// RIMUOVI MARKER MUNICIPIO IN CASO DI ZOOM MAGGIORE DI 12
function remMarkerAll(){
   //remMarkerMun();
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
	  map.setZoom(14);

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

	if (name == 'Aff'){var title1 = statoAttuale;}else{
				var title1 = 'Scrutinio ';
				if (tipo == 0){title1 += 'Camera';}
				if (tipo == 1){title1 += 'Senato';}
				if (tipo == 2){title1 += 'Regionali Lista';}
				if (tipo == 3){title1 += 'Regionali Preferenze';}

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

	if (map.getZoom() >= 14){//AGGIUNGO DETTAGLIO MUNICIPIO //
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
    if (map.getZoom() >= 14){
	    var latDet = roundNumber(targetCoordMun.lat(),7); while (latDet.length != 10){latDet = latDet + "0" + "";}
		var lngDet = roundNumber(targetCoordMun.lng(),7); while (lngDet.length != 10){lngDet = lngDet + "0" + "";}
		
		var plesso = coordPless['"'+lngDet+','+latDet+'"'][0];
		
	    for (var x in plesso){
			munD = plesso[x]["M"];

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
	var res2;
	jQuery.getJSON(locData+name+tipo+'P.json?nc='+Math.random(),
				{},
				function(result){
				addDataGraphAfterJson(parseInt(result[0]["pervenute"]));
				}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
/* fINE */

}

function addDataGraphAfterJson(pubtotAppo){

	var affTot = dataSetSez.length - piePerv - 1;
	var pubTot = pubtotAppo;
	var priTot = piePerv - pubtotAppo;

	console.log(pubtotAppo,piePerv,(dataSetSez.length -1));
	console.log(affTot,pubTot,priTot,(dataSetSez.length -1));
		var data = [
		['N.P.',affTot],
		['Pubb.',pubTot],
		['Nuove',priTot]

	];

	 plotPieDiff = jQuery.jqplot ('chartPieDiff', [data], {
      seriesDefaults: {
        // Make this a pie chart.
        renderer: jQuery.jqplot.PieRenderer,


        rendererOptions: {
           showDataLabels: true,dataLabelFormatString:'%.2f%'
        }},
	   series: [
                    {seriesColors: [  "gray","orange" ,"red"]}
                    ],
	  title: "Situazione Sezioni",
	  legend: {
                show: true,
                location: 'e',
                placement: 'outside',
				dataLabels: 'value'
            },
	  grid: {background:'transparent', borderColor: '#dedede'}	  });

	plotPieDiff.replot();
	plotPieDiff.redraw();

	if (name == 'Aff'){var title1 = statoAttuale;}else{
				var title1 = 'Scrutinio ';
				if (tipo == 0){title1 += 'Camera';}
				if (tipo == 1){title1 += 'Senato';}
				if (tipo == 2){title1 += 'Regionali Lista';}
				if (tipo == 3){title1 += 'Regionali Preferenze';}

			}


    var dataPerc = [];
	var dataPercTick = [];
	var dataPercX = [
						["0 ",0],
						["25 ",25],
						["50 ",50],
						["75 ",75],
						["100 ",100]
					];
    conta = 1;
	for (var mun in dataSetDetMun){

	   dataPerc.push(parseInt(dataSetDetMun[mun].replace('%','')));
	   dataPercTick.push(["Mun " + mun+'']);
	   conta++;


	}

	jQuery('#titleGraph').text('Stato avanzamento - '+title1);
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
				fontSize: '10pt',
				textColor: "#fff"
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
   var perv = "No";var color = "red";if (dataSetSez[parseInt(sezione["N"])] == true){perv = "Si";color = "green";}
   jQuery("#dettSezioneNumero").html(sezione["N"]);
   jQuery("#dettSezioneIncaricato").html(sezione["U"] + " - " + sezione["I"]);
   jQuery("#dettSezioneScuola").html(sezione["S"]);
   jQuery("#dettSezioneMunicipio").html(sezione["M"]);
   jQuery("#dettSezioneUbicazione").html(sezione["Ub"]);
   jQuery("#dettSezioneGruppo").html(sezione["G"]);
   jQuery("#dettSezioneTelefono").html(sezione["T"]);
   jQuery("#dettSezioneCellulare").html(sezione["Ce"]);
   jQuery("#dettSezionePerv").html('<font color="'+color+'">'+ perv + '</font>');
   jQuery("#dettSezione").popup("open");
}

// CARICO ANAGRAFICA PLESSI  (COMPRESE LE COORDINATE)
function loadPlessi(){
   for (var x in plessi){
      var obj = plessi[x];
	  var coordinate = obj["Coordinate"].replace(",0","");
	  if (!coordPless['"' + coordinate + '"']){coordPless['"' + coordinate + '"'] = [];}
	  coordPless['"' + coordinate + '"'].push(obj["SEZIONI"]);

   }
}

// AGGIORNO DATA
function loadData(){

 loadingCustom(0);

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
jQuery.getJSON(locData+name+tipo+'.json?nc='+Math.random(),
				{},
				function(result){ checkConfig(result);}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
/* fINE */

}
// LEGGO RISULTATI DELLA LOAD_DATA()
function readResult(e){
	 piePerv = 0;
	 for (var k in e){
	    dataSetMun[e[k]["municipio"]] = e[k]["perc"];
		dataSetDetMun[parseInt(e[k]["municipio"])] = e[k]["perc"];
		var ple = e[k]["plessi"];
		for (var x in ple){
			var sez = ple[x]["sezioni"];
			for (var s in sez){
			   var perv = false;
			   if (sez[s]["pervenuta"] == "SI"){perv = true;piePerv++;}

			   dataSetSez[parseInt(sez[s]["numero"])] = perv;
			}
		}
	}

	if (name == 'Aff'){cambiaTitolo(statoAttuale);}else{
				var tit = 'Scrutinio ';
				if (tipo == 0){tit += 'Camera';}
				if (tipo == 1){tit += 'Senato';}
				if (tipo == 2){tit += 'Regionali Lista';}
				if (tipo == 3){tit += 'Regionali Preferenze';}
		     	cambiaTitolo(tit);
			}

			remMarkerAll();
			if (map.getZoom() >= 14){addMarkerSez();}else{addMarkerMun();}
			jQuery('#nav-panel').panel('close');
			if (statusTimer == false){startTimer();}else{resetTimer();}
			addDataGraph();
			console.log("Dati Caricati: ",name+tipo+"");
			loadingCustom(1);
			
}


function getStatoCoordinata(lat,lng){
   // 0 ROSSO 1 ROSSO/VERDE 2 VERDE

   var plesso = coordPless['"'+lng+','+lat+'"'][0];

   var ck1 = 0; var ck2 = 0;

   for (var x in plesso){

        ck1++;
		if (dataSetSez[parseInt(plesso[x]["N"])] == true){ck2++;}
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
   	if (name == 'Aff'){
		loadStato();	
	}else{
		loadData();
	}
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
function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}

function checkParams(){
	var loc = window.location.href.split('?');
	if(loc[1]){
		var params = loc[1].split('&');
		var paramsName = params[0].split('=');
		var paramsType = params[1].split('=');

		name = paramsName[1];
		tipo = paramsType[1].replace('#','');
	}else{
		name = 'Aff';
		tipo = 0;
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

jQuery.getJSON(locData+"config.json?nc="+Math.random(),
				{},
				function(cfg){
               
				   if(name!='Aff') statoAttuale = cfg[0].descStato;

					if (vers == 0){
						vers = cfg[0].versione;
						readResult(result);
					}else{
					   if (vers == cfg[0].versione){readResult(result);}else{reloadPage();return false;}

					}
				}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});

/* fINE */
}

function reloadPage(){
	var loc = window.location.href;
	loc = loc.replace('#','');
	window.location.href  = loc;

}



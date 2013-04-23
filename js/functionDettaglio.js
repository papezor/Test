function loadAssets(){
    loadingCustom(0);

jQuery.getScript(locAssets+"GeoReferenziazioneMunicipi.js", function(){loadPlessiAssets();}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});

}
function loadPlessiAssets(){jQuery.getScript(locAssets+"AnagraficaPlessi2.js", function(){
	checkParams();
	if (name == 'Aff'){
		loadStato();	
	}else{
		loadData();
	}
}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
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

var contaTot;var contaNonPervTot;
var filMun = 0;

function loadMun() {
  
  contaTot = 0;
  contaNonPervTot =0;  
  
          var html= '<ul id="listaMun" data-role="listview" style="padding-top:5px;margin-left:3px;margin-top:3px;width:99%;" >';
          html+= '<li><a onclick="clickLisMun(0);"><img src="images/Roma_1.png"  class="ui-li-icon">Roma Capitale</a></li>';
          for (var key in munMap) {
          
             var mun = munMap[key]["MUNICIPIO"];
             var coord = munMap[key]["COORDINATE"];
             if (mun.length < 5){
             munimg = parseInt(mun);
             
             contaMun = parseInt(dataSetDetMun[parseInt(mun)]["totale"]);
             contaPervMun = parseInt(dataSetDetMun[parseInt(mun)]["pervenute"]);
             contaNonPervMun = contaMun - contaPervMun;
             contaTot+= contaMun;
             contaNonPervTot+= contaNonPervMun;
             
                html+= '<li><a onclick="clickLisMun('+"'"+ mun +"'"+');"><img src="images/Roma_'+ munimg +'.png"  class="ui-li-icon">Municipio '+munimg+'</a></li>';
             }
         } 
          html+='</ul>';
          jQuery('#tableMun').html(html);
          jQuery('#listaMun').listview();
          jQuery('#pannelloFiltri').css("height", (jQuery('.ui-page').height() - 80) + 'px');
          jQuery('#tableMun').css("height", (jQuery('.ui-page').height() - 80) + 'px');
          //jQuery('#listaMun').css("height", (jQuery('.ui-page').height() - 80) + 'px');
         
		 clickLisMun(filMun);
        
          
}


function clickLisMun(mun){
 filMun = mun;
 //loadMun();
 loadDataTable();

}

function loadDataTable(){
  jQuery('#pannelloSezioni').css("height", (jQuery('.ui-page').height() - 80) + 'px');
  jQuery('#tableSez').css("height", (jQuery('.ui-page').height() - 80) + 'px');   

   jQuery('#tableSez').html('');
  
 
	
	if(contaNonPervTot == 0) { 	
	  var fine = '<font color="white" size="20">Affluenza Completa</font>';
	  jQuery('#tableSez').html(fine);
	}  else {
//if(contaNonPervTot <= 5000) {
if(contaNonPervTot <= 50) {
	  var html= '<ul id="appoList" data-role="listview" style="padding-top:5px;margin-left:3px;margin-top:3px;width:99%;" >';
      var conta = 0;
		for (var x in plessi){
            
			var sez = plessi[x]["SEZIONI"];
			
			conta += sez.length;
			for (var y in sez){
			    
				if (sez[y]["M"] == filMun || filMun == 0){
					 
					if ( dataSetSez[parseInt(sez[y]["N"])] == false){
					    
						var func = "javaScript:apriSezTab("+x+","+y+");";
			     	//html += '<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="null" data-iconpos="null" data-theme="c" class="ui-submit ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false" data-disabled="false"><span class="ui-btn-inner" style="color:#d81417;"><span class="ui-btn-text">Sez. '+sez+' - Municipio '+plesso[y]["Municipio"]+'</span></span><button type="submit" data-theme="c" class="ui-btn-hidden" data-disabled="false" onClick="'+func+'">'+sez+'</button></div>';
						html += '<li><a href="' + func + '">Sez. ' + sez[y]["N"] + ' - Municipio ' + sez[y]["M"] + '</a></li>'; ;
						}
					}
				}
			
			}
         html += '</ul>';

	 console.log(conta);
	 jQuery('#tableSez').html(html);
	 jQuery('#appoList').listview();

	} else {
	      
	      var dati = [];
	     
	      if(filMun == 0) {   //renderizzo il grafico di tutto il comune
	           x = contaNonPervTot;
	           y = (contaTot - contaNonPervTot);
	           title = 'Sezioni pervenute - tutto il Comune';
	           
	           
	      } else {
	      
	          
	          contaMun = parseInt(dataSetDetMun[parseInt(filMun)]["totale"]);
            contaPervMun = parseInt(dataSetDetMun[parseInt(filMun)]["pervenute"]);
            contaNonPervMun = contaMun - contaPervMun;
            x = contaNonPervMun
	          y = (contaMun - contaNonPervMun);
	          title = 'Sezioni pervenute - Municipio ' + filMun;
	      }
	      
	      dati = [['Non Pervenute',x],['Pervenute',y]];
	      var PieAffl;
          PieAffl = jQuery.jqplot ('tableSez', [dati], 
          { 
            title: {
            text: title,

            color: 'white',   // title for the plot,
            show: true
           },

            seriesDefaults: {
              // Make this a pie chart.
              renderer: jQuery.jqplot.PieRenderer, 
              rendererOptions: {
                // Put data labels on the pie slices.
                // By default, labels show the percentage of the slice.
                showDataLabels: true,
                dataLabels: 'value',
                sliceMargin: 4, 
                lineWidth: 5,
                padding: 4
              }
            }, 
            series: [
                    {seriesColors: [  "lightgray","red"]}
                    ],
            legend: { renderer:jQuery.jqplot.PieLegendRenderer,
                            rendererOptions:{
                               numberRows:2
                            },
                              show: true,
                              location: 's',
                              showSwatches: 'true',
                              //fontSize: '1em',
                              textColor: 'white',
                      placement: 'e'},
            grid:{background:'transparent', borderWidth:0, shadow:false }
          }
        );
        
	      PieAffl.replot();
	}
  }
  
     loadingCustom(1);
	console.log('paginazione dati');

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
	//	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(dettPanelBox);
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


function addDataGraph(tit){
	var res2;
	jQuery.getJSON(locData+name+tipo+'P.json?nc='+Math.random(),
				{},
				function(result){
				addDataGraphAfterJson(parseInt(result[0]["pervenute"]),tit);
				}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
/* fINE */

}

function addDataGraphAfterJson(pubtotAppo,tit){


	var affTot = dataSetSez.length - piePerv - 1;
	var pubTot = pubtotAppo;
	var priTot = piePerv - pubtotAppo;
	
	jQuery('#titlePage').text(tit);
	console.log(affTot,pubTot,priTot);
	console.log(dataSetSez.length,pubtotAppo,piePerv);
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
           showDataLabels: true,
		   dataLabelFormatString:'%.2f%'
        }},
	   series: [
                    {seriesColors: [  "gray","orange" ,"red"]}
                    ],
	  title: "Situazione Sezioni",
	  legend: {
                show: true,
                location: 'e',
                placement: 'outside'
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
			

	jQuery('#titleGraph').html("Stato di avanzamento  - " + piePerv + " sezioni su 2600");
	
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
		
	   dataPerc.push(parseInt(dataSetDetMun[mun]["perc"].replace('%','')));
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


// AGGIORNO DATA
function loadData(){
 loadingCustom(0);
 addGraphPanel();

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
				function(result){checkConfig(result);}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
/* fINE */

}


//AGGIUNTA VARIABILI PANNELLINO DEL CAZZO 

// LEGGO RISULTATI DELLA LOAD_DATA()
function readResult(e){


	 piePerv = 0;
	 for (var k in e){
	    dataSetMun[e[k]["municipio"]] = e[k]["perc"];
		if (!dataSetDetMun[parseInt(e[k]["municipio"])]){dataSetDetMun[parseInt(e[k]["municipio"])] = [];}
		dataSetDetMun[parseInt(e[k]["municipio"])]["pervenute"] = e[k]["pervenute"];
		dataSetDetMun[parseInt(e[k]["municipio"])]["totale"] = e[k]["totale"];
		dataSetDetMun[parseInt(e[k]["municipio"])]["perc"] = e[k]["perc"];
		
		
	
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
	
			if (name == 'Aff'){tit = statoAttuale; cambiaTitolo(statoAttuale);}else{
				var tit = 'Scrutinio ';
				if (tipo == 0){tit += 'Camera';}
				if (tipo == 1){tit += 'Senato';}
				if (tipo == 2){tit += 'Regionali Lista';}
				if (tipo == 3){tit += 'Regionali Preferenze';}
		     	cambiaTitolo(tit);
			}
			jQuery('#nav-panel').panel('close');
			if (statusTimer == false){startTimer();}else{resetTimer();}
			addDataGraph(tit);
			console.log("Dati Caricati: ",name+tipo+"");
			loadMun();
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

function apriSezTab(x,y){
    html = '';
	var sezione = plessi[x]["SEZIONI"][y];
	if (!document.getElementById('popDett' + sezione["N"])){
		  //alert(dataSetSez[parseInt(sezione["Numero"])] + '  '+lng + ',' + lat);
		  var perv = "No";var color = "red";if (dataSetSez[parseInt(sezione["N"])] == true){perv = "Si";color = "green";}
		  //html += '<div id="popDett' + sezione["Numero"] + '" class="ui-corner-all ui-body-c" style="margin-top:15px; margin-left:20px; width:80%;line-height:1.1em;border: 1px solid orange;text-shadow:none;color:white;background:rgb(0, 0, 0);background: rgba(0, 0, 0, 0.5);">';
		  html += '<div id="popDett' + sezione["N"] + '" class="contentFiltro ui-corner-all" style="height:auto !important;color:white;padding:5px 15px;">';

		  var func = "chiudiSezTab('popDett" + sezione["N"] + "')";
		  var funcMap = "return false;";

		 // html+= '<a href="#mypanel" data-icon="plus" data-iconpos="notext">Add</a>';

		  html+= '<div class="ui-grid-a" style="width:100%;">';
		  html += '<div class="ui-block-a" style="width:75%">';
		  html += '<span style="color:' + color + ';font-size:1.2em;">Sezione ' + sezione["N"] + '</span>';
		  html += '</div>';
		  html += '<div class="ui-block-b" style="float:right;text-align:right;width:20%;" >';
	      html += '<a href="javaScript:' + func + ';" data-icon="delete" data-role="button"  data-iconpos="notext" data-mini="true" id="buttSez' + sezione["Numero"] + '" style="color:white;">Close</a>' + '';
		  /*<!--html += '<a href="javaScript:' + funcMap + ';" data-icon="delete" data-role="button" data-mini="true" id="buttSez' + sezione["Numero"] + 'mappa">Mappa</a>' + '</h3>';*/
		  html += '</div>';
		  html+='</div>';
		  html += '<div>';
		  html+= '<p>Pervenuta <font color="'+color+'">'+ perv + '</font><br>';
		  html+= 'Municipio '+ sezione["M"] +'<br>';
		  html+= 'Incaricato '+ sezione["U"] + " - " + sezione["I"] +'<br>';
		  html+= 'Scuola '+ sezione["S"] +'<br>';
		  html+= 'Indirizzo '+ sezione["Ub"] +'<br>';
		  html+= 'Gruppo '+ sezione["G"] +'<br>';
		  html+= 'Telefono '+ sezione["T"] +'<br>';
		  html+= 'Cellulare '+ sezione["Ce"] +'<br>';
		  html += '</p></div></div>';
		  jQuery("#tableSezDett").css('height',(jQuery('.ui-content').height() - 70) + 'px');
		  jQuery("#tableSezDett").css('overflow-y','scroll');
		  jQuery("#tableSezDett").append(html).show();
		  //jQuery("#buttSez" + sezione["N"]).button();
		  setTimeout('jQuery("#buttSez" + sezione["N"]).button()',500);
		  

		 // jQuery('a').button('refresh');
	}else{chiudiSezTab('popDett' + sezione["N"]);}
}

function chiudiSezTab(target){jQuery('#'+target).remove();}

// FUNZIONI VARIE LIKE FUNZIONI DI TIMER PER RELOAD DATA, CREAZIONE DIV PER MAPPA E ARROTODANMENTO NUMERI
function addSecTimer(){if (timer == refresh){setTimeout("addSecTimer()",1000);loadData();}else{/*console.log(timer);*/timer++;setTimeout("addSecTimer()",1000);}}
function resetTimer(){timer = 0;}
function stopTimer(){timer = -2000;}
function startTimer(){statusTimer = true; resetTimer();setTimeout("addSecTimer()",1000);}
function roundNumber(rnum, rlength) {var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);	return newnumber.toString();}
function createDivGraph(){if (!document.getElementById("homeGraph")){jQuery(".ui-content").append('<div id="homeGraph" class="ui-corner-all ui-body-a" style="width:'+(jQuery(document).width()-9)+'px;height:320px; bottom:-285px;position:absolute;left:3px; right:3px;z-index:100" data-theme="a" ></div>');} return '#homeGraph';}
//function distanceFromCenter(coord){return google.maps.geometry.spherical.computeDistanceBetween(coord,map.getCenter());}
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
				        if (name != 'Aff')statoAttuale = cfg[0].descStato;
						console.log(statoAttuale);
						readResult(result);

					}
				).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});

/* fINE */
}



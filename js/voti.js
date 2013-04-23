

function loadData(str) {
     
    page = str; 
	dataSet = [];
    selected = [];
    loadingCustom(0);
	
    var file = "";
	var titolo = "";
	
	if(str == 'sindaco')  {titolo = 'Risultati voti sindaco'; file = 'VotiSindaco';}
    if(str == 'listacomunali') {titolo = 'Risultati voti liste comunali'; file = 'VotiListaCom';}	
	if(str == 'presidente')  {titolo = 'Risultati voti presidente municipio'; file = 'VotiSindaco';}
    if(str == 'listamunicipali') {titolo = 'Risultati voti liste municipali'; file = 'VotiListaCom';}
	
	cambiaTitolo(titolo);
	
	var e; var result;
    jQuery.getJSON(locData + file + '.json?nc='+Math.random(),
				{},
				function(result){
					checkConfig(result);}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
	
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
					    statoAttuale = cfg[0].descStato;
						//console.log(statoAttuale);
						readResult(result);

					}
				).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});

/* fINE */
}

function readResult(e){

    if (statusTimer == false){startTimer();}else{resetTimer();}

	 for(var k in e) {
	   var obj = e[k];
	   var nome = e[k]['Nome'];
	   if(!dataSet[nome]) dataSet[nome] = [];
	   
	   for(var x in obj) {
	     if(x != 'Nome') dataSet[nome][x] = obj[x];   
	   }
	     
     } 

	renderGraphRisultati();
}

function renderGraphRisultati() {

var label = 'Tutto il comune';
var votiTot = 0;

     var dati = [];
  for(var x in dataSet) {
      dati.push([x,parseInt(dataSet[x]['Municipio 99'])]);
	  votiTot += parseInt(dataSet[x]['Municipio 99']);
  }

   //console.log(dati);
	graphRisultati = jQuery.jqplot('graphRisultati', [dati], {
	seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer,
		},
	series: [{color: colorVotiSindaco}],
	
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
				     
							tickOptions:{showGridline: false,textColor: "#fff"}
						},
						// yaxis: {angle:0}
						yaxis: {
						        
						        tickOptions:{textColor: "#fff"},
							
						}
						// yaxis: {renderer: $.jqplot.CategoryAxisRenderer}
					},

					grid: {background:'transparent', borderColor: '#dedede'} });
				graphRisultati.replot();
    var leg = [{'lbl':label,'color':colorVotiSindaco}];
	var target = 'graphRisultati';
	writeLegend(leg,target,'s');
	
	//creo grafico torta pannello di destra
	
	var pieColors = [];
	var legPie = [];
	var pieDati = [];
	var i = 1;
	
	pieDati.push(['Altri',0]);
	pieColors.push(cPie[0]);
	
	
	for(var x in dataSet) {
	   var votiCand = parseInt(dataSet[x]['Municipio 99']);
	   if(votiCand < roundNumber( votiTot*5 / 100,2))
          	  pieDati[0][1] += votiCand;
       else { pieDati.push([x,parseInt(dataSet[x]['Municipio 99'])]);		  
	          legPie.push({'lbl': x, 'color': cPie[i]});
			  pieColors.push(cPie[i]);
              i++;
			}
	   
	}
	legPie.push({'lbl':'Altri ', 'color': cPie[0]});
	
	//console.log(pieDati);
	PieVoti = jQuery.jqplot ('pieRisultati', [pieDati],
    {
      seriesDefaults: {
        // Make this a pie chart.
        renderer: jQuery.jqplot.PieRenderer,
        rendererOptions: {
          // Put data labels on the pie slices.
          // By default, labels show the percentage of the slice.
          showDataLabels: true,
          sliceMargin: 4,
          lineWidth: 5,
          padding: 4,
		  dataLabelFormatString:'%.2f%'
        }
      },
     	series: [
	                {seriesColors: cPie}
	            ],
      grid:{background:'transparent', borderWidth:0, shadow:false }
    }
  );
    PieVoti.replot();
	var target = 'pieRisultati';
	writeLegend(legPie,target,'bl3');
   
    loadingCustom(1);
}
var seriesColors = [];
   var leg = [];
   
function renderGraphConfronti(candidato,color,nome) {
   
   if(color == '') color = cPie[0];
   
   loadingCustom(0);
   
   var trovato = false;
   var indexToRemove = 0;
   
   for (var x in selected){
      if(selected[x]['candidato'] == candidato) {
	    trovato = true;
		indexToRemove = x;
     }
  }
   
   
  if(!trovato) {
     if(selected.length == 2) {
		 alert("Puoi selezionare massimo due candidati");
		 loadingCustom(1);
		 return;
     }
     selected.push({'candidato' : candidato});
	 leg.push({'lbl':'Voti '+candidato, 'color': color});
	 seriesColors.push(color);
	 }
  else { selected.splice(indexToRemove,1);
         seriesColors.splice(indexToRemove,1);
		 leg.splice(indexToRemove,1);
   }
   
   if(selected.length == 0) {
     jQuery('#graphConfronti').empty(); 
     var html = '<div align="center" style="padding-top:30px;"><font color="white" size="7">Selezionare un candidato</font></div>';
	 jQuery('#graphConfronti').append(html);
	 loadingCustom(1);
     return;
   }
   
   
  
   var dati = [];
  
  // var i = 0;
   
   
   
   for (var x in selected){
      
      var municipi = [];
	 
      var nome = selected[x]['candidato'];
	  var obj = dataSet[nome];
	  for(var y in obj) {
	     if(y != 'Nome' && y != 'Municipio 99') municipi.push([y,parseInt(obj[y])]);
	  }
	  dati.push(municipi);
	  
      
   }
  
   
   graphConfronti = jQuery.jqplot('graphConfronti', dati, {
	seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer,
		},
	seriesColors: seriesColors,
	
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
				     
							tickOptions:{showGridline: false,textColor: "#fff"}
						},
						// yaxis: {angle:0}
						yaxis: {
						        
						        tickOptions:{textColor: "#fff"},
							
						}
						// yaxis: {renderer: $.jqplot.CategoryAxisRenderer}
					},

					grid: {background:'transparent', borderColor: '#dedede'} });
				graphConfronti.replot();
	/*var target = 'graphConfronti';
	writeLegend(leg,target,'s');*/
   
    loadingCustom(1);
}
	
 function caricaPartiti(tipo){
    page = tipo;
    var lista;
     jQuery('#pannelloCandidati').css("display", 'none');
	//jQuery('#listaCandidati').fadeIn(1000).animate({"left":(jQuery(document).width()+50)}, "fast"); 
    if (tipo == 'Com'){/* COMUNALI */ lista = listaReg; titolo = 'Preferenze Liste Comunali'}
    if (tipo == 'Mun'){/* MUNICIPALI */ lista = listaSen; titolo = 'Preferenze Liste Municipali'}
	
	cambiaTitolo(titolo);
       
     var html ='<ul id="listViewCandidati" data-role="listview" style="padding-top:5px;margin-left:3px;margin-top:3px;width:99%;" >';
	
      for(var x in lista)
      {
        var idPartito = x;
        var nome=lista[x]['nome'];
        var logo=lista[x]['logo'];
		var votiLista = parseInt(lista[x]['votilista']);
        var func = '';
        if (lista[x]['lista']){
            func = "javaScript:apriLista("+x+",'"+nome+"');";
            if (!candidati[x]){candidati[x] = [];}
            candidati[x].push(lista[x]['lista']);
        }
        html += '<li><a href="'+func+'">';
        
        if(parseInt(x) >= '9') 
         html += '<img alt="" src="simboli/r'+(parseInt(x)+1)+'.gif"  />';
        else
         html += '<img alt="" src="simboli/r0'+(parseInt(x)+1)+'.gif" />';
        
        html += '<h3><div style="width:100%;float:left;"><div style="width:80%;float:left;">'+nome+'</div><div style="width:20%;float:left;">'+ votiLista +'</div></div></h3></a></li>';
      
      }
      
      html+='</ul>';
  
      jQuery('#tableMun').html(html);
      jQuery('#listViewCandidati').listview();
      jQuery('#pannelloFiltri').css("height", (jQuery('.ui-page').height() - 50) + 'px');
      jQuery('#tableMun').css("height", (jQuery('.ui-page').height() - 50) + 'px');
 
 }
  
     
    
function apriLista(id,nomePartito)
{
	 
    $('#tableSez').html('');

    html = '<ul  data-role="listview" style="line-height:20px; padding-top:5px;margin-left:3px;margin-top:3px;width:99%; " id="candList">';
    
    html = '<h3><div style="width:100%;margin-left:6px;color:red;">'+nomePartito+'</div></h3>';
    
    
    
    for(var x in candidati[id][0]){ 
     
     html+= '<div style="width:100%;float:left;color:yellow;"><div style="width:80%;float:left;">'+candidati[id][0][x]["posizione"]+' - '+candidati[id][0][x]["nome"] +'</div><div style="width:20%;float:left;">'+candidati[id][0][x]['voti']+'</div></div><br><br>';
     }
     
     html += '</ul>';
	 
	 jQuery('#tableCand').html(html);
	 jQuery('#candList').listview();
     jQuery('#pannelloCandidati').css("height", (jQuery('.ui-page').height() - 50) + 'px');
     jQuery('#tableCand').css("height", (jQuery('.ui-page').height() - 50) + 'px');
     jQuery('#pannelloCandidati').css("display", 'block');
     
}


function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
function roundNumber(rnum, rlength) {var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);	return newnumber.toString();}
function addSecTimer(){if (timer == refresh){setTimeout("addSecTimer()",1000);if(page == 'Com' || page == 'Mun') caricaPartiti(page); else loadData(page);}else{/*console.log(timer);*/timer++;setTimeout("addSecTimer()",1000);}}
function resetTimer(){timer = 0;}
function stopTimer(){timer = -200000000;}
function startTimer(){statusTimer = true; resetTimer();setTimeout("addSecTimer()",2000);}
function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
function createDivGraph(){if (!document.getElementById("homeGraph")){jQuery(".ui-content").append('<div id="homeGraph" class="ui-corner-all ui-body-a" style="width:'+(jQuery(document).width()-9)+'px;height:320px; bottom:-285px;position:absolute;left:3px; right:3px;z-index:100" data-theme="a" ></div>');} return '#homeGraph';}
function closeAllPanel(str){statusGraph = true; slideGraph(); jQuery('#nav-panel').panel('close'); jQuery('#graphPerc').panel('close');jQuery('#'+str).panel('open');}
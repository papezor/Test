var defPop = {};
var municipi = ["1","2","3","4","5","6","7","8","9","10","11","12","13","15","16","17","18","19","20"];
var tipo = 0; // 0 = regionali 1 = camera 2 = senato
var etaRC = ['18-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','DA 65'];
var etaS =  ['25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','DA 65'];
var eta;

function loadAssetCorpo() {
    loadingCustom(0);
    pulisciMappa();
    var file = "";
	var titolo = "Corpo Elettorale ";
    if(tipo == 0) {file = "Regionali";  titolo+= file; eta = etaRC;}
	else if(tipo == 1) { file = "Camera"; titolo+= file; eta = etaRC;}
	else { file = "Senato"; titolo+= file;  eta = etaS;}
	cambiaTitolo(titolo);
	jQuery.getScript(locAssets+"Corpo" + file + ".js", function(){loadCorpo();}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
	
}

function loadCorpo() {
	
    for(var x in CORPO) {
	   var obj = CORPO[x];
	   var mun = parseInt(obj['ID']['NUMERO']);
	   defPop[mun] = {};
	  for(var y in obj['ETA']) {
       var e = obj['ETA'][y]['FASCIA'];
	   defPop[mun][e] = {};
	   defPop[mun][e]['MASCHI'] = obj['ETA'][y]['MASCHI'];
	   defPop[mun][e]['FEMMINE'] = obj['ETA'][y]['FEMMINE'];
	   defPop[mun][e]['TOTALI'] = obj['ETA'][y]['TOTALI'];
	 }
	}
	
	  renderG1();	
    renderG2();
   // renderG3();
 
}
    
    var obj = {
	  minMun: 1,
	  maxMun: 2,
	  checkedMun: 0
	}    

var graph = {};

for (i=1;i<=obj.maxMun;i++){
   graph['g'+i] = {'idG':i, 'mun': ''};
}


function renderG1()
{
 
   var popDef = {};
   
   for (var x in municipi){
	  for(var y in eta) {
	        if(!popDef[eta[y]]) popDef[eta[y]] = 0; 
	        var mun = parseInt(municipi[x]);
	        popDef[eta[y]]+= parseInt(defPop[mun][eta[y]]['TOTALI']);
	  }
  }
  
  /*for (var x in municipi){
	  for(var y in eta) {
	        if(!popDef[eta[y]]) {
	           popDef[eta[y]] = {};
	           popDef[eta[y]]['totali'] = 0;
	           popDef[eta[y]]['maschi'] = 0;
	           popDef[eta[y]]['femmine'] = 0;
	        } 
	        var mun = parseInt(municipi[x]); 
	        popDef[eta[y]]['totali']+= parseInt(defPop[mun][eta[y]]['TOTALI']);
	        popDef[eta[y]]['maschi']+= parseInt(defPop[mun][eta[y]]['MASCHI']);
	        popDef[eta[y]]['femmine']+= parseInt(defPop[mun][eta[y]]['FEMMINE']);
	  }
  }*/
  
  var dati = [];
  for(var x in popDef) {
    dati.push([x,popDef[x]]);
  }
  
	plotG2=jQuery.jqplot ('G2', [dati], {
	seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer,
		},
	series: [{color: totMun}],
	
					axesDefaults: {
						tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
						tickOptions: {
							angle: -30,
							fontSize: '10pt'
							}
					},
					axes: {
						xaxis: {
						  label:'Fascia di età',
						   labelOptions: {
                  fontSize: '10pt',
                  textColor: "#fff"
              },
							renderer: $.jqplot.CategoryAxisRenderer,
				     angle: -30,
				     fontSize: '10pt',
				    
				     tickOptions:{showGridline: false,textColor: "#fff"}
					 },
						// yaxis: {angle:0}
						yaxis: {
						        
						        tickOptions:{textColor: "#fff"}}
						// yaxis: {renderer: $.jqplot.CategoryAxisRenderer}
					},

					grid: {background:'transparent', borderColor: '#dedede'} });
				plotG2.replot();
    var leg = [{'lbl':'Tutto il Comune','color':totMun}];
	var target = 'G2';
	writeLegend(leg,target,'s');		
			//	plotG2.redraw();

}

function renderG2() {
 
    var totM = 0;
    var totF = 0;
    var tot = 0;
    
	for (var x in municipi){
	  totM += parseInt(defPop[municipi[x]]['TOTALE']['MASCHI']);
	  totF += parseInt(defPop[municipi[x]]['TOTALE']['FEMMINE']);
	  tot+= parseInt(defPop[municipi[x]]['TOTALE']['TOTALI']);
	}
	
	var percM = Math.round((totM * 100) / tot); 
	var percF = Math.round((totF * 100) / tot);
	
	 plotGraphSex = jQuery.jqplot ('barChart', [[tot],[totM],[totF]], {
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
		series: [
            {color: totMun, label: 'Totale'},
            {color: totMunM, label: 'Maschi'},
            {color: totMunF, label: 'Femmine'}
        ],
		legend: {
				
                show: false,
                location: ' nw',
                textColor: 'white'
            },
		axes: {
			xaxis: {
			  label:'Numero di elettori',
				labelOptions: {
                  fontSize: '10pt',
                  textColor: "#fff"
              },
				renderer: $.jqplot.CategoryAxisRenderer,
				angle: -30,
				fontSize: '10pt',
				tickOptions:{showGridline: false,textColor: "#fff"}

				},
				yaxis: {
				 tickOptions:{textColor: "#fff"}
				}
			
		},

	grid: {background:'transparent', borderColor: '#dedede'} });
	
	plotGraphSex.replot();
	var leg = [{'lbl':'Popolazione','color':totMun},
			   {'lbl':'Totale Maschi','color':totMunM},
			   {'lbl':'Totale Femmine','color':totMunF}];
	var target = 'barChart';
	writeLegend(leg,target,'r');
	//	plotGraphSex.redraw();
	
	var s1 = [['% Maschi',totM],['% Femmine',totF]];
    
	var plot3 = $.jqplot('graphDonut',[s1], {
    seriesDefaults: {
      // make this a donut chart.
      renderer:$.jqplot.DonutRenderer,
      rendererOptions:{
        // Donut's can be cut into slices like pies.
        sliceMargin: 3,
        // Pies and donuts can start at any arbitrary angle.
        startAngle: -90,
        showDataLabels: true,
        
        // By default, data labels show the percentage of the donut/pie.
        // You can show the data 'value' or data 'label' instead.
        //dataLabels: 'value'
      }
    },
    series: [
	            {seriesColors: [ totMunM,totMunF]}],
   
    grid: {background:'transparent', borderColor: '#dedede',shadow:false},
    
  });	
   
   plot3.replot();
   	var leg = [{'lbl':'% Maschi','color':totMunM},
			   {'lbl':'% Femmine','color':totMunF}];
	var target = 'graphDonut';
	writeLegend(leg,target,'bl1');
   
    loadingCustom(1);
}


function renderData(){

    loadingCustom(0);
    /* CREO DATI PER GRAPH POPOLAZIONE */
	var dati = [];
	var seriesColors = [];
	var leg = [];
	var i = 0;
	var iColor = 0;
	
	for (var indx in graph){
	
		arrPop = [];
		arrLabel = [];
        
		if (graph[indx]['mun'] != ''){
			var mun = parseInt(graph[indx]['mun']);
			for (var x in eta){
				var tot = parseInt(defPop[mun][eta[x]]['TOTALI']);
				arrPop.push([eta[x],tot]);
				
			}
			dati.push(arrPop); 
			leg.push({'lbl':'Mun '+mun, 'color': cMun[i]});
			
			seriesColors.push(cMun[i]);
			//arrLabel.push(['label','pippo']);
			i++;
		}
	}
	
plotG2=jQuery.jqplot ('G2', dati, {
	seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer
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
						  label:'Fascia di età',
						   labelOptions: {
                  fontSize: '10pt',
                  textColor: "#fff"
              },
							renderer: $.jqplot.CategoryAxisRenderer,
				     angle: -30,
				     fontSize: '10pt',
				    
				     tickOptions:{showGridline: false,textColor: "#fff"}
					 },
						// yaxis: {angle:0}
						yaxis: {
						        
						        tickOptions:{textColor: "#fff"}}
						// yaxis: {renderer: $.jqplot.CategoryAxisRenderer}
					},

			    grid: {background:'transparent', borderColor: '#dedede'} });
				plotG2.replot();
				//plotG2.redraw();
				var target = 'G2';
	            writeLegend(leg,target,'s');	
				
    var Sex =  [];
	var PercSex = [];
	var colorPie = [];
	var iColor = 0;
	for (var indx in graph){
	    var totM = 0;
	    var totF = 0;
	    var tot = 0;
		
		  arrSex = [];
      arrPercSex = [];
		
		if (graph[indx]['mun'] != ''){
			var mun = parseInt(graph[indx]['mun']);
			totM = parseInt(defPop[mun]['TOTALE']['MASCHI']);
	    totF = parseInt(defPop[mun]['TOTALE']['FEMMINE']);
	    tot= parseInt(defPop[mun]['TOTALE']['TOTALI']);
			arrSex = [tot,totM,totF];
			/*var percM = Math.round((totM * 100) / tot); 
	    var percF = Math.round((totF * 100) / tot);
			arrPercSex = [percM,percF];*/
			Sex.push(arrSex);	
            PercSex.push([['% Maschi - municipio x',totM],['% Maschi - municipio y',totF]]);	
			
			
			colorPie.push({'lbl':'Maschi - Mun. '+mun, 'color': cMunDon[iColor]});iColor++;
			colorPie.push({'lbl':'Femmine - Mun. '+mun, 'color': cMunDon[iColor]});iColor++;
			
			
		
		
		}
	}
	  
	
	plotGraphSex = jQuery.jqplot ('barChart', Sex, {
		seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer
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
			label:'Numero di elettori',
						   labelOptions: {
                  fontSize: '10pt',
                  textColor: "#fff"
              },
				renderer: $.jqplot.CategoryAxisRenderer,
				angle: -30,
				fontSize: '10pt',
				ticks: ['Totale','Maschi','Femmine'],
				tickOptions:{showGridline: false, textColor: "#fff"}

				},
				yaxis: {tickOptions:{showGridline: false,textColor: "#fff"}}
			
		},

		grid: {background:'transparent', borderColor: '#dedede'} });
	plotGraphSex.replot();
	var target = 'barChart';
	writeLegend(leg,target,'r');	
	//plotGraphSex.redraw();		
	
	var plot3 = $.jqplot('graphDonut',PercSex, {
    seriesDefaults: {
      // make this a donut chart.
      renderer:$.jqplot.DonutRenderer,
      rendererOptions:{
        // Donut's can be cut into slices like pies.
        sliceMargin: 3,
        // Pies and donuts can start at any arbitrary angle.
        startAngle: -90,
        showDataLabels: true
      },
    },
   series: [
				{seriesColors: [cMunDon[0],cMunDon[1]]},
				{seriesColors: [cMunDon[2],cMunDon[3]]}
				
	  ],   
   grid: {background:'transparent',borderColor: '#dedede'}}) ;
   plot3.replot();
   var target = 'graphDonut';
   writeLegend(colorPie,target,'bl2');	
  //plot3.redraw();
  loadingCustom(1);
}

function pulisciMappa() {
    obj.checkedMun = 0;
	for (i=1;i<=obj.maxMun;i++){
      graph['g'+i] = {'idG':i, 'mun': ''};
    }
    $('#municipiyellow area').each(function(e) {
	    var data = $('#'+this.id).mouseout().data('maphilight') || {};
	    data.alwaysOn = false;
	  
		$('#'+this.id).data('maphilight', data).trigger('alwaysOn.maphilight');
	});
}

function startGraph() {
  defPop = {};
  pulisciMappa(); 
  loadCorpo();

}


function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}

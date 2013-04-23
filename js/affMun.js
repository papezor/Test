
function loadAssetAffMun() {
    loadingCustom(0);
    var file = "";
	
	var e; var result;
    jQuery.getJSON(locData + 'AffluenzaMun.json?nc='+Math.random(),
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
    
	var obj = e["AFFLUENZE"];
	for (var k in obj){
	   var mun = parseInt(obj[k]['MUNICIPIO']);
	   if (!dataSet[mun])dataSet[mun] = [];
	   dataSet[mun]['MPERCVOT'] = obj[k]['MPERCVOT']; 
	   dataSet[mun]['FPERCVOT'] = obj[k]['FPERCVOT']; 
	   dataSet[mun]['TPERCVOT'] = obj[k]['TPERCVOT'];
       dataSet[mun]['MVOTANTI'] = obj[k]['MVOTANTI']; 
	   dataSet[mun]['FVOTANTI'] = obj[k]['FVOTANTI']; 
	   dataSet[mun]['TVOTANTI'] = obj[k]['TVOTANTI'];
	   dataSet[mun]['MISCRITII'] = obj[k]['MISCRITII'];
	   dataSet[mun]['FISCRITII'] = obj[k]['FISCRITII'];
	   dataSet[mun]['TISCRITII'] = obj[k]['TISCRITII'];
	   
	   var aff = obj[k]['AFFLUENZA'];
	}
	var htmloraAff = '';
    
    if(aff == 2)htmloraAff+= 'Affluenza per Municipio Domenica ore 12:00';     
    if(aff == 3)htmloraAff+= 'Affluenza per Municipio Domenica ore 19:00';         
    if(aff == 4)htmloraAff+= 'Affluenza per Municipio Domenica ore 22:00';         
    if(aff == 9)htmloraAff+= 'Affluenza per Municipio Lunedi ore 15:00';         
   
    cambiaTitolo(htmloraAff);
	
	//console.log(dataSet);
	renderG1();
    renderG2();	
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
 
  var dati = [];
  for(var x in dataSet) {
    dati.push(['Mun ' + x,dataSet[x]['TPERCVOT']]);
  }
   //console.log(dati);
	graphAll = jQuery.jqplot('G2', [dati], {
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
							
							renderer: $.jqplot.CategoryAxisRenderer,
							angle: -30,
							fontSize: '10pt',
				     
							tickOptions:{showGridline: false,textColor: "#fff"}
						},
						// yaxis: {angle:0}
						yaxis: {
						        
						        tickOptions:{textColor: "#fff"},
								ticks:dataPercY
						}
						// yaxis: {renderer: $.jqplot.CategoryAxisRenderer}
					},

					grid: {background:'transparent', borderColor: '#dedede'} });
				graphAll.replot();
    var leg = [{'lbl':'Tutto il Comune','color':totMun}];
	var target = 'G2';
	writeLegend(leg,target,'s');		     
			
}


function renderG2() {
 
    var totM = 0;
    var totF = 0;
    var tot = 0;
    
	for (var x in dataSet){
	  totM += parseInt(dataSet[x]['MVOTANTI']);
	  totF += parseInt(dataSet[x]['FVOTANTI']);
	  tot+= parseInt(dataSet[x]['TVOTANTI']);
	}
	
	var percM = Math.round((totM * 100) / tot); 
	var percF = Math.round((totF * 100) / tot);
	
	 plotGraphSex = jQuery.jqplot ('barChart', [[tot],[totM],[totF]], {
		seriesDefaults: {
			renderer:jQuery.jqplot.BarRenderer,
			 rendererOptions: {
			  barWidth: 70,
			  barPadding: 40
		   }
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
			  label:'Numero di votanti',
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
	var leg = [{'lbl':'Totale Votanti','color':totMun},
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


function renderData() {
    //console.log(graph);
	
    loadingCustom(0);
    /* CREO DATI PER GRAPH POPOLAZIONE */
	var dati = [];
	var seriesColors = [];
	var leg = [];
	var i = 0;
	var iColor = 0;
	
				
		var Sex =  [];
		var PercSex = [];
		var colorPie = [];
		var iColor = 0;
		var totM = 0;
		var totF = 0;
		var tot = 0;
		for (var indx in graph){
			
			
		  arrSex = [];
		  arrPercSex = [];
			
			if (graph[indx]['mun'] != ''){
				var mun = parseInt(graph[indx]['mun']);
				totM = parseInt(dataSet[mun]['MVOTANTI']);
			    totF = parseInt(dataSet[mun]['FVOTANTI']);
			    tot = parseInt(dataSet[mun]['TVOTANTI']);
				arrSex = [tot,totM,totF];
				/*var percM = Math.round((totM * 100) / tot); 
			var percF = Math.round((totF * 100) / tot);
				arrPercSex = [percM,percF];*/
				Sex.push(arrSex);	
				PercSex.push([['% Maschi - municipio x',totM],['% Maschi - municipio y',totF]]);	
				
				colorPie.push({'lbl':'Maschi - Mun. '+mun, 'color': cMunDon[iColor]});iColor++;
				colorPie.push({'lbl':'Femmine - Mun. '+mun, 'color': cMunDon[iColor]});iColor++;
				
            leg.push({'lbl':'Mun '+mun, 'color': cMun[i]});
			
			seriesColors.push(cMun[i]);
			//arrLabel.push(['label','pippo']);
			i++;				
			}
	  }
	 //console.log('bbb');
	 
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
			label:'Numero di votanti',
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
   
   //console.log('ccc');
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

	function selezionaMun(ev, seriesIndex, pointIndex, data) {
		 //console.log('passo mun');
		  var clicked = false;
		  var mun = pointIndex + 1;
		  
		
		  
		  for(i=1;i <= obj.maxMun;i++) {
		     if(graph['g'+i]['mun'] == mun)
			   clicked = true;
		  }
		  console.log(obj.checkedMun);  
		 if(!clicked) { 
		   if(obj.checkedMun == obj.maxMun) {
	              alert("Numero massimo di municipi selezionabili raggiunto");
		          return;
	            }

			 for(i=1;i <= obj.maxMun;i++) {

				  if((!graph['g'+i]['mun']) || graph['g'+i]['mun'] == '') {
				    graph['g'+i] = {'mun': mun};
					break;
					}
				}
			    obj.checkedMun++;
                console.log(obj.checkedMun);
				
			} else {

			   for(i=1;i <= obj.maxMun;i++) {
	                   if(mun == graph['g'+i]['mun']) {
					              graph['g'+i]['mun'] = '';

		             }
		        }
				obj.checkedMun--;
			}
           
		   
			if(obj.checkedMun == 0) {
		       loadAssetAffMun();
		    }
			else{ renderData();}
        }


function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}

function addSecTimer(){if (timer == refresh){setTimeout("addSecTimer()",1000);loadAssetAffMun();}else{/*console.log(timer);*/timer++;setTimeout("addSecTimer()",1000);}}
function resetTimer(){timer = 0;}
function stopTimer(){timer = -200000000;}
function startTimer(){statusTimer = true; resetTimer();setTimeout("addSecTimer()",2000);}
function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
function createDivGraph(){if (!document.getElementById("homeGraph")){jQuery(".ui-content").append('<div id="homeGraph" class="ui-corner-all ui-body-a" style="width:'+(jQuery(document).width()-9)+'px;height:320px; bottom:-285px;position:absolute;left:3px; right:3px;z-index:100" data-theme="a" ></div>');} return '#homeGraph';}
function closeAllPanel(str){statusGraph = true; slideGraph(); jQuery('#nav-panel').panel('close'); jQuery('#graphPerc').panel('close');jQuery('#'+str).panel('open');}
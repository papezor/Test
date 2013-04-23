function loadData(){
 loadingCustom(0);
var e; var result;
jQuery.getJSON(locData + 'Affluenza.json?nc='+Math.random(),
				{},
				function(result){
			
					checkConfig(result);}).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
/* fINE */

}


// LEGGO RISULTATI DELLA LOAD_DATA()
function readResult(e){

		/*if (name == 'Aff'){cambiaTitolo(statoAttuale);}else{
				var tit = 'Scrutinio ';
				if (tipo == 0){tit += 'Camera';}
				if (tipo == 1){tit += 'Senato';}
				if (tipo == 2){tit += 'Regionali Lista';}
				if (tipo == 3){tit += 'Regionali Preferenze';}
		     	cambiaTitolo(tit);
			}*/
	if (statusTimer == false){startTimer();}else{resetTimer();}

	var obj = e["AFFLUENZE"];
	for (var k in obj){
	    
		if (obj[k]['TIPO'] == 'SENATO'){var tipo = 1;}
		if (obj[k]['TIPO'] == 'CAMERA'){var tipo = 0;}
		if (obj[k]['TIPO'] == 'REGIONE'){var tipo = 2;}

		if (!dataSet[tipo])dataSet[tipo] = [];

		dataSet[tipo]['SEZTOT'] = obj[k]['SEZTOT'];
		dataSet[tipo]['SEZPERV'] = obj[k]['SEZPERV'];
		dataSet[tipo]['PERCSEZ'] = obj[k]['PERCSEZ'];
		dataSet[tipo]['MISCRITII'] = obj[k]['MISCRITII'];
		dataSet[tipo]['FISCRITII'] = obj[k]['FISCRITII'];
		dataSet[tipo]['TISCRITII'] = obj[k]['TISCRITII'];
		dataSet[tipo]['MVOTANTI'] = obj[k]['MVOTANTI'];
		dataSet[tipo]['FVOTANTI'] = obj[k]['FVOTANTI'];
		dataSet[tipo]['TVOTANTI'] = obj[k]['TVOTANTI'];
		dataSet[tipo]['MPERCVOT'] = obj[k]['MPERCVOT'];
		dataSet[tipo]['FPERCVOT'] = obj[k]['FPERCVOT'];
		dataSet[tipo]['TPERCVOT'] = obj[k]['TPERCVOT'];
		dataSet[tipo]['AFFLUENZA'] = obj[k]['AFFLUENZA'];
        var aff = obj[k]['AFFLUENZA'];
	}
	
	
    var htmloraAff = '';
    
    if(aff == 2)htmloraAff+= 'Affluenza Domenica ore 12:00';     
    if(aff == 3)htmloraAff+= 'Affluenza Domenica ore 19:00';         
    if(aff == 4)htmloraAff+= 'Affluenza Domenica ore 22:00';         
    if(aff == 9)htmloraAff+= 'Affluenza Lunedi ore 15:00';         
   

    jQuery("#oraAff").html(htmloraAff);
    cambiaTitolo(htmloraAff);
    jQuery("#sezPerv").html('<font color="red">'+ dataSet[0]["SEZPERV"] +'</font');
    jQuery("#setTot").html('<font color="red">'+ dataSet[0]["SEZTOT"] +'</font');
	jQuery("#contentTitolo").show('fast');
    
	
	
	
	if(obj[k]['SEZTOT'] == obj[k]['SEZPERV'] && obj[k]['SEZPERV'] > 0) {
		   
		   jQuery("#buttonClosereg").hide('fast');
           jQuery("#buttonClosecam").hide('fast');
           
		   jQuery("#buttonOpenreg").show('fast');
           jQuery("#buttonOpencam").show('fast');
           
		   jQuery("#buttonClosesen").hide('fast'); 
		if (obj[k]['AFFLUENZA'] != 9){
		   jQuery("#buttonOpensen").hide('fast');
		 }else{
		   jQuery("#buttonOpensen").show('fast');
		 }

    } 
	
	//addDataGraph();
	
	
replotAll(aff);
	
	
}

function replotAll(aff){camReplot(); senReplot(); regReplot();

	if (aff != 9){
		   jQuery("#S1").html('<div style="width:80%; text-align:center;margin:auto;"><span style="color:yellow; font-size:1.2em;">Dati disponibili dalle 15 di Lunedi 25/02</span></div>');
		   jQuery("#S2").html('<div style="width:80%; text-align:center;margin:auto;"><span style="color:yellow; font-size:1.2em;">Dati disponibili dalle 15 di Lunedi 25/02</span></div>');
    }
	
	 loadingCustom(1);
}

function camReplot(){
	  t = 0; // CAMERA;
	  var camAst = dataSet[t]["TISCRITII"] - dataSet[t]["TVOTANTI"];
      var camPerv = parseInt(dataSet[t]["TVOTANTI"]);
	  PieCam.series[0].data = [['Pervenute',camPerv],['Astensione',camAst]];
	  PieCam.replot({resetAxes:true});
		var leg = [{'lbl':'Votanti','color':cCam},
					{'lbl':'Astensione','color':cAst}];
		var target = 'C1';
		writeLegend(leg,target,'bl');

	  var MIsc = parseInt(dataSet[t]["MISCRITII"]); 
      var MV = parseInt(dataSet[t]["MVOTANTI"]);
	  var FIsc = parseInt(dataSet[t]["FISCRITII"]);  
      var FV = parseInt(dataSet[t]["FVOTANTI"]); 
	  var d1 = [[1,MV],[2,FV]];
	  var d2 = [[1,MIsc],[2,FIsc]];
	  BarCam.series[0].data = d1;
	  BarCam.series[1].data = d2;
	  BarCam.replot({resetAxes:true});
	  var leg = [{'lbl':'Votanti','color':cCam},
					   {'lbl':'Iscritti','color':cTot}];
	  var target = 'C2';
	  writeLegend(leg,target,'r');
	  
	  
}
function senReplot(){	  
      t = 1; // SENATO;
	  
	  var senAst = dataSet[t]["TISCRITII"] - dataSet[t]["TVOTANTI"];
      var senPerv = parseInt(dataSet[t]["TVOTANTI"]);
	  PieSen.series[0].data = [['Pervenute',senPerv],['Astensione',senAst]];
	  PieSen.replot({resetAxes:true});
	  var leg = [{'lbl':'Votanti','color':cSen},
					{'lbl':'Astensione','color':cAst}];
		var target = 'S1';
		writeLegend(leg,target,'bl');
		
		
		
	  var MIsc = parseInt(dataSet[t]["MISCRITII"]); 
      var MV = parseInt(dataSet[t]["MVOTANTI"]);
	  var FIsc = parseInt(dataSet[t]["FISCRITII"]);  
      var FV = parseInt(dataSet[t]["FVOTANTI"]); 
	  var d1 = [[1,MV],[2,FV]];
	  var d2 = [[1,MIsc],[2,FIsc]];
	  BarSen.series[0].data = d1;
	  BarSen.series[1].data = d2;
	  BarSen.replot({resetAxes:true});
	  var leg = [{'lbl':'Votanti','color':cSen},
					   {'lbl':'Iscritti','color':cTot}];
	  var target = 'S2';
	  writeLegend(leg,target,'r');

}
function regReplot(){	  

      t = 2; // REGIONALI;
	  
	  var regAst = dataSet[t]["TISCRITII"] - dataSet[t]["TVOTANTI"];
      var regPerv = parseInt(dataSet[t]["TVOTANTI"]);
	  PieReg.series[0].data = [['Pervenute',regPerv],['Astensione',regAst]];
	  PieReg.replot({resetAxes:true});
	    var leg = [{'lbl':'Votanti','color':cReg},
					{'lbl':'Astensione','color':cAst}];
		var target = 'R1';
		writeLegend(leg,target,'bl');
	  
	  var MIsc = parseInt(dataSet[t]["MISCRITII"]); 
      var MV = parseInt(dataSet[t]["MVOTANTI"]);
	  var FIsc = parseInt(dataSet[t]["FISCRITII"]);  
      var FV = parseInt(dataSet[t]["FVOTANTI"]); 
	  var d1 = [[1,MV],[2,FV]];
	  var d2 = [[1,MIsc],[2,FIsc]];
	
	  BarReg.series[0].data = d1;
	  BarReg.series[1].data = d2;
	  BarReg.replot({resetAxes:true});
	  var leg = [{'lbl':'Votanti','color':cReg},
					   {'lbl':'Iscritti','color':cTot}];
	  var target = 'R2';
	  writeLegend(leg,target,'r');
   
	  
}



  
 function chiudi(tipo){
		if (tipo == 'reg'){regReplot();}
		if (tipo == 'cam'){camReplot();}
		if (tipo == 'sen'){senReplot();}
		
	   jQuery('#buttonClose'+tipo).hide('fast');
       jQuery('#buttonOpen'+tipo).show('fast');
  
 }



function confronta(tipo) {
		if (tipo == 'reg'){regCfrReplot();}
		if (tipo == 'cam'){camCfrReplot();}
		if (tipo == 'sen'){senCfrReplot();}
		
	   jQuery('#buttonOpen'+tipo).hide('fast');
	   jQuery('#buttonClose'+tipo).show('fast');
    
		
}

function initGraphs()
{

createPieDef();

createBarDef();

}



function createBarDef(){

//-----------------------------------------------------------------------------------------------------------//


BarReg = $.jqplot('R2', [defBar, defBar], {
seriesDefaults:{
	renderer:$.jqplot.BarRenderer,
	rendererOptions: {
		barMargin: 30
		
	}
},
series: [
            {color: cReg,label: 'votanti'},
            {color: cTot, label: 'iscritti'}
        ],
legend: {
                show: false,
                location: 'e',
                placement: 'insideGrid',
                textColor: 'white'
            },
axesDefaults: {
	tickRenderer: $.jqplot.CanvasAxisTickRenderer
	},
axes:{
	xaxis:{
		renderer: $.jqplot.CategoryAxisRenderer,
		tickOptions:{showGridline: false,textColor:'#fff',fontSize: '1em'}
	},
	yaxis:{
		pad: 0,
		rendererOptions: {
		        forceTickAt0: true
		},
		tickOptions: {
			textColor:'#fff',
			angle: -30,
			fontSize: '0.75em'
		}
	}
},

 grid:{background:'transparent', borderWidth:0, shadow:false}
});

BarCam = $.jqplot('C2', [defBar, defBar], {
seriesDefaults:{
	renderer:$.jqplot.BarRenderer,
	rendererOptions: {
		barMargin: 30
	}
},
series: [
            {color: cCam,label: 'votanti'},
            {color: cTot,label: 'iscritti'}
        ],
legend: {
                show: false,
                location: 'e',
                placement: 'insideGrid',
                textColor: 'white'
            },
aaxesDefaults: {
	tickRenderer: $.jqplot.CanvasAxisTickRenderer
	},
axes:{
	xaxis:{
		renderer: $.jqplot.CategoryAxisRenderer,
		tickOptions:{showGridline: false,textColor:'#fff',fontSize: '1em'}
	},
	yaxis:{
		pad: 0,
		rendererOptions: {
		        forceTickAt0: true
		},
		tickOptions: {
			textColor:'white',
			angle: -30,
			fontSize: '0.75em'
		}
	}
},

 grid:{background:'transparent', borderWidth:0, shadow:false}
});

BarSen = $.jqplot('S2', [defBar, defBar], {
seriesDefaults:{
	renderer:$.jqplot.BarRenderer,
	rendererOptions: {
		barMargin: 30
	}
},
series: [
            {color: cSen, label: 'votanti'},
            {color: cTot, label: 'iscritti'}
        ],
legend: {
                show: false,
                location: 'e',
                placement: 'insideGrid',
                textColor: 'white'
            },
axesDefaults: {
	tickRenderer: $.jqplot.CanvasAxisTickRenderer
	},
axes:{
	xaxis:{
		renderer: $.jqplot.CategoryAxisRenderer,
		tickOptions:{showGridline: false,textColor:'#fff',fontSize: '1em'}
	},
	yaxis:{
		pad: 0,
		rendererOptions: {
		        forceTickAt0: true
		},
		tickOptions: {
			textColor:'#fff',
			angle: -30,
			fontSize: '0.75em'
		}
	}
},

 grid:{background:'transparent', borderWidth:0, shadow:false}
});
}

function createPieDef(){


/****************** AGGIUNTA ALESSIO ********************/
PieReg = jQuery.jqplot ('R1', [defPie],
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
	                {seriesColors: [ cReg, cAst]}
	            ],
      grid:{background:'transparent', borderWidth:0, shadow:false }
    }
  );


  PieCam = jQuery.jqplot ('C1', [defPie],
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
	            {seriesColors: [ cCam, cAst]}
	            ],
      grid:{background:'transparent', borderWidth:0, shadow:false}
    }
  );

  PieSen = jQuery.jqplot ('S1', [defPie],
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
	             {seriesColors: [ cSen, cAst]}
	            ],

      grid:{background:'transparent', borderWidth:0, shadow:false}
    }
  );

}




function camCfrReplot(){
	 if (!DonCam){createDonCam();}
	
	
	  t =  0; // CAMERA;
	  var statoAff = parseInt(dataSet[t]["AFFLUENZA"]); 
	
	  var senAst = dataSet[t]["TISCRITII"] - dataSet[t]["TVOTANTI"];
      var senPerv = parseInt(dataSet[t]["TVOTANTI"]);
	  var sto = oldAff["" + t]["" + statoAff];
	  var d1 = [["2010",sto["perv"]],["Oggi",sto["aste"]]];
	  var d2 = [["2010",senPerv],["Oggi",senAst]];
	  
	  DonCam.series[0].data = d2;
	  DonCam.series[1].data = d1;	  
	  DonCam.replot();
	  

	  var sto = difSex["" + t]["" + statoAff];
	  var Mold = sto["m"];
      var Mnow = parseInt(dataSet[t]["MVOTANTI"]);
	  var Fold = sto["f"];
      var Fnow = parseInt(dataSet[t]["FVOTANTI"]); 
	  var d1 = [[1,Mold],[2,Fold]];
	  var d2 = [[1,Mnow],[2,Fnow]];
	  BarCamCfr.series[0].data = d1;
	  BarCamCfr.series[1].data = d2;
	  BarCamCfr.replot({resetAxes:true});
	  var leg = [{'lbl':'oggi','color':cCam},
				 {'lbl':'2008','color':cSto}];
	  var target = 'C1';
	  writeLegend(leg,target,'bl');
	  var target = 'C2';
	  writeLegend(leg,target,'r'); 
}

function createDonCam(){
    
	DonCam = $.jqplot('C1', [defPie, defPie], {
		seriesDefaults: {
			renderer:$.jqplot.DonutRenderer,
			rendererOptions:{
				sliceMargin: 2,
				innerDiameter: 10,
				startAngle: -90,
				diameter: 2,
				showDataLabels: true,
				padding:0,
			}
		},
		series: [
					{seriesColors: [cCam, "lightgray"],label: ''},
					{seriesColors: [cSto, "lightgray"],label: ''}
					],
				  grid: {background:'transparent', borderWidth:0, shadow:false}
	});
	

	BarCamCfr = $.jqplot('C2', [defBar, defBar], {
	seriesDefaults:{
		renderer:$.jqplot.BarRenderer,
		rendererOptions: {
			barMargin: 30
		}
	},
	  series: [
				{color: cSto, label: '2008'},
				{color: cCam, label: 'oggi'}
	  ],     
	grid:{background:'transparent', borderWidth:0, shadow:false},
	axesDefaults: {
		tickRenderer: $.jqplot.CanvasAxisTickRenderer
		},
	axes:{
		xaxis:{
			renderer: $.jqplot.CategoryAxisRenderer,
			tickOptions:{showGridline: false,textColor:'#fff',fontSize: '1em'}
		},
		yaxis:{
			pad: 0,
			rendererOptions: {
					forceTickAt0: true
			},
			tickOptions: {
				textColor:'#fff',
				angle: -30,
				fontSize: '0.75em'
			}
		}
	
	 
		}
	});


}




function senCfrReplot(){
	 if (!DonSen){createDonSen();}
	
	
	  t = 1; // SENATO;
	  var statoAff = parseInt(dataSet[t]["AFFLUENZA"]); 
	
	  var senAst = dataSet[t]["TISCRITII"] - dataSet[t]["TVOTANTI"];
      var senPerv = parseInt(dataSet[t]["TVOTANTI"]);
	  var sto = oldAff["" + t]["" + statoAff];
	  var d1 = [["2010",sto["perv"]],["Oggi",sto["aste"]]];
	  var d2 = [["2010",senPerv],["Oggi",senAst]];
	  
	  DonSen.series[0].data = [["2010",50],["Oggi",50]];	  
	  DonSen.series[1].data = d1;
	  DonSen.replot();
	
	  // AGGIUNGERE LEGGENDA A MANO //
      
	  var sto = difSex["" + t]["" + statoAff];
	  var Mold = sto["m"];
      var Mnow = parseInt(dataSet[t]["MVOTANTI"]);
	  var Fold = sto["f"];
      var Fnow = parseInt(dataSet[t]["FVOTANTI"]); 
	  var d1 = [[1,Mold],[2,Fold]];
	  var d2 = [[1,Mnow],[2,Fnow]];
	  BarSenCfr.series[0].data = d1;
	  BarSenCfr.series[1].data = d2;
	  BarSenCfr.replot({resetAxes:true});
      var leg = [{'lbl':'oggi','color':cSen},
				 {'lbl':'2008','color':cSto}];
	  var target = 'S1';
	  writeLegend(leg,target,'bl');
	  var target = 'S2';
	  writeLegend(leg,target,'r'); 

}

function createDonSen(){
    
	DonSen = $.jqplot('S1', [defPie, defPie], {
		seriesDefaults: {
			renderer:$.jqplot.DonutRenderer,
			rendererOptions:{
				sliceMargin: 2,
				innerDiameter: 10,
				startAngle: -90,
				diameter: 2,
				showDataLabels: true,
				padding:0,
			}
		},
		series: [
					{seriesColors: [cSen , "lightgray"],label: '2008'},
					{seriesColors: [cSto, "lightgray"],label: 'oggi'}
					],
		grid: {background:'transparent', borderWidth:0, shadow:false}
	});
	

	BarSenCfr = $.jqplot('S2', [defBar, defBar], {
	seriesDefaults:{
		renderer:$.jqplot.BarRenderer,
		rendererOptions: {
			barMargin: 30
		}
	},
	  series: [
				{color: cSto, label: '2008'},
				{color: cSen, label: 'oggi'}
	  ],     
	grid:{background:'transparent', borderWidth:0, shadow:false},
	axesDefaults: {
		tickRenderer: $.jqplot.CanvasAxisTickRenderer
		},
	axes:{
		xaxis:{
			renderer: $.jqplot.CategoryAxisRenderer,
			tickOptions:{showGridline: false,textColor:'#fff',fontSize: '1em'}
		},
		yaxis:{
			pad: 0,
			rendererOptions: {
					forceTickAt0: true
			},
			tickOptions: {
				textColor:'#fff',
				angle: -30,
				fontSize: '0.75em'
			}
		}
	
	 
		}
	});


}




function regCfrReplot(){
	 if (!DonReg){createDonReg();}
	
	
	  t = 2; // REGIONALI;
	  var statoAff = parseInt(dataSet[t]["AFFLUENZA"]); 
	
	  var senAst = dataSet[t]["TISCRITII"] - dataSet[t]["TVOTANTI"];
      var senPerv = parseInt(dataSet[t]["TVOTANTI"]);
	  var sto = oldAff["" + t]["" + statoAff];
	  var d1 = [["2010",sto["perv"]],["Oggi",sto["aste"]]];
	  var d2 = [["2010",senPerv],["Oggi",senAst]];
	  
	  DonReg.series[0].data = d2;
	  DonReg.series[1].data = d1;	  
	  DonReg.replot();
	
	  // AGGIUNGERE LEGGENDA A MANO //
      
	  var sto = difSex["" + t]["" + statoAff];
	  var Mold = sto["m"];
      var Mnow = parseInt(dataSet[t]["MVOTANTI"]);
	  var Fold = sto["f"];
      var Fnow = parseInt(dataSet[t]["FVOTANTI"]); 
	  var d1 = [[1,Mold],[2,Fold]];
	  var d2 = [[1,Mnow],[2,Fnow]];
	  BarRegCfr.series[0].data = d1;
	  BarRegCfr.series[1].data = d2;
	  BarRegCfr.replot({resetAxes:true});
	  var leg = [{'lbl':'oggi','color':cReg},
				 {'lbl':'2010','color':cSto}];
	  var target = 'R1';
	  writeLegend(leg,target,'bl');
	  var target = 'R2';
	  writeLegend(leg,target,'r'); 

}

function createDonReg(){
    
	DonReg = $.jqplot('R1', [defPie, defPie], {
		seriesDefaults: {
			renderer:$.jqplot.DonutRenderer,
			rendererOptions:{
				sliceMargin: 2,
				innerDiameter: 10,
				startAngle: -90,
				diameter: 2,
				showDataLabels: true,
				padding:0,
			}
		},
		series: [
					{seriesColors: [ cReg, "lightgray"],label: '2010'},
					{seriesColors: [ cSto, "lightgray"],label: 'oggi'}
					],
						 
				  grid: {background:'transparent', borderWidth:0, shadow:false}
	});
	

	BarRegCfr = $.jqplot('R2', [defBar, defBar], {
	seriesDefaults:{
		renderer:$.jqplot.BarRenderer,
		rendererOptions: {
			barMargin: 30
		}
	},
	  series: [
				{color: cSto, label: '2010'},
				{color: cReg, label: 'oggi'}
	  ],     
	grid:{background:'transparent', borderWidth:0, shadow:false},
	axesDefaults: {
		tickRenderer: $.jqplot.CanvasAxisTickRenderer
		},
	axes:{
		xaxis:{
			renderer: $.jqplot.CategoryAxisRenderer,
			tickOptions:{showGridline: false,textColor:'#fff',fontSize: '1em'}
		},
		yaxis:{
			pad: 0,
			rendererOptions: {
					forceTickAt0: true
			},
			tickOptions: {
				textColor:'#fff',
				angle: -30,
				fontSize: '0.75em'
			}
		}
	
	 
		}
	});


}
function addSecTimer(){if (timer == refresh){setTimeout("addSecTimer()",1000);loadData();}else{/*console.log(timer);*/timer++;setTimeout("addSecTimer()",1000);}}
function resetTimer(){timer = 0;}
function stopTimer(){timer = -200000000;}
function startTimer(){statusTimer = true; resetTimer();setTimeout("addSecTimer()",2000);}
function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
function createDivGraph(){if (!document.getElementById("homeGraph")){jQuery(".ui-content").append('<div id="homeGraph" class="ui-corner-all ui-body-a" style="width:'+(jQuery(document).width()-9)+'px;height:320px; bottom:-285px;position:absolute;left:3px; right:3px;z-index:100" data-theme="a" ></div>');} return '#homeGraph';}
function closeAllPanel(str){statusGraph = true; slideGraph(); jQuery('#nav-panel').panel('close'); jQuery('#graphPerc').panel('close');jQuery('#'+str).panel('open');}



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
						console.log(statoAttuale);
						readResult(result);

					}
				).error(function() {
		erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});

/* fINE */
}



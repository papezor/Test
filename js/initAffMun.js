
var name = 'Aff';  // Aff = affluenze  Com = composizione Scr = scrutinio

var zoom = 11;  // zoom originale
var map;	    
var coordPless = [];
var sez = [];
var markerArray = [];
var markerMun = [];
var dataSet = [];
var dataSetSez = [];
var dataSetMun = []; var dataSetDetMun = [];
var percTotMun;var plotGraffNow;
var lat = '0'; var lng = '0';
var timer = 0; var statusTimer = false; // variabili PER GESTIONE TIMER 
var divDisp = '#renderPage';
var statusGraph = false;
var vers = 0;

var graphAll;
var totMun = '#50021B';
var cMun = ['#FF9933','#99FF66'];
var totMunF = 'pink';
var totMunM = 'lightblue';
var cMunDon =['blue','#FF66FF','lightblue','#FFCCFF'];
var dataPercY = [
						["0 ",0],
						["25 ",25],
						["50 ",50],
						["75 ",75],
						["100 ",100]
					];
var dataAuth = $.mobile.path.parseUrl(window.location.href);
//for (var x in dataAuth){alert(x); alert(dataAuth[x]);}
jQuery(document).ready(function(){
       jQuery.getScript("js/elezioni.js", function(){
         elezioni.menu.init();    
	   });
	  
	  
	   $('#G2').bind('jqplotDataClick', function(ev,seriesIndex,pointIndex,data) {
	 
	     selezionaMun(ev,seriesIndex,pointIndex,data);
		 graphAll.series[seriesIndex].seriesColors[pointIndex] = '#FFCCFF';
		 graphAll.replot({ clear: true }); 
	  
	  });  
	 
       loadAssetAffMun();
       

}); 
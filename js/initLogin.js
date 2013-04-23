

var refresh = 60; // ogni quanti secondi si ricarica i dati
var coord_def = new google.maps.LatLng(41.890105,12.480821); // centro di roma
var munG = 99;var munD;var targetCoordMun = new google.maps.LatLng(41.890105,12.480821); // centro di roma
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
var infowindow = new google.maps.InfoWindow();
var lat = '0'; var lng = '0';
var divDisp = '#renderPage';
var dataPercY = [
						["0 ",0],
						["25 ",25],
						["50 ",50],
						["75 ",75],
						["100 ",100]
					];
var totMun = '#50021B';
var vers = 0;
var piePerv;

var dataAuth = $.mobile.path.parseUrl(window.location.href);
//for (var x in dataAuth){alert(x); alert(dataAuth[x]);}
//jQuery(document).ready(function(){loadAssets();}); 
jQuery(document).ready(function(){
       jQuery.getScript("js/elezioni.js", function(){
         elezioni.menu.init();    
	   });
	   
	  jQuery.getJSON("publicAssets/menu.json?nc="+Math.random(),
				function(res){
				  
		
					// leggo menu //
						    var menu = 'menuPuzzle';
							var totBlock = 6;
							jQuery('#menuPuzzle').html('');
							// leggo sotto menu
							img = 1;r = 1;pr = 1;
							
							for (var x in res){
							    console.log(x);
							/*	if (r == 1){s='margin-top:40px;';}else{s='margin-top:-30px;';}
								if (pr == 1){s += 'margin-left:80px;';}pr++;
								if (pr > puzzleLinea){pr = 1;r++;} */s='margin-top:-30px;';
								// menu = voce di riferimento
								testo = res[x].titolo; // testo sub menu
								link = res[x].click; // collegamento da mettere
							
								jQuery('#menuPuzzle').append('<div class="submenu" style="'+s+'" id="'+menu+x+'"><a href="'+link+'"><img src="images/'+img+'.png" width="150px"></a></div>'); 
								jQuery('#'+menu+x).append('<div class="textSubMenu"><a href="'+link+'">'+testo+'</a></div>');
								img++; if (img > totBlock)img = 1;
							}

					 loadAssets();
					
					
					
					
				}).error(function() {
			erroreGenerico('ERRORE AVANZAMENTO JSON\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	}); 
	 
	   
     
	  
	  
});
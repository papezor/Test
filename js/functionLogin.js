function loadAssets(){jQuery.getScript(locAssets+"GeoReferenziazioneMunicipi.js", function(){loadPlessiAssets();});}
function loadPlessiAssets(){jQuery.getScript(locAssets+"AnagraficaPlessi2.js", function(){createMappaDef();});}


function checkPwd(){
    var ckPwd = "../../access/getAccess.ashx";
	jQuery.ajax({
		type: "POST",
		url: ckPwd,
		data: { "pin": jQuery('#pin').val() },
		success: function(result){
				openIndex();
		},
		fail: function(){
			alert('errore durante operazione');
		}
	});
}

function openIndex(){
	pi = jQuery('#pin').val();var u = '';var p='';for (x=0;x<pi.length;x++){if (x%2){p+=pi.charAt(x);}else{u+=pi.charAt(x);}}
	var dest = "index.html";
	var locData = '../2013/m/private/data/'
	var ckL = locData + 'config.json'; 
	var dest = "index.html";
	
	jQuery.ajax
  ({
		type: "GET",
		url: ckL,
		username: u,
		password: p,
		headers:{"username":u,"password":p},
		success: function(){
				//SONO AUTENTICATO //
			$.mobile.changePage(dest);
		}
	});
}
function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
function createDivCanvas(){document.getElementById("renderPage").innerHTML = '<div id="map_canvas" style="width:100%; height:'+(jQuery(document).height())+'px;"></div>';}
function closeAllPanel(str){jQuery('#'+str).panel('open');}
function createMappaDef(){
		// creo div per la mappa se non esiste
		createDivCanvas();



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

}